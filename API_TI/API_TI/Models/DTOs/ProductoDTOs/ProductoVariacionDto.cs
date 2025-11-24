namespace API_TI.Models.DTOs.ProductoDTOs
{
    public class ProductoVariacionDto
    {
        public int IdVariacion { get; set; }
        public int ProductoId { get; set; }
        public string? Sku { get; set; }
        public string CodigoBarras { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public string? ImagenUrl { get; set; }
        public int Stock { get; set; }
        public bool EstaActivo { get; set; }

        // Relationship
        public string Categoria { get; set; } = string.Empty;
        public string Marca { get; set; } = string.Empty;
        public string Proveedor { get; set; } = string.Empty;

        public List<ProductoVariacionAtributoDto> Atributos { get; set; } = new();
    }
}
