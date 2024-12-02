using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;

namespace Ecommerce.Models.Mappers
{
    public class ProductMapper
    {
        // Product a ProductDto
        public ProductDto ProductToDto(Product product)
        {
            return new ProductDto
            {
                Name = product.Name,
                Stock = product.Stock,
                Price = product.Price,
                Description = product.Description,
                Image = product.Image
            };
        }

        // ProductDto a Product
        public Product ProductDtoToProduct(ProductDto productDto)
        {
            return new Product
            {
                Name = productDto.Name,
                Stock = productDto.Stock,
                Price = productDto.Price,
                Description = productDto.Description,
                Image = productDto.Image
            };
        }
    }
}
