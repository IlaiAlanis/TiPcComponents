namespace API_TI.Models.DTOs.DescuentoDTOs
{
    public class DescuentoCreateDto
    {
        public string NombreDescuento { get; set; }
        public string Descripcion { get; set; }
        public string TipoValor { get; set; }
        public decimal Valor { get; set; }
    }
}
