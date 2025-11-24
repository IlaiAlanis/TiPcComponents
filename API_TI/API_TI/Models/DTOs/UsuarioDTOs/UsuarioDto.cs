namespace API_TI.Models.DTOs.UsuarioDTOs
{
    public class UsuarioDto
    {
        public int IdUsuario { get; set; }
        public string NombreUsuario { get; set; } = null!;
        public string Correo { get; set; } = null!;
        public int Rol { get; set; }
        public string? Telefono { get; set; }

        public bool EstaActivo { get; set; }
        public DateTime FechaCreacion { get; set; }
    }
}
