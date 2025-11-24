namespace API_TI.Models.DTOs.ProductoDTOs
{
    public class ProductoRelacionadoDto
    {
        public int ProductoId { get; set; }
        public int ProductoRelacionadoId { get; set; }

        public string? NombreProducto { get; set; }
        public string? NombreRelacionado { get; set; }
    }
}
