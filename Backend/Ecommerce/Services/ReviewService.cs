using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;
using Ecommerce.Models.ReviewModels;
using Microsoft.Extensions.ML;

namespace Ecommerce.Services;

public class ReviewService
{

    private readonly UnitOfWork _unitOfWork;
    private readonly PredictionEnginePool<ModelInput, ModelOutput> _model;

    public ReviewService(UnitOfWork unitOfWork, PredictionEnginePool<ModelInput, ModelOutput> model)
    {
        _unitOfWork = unitOfWork;
        _model = model;
    }

    public async Task<List<Review>> GetAllReviewsAsync()
    {
        return await _unitOfWork.ReviewRepository.GetAllReviewsAsync();
    }

    public async Task<Review> GetReviewByIdAsync(int id)
    {
        return await _unitOfWork.ReviewRepository.GetReviewById(id);
    }

    public async Task<List<Review>> GetReviewByProductAsync(int id)
    {
        return await _unitOfWork.ReviewRepository.GetReviewByProduct(id);
    }



    // crea una reseña
    public async Task<Review> CreateReviewAsync(ReviewDto model)
    {
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

        Review review = await _unitOfWork.ReviewRepository.InsertReviewAsync(newReview)
         ?? throw new Exception("No se pudo crear la reseña.");

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
