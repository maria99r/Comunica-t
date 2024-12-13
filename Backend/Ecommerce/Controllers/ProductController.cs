﻿using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;
using Ecommerce.Models.Mappers;
using Ecommerce.Services;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly ProductService _productService;
    private readonly ProductMapper _productMapper;
    public ProductController(ProductService productService, ProductMapper productMapper)
    {
        _productService = productService;
        _productMapper = productMapper;
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllProducts()
    {
        var products = await _productService.GetAllProductsAsync();

        if (products == null || products.Count == 0)
        {
            return NotFound("No se encontraron productos.");
        }
        return Ok(products);
    }



    [HttpGet("{id}")]
    // busqueda por id de productos
    public async Task<IActionResult> GetProductByIdAsync(int id)
    {
        var product = await _productService.GetProductByIdAsync(id);

        if (product == null)
        {
            return NotFound(new { message = $"El producto con la id: '{id}' no ha sido encontrado." });
        }

        return Ok(product);
    }

    // busqueda de productos por criterio
    [HttpPost("search")]
    public async Task<IActionResult> SearchProducts([FromBody] SearchDto searchDto)
    {
        if (searchDto == null)
        {
            return BadRequest("Busqueda fallida.");
        }

        var result = await _productService.SearchProductsAsync(searchDto);

        if (result.Count == 0)
        {
            return Ok(new { products = new List<Product>(), totalPages = 0 });
        }

        return Ok(new { products = result, totalPages = result.Count });

    }

    // Modificar producto existente
    [HttpPut("modifyProduct/{productId}")]
    public async Task<IActionResult> ModifyProduct(int productId, [FromBody] ProductDto productRequest)
    {
        var product = await _productService.GetProductByIdAsync(productId);

        try
        {
            await _productService.ModifyProductAsync(productId, productRequest.Name,
                productRequest.Price, productRequest.Stock, productRequest.Description, productRequest.Image);
            return Ok("Producto actualizado correctamente.");
        }
        catch (InvalidOperationException)
        {
            return BadRequest("No pudo modificarse el producto.");
        }
    }

    // Crear nuevo producto
    [HttpPost("insertProduct")]
    public async Task<ActionResult<ProductDto>> InsertNewProduct([FromForm] ProductDto productDto)
    {
        if (productDto == null)
        {
            return BadRequest("El producto no puede ser nulo.");
        }

        var newProduct = await _productService.InsertProductAsync(productDto);

        var newProductDto = _productMapper.ProductToDto(newProduct);

        return Ok(newProductDto);

    }
}
