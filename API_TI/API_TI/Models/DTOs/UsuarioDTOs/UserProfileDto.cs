namespace API_TI.Models.DTOs.UsuarioDTOs
{
    public class UserProfileDto
    {
        public int IdUsuario { get; set; }
        public string NombreUsuario { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public string Correo { get; set; }
        public bool CorreoVerificado { get; set; }
        public DateOnly? FechaNacimiento { get; set; }
        public string Rol { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime? UltimoLogin { get; set; }
    }
}
