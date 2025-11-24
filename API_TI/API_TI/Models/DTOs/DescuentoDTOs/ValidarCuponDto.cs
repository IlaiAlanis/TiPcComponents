namespace API_TI.Models.DTOs.DescuentoDTOs
{
    public class ValidarCuponDto
    {
        public string Codigo { get; set; }
        public int UsuarioId { get; set; }
        public decimal MontoCarrito { get; set; }
    }
}
