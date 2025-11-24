using System.ComponentModel.DataAnnotations;

namespace API_TI.Models.DTOs.UsuarioDTOs
{
    public class UpdateEmailRequest
    {
        [Required][EmailAddress] public string NewEmail { get; set; }
        [Required] public string Password { get; set; }
    }
}
