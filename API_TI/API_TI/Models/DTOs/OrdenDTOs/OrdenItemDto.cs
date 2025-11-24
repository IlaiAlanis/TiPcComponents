namespace API_TI.Models.DTOs.OrdenDTOs
{
    public class OrdenItemDto
    {
        public int IdOrdenItem { get; set; }
        public int ProductoId { get; set; }
        public string NombreProducto { get; set; }
        public string ImagenUrl { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal? DescuentoAplicado { get; set; }
        public decimal? Subtotal { get; set; }
    }
}
