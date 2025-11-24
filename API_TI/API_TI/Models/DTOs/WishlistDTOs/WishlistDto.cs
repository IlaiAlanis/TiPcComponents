namespace API_TI.Models.DTOs.WishlistDTOs
{
    public class WishlistDto
    {
        public int IdListaDeseo { get; set; }
        public int UsuarioId { get; set; }
        public List<WishlistItemDto> Items { get; set; }
        public int TotalItems { get; set; }
    }
}
