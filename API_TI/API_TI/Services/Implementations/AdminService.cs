using API_TI.Data;
using API_TI.Models.DTOs.AdminDTOs;
using API_TI.Models.Error;
using API_TI.Services.Abstract;
using API_TI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API_TI.Services.Implementations
{
    public class AdminService : BaseService, IAdminService
    {
        private readonly TiPcComponentsContext _context;

        public AdminService(
            TiPcComponentsContext context,
            IErrorService errorService,
            IHttpContextAccessor httpContextAccessor,
            IAuditService auditService
        ) : base(errorService, httpContextAccessor, auditService)
        {
            _context = context;
        }

        public async Task<ApiResponse<PagedResult<AdminUserDto>>> GetUsersAsync(UserListRequest request)
        {
            try
            {
                var query = _context.Usuarios
                    .Include(u => u.Rol)
                    .AsQueryable();

                // Filters
                if (!string.IsNullOrWhiteSpace(request.Search))
                {
                    query = query.Where(u =>
                        u.NombreUsuario.Contains(request.Search) ||
                        u.Correo.Contains(request.Search));
                }

                if (request.EstaActivo.HasValue)
                    query = query.Where(u => u.EstaActivo == request.EstaActivo.Value);

                if (request.RolId.HasValue)
                    query = query.Where(u => u.RolId == request.RolId.Value);

                var total = await query.CountAsync();

                var users = await query
                    .OrderByDescending(u => u.FechaCreacion)
                    .Skip((request.Page - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .Select(u => new AdminUserDto
                    {
                        IdUsuario = u.IdUsuario,
                        NombreCompleto = u.NombreUsuario + " " + (u.ApellidoPaterno ?? ""),
                        Correo = u.Correo,
                        Rol = u.Rol.NombreRol,
                        EstaActivo = u.EstaActivo,
                        CorreoVerificado = u.CorreoVerificado,
                        FechaCreacion = u.FechaCreacion,
                        UltimoLogin = u.UltimoLoginUsuario,
                        IntentosFallidos = u.IntentosFallidosLogin
                    })
                    .ToListAsync();

                var result = new PagedResult<AdminUserDto>
                {
                    Items = users,
                    TotalItems = total,
                    Page = request.Page,
                    PageSize = request.PageSize
                };

                return ApiResponse<PagedResult<AdminUserDto>>.Ok(result);
            }
            catch (Exception ex)
            {
                await LogTechnicalErrorAsync(9000, ex);
                return await ReturnErrorAsync<PagedResult<AdminUserDto>>(9000);
            }
        }

        public async Task<ApiResponse<AdminUserDto>> GetUserDetailsAsync(int userId)
        {
            try
            {
                var user = await _context.Usuarios
                    .Include(u => u.Rol)
                    .FirstOrDefaultAsync(u => u.IdUsuario == userId);

                if (user == null)
                    return await ReturnErrorAsync<AdminUserDto>(200);

                var dto = new AdminUserDto
                {
                    IdUsuario = user.IdUsuario,
                    NombreCompleto = user.NombreUsuario + " " + (user.ApellidoPaterno ?? ""),
                    Correo = user.Correo,
                    Rol = user.Rol.NombreRol,
                    EstaActivo = user.EstaActivo,
                    CorreoVerificado = user.CorreoVerificado,
                    FechaCreacion = user.FechaCreacion,
                    UltimoLogin = user.UltimoLoginUsuario,
                    IntentosFallidos = user.IntentosFallidosLogin
                };

                return ApiResponse<AdminUserDto>.Ok(dto);
            }
            catch (Exception ex)
            {
                await LogTechnicalErrorAsync(9000, ex);
                return await ReturnErrorAsync<AdminUserDto>(9000);
            }
        }

        public async Task<ApiResponse<object>> ToggleUserStatusAsync(int adminId, int userId)
        {
            try
            {
                // Can't disable yourself
                if (adminId == userId)
                    return await ReturnErrorAsync<object>(5, "No puedes desactivar tu propia cuenta");

                var user = await _context.Usuarios.FindAsync(userId);
                if (user == null)
                    return await ReturnErrorAsync<object>(200);

                user.EstaActivo = !user.EstaActivo;
                user.FechaActualizacion = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                await AuditAsync("Admin.User.StatusToggled", new
                {
                    AdminId = adminId,
                    UserId = userId,
                    NewStatus = user.EstaActivo
                });

                return ApiResponse<object>.Ok(null,
                    user.EstaActivo ? "Usuario activado" : "Usuario desactivado");
            }
            catch (Exception ex)
            {
                await LogTechnicalErrorAsync(9000, ex);
                return await ReturnErrorAsync<object>(9000);
            }
        }

        public async Task<ApiResponse<AdminDashboardDto>> GetDashboardStatsAsync()
        {
            try
            {
                var today = DateTime.UtcNow.Date;
                var monthStart = new DateTime(today.Year, today.Month, 1);

                var stats = new AdminDashboardDto
                {
                    TotalUsuarios = await _context.Usuarios.CountAsync(),
                    UsuariosActivos = await _context.Usuarios.CountAsync(u => u.EstaActivo),
                    UsuariosHoy = await _context.Usuarios.CountAsync(u => u.FechaCreacion >= today),
                    OrdenesPendientes = await _context.Ordens.CountAsync(o =>
                        o.EstatusVentaId == 2 || o.EstatusVentaId == 3),
                    OrdenesHoy = await _context.Ordens.CountAsync(o => o.FechaOrden >= today),
                    VentasHoy = await _context.Ordens
                        .Where(o => o.FechaOrden >= today && o.EstatusVentaId >= 4)
                        .SumAsync(o => (decimal?)o.Total) ?? 0,
                    VentasMes = await _context.Ordens
                        .Where(o => o.FechaOrden >= monthStart && o.EstatusVentaId >= 4)
                        .SumAsync(o => (decimal?)o.Total) ?? 0
                };

                return ApiResponse<AdminDashboardDto>.Ok(stats);
            }
            catch (Exception ex)
            {
                await LogTechnicalErrorAsync(9000, ex);
                return await ReturnErrorAsync<AdminDashboardDto>(9000);
            }
        }
    }
}
