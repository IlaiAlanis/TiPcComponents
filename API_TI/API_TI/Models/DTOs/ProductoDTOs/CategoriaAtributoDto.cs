namespace API_TI.Models.DTOs.ProductoDTOs
{
    public class CategoriaAtributoDto
    {
        public int IdCategoriaAtributo { get; set; }
        public int CategoriaId { get; set; }
        public int AtributoId { get; set; }
        public bool EsObligatorio { get; set; }
        public int? Orden { get; set; }

        public string Nombre { get; set; } = string.Empty;
    }
}
