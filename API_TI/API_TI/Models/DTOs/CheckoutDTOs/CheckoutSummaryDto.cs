using API_TI.Models.DTOs.CarritoDTOs;
using API_TI.Models.DTOs.CotizacionDTOs;
using API_TI.Models.DTOs.DireccionDTOs;
using API_TI.Models.DTOs.ImpuestoDTOs;

namespace API_TI.Models.DTOs.CheckoutDTOs
{
    public class CheckoutSummaryDto
    {
        public CarritoDto Carrito { get; set; }
        public DireccionDto DireccionEnvio { get; set; }
        public List<CotizacionEnvioDto> OpcionesEnvio { get; set; }
        public ImpuestoDto Impuesto { get; set; }
        public ResumenCostosDto Costos { get; set; }
    }
}
