using Ecommerce.Models.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Models.Database.Repositories.Implementations;

public class ProductCartRepository : Repository<ProductCart, int>
{
    public ProductCartRepository(EcommerceContext context) : base(context)
    { }

    // devuelve un producto de un carrito
    public async Task<ProductCart> GetProductInCartAsync(int cartId, int productId)
    {
        return await GetQueryable()
            .Include(pc => pc.Cart)
            .Include(pc => pc.Product)
            .FirstOrDefaultAsync(pc => pc.CartId == cartId && pc.ProductId == productId);

    }

    // crea producto en carrito
    public async Task AddProductToCartAsync(ProductCart productCart)
    {
        // comprueba si ese producto existe en el carrito
        var existingProduct = await GetProductInCartAsync(productCart.CartId, productCart.ProductId);

        if (existingProduct != null)
        {
            // si ya existe, se suma la cantidad
            existingProduct.Quantity += productCart.Quantity;
        }
        else
        {
            // si no existe se crea 
            var newProductInCart = new ProductCart
            {
                CartId = productCart.CartId,
                ProductId = productCart.ProductId,
                Quantity = productCart.Quantity
            };

            await InsertAsync(newProductInCart);
        }
        await SaveAsync();
    }

    // eliminar producto
    public async Task DeleteProductFromCartAsync(ProductCart productCart)
    {
        _context.Set<ProductCart>().Remove(productCart);
        await SaveAsync();
    }

    // obtener productos de un carrito
    public async Task<List<ProductCart>> GetProductsByCart(int id)
    {
        return await GetQueryable()
            .Include(pc => pc.Cart)
            .Include(pc => pc.Product)
            .Where(ProductCart => ProductCart.CartId == id).ToListAsync();
    }

}
