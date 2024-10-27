using Ecommerce.Models.Database.Entities;

namespace Ecommerce.Models.Database.Repositories.Implementations
{
    public class ProductRepository : Repository<Product>
    {
        public ProductRepository(EcommerceContext context) : base(context)
        {

        }
    }
}
