using Ecommerce.Helpers;
using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Database.Repositories.Implementations;
using Ecommerce.Models.Dtos;

namespace Ecommerce.Services;

public class ReviewService
{

    private readonly UnitOfWork _unitOfWork;

    private readonly ReviewRepository _reviewRepository;

    public ReviewService(ReviewRepository reviewRepository, UnitOfWork unitOfWork)
    {
        _reviewRepository = reviewRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<List<Review>> GetAllReviewsAsync()
    {
        return await _reviewRepository.GetAllReviewsAsync();
    }

    public async Task<Review> GetReviewByIdAsync(int id)
    {
        return await _reviewRepository.GetReviewById(id);
    }

    public async Task<List<Review>> GetReviewByProductAsync(int id)
    {
        return await _reviewRepository.GetReviewByProduct(id);
    }



    // crea una reseña
    public async Task<Review> CreateReviewAsync(ReviewDto model)
    {
        // hay que verificar que el usuario este logueado!!
        

        var newReview = new Review
        {
            Text = model.Text,
            Category = model.Category, // aqui usar la IA para que la evalue sola
            PublicationDate = model.Date,
            UserId = model.UserId,
            ProductId = model.ProductId
        };

        await _unitOfWork.ReviewRepository.InsertReviewAsync(newReview);
        await _unitOfWork.SaveAsync();

        return newReview;
    }
}
