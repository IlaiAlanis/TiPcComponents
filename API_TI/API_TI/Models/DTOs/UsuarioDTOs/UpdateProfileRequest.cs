using System.ComponentModel.DataAnnotations;

namespace API_TI.Models.DTOs.UsuarioDTOs
{
    public class UpdateProfileRequest
    {
        [MaxLength(150)]
    public string? NombreUsuario { get; set; }
        [EmailAddress]
        public string? Correo { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        [Phone]
        public string? Telefono { get; set; }
        public DateOnly? FechaNacimiento { get; set; }
    }
}
