namespace API_TI.Models.DTOs.ProductoDTOs
{
    public class ProductoVariacionAtributoDto
    {
        public int AtributoId { get; set; }
        public string Valor { get; set; } = string.Empty;
        public int? Orden { get; set; }
        public string? Unidad { get; set; }
    }
}
