﻿using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;
using Ecommerce.Models.Mappers;
using Ecommerce.Models.ReviewModels;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.ML;

namespace Ecommerce.Services;

public class ReviewService
{

    private readonly UnitOfWork _unitOfWork;
    private readonly UserMapper _userMapper;
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

    // Borrar review; sólo puede ser borrada por el usuario que la ha publicado o por un admin.
    public async Task DeleteReviewByIdAsync(int reviewId, UserDto user)
    {
        Review review = await _unitOfWork.ReviewRepository.GetReviewById(reviewId);

        if (review == null)
        {
            Console.WriteLine("La reseña con ID ", reviewId, " no existe.");
            return;
        }

        if (review.UserId == user.UserId || user.Role == "Admin")
        {
            await _unitOfWork.ReviewRepository.Delete(review);
        }
        else
        {
            Console.WriteLine("No puedes borrar una reseña que no sea tuya.");
            return;
        }

        await _unitOfWork.SaveAsync();
    }
}
