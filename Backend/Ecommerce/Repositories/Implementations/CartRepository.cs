using Ecommerce.Models;

namespace Ecommerce.Repositories.Implementations
{
    public class CartRepository : Repository<Cart, int>
    {
        public CartRepository(EcommerceContext context) : base(context)
        {

        }
    }
}
