using System.ComponentModel.DataAnnotations;

namespace API_TI.Models.Auth
{
    public class RegisterRequestAuth
    {
        [Required(ErrorMessage = "El nombre de usuario es requerido")]
        [StringLength(150, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 150 caracteres")]
        [RegularExpression(@"^[a-zA-Z0-9_\s]+$", ErrorMessage = "El nombre solo puede contener letras, números y guiones bajos")]
        public string NombreUsuario { get; set; }
        [Required(ErrorMessage = "El correo es requerido")]
        [EmailAddress(ErrorMessage = "Formato de correo inválido")]
        [StringLength(255)]
        public string Correo { get; set; }

        [Required(ErrorMessage = "La contraseña es requerida")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "La contraseña debe tener entre 8 y 100 caracteres")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$",
            ErrorMessage = "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial")]
        public string Contrasena { get; set; }

        [Required]
        [Compare("Contrasena", ErrorMessage = "Las contraseñas no coinciden")]
        public string ConfirmarContrasena { get; set; }

        public DateOnly? FechaNacimiento { get; set; }

        public int RolId { get; set; } = 2;
        public string RecaptchaToken { get; set; }
    }
}
