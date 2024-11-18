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
        var cart = await _cartService.GetByUserIdAsync(id);

        if (cart == null)
        {
            return NotFound("No se encontró carrito para este usuario.");
        }
        return Ok(cart);
    }


    // crearCarrito
    [HttpPost("newCart")]
    public async Task<ActionResult<Cart>> Post([FromBody] CartDto model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var newCart = new Cart
            {
                UserId = model.UserId
            };

            var createdCart = await _cartService.CreateCartAsync(newCart);

            return (createdCart);

        }
        catch (InvalidOperationException)
        {
            return Conflict("No pudo crearse el carrito");
        }
    }

}
