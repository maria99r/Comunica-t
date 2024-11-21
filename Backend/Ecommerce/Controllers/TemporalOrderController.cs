using Ecommerce.Models.Database.Entities;
using Ecommerce.Services;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TemporalOrderController : ControllerBase
{
    private readonly TemporalOrderService _temporalOrderService;
    public TemporalOrderController(TemporalOrderService temporalOrderService)
    {
        _temporalOrderService = temporalOrderService;
    }


    // crear orden temporal a través de carrito
    [HttpPost("newTemporalOrder")]
    public async Task<ActionResult<TemporalOrder>> NewTemporalOrder([FromBody] Cart cart, string paymentMethod)
    {
        try
        {
            // var newTemporalOrder = await _temporalOrderService.CreateTemporalOrderAsync(cart, paymentMethod);

            return Ok();//(newTemporalOrder);

        }
        catch (InvalidOperationException e)
        {
            return Conflict($"No pudo crearse la order temporal: {e.Message}");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error interno: {ex.Message}");
        }
    }

}
