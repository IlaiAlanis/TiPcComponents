namespace API_TI.Models.DTOs.ProductoDTOs
{
    public class UpdateProductoDto
    {
        public string? Nombre { get; set; }
        public string? Descripcion { get; set; }
        public string? Dimensiones { get; set; }
        public decimal? Peso { get; set; }
        public decimal? PrecioBase { get; set; }
        public decimal? PrecioPromocional { get; set; }
        public bool? EsDestacado { get; set; }
        public bool? EstaActivo { get; set; }
        public int? Stock { get; set; }
    }
}
