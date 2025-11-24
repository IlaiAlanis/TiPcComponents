using API_TI.Models.DTOs.AdminDTOs;
using API_TI.Models.Error;

namespace API_TI.Services.Interfaces
{
    public interface IAdminDashboardService
    {
        Task<ApiResponse<DashboardMetricsDto>> GetMetricsAsync();
    }
}
