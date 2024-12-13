using Ecommerce.Models.Dtos;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace Ecommerce.Services.Email;

public class EmailService : IEmailService
{

    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public void SendEmail(EmailDto request)
    {
        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse(_config.GetSection("Email:UserName").Value));
        email.To.Add(MailboxAddress.Parse(request.To));
        email.Subject = request.Subject;
        email.Body = new TextPart(MimeKit.Text.TextFormat.Html)
        {
            Text = request.Body
        };

        using var smtp = new SmtpClient();

        smtp.Connect(
            _config.GetSection("Email:Host").Value,
            Convert.ToInt32(_config.GetSection("Email:Port").Value),
            SecureSocketOptions.StartTls
            );

        smtp.Authenticate(_config.GetSection("Email:UserName").Value, Environment.GetEnvironmentVariable("EmailPassword"));
        smtp.Send(email);

        smtp.Disconnect(true);

    }
}
