using Ecommerce.Models.Database.Entities;
using Ecommerce.Services;
using Microsoft.AspNetCore.Mvc;
using Ecommerce.Models.Dtos;

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


    // obtener por id del order

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTemporalOrderById(int id)
    {
        try
        {
            var temporalOrder = await _temporalOrderService.GetByIdAsync(id);

            if (temporalOrder == null)
            {
                return null;
            }

            return Ok(temporalOrder);
        }
        catch (Exception e)
        {
            return StatusCode(500, "Error al procesar la solicitud.");
        }

    }

    // hay que hacer dos metodos , uno si esta loguqeado (q recibe el jwt) y otro si no lo esta que recibe el carrito del localstorage

    // si lo recibe del front: recibe un array de productCart y el metodo de pago

    // DESDE EL LOCAL

    [HttpPost("newTemporalOrderLocal")]
    public async Task<ActionResult<TemporalOrder>> NewTemporalOrderLocal([FromBody] ProductCartDto[] cart, string paymentMethod)
    {
        try
        {
            var newTemporalOrder = await _temporalOrderService.CreateTemporalOrderLocalAsync(cart, paymentMethod);

            return Ok(newTemporalOrder);

        }
        catch (InvalidOperationException e)
        {
            return Conflict($"No pudo crearse la order temporal: {e.Message}");
        }
        
    }


    // DESDE LA BBDD
    [HttpPost("newTemporalOrderBBDD")]
    public async Task<ActionResult<TemporalOrder>> NewTemporalOrderBBDD([FromBody] CartDto cart, string paymentMethod)
    {
        try
        {
            var newTemporalOrder = await _temporalOrderService.CreateTemporalOrderBBDDAsync(cart, paymentMethod);

            return Ok(newTemporalOrder);

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
