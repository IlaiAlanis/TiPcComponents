namespace API_TI.Models.DTOs.ProductoDTOs
{
    public class ProductoVariacionCreateDto
    {
        public int ProductoId { get; set; }
        public string? Sku { get; set; }
        public string CodigoBarras { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public string? ImagenUrl { get; set; }
        public int Stock { get; set; }
        public List<ProductoVariacionAtributoDto> Atributos { get; set; } = new();
    }
}
