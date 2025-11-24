using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using API_TI.Data;
using API_TI.Services.Interfaces;
using API_TI.Middlewares;
using API_TI.Swagger;
using Serilog;
using API_TI.Services.Implementations;
using System.Text;
using System.Globalization;
using System.Security.Claims;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using Serilog.Events;
using Microsoft.OpenApi.Models;
using System.Reflection;
using API_TI.Services.Background;
using Microsoft.AspNetCore.Authentication.Cookies;


var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
builder.Host.UseSerilog((ctx, lc) => lc
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("Application", "TiPcComponentsApi")
    .WriteTo.Console()
    .WriteTo.File("Logs/app_log.txt", rollingInterval: RollingInterval.Day)
    .WriteTo.File("Logs/auth_log.txt", rollingInterval: RollingInterval.Day, restrictedToMinimumLevel: LogEventLevel.Information)
);

// Culture
var culture = new CultureInfo("es-MX");
CultureInfo.DefaultThreadCurrentCulture = culture;
CultureInfo.DefaultThreadCurrentUICulture = culture;

// JWT Settings
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("Jwt"));

// Validate Key
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey) || jwtKey.Length < 32)
    throw new Exception("JWT Key must be at least 32 characters long.");

if (jwtKey.All(c => char.IsLetterOrDigit(c)))
    throw new Exception("JWT Key should contain special characters for better security.");

// Get the connection string
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Register DbContext
builder.Services.AddDbContext<TiPcComponentsContext>(option => 
    option.UseSqlServer(connectionString, sql =>
    {
        sql.EnableRetryOnFailure(maxRetryCount: 5, maxRetryDelay: TimeSpan.FromSeconds(5), errorNumbersToAdd: null);
    }));

builder.Services.AddHealthChecks()
    .AddDbContextCheck<TiPcComponentsContext>();

// Access to context out door of controller
builder.Services.AddHttpContextAccessor();

builder.Services.AddHostedService<StockReservationCleanupService>();
builder.Services.AddHostedService<LowStockAlertService>();


// Add services to the container - Dependency Injection.
builder.Services.AddScoped<IErrorService, ErrorService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddScoped<IAuditService, AuditService>();
builder.Services.AddScoped<IDireccionService, DireccionService>();
builder.Services.AddScoped<IGooglePlacesService, GooglePlacesService>();
builder.Services.AddScoped<IShippingService, ShippingService>();
builder.Services.AddScoped<IStripeService, StripeService>();
builder.Services.AddScoped<IPayPalService, PayPalService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IProductoService, ProductoService>();
builder.Services.AddScoped<IProductoImagenService, ProductoImagenService>();
builder.Services.AddScoped<ICategoriaService, CategoriaService>();
builder.Services.AddScoped<IMarcaService, MarcaService>();
builder.Services.AddScoped<ICarritoService, CarritoService>();
builder.Services.AddScoped<IDescuentoService, DescuentoService>();
builder.Services.AddScoped<IImpuestoService, ImpuestoService>();
builder.Services.AddScoped<ICheckoutService, CheckoutService>();
builder.Services.AddScoped<IOrdenService, OrdenService>();
builder.Services.AddScoped<IFacturaService, FacturaService>();
builder.Services.AddScoped<IReembolsoService, ReembolsoService>();
builder.Services.AddScoped<ICfdiService, CfdiService>();
builder.Services.AddScoped<IReporteService, ReporteService>();
builder.Services.AddScoped<IWishlistService, WishlistService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IProveedorService, ProveedorService>();
builder.Services.AddScoped<INewsletterService, NewsletterService>();
builder.Services.AddScoped<IOrderStatusService, OrderStatusService>();
builder.Services.AddScoped<IUserProfileService, UserProfileService>();
builder.Services.AddScoped<IAdminDashboardService, AdminDashboardService>();
builder.Services.AddScoped<IRecommendationService, RecommendationService>();
builder.Services.AddScoped<IDevolucionService, DevolucionService>();
builder.Services.AddScoped<IProductoImagenService, ProductoImagenService>();

// Controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger (single registration only)
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "TI PC Components API",
        Version = "v1",
        Description = "API para e-commerce de componentes de PC",
        Contact = new OpenApiContact
        {
            Name = "TI PC Components",
            Email = "support@tipccomponents.com"
        }
    });

    // JWT Authentication
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Ingrese 'Bearer' [espacio] y luego su token JWT"
    });

    // Filters
    c.OperationFilter<ErrorResponsesOperationFilter>();
    c.OperationFilter<AuthorizationOperationFilter>();
    c.SchemaFilter<SwaggerExampleFilter>();

    // XML Comments
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
        c.IncludeXmlComments(xmlPath);

    // Tags
    c.TagActionsBy(api =>
    {
        if (api.GroupName != null)
            return new[] { api.GroupName };

        var controllerName = api.ActionDescriptor is Microsoft.AspNetCore.Mvc.Controllers.ControllerActionDescriptor descriptor
            ? descriptor.ControllerName
            : "Unknown";

        return new[] { controllerName };
    });

    c.DocInclusionPredicate((name, api) => true);
});


// CORS 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                builder.Configuration["Cors:AllowedOrigins"]?.Split(',') ?? new[] { "http://localhost:5209" }
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});


// Rate limiting 
builder.Services.AddRateLimiter(options =>
{
    // Login limiter
    options.AddFixedWindowLimiter("LoginLimiter", opt =>
    {
        opt.PermitLimit = 5;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 0;
    });

    // ADD Register limiter
    options.AddFixedWindowLimiter("RegisterLimiter", opt =>
    {
        opt.PermitLimit = 3;
        opt.Window = TimeSpan.FromMinutes(10);
        opt.QueueLimit = 0;
    });

    // ADD Refresh limiter
    options.AddFixedWindowLimiter("RefreshLimiter", opt =>
    {
        opt.PermitLimit = 10;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueLimit = 0;
    });

    // ADD OAuth limiter
    options.AddFixedWindowLimiter("OAuthLimiter", opt =>
    {
        opt.PermitLimit = 5;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueLimit = 0;
    });

    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
//builder.Services.AddEndpointsApiExplorer();


// Jwt authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)),
            RoleClaimType = ClaimTypes.Role
        };
    });

builder.Services.AddAuthorization(options =>
{
    // Role-based policy for Admin
    options.AddPolicy("RequireAdmin", policy =>
        policy.RequireRole("Admin"));

    // Example: policy combining role or custom permission claim
    options.AddPolicy("ManageProducts", policy =>
        policy.RequireAssertion(context =>
            context.User.IsInRole("Admin") ||
            (context.User.HasClaim(c => c.Type == "permissions" && c.Value.Split(',').Contains("product.manage")))
        ));
});

// Cookie settings for OAuth flows (if you use cookie during OAuth redirect)
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.HttpOnly = true;
});

builder.Services.AddMemoryCache();


builder.Services.Configure<GooglePlacesSettings>(
    builder.Configuration.GetSection("Google:Places"));



// Build App
var app = builder.Build();
app.UseCors("AllowFrontend");
app.UseStaticFiles();

// Serilog - push correlation id property per request
app.Use(async (context, next) =>
{
    using (Serilog.Context.LogContext.PushProperty("CorrelationId", context.TraceIdentifier))
    {
        await next();
    }
});

// Use custom middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<RequestResponseLoggingMiddleware>();
app.UseMiddleware<SecurityHeadersMiddleware>();
app.UseMiddleware<RateLimitingMiddleware>();

app.UseHttpsRedirection();
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}
app.UseCors();
app.UseAuthentication();
app.UseMiddleware<JwtUserContextMiddleware>();
app.UseAuthorization();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "TI PC Components API v1");
        c.RoutePrefix = "swagger";
        c.DocumentTitle = "TI PC Components API";
        c.DefaultModelsExpandDepth(2);
        c.DefaultModelExpandDepth(2);
    });
}


// Endpoints
app.MapHealthChecks("/health");
app.MapControllers();
app.Run();

// Strongly Typed JWT Settings class
public class JwtSettings
{
    public string Issuer { get; set; }
    public string Audience { get; set; }
    public string Key { get; set; }
    public int ExpireMinutes { get;  set; }
}

public class GooglePlacesSettings
{
    public string ApiKey { get; set; }
}