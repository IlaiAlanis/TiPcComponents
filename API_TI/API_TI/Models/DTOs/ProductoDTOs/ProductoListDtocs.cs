namespace API_TI.Models.DTOs.ProductoDTOs
{
    public class ProductoListDtocs
    {
        public int IdProducto { get; set; }
        public string Nombre { get; set; }
        public string Imagen { get; set; }
        public decimal? PrecioBase { get; set; }
        public decimal? PrecioPromocional { get; set; }
        public bool EsDestacado { get; set; }
    }
}
