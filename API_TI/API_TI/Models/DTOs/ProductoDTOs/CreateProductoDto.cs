namespace API_TI.Models.DTOs.ProductoDTOs
{
    public class CreateProductoDto
    {
        public int CategoriaId { get; set; }
        public int ProveedorId { get; set; }
        public int MarcaId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public string? Dimensiones { get; set; }
        public decimal? Peso { get; set; }
        public decimal Precio { get; set; }
        public decimal? PrecioPromocional { get; set; }
        public bool EsDestacado { get; set; }
        public string Sku { get; set; } = string.Empty;
        public string CodigoBarras { get; set; } = string.Empty;
        public int Stock { get; set; } = 0;
    }
}
