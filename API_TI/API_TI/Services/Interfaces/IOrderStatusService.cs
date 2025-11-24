using API_TI.Models.DTOs.OrdenDTOs;
using API_TI.Models.DTOs.OrderDTOs;
using API_TI.Models.Error;

namespace API_TI.Services.Interfaces
{
    public interface IOrderStatusService
    {
        Task<ApiResponse<OrdenDto>> UpdateOrderStatusAsync(int ordenId, UpdateOrderStatusRequest request, int adminId);
    }
}
