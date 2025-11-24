namespace API_TI.Models.DTOs.CarritoDTOs
{
    public class CarritoItemDto
    {
        public int IdCarritoItem { get; set; }
        public int ProductoId { get; set; }
        public string NombreProducto { get; set; }
        public string ImagenUrl { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal DescuentoAplicado { get; set; }
        public decimal Subtotal { get; set; }
        public int StockDisponible { get; set; }
    }
}
