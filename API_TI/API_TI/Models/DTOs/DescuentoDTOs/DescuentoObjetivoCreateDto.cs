namespace API_TI.Models.DTOs.DescuentoDTOs
{
    public class DescuentoObjetivoCreateDto
    {
        public int DescuentoId { get; set; }
        public string TipoObjetivo { get; set; } = string.Empty;
        public int ObjetivoId { get; set; }
    }
}
