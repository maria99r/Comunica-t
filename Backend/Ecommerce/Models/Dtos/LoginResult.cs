namespace Ecommerce.Models.Dtos;

public class LoginResult
{
    public string AccessToken { get; set; }

    public UserDto User { get; set; }   // Para que el front reciba datos del usuario que ha iniciado sesión
}
