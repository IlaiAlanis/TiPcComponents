using API_TI.Models.DTOs.DescuentoDTOs;

namespace API_TI.Models.DTOs.CarritoDTOs
{
    public class ResultadoValidacionCuponDto
    {
        public bool EsValido { get; set; }
        public string Mensaje { get; set; } = string.Empty;
        public int ReglaDescuentoId { get; set; }
        public int DescuentoId { get; set; }
        public decimal DescuentoAplicado { get; set; }   
        public decimal TotalFinal { get; set; }
        public List<ItemDescuentoDto> DescuentosPorItem { get; set; } = new();
    }
}
