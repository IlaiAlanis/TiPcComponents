using API_TI.Models.DTOs.CiudadDTOs;
using API_TI.Models.DTOs.PaisDto;
using API_TI.Models.Error;
using API_TI.Models.DTOs.EstadoDTOs;

namespace API_TI.Services.Interfaces
{
    public interface IGeografiaService
    {
        Task<ApiResponse<IList<PaisDto>>> GetCountriesAsync();
        Task<ApiResponse<IList<EstadoDto>>> GetStatesByCountryAsync(int paisId);
        Task<ApiResponse<IList<CiudadDto>>> GetCitiesByStateAsync(int estadoId);
    }
}
