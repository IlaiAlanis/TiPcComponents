namespace API_TI.Models.DTOs.RolDTOs
{
    public class RolDto
    {
        public int IdRol { get; set; }
        public string NombreRol { get; set; }
        public string? Descripcion { get; set; }
        public bool EstaActivo { get; set; }
        public DateTime FechaCreacion { get; set; }
    }
}
