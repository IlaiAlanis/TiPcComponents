namespace API_TI.Models.DTOs.AdminDTOs
{
    public class AdminUserDto
    {
        public int IdUsuario { get; set; }
        public string NombreCompleto { get; set; }
        public string Correo { get; set; }
        public string Rol { get; set; }
        public bool EstaActivo { get; set; }
        public bool CorreoVerificado { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime? UltimoLogin { get; set; }
        public int IntentosFallidos { get; set; }
    }
}
