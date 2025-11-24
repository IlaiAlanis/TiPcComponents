namespace API_TI.Models.DTOs.ProductoDTOs
{
    public class ProductoImagenDto
    {
        public int IdImagen { get; set; }
        public int ProductoId { get; set; }
        public string UrlImagen { get; set; }
        public bool EsPrincipal { get; set; }
        public int? Orden { get; set; }
    }
}
