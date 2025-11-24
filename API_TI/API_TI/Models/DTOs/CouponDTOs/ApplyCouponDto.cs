namespace API_TI.Models.DTOs.CouponDTOs
{
    public class ApplyCouponDto
    {
        public int UsuarioId { get; set; }
        public string Cupon { get; set; } = null!;
    }
}
