using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;
using Ecommerce.Models.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Models.Database.Repositories.Implementations;

public class CartRepository : Repository<Cart, int>
{

    private readonly CartMapper _cartMapper;
    public CartRepository(EcommerceContext context) : base(context)
    {
        _cartMapper = new CartMapper();
    }

    // devuelve el carrito del usuario
    public async Task<CartDto> GetCartByUserId(int id)
    {
        try
        {
            var cart = await GetQueryable()
            .Include(cart => cart.User)
            .Include(cart => cart.ProductCarts)
                .ThenInclude(pc => pc.Product)
                .FirstOrDefaultAsync(cart => cart.UserId == id);

            if (cart == null)
            {
                Console.WriteLine($"No se encontró carrito para el usuario con ID {id}."); // Log
                throw new InvalidOperationException("El carrito no se encontró para este usuario.");
            }

            return _cartMapper.CartToDto(cart);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error en GetCartByUserId: {ex.Message}"); // Log de error
            throw;
        }
        
    }


    // Crear un nuevo carrito
    public async Task<Cart> InsertCartAsync(int userId)
    {
        var newCart = new Cart
        {
            UserId = userId
        };

        var insertedCart =  await InsertAsync(newCart);

        if (insertedCart == null)
        {
            throw new Exception("No se pudo insertar el carrito.");
        }


        if (!await SaveAsync())
        {
            throw new Exception("El carrito no se pudo guardar en la BBDD.");

        }

        return newCart;
    }

}
