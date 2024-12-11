namespace Ecommerce.Models.Dtos;

public class CreateTransactionRequest
{
    public string NetworkUrl { get; set; }
    public decimal Euros { get; set; }
}
