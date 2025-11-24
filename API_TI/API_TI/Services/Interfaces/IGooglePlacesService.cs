using API_TI.Models.DTOs.DireccionDTOs;
using API_TI.Models.Error;

namespace API_TI.Services.Interfaces
{
    public interface IGooglePlacesService
    {
        Task<ApiResponse<bool>> ValidatePlaceIdAsync(string placeId);
        Task<ApiResponse<DireccionDto>> GetAddressDetailsAsync(string placeId);
    }
}
