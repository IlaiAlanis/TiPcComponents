namespace API_TI.Models.DTOs.ProductoDTOs
{
    public class ProductoAtributoDto
    {
        public int IdAtributo { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Tipo { get; set; }
        public bool EstaActivo { get; set; }
    }
}
