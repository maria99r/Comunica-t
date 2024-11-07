using Ecommerce.Models.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Models.Database.Repositories.Implementations;

public class ReviewRepository : Repository<Review, int>
{
    public ReviewRepository(EcommerceContext context) : base(context)
    {

    }

    public async Task<Review> GetReviewById(int id)
    {
        return await GetQueryable()
            .FirstOrDefaultAsync(Review => Review.Id == id);
    }

    public async Task<Review> GetReviewByProduct(int id)
    {
        return await GetQueryable()
            .FirstOrDefaultAsync(Review => Review.ProductId == id);
    }


    public async Task<List<Review>> GetAllReviewsAsync()
    {
        return await GetQueryable().ToListAsync();
    }

    // Crear reseña
    public async Task<Review> InsertReviewAsync(Review newReview)
    {

        await base.InsertAsync(newReview);

        if (await SaveAsync())
        {
            return newReview;
        }

        throw new Exception("No se pudo crear la reseña.");
    }
}
