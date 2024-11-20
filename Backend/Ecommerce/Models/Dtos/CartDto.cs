using Ecommerce.Models.Database.Entities;

namespace Ecommerce.Models.Dtos;

// datos carrito con info del userDto
public class CartDto
{
    public int Id { get; set; }
    public int UserId { get; set; }

    public UserDto User { get; set; }

    public List<ProductCart> ProductCarts { get; set; }

}
