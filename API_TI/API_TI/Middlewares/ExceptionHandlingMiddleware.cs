using API_TI.Models.DTOs.ErrorDTOs;
using API_TI.Models.Error;
using API_TI.Services.Implementations;
using API_TI.Services.Interfaces;
using System.Net;
using System.Text.Json;

namespace API_TI.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IErrorService _errorService;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;
        private readonly IAuditService _auditService;

        public ExceptionHandlingMiddleware(
            RequestDelegate next,
            IErrorService errorService,
            ILogger<ExceptionHandlingMiddleware> logger,
            IAuditService auditService
        )
        {
            _next = next;
            _errorService = errorService;
            _logger = logger;
            _auditService = auditService;
        }

        public async Task Invoke(HttpContext context)
        {
            var correlationId = context.TraceIdentifier;

            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                // Structured logging (Serilog)
                var endpoint = context.Request.Path;
                var ip = context.Connection?.RemoteIpAddress?.ToString();
                var ua = context.Request.Headers["User-Agent"].ToString();
                var userId = context.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                int? userIdParsed = null;
                if (userId != null && int.TryParse(userId, out var parsed))
                    userIdParsed = parsed;

                _logger.LogError(ex, "Unhandled exception {@Meta}", new
                {
                    CorrelationId = correlationId,
                    Endpoint = endpoint,
                    Ip = ip,
                    UserAgent = ua,
                    UserId = userId
                });

                // Persist technical details to DB via ErrorService (9000)
                try
                {
                    var technicalDetail = $"Exception: {ex.Message}\n{ex.StackTrace}";
                    await _errorService.LogErrorAsync(9000, technicalDetail, endpoint, userId is null ? (int?)null : userIdParsed);
                }
                catch (Exception logEx)
                {
                    _logger.LogError(logEx, "Failed to write error log to DB");
                }

                // Optional audit for critical exception
                try
                {
                    await _auditService.LogAsync("System.Exception", new
                    {
                        CorrelationId = correlationId,
                        Endpoint = endpoint,
                        Error = ex.Message
                    }, userId is null ? (int?)null : userIdParsed);
                }
                catch
                {
                    System.Diagnostics.Debug.WriteLine($"Audit failed: {ex.Message}");
                }

                // Fetch friendly message
                var errorInfo = await _errorService.GetErrorByCodeInfoAsync(9000)
                    ?? new ErrorInfoDto { Codigo = 9000, Mensaje = "Error interno del servidor.", Severidad = 3 };

                // Build client-safe response (no technical detail)
                var apiResponse = ApiResponse<object>.Fail(errorInfo.Codigo, errorInfo.Mensaje, errorInfo.Severidad);

                // Attach correlation id so clients can give to support
                apiResponse.CorrelationId = correlationId;

                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                context.Response.ContentType = "application/json";

                var json = JsonSerializer.Serialize(apiResponse);
                await context.Response.WriteAsync(json);
            }
        }
    }
}
