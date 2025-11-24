using API_TI.Data;
using API_TI.Models.Auth;
using API_TI.Models.DTOs.UsuarioDTOs;
using API_TI.Models.Error;
using API_TI.Services.Implementations;
using API_TI.Services.Interfaces;
using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using static Google.Apis.Requests.BatchRequest;

namespace API_TI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : BaseApiController
    {
        private readonly TiPcComponentsContext _context;
        private readonly IAuthService _authService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ITokenService _tokenService;


        public AuthController(
            TiPcComponentsContext context,
            IAuthService authService, 
            IHttpContextAccessor httpContextAccessor,
            ITokenService tokenService
        )
        {
            _context = context;
            _authService = authService;
            _httpContextAccessor = httpContextAccessor;
            _tokenService = tokenService;
        }

        protected void SetRefreshTokenCookie(string refreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,  // Prevent JavaScript access
                Secure = true,    // HTTPS only
                SameSite = SameSiteMode.Strict,  // CSRF protection
                Expires = DateTime.UtcNow.AddDays(30),
                Path = "/",
                IsEssential = true
            };

            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }


        [HttpPost("login")]
        [EnableRateLimiting("LoginLimiter")]
        public async Task<IActionResult> Login(LoginRequestAuth request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return FromApiResponse(ApiResponse<AuthResponse>.Fail(
                    2, // PARAMETRO_INVALIDO
                    "Datos de entrada inválidos",
                    2,
                    string.Join("; ", errors)
                ));
            }                
            
            var response = await _authService.LoginAsync(request);
            if (response.Success && response.Data?.RefreshToken != null)
            {
                // Store refresh token in secure cookie
                SetRefreshTokenCookie(response.Data.RefreshToken);

                // Don't send refresh token in response body (security best practice)
                response.Data.RefreshToken = null;
            }
            return FromApiResponse(response);
        }

        [HttpPost("register")]
        [EnableRateLimiting("LoginLimiter")]
        public async Task<IActionResult> Register(RegisterRequestAuth request)
        {
            var response = await _authService.RegisterAsync(request);
            return FromApiResponse(response);
        }

        [HttpPost("google-login")]
        [EnableRateLimiting("OAuthLimiter")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleAuthRequestAuth request)
        {
            if (!ModelState.IsValid || string.IsNullOrWhiteSpace(request?.IdToken))
                return FromApiResponse(ApiResponse<AuthResponse>.Fail(2, "Token de Google requerido", 2));

            var response = await _authService.LoginWithGoogleAsync(request);
            return FromApiResponse(response);
        }

        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
        {
            // try cookie first if not provided in body
            var refreshToken = request?.RefreshToken ?? _httpContextAccessor.HttpContext?.Request.Cookies["refreshToken"];

            if (string.IsNullOrWhiteSpace(refreshToken))
                return FromApiResponse(ApiResponse<AuthResponse>.Fail(106, "Refresh token requerido", 2));

            var response = await _authService.RefreshTokenAsync(refreshToken);
            return FromApiResponse(response);
        }

        [HttpPost("logout")]
        [AllowAnonymous] // user must be authenticated or provide refresh token
        public async Task<IActionResult> Logout([FromBody] RefreshRequest req)
        {
            var token = req?.RefreshToken ?? _httpContextAccessor.HttpContext?.Request.Cookies["refreshToken"];
            
            if (string.IsNullOrWhiteSpace(token))
                return FromApiResponse(ApiResponse<object>.Fail(106, "Refresh token required", 2));

            var result = await _authService.LogoutAsync(token);
            return FromApiResponse(result);
        }

        [HttpGet("sessions")]
        [Authorize]
        public async Task<IActionResult> GetSessions()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
                return FromApiResponse(ApiResponse<IList<UsuarioTokenDto>>.Fail(100, "No autenticado", 3));

            var currentRefresh = Request.Cookies["refreshToken"]; // optional
            var sessions = await _tokenService.ListActiveSessionsAsync(userId, currentRefresh);
            return FromApiResponse(ApiResponse<IList<UsuarioTokenDto>>.Ok(sessions));
        }

        [HttpPost("sessions/{id}/revoke")]
        [Authorize]
        public async Task<IActionResult> RevokeSession(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (!int.TryParse(userIdClaim, out var userId))
                return FromApiResponse(ApiResponse<object>.Fail(100, "No autenticado", 3));

            var success = await _tokenService.RevokeSessionAsync(userId, id);
            return success
                ? FromApiResponse(ApiResponse<object>.Ok(null, "Sesión revocada"))
                : FromApiResponse(ApiResponse<object>.Fail(1000, "Sesión no encontrada", 3));
        }

        [HttpPost("request-password-reset")]
        [EnableRateLimiting("RegisterLimiter")] // Prevent abuse
        public async Task<IActionResult> RequestPasswordReset([FromBody] PasswordResetRequestAuth request)
        {
            if (!ModelState.IsValid || string.IsNullOrWhiteSpace(request?.Email))
                return FromApiResponse(ApiResponse<object>.Fail(2, "Email requerido", 2));

            var response = await _authService.RequestPasswordResetAsync(request.Email);
            return FromApiResponse(response);
        }

        [HttpPost("reset-password")]
        [EnableRateLimiting("RegisterLimiter")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestAuth request)
        {
            if (!ModelState.IsValid)
                return FromApiResponse(ApiResponse<object>.Fail(4, "Datos incompletos", 2));

            // Changed - pass entire request object
            var response = await _authService.ResetPasswordAsync(request);
            return FromApiResponse(response);
        }

        //[HttpPost("verify-email")]
        //[Authorize]
        //public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequestAuth request)
        //{
        //    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        //    if (!int.TryParse(userIdClaim, out var userId))
        //        return FromApiResponse(ApiResponse<object>.Fail(200, "Usuario no encontrado"));

        //    var response = await _authService.VerifyEmailAsync(userId, request.Code);
        //    return FromApiResponse(response);
        //}

        [HttpPost("verify-email")]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequest request)
        {
            var response = await _authService.VerifyEmailAsync(request);
            return FromApiResponse(response);
        }

        [HttpPost("resend-verification")]
        [Authorize]
        [EnableRateLimiting("RegisterLimiter")]
        public async Task<IActionResult> ResendVerification()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
                return FromApiResponse(ApiResponse<object>.Fail(200, "Usuario no encontrado"));

            var response = await _authService.SendEmailVerificationAsync(userId);
            return FromApiResponse(response);
        }
    }
}
