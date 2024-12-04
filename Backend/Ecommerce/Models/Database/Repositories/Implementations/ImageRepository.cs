using Ecommerce.Models.Database.Entities;
namespace Ecommerce.Models.Database.Repositories.Implementations;

public class ImageRepository : Repository<Image, int>
{
    public ImageRepository(EcommerceContext context) : base(context)
    {
    }
}
