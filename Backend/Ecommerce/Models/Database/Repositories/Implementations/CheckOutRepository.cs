using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;
using Ecommerce.Models.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Models.Database.Repositories.Implementations
{
    public class CheckOutRepository : Repository<Cart, int>
    {
        private readonly CartMapper _cartMapper;
        private readonly ProductCartMapper _productCartMapper;
        public CheckOutRepository(EcommerceContext context) : base(context)
        {
            _cartMapper = new CartMapper();
        }

        // devuelve el carrito del usuario
        public async Task<CartDto> GetCartByUserId(int id)
        {
            var cart = await GetQueryable()
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

        // devuelve el precio 
        public async Task<int> GetTotalPrice(int cartId)
        {
            // Obtener el carrito con los productos relacionados.
            var cart = await GetQueryable()
                .Include(cart => cart.ProductCarts)
                    .ThenInclude(pc => pc.Product)
                .FirstOrDefaultAsync(cart => cart.UserId == cartId);

            // Verificar si el carrito existe.
            if (cart == null)
            {
                Console.WriteLine($"No se encontró carrito con ID {cartId}.");
                throw new InvalidOperationException("El carrito no se encontró.");
            }

            // Sumar los precios de los productos en el carrito, con comprobación de precios válidos.
            int totalPrice = cart.ProductCarts
                .Where(pc => pc.Product?.Price > 0)  // Asegura que el precio sea válido (mayor que cero)
                .Sum(pc => pc.Product?.Price ?? 0);  // Usa 0 si el precio es nulo

            return totalPrice;
        }
    }
}
