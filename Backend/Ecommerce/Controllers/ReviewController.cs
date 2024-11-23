using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Database.Repositories.Implementations;
using Ecommerce.Models.Dtos;
using Ecommerce.Models.Mappers;
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

    [HttpGet("byproduct/{id}")]
    public async Task<IActionResult> GetReviewByProduct(int id)
    {
        var reviews = await _reviewService.GetReviewByProductAsync(id);

        if (reviews == null || reviews.Count == 0)
        {
            return Ok(new List<Review>());
        }
        return Ok(reviews);
    }


    // CREAR NUEVA RESEÑA
    [HttpPost("newReview")]
    public async Task<ActionResult<Review>> Post([FromBody] ReviewDto model)
    {
        // valida entrada
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var createdReview = await _reviewService.CreateReviewAsync(model);
            return CreatedAtAction(nameof(GetAllReviews), new { id = createdReview.Id }, createdReview);
        }
        catch (InvalidOperationException)
        {
            return Conflict("No pudo crearse la reseña");
        }
    }

}
