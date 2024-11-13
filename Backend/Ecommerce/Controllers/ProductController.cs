using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Database.Repositories.Implementations;
using Ecommerce.Models.Dtos;
using Ecommerce.Services;
using Microsoft.AspNetCore.Mvc;



namespace Ecommerce.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly ProductRepository _productRepository;
    private readonly ProductService _productService;

    public ProductController(ProductRepository productRepository, ProductService productService)
    {
        _productRepository = productRepository;
        _productService = productService;
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
        var product = await _productRepository.GetProductById(id);

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

        if (result.Product == null || result.Product.Count == 0)
        {
            return Ok(new { products = new List<Product>(), totalPages = 0 });
        }

        return Ok(new { products = result.Product, totalPages = result.TotalPages });

    }

}
