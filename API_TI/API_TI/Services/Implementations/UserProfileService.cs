using API_TI.Data;
using API_TI.Models.Auth;
using API_TI.Models.DTOs.UsuarioDTOs;
using API_TI.Models.Error;
using API_TI.Services.Abstract;
using API_TI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using static System.Net.WebRequestMethods;

namespace API_TI.Services.Implementations
{
    public class UserProfileService : BaseService, IUserProfileService
    {
        private readonly TiPcComponentsContext _context;
        private readonly IEmailService _emailService;

        public UserProfileService(
            TiPcComponentsContext context,
            IEmailService emailService,
            IErrorService errorService,
            IHttpContextAccessor httpContextAccessor,
            IAuditService auditService
        ) : base(errorService, httpContextAccessor, auditService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task<ApiResponse<UsuarioDto>> GetProfileAsync(int usuarioId)
        {
            try
            {
                var usuario = await _context.Usuarios.FindAsync(usuarioId);
                if (usuario == null)
                    return await ReturnErrorAsync<UsuarioDto>(200);

                return ApiResponse<UsuarioDto>.Ok(new UsuarioDto
                {
                    IdUsuario = usuario.IdUsuario,
                    NombreUsuario = usuario.NombreUsuario,
                    Correo = usuario.Correo,
                    Telefono = usuario.Telefono,
                    FechaCreacion = usuario.FechaCreacion
                });
            }
            catch (Exception ex)
            {
                await LogTechnicalErrorAsync(9000, ex);
                return await ReturnErrorAsync<UsuarioDto>(9000);
            }
        }

        public async Task<ApiResponse<UsuarioDto>> UpdateProfileAsync(int usuarioId, UpdateProfileRequest request)
        {
            try
            {
                var usuario = await _context.Usuarios.FindAsync(usuarioId);
                if (usuario == null)
                    return await ReturnErrorAsync<UsuarioDto>(200);

                if (!string.IsNullOrWhiteSpace(request.NombreUsuario))
                    usuario.NombreUsuario = request.NombreUsuario;

                if (!string.IsNullOrWhiteSpace(request.Telefono))
                    usuario.Telefono = request.Telefono;

                if (!string.IsNullOrWhiteSpace(request.Correo) && request.Correo != usuario.Correo)
                {
                    if (await _context.Usuarios.AnyAsync(u => u.Correo == request.Correo && u.IdUsuario != usuarioId))
                        return await ReturnErrorAsync<UsuarioDto>(203, "Correo ya registrado");

                    usuario.Correo = request.Correo;
                    usuario.CorreoVerificado = false;
                    // Send verification email
                    await _emailService.SendEmailVerificationAsync(request.Correo, GenerateVerificationCode());
                }

                usuario.FechaActualizacion = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                await AuditAsync("User.ProfileUpdated", new { UsuarioId = usuarioId }, usuarioId);

                return await GetProfileAsync(usuarioId);
            }
            catch (Exception ex)
            {
                await LogTechnicalErrorAsync(9000, ex);
                return await ReturnErrorAsync<UsuarioDto>(9000);
            }
        }

        public async Task<ApiResponse<object>> ChangePasswordAsync(int usuarioId, ChangePasswordRequest request)
        {
            try
            {
                var usuario = await _context.Usuarios.FindAsync(usuarioId);
                if (usuario == null)
                    return await ReturnErrorAsync<object>(200);

                // Verify current password
                if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, usuario.ContrasenaHash))
                    return await ReturnErrorAsync<object>(204, "Contraseña actual incorrecta");

                // Hash new password
                usuario.ContrasenaHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                usuario.FechaActualizacion = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                await AuditAsync("User.PasswordChanged", new { UsuarioId = usuarioId }, usuarioId);

                return ApiResponse<object>.Ok(null, "Contraseña actualizada");
            }
            catch (Exception ex)
            {
                await LogTechnicalErrorAsync(9000, ex);
                return await ReturnErrorAsync<object>(9000);
            }
        }

        private string GenerateVerificationCode() => new Random().Next(100000, 999999).ToString();
    }
}
