using API_TI.Models.DTOs.CotizacionDTOs;
using API_TI.Models.Error;

namespace API_TI.Services.Interfaces
{
    public interface IShippingService
    {
        Task<ApiResponse<CotizacionesEnvioResponse>> GetShippingQuotesAsync(int userId, CotizarEnvioRequest request);
        Task<ApiResponse<CotizacionEnvioDto>> GetLocalShippingRateAsync(int direccionId, decimal pesoKg);
    }
}
