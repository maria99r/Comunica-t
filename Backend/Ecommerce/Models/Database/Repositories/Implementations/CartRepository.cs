using Ecommerce.Models.Database.Entities;

namespace Ecommerce.Models.Database.Repositories.Implementations
{
    public class CartRepository : Repository<Cart>
    {
        public CartRepository(EcommerceContext context) : base(context)
        {

        }
    }
}
