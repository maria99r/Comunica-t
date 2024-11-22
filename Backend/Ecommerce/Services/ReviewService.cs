using Ecommerce.Helpers;
using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Database.Repositories.Implementations;
using Ecommerce.Models.Dtos;
using Ecommerce.Models.ReviewModels;
using Microsoft.Extensions.ML;
using static System.Net.Mime.MediaTypeNames;

namespace Ecommerce.Services;

public class ReviewService
{

    private readonly UnitOfWork _unitOfWork;

    private readonly ReviewRepository _reviewRepository;

    private readonly PredictionEnginePool<ModelInput, ModelOutput> _model;

    public ReviewService(ReviewRepository reviewRepository, UnitOfWork unitOfWork, PredictionEnginePool<ModelInput, ModelOutput> model)
    {
        _reviewRepository = reviewRepository;
        _unitOfWork = unitOfWork;
        _model = model;
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

        // entrada de texto a la ia que predice 
        var input = new ModelInput
        {
            Text = FormatText(model.Text)
        };

        // prediccion de la categoria
        ModelOutput prediction = _model.Predict(input);

        var newReview = new Review
        {
            Text = model.Text,
            Label = (int)prediction.PredictedLabel, // guardo la prediccion de la ia
            PublicationDate = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(DateTime.UtcNow, "Europe/Madrid"), // se crea a fecha actual local de españa
            UserId = model.UserId,
            ProductId = model.ProductId
        };

        await _unitOfWork.ReviewRepository.InsertReviewAsync(newReview);
        await _unitOfWork.SaveAsync();

        return newReview;
    }

    // Formatear texto
    public string FormatText(string text)
    {
        return text.Trim()
                   .ToLowerInvariant()
                   .Replace("á", "a")
                   .Replace("é", "e")
                   .Replace("í", "i")
                   .Replace("ó", "o")
                   .Replace("ú", "u");
    }
}
