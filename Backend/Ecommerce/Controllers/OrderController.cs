using Ecommerce.Models.Database.Entities;
using Ecommerce.Services;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly OrderService _orderService;
    private readonly UserService _userService;
    public OrderController(UserService userService, OrderService orderService)
    {
        _orderService = orderService;
        _userService = userService;
    }

    [HttpGet("byUser/{id}")]
    public async Task<IActionResult> GetOrdersByUser(int id)
    {

        var orders = await _orderService.GetOrderByUser(id);

        if (orders == null || orders.Count == 0)
        {
            return Ok(new List<Order>());
        }
        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdAsync(int id)
    {
        var order = await _orderService.GetByIdAsync(id);

        if (id == 0)
        {
            return NotFound(new { message = $"El pedido con id '{id}' no ha sido encontrado." });
        }
        return Ok(order);
    }



    [HttpPost("newOrder/{idTemporal}")]
    public async Task<ActionResult<Order>> newOrder([FromRoute] int idTemporal)
    {
        try
        {
            var newOrder = await _orderService.CreateOrderAsync(idTemporal);

            return Ok(newOrder);

        }
        catch (InvalidOperationException e)
        {
            return Conflict($"No pudo crearse el pedido: {e.Message}");
        }

    }
}
