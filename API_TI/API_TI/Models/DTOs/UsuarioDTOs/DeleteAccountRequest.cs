using System.ComponentModel.DataAnnotations;

namespace API_TI.Models.DTOs.UsuarioDTOs
{
    public class DeleteAccountRequest
    {
        [Required] public string Password { get; set; }
    }
}
