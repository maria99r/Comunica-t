using Ecommerce.Models.Database.Repositories.Implementations;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ProductRepository _productRepository;

        public ProductController(ProductRepository productRepository)
        {
            _productRepository = productRepository;
        }
        [HttpGet("{id}")]

        public async Task<IActionResult> GetProductByIdAsync(int id)
        {
            var product = await _productRepository.GetProductById(id);

            if (product == null) 
            {
                return NotFound(new { message = $"El producto con la id: '{id}' no ha sido encontrado." }); // Da un mensaje de error
            }

            return Ok(product); 
        }
    }
}
