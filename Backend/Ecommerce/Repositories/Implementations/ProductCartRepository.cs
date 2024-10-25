using Ecommerce.Models;

namespace Ecommerce.Repositories.Implementations
{
    public class ProductCartRepository : Repository<ProductCart, int>
    {
        public ProductCartRepository(EcommerceContext context) : base(context)
        {

        }
    }
}
