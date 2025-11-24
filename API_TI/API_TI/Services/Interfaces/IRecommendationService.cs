using API_TI.Models.DTOs.ProductoDTOs;
using API_TI.Models.Error;

namespace API_TI.Services.Interfaces
{
    public interface IRecommendationService
    {
        Task<ApiResponse<List<ProductoDto>>> GetRecommendationsAsync(int usuarioId, int take = 10);
        Task<ApiResponse<List<ProductoDto>>> GetSimilarProductsAsync(int productoId, int take = 6);
    
    }
}
