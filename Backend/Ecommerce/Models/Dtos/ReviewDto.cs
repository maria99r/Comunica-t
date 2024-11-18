namespace Ecommerce.Models.Dtos;

// la info que se pasa al crear la reseña, sin la categoria que predice la ia ni la fecha que será ahora mismo
public class ReviewDto
{
    public string Text { get; set; } 

    public int UserId { get; set; }

    public int ProductId { get; set; } 

}


