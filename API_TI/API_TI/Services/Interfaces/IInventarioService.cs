using API_TI.Models.DTOs.InventarioDTOs;
using API_TI.Models.Error;

namespace API_TI.Services.Interfaces
{
    public interface IInventarioService
    {
        Task<ApiResponse<object>> AdjustStockAsync(AdjustStockRequest request, int usuarioId);
    }
}
