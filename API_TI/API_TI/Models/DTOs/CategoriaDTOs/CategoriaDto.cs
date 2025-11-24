namespace API_TI.Models.DTOs.CategoriaDTOs
{
    public class CategoriaDto
    {
        public int IdCategoria { get; set; }
        public string Nombre { get; set; } = null!;
        public string Descripcion { get; set; } = null!;
        public bool EstaActivo { get; set; }
    }
}
