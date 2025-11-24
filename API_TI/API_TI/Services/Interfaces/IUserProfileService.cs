using API_TI.Models.DTOs.UsuarioDTOs;
using API_TI.Models.Error;

namespace API_TI.Services.Interfaces
{
    public interface IUserProfileService
    {
        Task<ApiResponse<UsuarioDto>> GetProfileAsync(int usuarioId);
        Task<ApiResponse<UsuarioDto>> UpdateProfileAsync(int usuarioId, UpdateProfileRequest request);
        Task<ApiResponse<object>> ChangePasswordAsync(int usuarioId, ChangePasswordRequest request);
    }
}
