using API_TI.Models.DTOs.AdminDTOs;
using API_TI.Models.DTOs.OrdenDTOs;
using API_TI.Models.Error;

namespace API_TI.Services.Interfaces
{
    public interface IOrdenService
    {
        Task<ApiResponse<PagedResult<OrdenDto>>> GetUserOrdersAsync(int usuarioId, int page, int pageSize);
        Task<ApiResponse<OrdenDto>> GetOrderByIdAsync(int usuarioId, int ordenId);
        Task<ApiResponse<object>> CancelOrderAsync(int ordenId, int usuarioId);
    }
}
