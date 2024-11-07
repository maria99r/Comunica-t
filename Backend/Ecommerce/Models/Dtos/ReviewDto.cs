namespace Ecommerce.Models.Dtos;

public class ReviewDto
{
    public string Text { get; set; } 

    public int Label { get; set; } // abria que borrarlo porque la crea la ia 

    public DateTime Date { get; set; }

    public int UserId { get; set; }

    public int ProductId { get; set; } 

}


