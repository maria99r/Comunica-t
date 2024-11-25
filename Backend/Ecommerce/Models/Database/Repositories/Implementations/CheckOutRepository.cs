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
        public async Task<double> GetTotalPrice(int cartId)
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
            double totalPrice = cart.ProductCarts
                .Where(pc => pc.Product?.Price > 0 && pc.Quantity > 0) // Asegura que el precio y la cantidad sean válidos
                .Sum(pc => (pc.Product.Price  * pc.Quantity) / 100);

            return totalPrice;
        }
    }
}
