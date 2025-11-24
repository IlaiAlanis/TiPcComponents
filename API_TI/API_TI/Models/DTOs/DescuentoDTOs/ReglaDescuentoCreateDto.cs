namespace API_TI.Models.DTOs.DescuentoDTOs
{
    public class ReglaDescuentoCreateDto
    {
        public int DescuentoId { get; set; }
        public int? UsuarioId { get; set; }
        public int Prioridad { get; set; } = 1;
        public bool UsuariosNuevosOnly { get; set; } = false;
        public int? CantidadMaxPorUsuario { get; set; }
        public int? CantidadMaxUso { get; set; }
        public int? CantidadMinima { get; set; }
        public decimal? TotalMinimo { get; set; }
        public string? Coupon { get; set; }  
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
    }
}
