namespace API_TI.Models.DTOs.WishlistDTOs
{
    public class WishlistItemDto
    {
        public int IdItem { get; set; }
        public int ProductoId { get; set; }
        public string NombreProducto { get; set; }
        public string ImagenUrl { get; set; }
        public decimal Precio { get; set; }
        public bool EnStock { get; set; }
        public DateTime FechaAgregado { get; set; }
    }
}
