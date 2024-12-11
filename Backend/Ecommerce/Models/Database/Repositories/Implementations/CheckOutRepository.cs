using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;
using Ecommerce.Models.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Models.Database.Repositories.Implementations
{
    public class CheckoutRepository : Repository<Cart, int>
    {
        private readonly CartMapper _cartMapper;
        private readonly ProductCartMapper _productCartMapper;
        public CheckoutRepository(EcommerceContext context) : base(context)
        {
            _cartMapper = new CartMapper();
        }

        // devuelve el precio total
        public async Task<double> GetTotalPrice(int cartId)
        {
            var cart = await GetQueryable()
                .Include(cart => cart.ProductCarts)
                    .ThenInclude(pc => pc.Product)
                .FirstOrDefaultAsync(cart => cart.Id == cartId);

            if (cart == null)
            {
                Console.WriteLine($"No se encontró carrito con ID {cartId}.");
                throw new InvalidOperationException("El carrito no se encontró.");
            }

            // suma precios de los productos en el carrito
            double totalPrice = cart.ProductCarts
                .Where(pc => pc.Product?.Price > 0 && pc.Quantity > 0) 
                .Sum(pc => (pc.Product.Price  * pc.Quantity) / 100);

            return totalPrice;
        }
    }
}
