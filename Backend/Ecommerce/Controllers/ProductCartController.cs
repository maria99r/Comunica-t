﻿using Ecommerce.Models.Dtos;
using Ecommerce.Services;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductCartController : ControllerBase
{
    private readonly ProductCartService _productCartService;
    public ProductCartController(ProductCartService productCartService)
    {
        _productCartService = productCartService;
    }

    // añade producto a carrito
    [HttpPost("addProduct")]
    public async Task<IActionResult> AddProductToCart([FromBody] ProductCartDto productCartDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("Parámetros inválidos");
        }

        try
        {
            await _productCartService.AddProductToCartAsync(productCartDto);
            return Ok(new { message = "Producto añadido al carrito." });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict($"No pudo añadirse el producto: {ex.Message}");
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }


    // elimina un producto de un carrito
    [HttpDelete("removeProduct/{cartId}/{productId}")]
    public async Task<IActionResult> DeleteProductFromCart(int cartId, int productId)
    {
        try
        {
            await _productCartService.DeleteProductFromCartAsync(cartId, productId);

            return Ok("Producto eliminado del carrito correctamente.");
        }
        catch (InvalidOperationException)
        {
            return BadRequest("No pudo eliminarse el producto");
        }
    }

    // modifica la cantidad 
    [HttpPut("updateQuantity/{userId}/{productId}")]
    public async Task<IActionResult> UpdateProductQuantity(int userId, int productId, [FromQuery] int newQuantity)
    {
        if (newQuantity == 0)
        {
            return BadRequest("La cantidad no puede ser 0.");
        }

        try
        {
            await _productCartService.UpdateProductQuantityAsync(userId, productId, newQuantity);
            return Ok("Cantidad actualizada correctamente.");
        }
        catch (InvalidOperationException)
        {
            return BadRequest("No pudo modificarse la cantidad.");
        }
    }


    [HttpGet("bycart/{id}")]
    public async Task<IActionResult> GetProductByCart(int id)
    {
        var products = await _productCartService.GetProductByCartAsync(id);

        if (products == null || products.Count == 0)
        {
            return NotFound("No se encontraron productos en esta cesta.");
        }
        return Ok(products);
    }
}
