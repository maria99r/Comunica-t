using Ecommerce.Models.Database.Repositories.Implementations;
using Ecommerce.Services;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controllers;


[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly ReviewRepository _reviewRepository;
    private readonly ReviewService _reviewService;

    public ReviewController(ReviewRepository reviewRepository, ReviewService reviewService)
    {
        _reviewRepository = reviewRepository;
        _reviewService = reviewService;
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllReviews()
    {
        var reviews = await _reviewService.GetAllReviewsAsync();

        if (reviews == null || reviews.Count == 0)
        {
            return NotFound("No se encontraron reseñas.");
        }
        return Ok(reviews);
    }


}
