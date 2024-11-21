using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Database.Repositories.Implementations;
using Ecommerce.Models.Dtos;
using Ecommerce.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly CartService _cartService;

    public CartController(CartService cartService)
    {
        _cartService = cartService;
    }


    [HttpGet("byUser/{id}")]
    public async Task<IActionResult> GetCartByUser(int id)
    {
        try
        {
            var cart = await _cartService.GetByUserIdAsync(id);
            return Ok(cart);
        }
        catch (Exception e)
        {
            return StatusCode(500, "Error al procesar la solicitud.");
        }
        
    }


    // crearCarrito a partir de id de usuario
    [HttpPost("newCart")]
    public async Task<ActionResult<Cart>> NewCart([FromBody] int userId)
    {
        if (userId <= 0)
        {
            return BadRequest("El id de usuario no es válido.");
        }

        try
        {
            var newCart = await _cartService.CreateCartAsync(userId);

            return Ok(newCart);

        }
        catch (InvalidOperationException e)
        {
            return Conflict($"No pudo crearse el carrito: {e.Message}");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error interno: {ex.Message}");
        }
    }

}
