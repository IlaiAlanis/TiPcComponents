using System.ComponentModel.DataAnnotations;

namespace API_TI.Models.DTOs.UsuarioDTOs
{
    public class ChangePasswordRequest
    {
        [Required] public string CurrentPassword { get; set; }
        [Required]
        [MinLength(8)]
        public string NewPassword { get; set; }
    }
}
