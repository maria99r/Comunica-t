using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;
using Ecommerce.Models.Mappers;
using Ecommerce.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly ReviewService _reviewService;
    private readonly UserService _userService;
    public ReviewController(ReviewService reviewService, UserService userService)
    {
        _reviewService = reviewService;
        _userService = userService;
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

    // Elimina una review
    [Authorize]
    [HttpDelete("deleteReview/{reviewId}")]
    public async Task<IActionResult> DeleteReviewById(int reviewId)
    {
        UserDto user = await ReadToken();

        try
        {
            bool deleted = await _reviewService.DeleteReviewByIdAsync(reviewId, user);
            if (deleted)
            {
                return Ok("Usuario eliminado correctamente.");
            }
            else
            {
                return BadRequest("La reseña no se puede eliminar");
            }
        }
        catch (InvalidOperationException)
        {
            return BadRequest("No pudo eliminarse el usuario");
        }
    }

    // Leer datos del token
    private async Task<UserDto> ReadToken()
    {
        try
        {
            string id = User.Claims.FirstOrDefault().Value;
            UserDto user = await _userService.GetUserByIdAsync(Int32.Parse(id));
            return user;
        }
        catch (Exception)
        {
            Console.WriteLine("La ID del usuario es null");
            return null;
        }
    }
}
