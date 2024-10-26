using Ecommerce.Models;

namespace Ecommerce.Repositories.Implementations
{
    public class ProductRepository : Repository<Product, int>
    {
        public ProductRepository(EcommerceContext context) : base(context)
        {

        }
    }
}
