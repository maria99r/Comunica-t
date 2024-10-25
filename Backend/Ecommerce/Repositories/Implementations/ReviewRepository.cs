using Ecommerce.Models;

namespace Ecommerce.Repositories.Implementations
{
    public class ReviewRepository : Repository<Review, int>
    {
        public ReviewRepository(EcommerceContext context) : base(context)
        {

        }
    }
}
