using API_TI.Data;
using API_TI.Models.DTOs.UsuarioDTOs;
using API_TI.Models.Error;
using API_TI.Services.Abstract;
using API_TI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API_TI.Services.Implementations
{
    public class UserService : BaseService, IUserService
    {
        private readonly TiPcComponentsContext _context;

        public UserService(
            TiPcComponentsContext context,
            IErrorService errorService,
            IHttpContextAccessor httpContextAccessor,
            IAuditService auditService
        ) : base(errorService, httpContextAccessor, auditService)
        {
            _context = context;
        }

        public async Task<ApiResponse<UserProfileDto>> GetProfileAsync(int userId)
        {
            try
            {
                var user = await _context.Usuarios
                    .Include(u => u.Rol)
                    .FirstOrDefaultAsync(u => u.IdUsuario == userId);

                if (user == null)
                    return await ReturnErrorAsync<UserProfileDto>(200);

                var profile = new UserProfileDto
                {
                    IdUsuario = user.IdUsuario,
                    NombreUsuario = user.NombreUsuario,
                    ApellidoPaterno = user.ApellidoPaterno,
                    ApellidoMaterno = user.ApellidoMaterno,
                    Correo = user.Correo,
                    CorreoVerificado = user.CorreoVerificado,
                    FechaNacimiento = user.FechaNacimiento,
                    Rol = user.Rol?.NombreRol,
                    FechaCreacion = user.FechaCreacion,
                    UltimoLogin = user.UltimoLoginUsuario
                };

                return ApiResponse<UserProfileDto>.Ok(profile);
            }
            catch (Exception ex)
            {
                await LogTechnicalErrorAsync(9000, ex);
                return await ReturnErrorAsync<UserProfileDto>(9000);
            }
        }

        public async Task<ApiResponse<UserProfileDto>> UpdateProfileAsync(int userId, UpdateProfileRequest request)
        {
            try
            {
                var user = await _context.Usuarios
                    .Include(u => u.Rol)
                    .FirstOrDefaultAsync(u => u.IdUsuario == userId);

                if (user == null)
                    return await ReturnErrorAsync<UserProfileDto>(200);

                user.NombreUsuario = request.NombreUsuario;
                user.ApellidoPaterno = request.ApellidoPaterno;
                user.ApellidoMaterno = request.ApellidoMaterno;
                user.FechaNacimiento = request.FechaNacimiento;
                user.FechaActualizacion = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                await AuditAsync("User.Profile.Updated", new { UserId = userId });

                var profile = new UserProfileDto
                {
                    IdUsuario = user.IdUsuario,
                    NombreUsuario = user.NombreUsuario,
                    ApellidoPaterno = user.ApellidoPaterno,
                    ApellidoMaterno = user.ApellidoMaterno,
                    Correo = user.Correo,
                    CorreoVerificado = user.CorreoVerificado,
                    FechaNacimiento = user.FechaNacimiento,
                    Rol = user.Rol?.NombreRol,
                    FechaCreacion = user.FechaCreacion,
                    UltimoLogin = user.UltimoLoginUsuario
                };

                return ApiResponse<UserProfileDto>.Ok(profile, "Perfil actualizado");
            }
            catch (Exception ex)
            {
                await LogTechnicalErrorAsync(9000, ex);
                return await ReturnErrorAsync<UserProfileDto>(9000);
            }
        }

        public async Task<ApiResponse<object>> ChangePasswordAsync(int userId, ChangePasswordRequest request)
        {
            try
            {
                var user = await _context.Usuarios.FindAsync(userId);
                if (user == null)
                    return await ReturnErrorAsync<object>(200);

                // Verify current password
                if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.ContrasenaHash))
                    return await ReturnErrorAsync<object>(203);

                // Validate new password
                if (request.NewPassword.Length < 8)
                    return await ReturnErrorAsync<object>(3, "Contraseña debe tener al menos 8 caracteres");

                if (BCrypt.Net.BCrypt.Verify(request.NewPassword, user.ContrasenaHash))
                    return await ReturnErrorAsync<object>(5, "La nueva contraseña debe ser diferente");

                // Hash new password
                user.ContrasenaHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword, 12);
                user.FechaActualizacion = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                await AuditAsync("User.Password.Changed", new { UserId = userId });

                return ApiResponse<object>.Ok(null, "Contraseña actualizada");
            }
            catch (Exception ex)
            {
                await LogTechnicalErrorAsync(9000, ex);
                return await ReturnErrorAsync<object>(9000);
            }
        }

        public async Task<ApiResponse<object>> UpdateEmailAsync(int userId, UpdateEmailRequest request)
        {
            try
            {
                var user = await _context.Usuarios.FindAsync(userId);
                if (user == null)
                    return await ReturnErrorAsync<object>(200);

                // Verify password
                if (!BCrypt.Net.BCrypt.Verify(request.Password, user.ContrasenaHash))
                    return await ReturnErrorAsync<object>(203);

                // Check if email already exists
                var exists = await _context.Usuarios
                    .AnyAsync(u => u.Correo == request.NewEmail && u.IdUsuario != userId);
                if (exists)
                    return await ReturnErrorAsync<object>(201);

                user.Correo = request.NewEmail;
                user.CorreoVerificado = false; // Require re-verification
                user.FechaActualizacion = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                await AuditAsync("User.Email.Changed", new
                {
                    UserId = userId,
                    NewEmail = request.NewEmail
                });

                return ApiResponse<object>.Ok(null, "Email actualizado. Verifica tu nuevo correo");
            }
            catch (Exception ex)
            {
                await LogTechnicalErrorAsync(9000, ex);
                return await ReturnErrorAsync<object>(9000);
            }
        }

        public async Task<ApiResponse<object>> DeleteAccountAsync(int userId, string password)
        {
            try
            {
                var user = await _context.Usuarios.FindAsync(userId);
                if (user == null)
                    return await ReturnErrorAsync<object>(200);

                // Verify password
                if (!BCrypt.Net.BCrypt.Verify(password, user.ContrasenaHash))
                    return await ReturnErrorAsync<object>(203);

                // Soft delete
                user.EstaActivo = false;
                user.FechaActualizacion = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                await AuditAsync("User.Account.Deleted", new { UserId = userId });

                return ApiResponse<object>.Ok(null, "Cuenta eliminada");
            }
            catch (Exception ex)
            {
                await LogTechnicalErrorAsync(9000, ex);
                return await ReturnErrorAsync<object>(9000);
            }
        }
    }
}
