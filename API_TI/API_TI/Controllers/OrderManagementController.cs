using API_TI.Models.DTOs.OrderDTOs;
using API_TI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API_TI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "RequireAdmin")]
    public class OrderManagementController : BaseApiController
    {
        private readonly IOrderStatusService _orderStatusService;

        public OrderManagementController(IOrderStatusService orderStatusService)
        {
            _orderStatusService = orderStatusService;
        }

        private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

        [HttpPut("{ordenId}/status")]
        public async Task<IActionResult> UpdateStatus(int ordenId, [FromBody] UpdateOrderStatusRequest request)
        {
            var response = await _orderStatusService.UpdateOrderStatusAsync(ordenId, request, GetUserId());
            return FromApiResponse(response);
        }
    }
}
