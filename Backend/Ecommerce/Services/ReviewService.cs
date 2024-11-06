using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Database.Repositories.Implementations;

namespace Ecommerce.Services;

public class ReviewService
{

    private readonly ReviewRepository _reviewRepository;

    public ReviewService(ReviewRepository reviewRepository)
    {
        _reviewRepository = reviewRepository;
    }

    public async Task<List<Review>> GetAllReviewsAsync()
    {
        return await _reviewRepository.GetAllReviewsAsync();
    }

    public async Task<Review> GetReviewByIdAsync(int id)
    {
        return await _reviewRepository.GetReviewById(id);
    }
}
