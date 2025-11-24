using API_TI.Models.dbModels;

namespace API_TI.Models.DTOs.DescuentoDTOs
{
    public class DescuentoDto
    {
        public int IdDescuento { get; set; }
        public string NombreDescuento { get; set; }
        public string Descripcion { get; set; }
        public string TipoDescuento { get; set; }
        public decimal Valor { get; set; }
        public decimal? ValorMaximo { get; set; }
        public bool EsAcumulable { get; set; }
        public bool EstaActivo { get; set; }
    }
}
