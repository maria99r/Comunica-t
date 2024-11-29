namespace Ecommerce.Models.Dtos;

public class EmailDto
{
    public string To { get; set; }  = string.Empty;
    public string Subject { get; set; } = string.Empty; // ASUNTO

    public string Body { get; set; } = string.Empty; // contenido correo
}
