namespace API_TI.Models.DTOs.ProductoDTOs
{
    public class ProductoHistorialPrecioDto
    {
        public int IdHistorialPrecio { get; set; }
        public int UsuarioId { get; set; }
        public int ProductoId { get; set; }
        public decimal PrecioAnterior { get; set; }
        public decimal PrecioNuevo { get; set; }
        public string? Motivo { get; set; }
        public string? FuenteCambio { get; set; }
        public DateTime FechaCambio { get; set; }
    }
}
