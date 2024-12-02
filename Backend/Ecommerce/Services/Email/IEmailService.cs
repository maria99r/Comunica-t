using Ecommerce.Models.Dtos;

namespace Ecommerce.Services.Email;

public interface IEmailService
{
    void SendEmail(EmailDto request);
}
