using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;

namespace Ecommerce.Models.Mappers;

public class CartMapper
{
    private readonly UserMapper _userMapper;


    public CartMapper()
    {
        _userMapper = new UserMapper();
    }


    public CartDto CartToDto(Cart cart)
    {
        if (cart == null)
        {
            throw new ArgumentNullException(nameof(cart), "El carrito es nulo");
        }

        return new CartDto
        {
            Id = cart.Id,
            UserId = cart.UserId,
            User = _userMapper.UserToDto(cart.User), // Usa el UserMapper para el usuario
            ProductCarts = cart.ProductCarts.Select(pc => new ProductCart
            {
                CartId = pc.CartId,
                ProductId = pc.ProductId,
                Quantity = pc.Quantity,
                Product = new Product
                {
                    Id = pc.Product.Id,
                    Name = pc.Product.Name,
                    Price = pc.Product.Price,
                    Stock = pc.Product.Stock,
                    Description = pc.Product.Description,
                    Image = pc.Product.Image
                }
            }).ToList()
        };
    }

    // Mapea una colección de Cart a una colección de CartDto
    public IEnumerable<CartDto> CartsToDto(IEnumerable<Cart> carts)
    {
        return carts.Select(CartToDto);
    }
}
