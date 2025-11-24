namespace API_TI.Models.DTOs.DescuentoDTOs
{
    public class DescuentoUpdateDto
    {
        public string NombreDescuento { get; set; }
        public string Descripcion { get; set; }
        public string TipoValor { get; set; }
        public decimal Valor { get; set; }
        public bool EstaActivo { get; set; }
    }
}
