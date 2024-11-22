using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;
using Ecommerce.Models.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Models.Database.Repositories.Implementations
{
    public class CheckOutRepository : Repository<Cart, int>
    {
        private readonly CartMapper _cartMapper;
        public CheckOutRepository(EcommerceContext context) : base(context)
        {
            _cartMapper = new CartMapper();
        }

        // devuelve el carrito del usuario
        public async Task<CartDto> GetCartByUserId(int id)
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

            return _cartMapper.CartToDto(cart); ;
        }
    }
}
