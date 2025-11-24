using System.ComponentModel.DataAnnotations;

namespace API_TI.Models.Auth
{
    public class LoginRequestAuth
    {
        [Required(ErrorMessage = "El correo es requerido")]
        [EmailAddress(ErrorMessage = "Formato de correo inválido")]
        [StringLength(255, ErrorMessage = "El correo no puede exceder 255 caracteres")]
        public string Correo { get; set; }

        [Required(ErrorMessage = "La contraseña es requerida")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "La contraseña debe tener entre 8 y 100 caracteres")]
        public string Contrasena { get; set; }
        public string RecaptchaToken { get; set; }
    }
}
