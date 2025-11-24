using API_TI.Models.DTOs.DescuentoDTOs;

namespace API_TI.Models.DTOs.CouponDTOs
{
    public class ResultadoValidacionCuponDto
    {
        public bool EsValido { get; set; }
        public string Mensaje { get; set; } = "";

        public int DescuentoId { get; set; }

        public decimal DescuentoAplicado { get; set; }

        public List<ItemDescuentoDto> DescuentosPorProducto { get; set; } = new();
    }
}
