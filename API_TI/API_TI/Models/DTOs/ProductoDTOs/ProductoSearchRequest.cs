namespace API_TI.Models.DTOs.ProductoDTOs
{
    public class ProductoSearchRequest
    {
        public string Query { get; set; }
        public int? CategoriaId { get; set; }
        public int? MarcaId { get; set; }
        public decimal? PrecioMin { get; set; }
        public decimal? PrecioMax { get; set; }
        public bool? EnStock { get; set; }
        public bool? EsDestacado { get; set; }
        public string OrderBy { get; set; } = "nombre"; // nombre, precio_asc, precio_desc, newest
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
