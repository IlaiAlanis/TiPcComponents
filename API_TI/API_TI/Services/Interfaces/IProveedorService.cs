using API_TI.Models.DTOs.ProveedorDTOs;
using API_TI.Models.Error;

namespace API_TI.Services.Interfaces
{
    public interface IProveedorService
    {
        Task<ApiResponse<List<ProveedorDto>>> GetAllAsync();
        Task<ApiResponse<ProveedorDto>> GetByIdAsync(int id);
        Task<ApiResponse<ProveedorDto>> CreateAsync(CreateProveedorRequest request);
        Task<ApiResponse<ProveedorDto>> UpdateAsync(int id, CreateProveedorRequest request);
        Task<ApiResponse<object>> DeleteAsync(int id);
    }
}
