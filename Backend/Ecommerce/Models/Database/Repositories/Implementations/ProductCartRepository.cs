using Ecommerce.Models.Database.Entities;

namespace Ecommerce.Models.Database.Repositories.Implementations
{
    public class ProductCartRepository : Repository<ProductCart>
    {
        public ProductCartRepository(EcommerceContext context) : base(context)
        {

        }
    }
}
