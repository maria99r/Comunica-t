using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Models.Database.Repositories.Implementations;

public class CartRepository : Repository<Cart, int>
{
    public CartRepository(EcommerceContext context) : base(context){}

    // devuelve el carrito del usuario
    public async Task<Cart> GetCartByUserId(int id)
    {
        return await GetQueryable()
            .FirstOrDefaultAsync(cart => cart.UserId == id);
    }


    // Crear un nuevo carrito
    public async Task<Cart> InsertCartAsync(Cart newCart)
    {
        await base.InsertAsync(newCart);

        if (await SaveAsync())
        {
            return newCart;
        }

        throw new Exception("No se pudo crear el carrito.");
    }

}
