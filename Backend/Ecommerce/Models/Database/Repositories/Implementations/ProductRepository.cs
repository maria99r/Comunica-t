using Ecommerce.Models.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Models.Database.Repositories.Implementations;

public class ProductRepository : Repository<Product, int>
{
    public ProductRepository(EcommerceContext context) : base(context) {}

    public async Task<Product> GetProductById(int id)
    {
        return await GetQueryable()
            .FirstOrDefaultAsync(Product => Product.Id == id);
    }

    public async Task<List<Product>> GetAllProductsAsync()
    {
        return await GetQueryable().ToListAsync();
    }

    // Crear un nuevo producto
    public async Task<Product> InsertProductAsync(Product newProduct)
    {

        await base.InsertAsync(newProduct);

        return newProduct;

        throw new Exception("No se pudo crear el nuevo producto.");
    }

    // Obtiene el producto con mayor ID para poder asignarle la mayor ID + 1 a los nuevos productos
    public async Task<Product> GetMaxIdProductAsync()
    {
        return await _context.Product
                             .OrderByDescending(p => p.Id)
                             .FirstOrDefaultAsync();
    }
}
