using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;

namespace Ecommerce.Models.Mappers;

public class ProductCartMapper
{
    // ProductCartDto a ProductCart
    public ProductCart ProductCartDtoToEntity(ProductCartDto productCartDto)
    {
        return new ProductCart
        {
            CartId = productCartDto.CartId,
            ProductId = productCartDto.ProductId,
            Quantity = productCartDto.Quantity
        };
    }

    // ProductCart a ProductCartDto
    public ProductCartDto ProductCartToDto(ProductCart productCart)
    {
        return new ProductCartDto
        {
            CartId = productCart.CartId,
            ProductId = productCart.ProductId,
            Quantity = productCart.Quantity
        };
    }


    // lista de ProductCartDto a ProductCart
    public IEnumerable<ProductCart> ProductCartDtosToEntities(IEnumerable<ProductCartDto> productCartDtos)
    {
        return productCartDtos.Select(ProductCartDtoToEntity);
    }


    // lista de ProductCart a ProductCartDto
    public IEnumerable<ProductCartDto> ProductCartsToDtos(IEnumerable<ProductCart> productCarts)
    {
        return productCarts.Select(ProductCartToDto);
    }

}
