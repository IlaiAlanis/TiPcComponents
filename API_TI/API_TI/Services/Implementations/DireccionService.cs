using API_TI.Data;
using API_TI.Models.dbModels;
using API_TI.Models.DTOs.DireccionDTOs;
using API_TI.Models.Error;
using API_TI.Services.Abstract;
using API_TI.Services.Helpers;
using API_TI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API_TI.Services.Implementations
{
    public class DireccionService : BaseService, IDireccionService
    {
        private readonly TiPcComponentsContext _context;
        private readonly ILogger<DireccionService> _logger;

        public DireccionService(
            TiPcComponentsContext context,
            ILogger<DireccionService> logger,
            IErrorService errorService,
            IHttpContextAccessor httpContextAccessor,
            IAuditService auditService
        ) : base(errorService, httpContextAccessor, auditService)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ApiResponse<IList<DireccionDto>>> GetUserAddressesAsync(int userId)
        {
            try
            {
                var addresses = await _context.Direccions
                    .Include(x => x.Pais)
                    .Include(x => x.Estado)
                    .Include(x => x.Ciudad)
                    .Where(x => x.UsuarioId == userId)
                    .OrderByDescending(x => x.EsDefault)
                    .ThenByDescending(x => x.FechaCreacion)
                    .ToListAsync();

                var dtos = Mapper.ToDireccionDto(addresses);
                return ApiResponse<IList<DireccionDto>>.Ok(dtos);
            }
            catch (Exception ex)
            {
                await LogTechnicalErrorAsync(9000, ex);
                return await ReturnErrorAsync<IList<DireccionDto>>(9000);
            }
        }

        public async Task<ApiResponse<DireccionDto>> GetAddressByIdAsync(int userId, int addressId)
        {
            try
            {
                var address = await _context.Direccions
                    .Include(x => x.Pais)
                    .Include(x => x.Estado)
                    .Include(x => x.Ciudad)
                    .FirstOrDefaultAsync(x => x.IdDireccion == addressId && x.UsuarioId == userId);

                if (address == null)
                    return await ReturnErrorAsync<DireccionDto>(902);

                return ApiResponse<DireccionDto>.Ok(Mapper.ToDireccionDto(address));
            }
            catch (Exception ex)
            {
                await LogTechnicalErrorAsync(9000, ex);
                return await ReturnErrorAsync<DireccionDto>(9000);
            }
        }

        public async Task<ApiResponse<DireccionDto>> CreateAddressAsync(int userId, CreateDireccionRequest request)
        {
            try
            {
                var valid = await ValidateGeographicHierarchy(request.PaisId, request.EstadoId, request.CiudadId);
                if (!valid)
                    return await ReturnErrorAsync<DireccionDto>(902, "Ubicación geográfica inválida");

                await using var transaction = await _context.Database.BeginTransactionAsync();

                try
                {
                    if (request.EsDefault)
                    {
                        await UnsetAllDefaultsAsync(userId);
                    }
                    else
                    {
                        var hasAddresses = await _context.Direccions.AnyAsync(d => d.UsuarioId == userId);
                        if (!hasAddresses)
                            request.EsDefault = true;
                    }

                    var address = new Direccion
                    {
                        UsuarioId = userId,
                        PaisId = request.PaisId,
                        EstadoId = request.EstadoId,
                        CiudadId = request.CiudadId,
                        CodigoPostal = request.CodigoPostal,
                        Colonia = request.Colonia,
                        Calle = request.Calle,
                        NumeroInterior = request.NumeroInterior,
                        NumeroExterior = request.NumeroExterior,
                        Etiqueta = request.Etiqueta ?? "Principal",
                        EsDefault = request.EsDefault,
                        FechaCreacion = DateTime.UtcNow
                    };

                    _context.Direccions.Add(address);
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    await AuditAsync("User.Address.Created", new { UserId = userId, AddressId = address.IdDireccion }, userId);

                    await _context.Entry(address).Reference(x => x.Pais).LoadAsync();
                    await _context.Entry(address).Reference(x => x.Estado).LoadAsync();
                    await _context.Entry(address).Reference(x => x.Ciudad).LoadAsync();

                    return ApiResponse<DireccionDto>.Ok(Mapper.ToDireccionDto(address), "Dirección creada");
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
            catch (Exception ex)
            {
                await LogTechnicalErrorAsync(9000, ex);
                return await ReturnErrorAsync<DireccionDto>(9000);
            }
        }

        public async Task<ApiResponse<DireccionDto>> UpdateAddressAsync(int userId, int addressId, UpdateDireccionRequest request)
        {
            try
            {
                var address = await _context.Direccions
                    .FirstOrDefaultAsync(x => x.IdDireccion == addressId && x.UsuarioId == userId);

                if (address == null)
                    return await ReturnErrorAsync<DireccionDto>(902);

                if (request.PaisId != 0 || request.EstadoId != 0 || request.CiudadId != 0)
                {
                    var paisId = request.PaisId != 0 ? request.PaisId : address.PaisId;
                    var estadoId = request.EstadoId != 0 ? request.EstadoId : address.EstadoId;
                    var ciudadId = request.CiudadId != 0 ? request.CiudadId : address.CiudadId;

                    var valid = await ValidateGeographicHierarchy(paisId, estadoId, ciudadId);
                    if (!valid)
                        return await ReturnErrorAsync<DireccionDto>(902, "Ubicación geográfica inválida");
                }

                await using var transaction = await _context.Database.BeginTransactionAsync();

                try
                {
                    if (request.EsDefault == true)
                        await UnsetAllDefaultsAsync(userId);

                    if (request.PaisId != 0) address.PaisId = request.PaisId;
                    if (request.EstadoId != 0) address.EstadoId = request.EstadoId;
                    if (request.CiudadId != 0) address.CiudadId = request.CiudadId;
                    if (!string.IsNullOrWhiteSpace(request.CodigoPostal)) address.CodigoPostal = request.CodigoPostal;
                    if (request.Colonia != null) address.Colonia = request.Colonia;
                    if (!string.IsNullOrWhiteSpace(request.Calle)) address.Calle = request.Calle;
                    if (request.NumeroInterior != null) address.NumeroInterior = request.NumeroInterior;
                    if (request.NumeroExterior != null) address.NumeroExterior = request.NumeroExterior;
                    if (request.Etiqueta != null) address.Etiqueta = request.Etiqueta;
                    if (request.EsDefault.HasValue) address.EsDefault = request.EsDefault.Value;

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    await AuditAsync("User.Address.Updated", new { UserId = userId, AddressId = addressId }, userId);

                    await _context.Entry(address).Reference(x => x.Pais).LoadAsync();
                    await _context.Entry(address).Reference(x => x.Estado).LoadAsync();
                    await _context.Entry(address).Reference(x => x.Ciudad).LoadAsync();

                    return ApiResponse<DireccionDto>.Ok(Mapper.ToDireccionDto(address), "Dirección actualizada");
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
            catch (Exception ex)
            {
                await LogTechnicalErrorAsync(9000, ex);
                return await ReturnErrorAsync<DireccionDto>(9000);
            }
        }

        public async Task<ApiResponse<object>> DeleteAddressAsync(int userId, int addressId)
        {
            try
            {
                var address = await _context.Direccions
                    .FirstOrDefaultAsync(x => x.IdDireccion == addressId && x.UsuarioId == userId);

                if (address == null)
                    return await ReturnErrorAsync<object>(902);

                if (address.EsDefault)
                {
                    var otherAddresses = await _context.Direccions
                        .AnyAsync(x => x.UsuarioId == userId && x.IdDireccion != addressId);

                    if (otherAddresses)
                        return await ReturnErrorAsync<object>(5, "Debe establecer otra dirección como predeterminada primero");
                }

                _context.Direccions.Remove(address);
                await _context.SaveChangesAsync();

                await AuditAsync("User.Address.Deleted", new { UserId = userId, AddressId = addressId }, userId);

                return ApiResponse<object>.Ok(null, "Dirección eliminada");
            }
            catch (Exception ex)
            {
                await LogTechnicalErrorAsync(9000, ex);
                return await ReturnErrorAsync<object>(9000);
            }
        }

        public async Task<ApiResponse<DireccionDto>> SetDefaultAddressAsync(int userId, int addressId)
        {
            try
            {
                var address = await _context.Direccions
                    .Include(x => x.Pais)
                    .Include(x => x.Estado)
                    .Include(x => x.Ciudad)
                    .FirstOrDefaultAsync(d => d.IdDireccion == addressId && d.UsuarioId == userId);

                if (address == null)
                    return await ReturnErrorAsync<DireccionDto>(902);

                if (address.EsDefault)
                    return ApiResponse<DireccionDto>.Ok(Mapper.ToDireccionDto(address), "Ya es la dirección predeterminada");

                await using var transaction = await _context.Database.BeginTransactionAsync();

                try
                {
                    await UnsetAllDefaultsAsync(userId);
                    address.EsDefault = true;
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    await AuditAsync("User.Address.SetDefault", new { UserId = userId, AddressId = addressId }, userId);

                    return ApiResponse<DireccionDto>.Ok(Mapper.ToDireccionDto(address), "Dirección predeterminada actualizada");
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
            catch (Exception ex)
            {
                await LogTechnicalErrorAsync(9000, ex);
                return await ReturnErrorAsync<DireccionDto>(9000);
            }
        }

        private async Task UnsetAllDefaultsAsync(int userId)
        {
            var defaults = await _context.Direccions
                .Where(x => x.UsuarioId == userId && x.EsDefault)
                .ToListAsync();

            foreach (var d in defaults)
                d.EsDefault = false;

            await _context.SaveChangesAsync();
        }

        private async Task<bool> ValidateGeographicHierarchy(int? paisId, int? estadoId, int? ciudadId)
        {
            if (paisId == null || estadoId == null || ciudadId == null)
                return false;

            var ciudad = await _context.Ciudads
                .Include(x => x.Estado)
                .ThenInclude(x => x.Pais)
                .FirstOrDefaultAsync(x => x.IdCiudad == ciudadId.Value);

            if (ciudad == null || ciudad.EstadoId != estadoId.Value || ciudad.Estado?.PaisId != paisId.Value)
                return false;

            return true;
        }
    }
}