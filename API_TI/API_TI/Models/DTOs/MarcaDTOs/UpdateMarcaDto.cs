namespace API_TI.Models.DTOs.MarcaDTOs
{
    public class UpdateMarcaDto
    {
        public int IdMarca { get; set; }
        public string Nombre { get; set; } = null!;
        public string? Descripcion { get; set; }
        public bool EstaActivo { get; set; }
    }
}
