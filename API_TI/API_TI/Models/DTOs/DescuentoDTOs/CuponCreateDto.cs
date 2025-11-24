namespace API_TI.Models.DTOs.DescuentoDTOs
{
    public class CuponCreateDto
    {
        public string Codigo { get; set; }
        public string Descripcion { get; set; }
        public string TipoValor { get; set; } 
        public decimal? Valor { get; set; }

        public bool UsoUnicoPorUsuario { get; set; }
        public int? LimiteUsos { get; set; }

        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
    }
}
