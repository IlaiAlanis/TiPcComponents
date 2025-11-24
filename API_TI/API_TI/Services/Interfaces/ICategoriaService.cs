using API_TI.Models.DTOs.CategoriaDTOs;
using API_TI.Models.Error;

namespace API_TI.Services.Interfaces
{
    public interface ICategoriaService
    {
        Task<ApiResponse<List<CategoriaDto>>> GetAllAsync();
        Task<ApiResponse<CategoriaDto>> GetByIdAsync(int id);
        Task<ApiResponse<CategoriaDto>> CreateAsync(CreateCategoriaDto dto);
        Task<ApiResponse<CategoriaDto>> UpdateAsync(UpdateCategoriaDto dto);
        Task<ApiResponse<bool>> DeleteAsync(int id);

    }
}
