using Ecommerce.Models.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Models.Database.Repositories.Implementations;

public class ProductRepository : Repository<Product, int>
{
    public ProductRepository(EcommerceContext context) : base(context) 
    {

    }

    public async Task<Product> GetProductById(int id)
    {
        return await GetQueryable()
            .FirstOrDefaultAsync(Product => Product.ProductId == id);
    }

    public async Task<List<Product>> GetAllProductsAsync()
    {
        return await GetQueryable().ToListAsync();
    }

}
