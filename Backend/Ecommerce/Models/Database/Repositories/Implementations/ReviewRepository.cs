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

    public async Task<List<Review>> GetReviewByProduct(int id)
    {
        return await GetQueryable()
            .Where(Review => Review.ProductId == id).ToListAsync();
    }


    public async Task<List<Review>> GetAllReviewsAsync()
    {
        return await GetQueryable().ToListAsync();
    }

    // Crear reseña
    public async Task<Review> InsertReviewAsync(Review newReview)
    {

        Review review = await base.InsertAsync(newReview);

        return review;

    }
}
