namespace API_TI.Models.DTOs.CategoriaDTOs
{
    public class UpdateCategoriaDto
    {
        public int IdCategoria { get; set; }
        public string Nombre { get; set; }
        public string? Descripcion { get; set; }
        public bool EstaActivo { get; set; }
    }
}
