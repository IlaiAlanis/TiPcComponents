namespace API_TI.Models.DTOs.ProductoDTOs
{
    public class ProductoDto
    {
        public int IdProducto { get; set; }
        public string Nombre { get; set; } = null!;
        public string? Descripcion { get; set; }
        public string? Dimensiones { get; set; }
        public decimal Peso { get; set; }
        public bool EsDestacado { get; set; }
        public decimal PrecioBase { get; set; }
        public decimal? PrecioPromocional { get; set; }
        public string Sku { get; set; } = string.Empty;
        public string CodigoBarras { get; set; } = string.Empty;
        public int? Stock { get; set; }
        public bool EstaActivo { get; set; }
        public DateTime FechaCreacion { get; set; }

        // Relationship
        public string Categoria { get; set; } = string.Empty;
        public string Marca { get; set; } = string.Empty;
        public string Proveedor { get; set; } = string.Empty;

        public List<ProductoImagenDto>? Imagenes { get; set; } = new();
        public List<ProductoVariacionDto> Variaciones { get; set; } = new();
        public List<ProductoResenaDto> Resenas { get; set; } = new();
    }
}
