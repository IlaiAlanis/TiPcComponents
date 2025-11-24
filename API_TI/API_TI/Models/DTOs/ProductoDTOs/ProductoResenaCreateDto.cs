namespace API_TI.Models.DTOs.ProductoDTOs
{
    public class ProductoResenaCreateDto
    {
        public int ProductoId { get; set; }
        public int UsuarioId { get; set; }
        public int Calificacion { get; set; }
        public string? Comentario { get; set; }
    }
}
