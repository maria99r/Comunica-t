using Ecommerce.Models.Database.Entities;

namespace Ecommerce.Models.Database.Repositories.Implementations
{
    public class ProductCartRepository : Repository<ProductCart, int>
    {
        public ProductCartRepository(EcommerceContext context) : base(context)
        {

        }
    }
}
