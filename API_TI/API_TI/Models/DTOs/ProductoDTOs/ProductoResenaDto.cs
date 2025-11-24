namespace API_TI.Models.DTOs.ProductoDTOs
{
    public class ProductoResenaDto
    {
        public int IdResena { get; set; }
        public int UsuarioId { get; set; }
        public string NombreUsuario { get; set; } = string.Empty;
        public int Calificacion { get; set; }
        public string? Comentario { get; set; }
        public DateTime FechaCreacion { get; set; }
    }
}
