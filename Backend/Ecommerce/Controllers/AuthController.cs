using Ecommerce.Models.Dtos;
using Ecommerce.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Ecommerce.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly TokenValidationParameters _tokenParameters;
    private readonly UserService _userService;

    public AuthController(UserService userService, IOptionsMonitor<JwtBearerOptions> jwtOptions)
    {
        _userService = userService;
        _tokenParameters = jwtOptions.Get(JwtBearerDefaults.AuthenticationScheme).TokenValidationParameters;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResult>> Login([FromBody] LoginRequest model)
    {
        try
        {
            // Se usa el método LoginAsync para verificar el usuario y la contraseña
            var user = await _userService.LoginAsync(model.Email, model.Password);

            // Si el usuario es null, se devuelve Unauthorized
            if (user == null)
            {
                return Unauthorized("Datos de inicio de sesión incorrectos.");
            }

            // Se crea el token JWT
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                // Se añaden los datos que autorizan al usuario
                Claims = new Dictionary<string, object>
                {
                    { ClaimTypes.NameIdentifier, user.UserId },  // ID del usuario
                    { ClaimTypes.Name, user.Name },              // Nombre del usuario
                    { ClaimTypes.Role, user.Role }               // Rol del usuario
                },
                // Expiración del token en 7 días
                Expires = DateTime.UtcNow.AddDays(7),
                // Clave y algoritmo de firmado
                SigningCredentials = new SigningCredentials(
                    _tokenParameters.IssuerSigningKey,
                    SecurityAlgorithms.HmacSha256Signature)
            };

            // Creación del token
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            string stringToken = tokenHandler.WriteToken(token);

            // Se devuelve el resultado de inicio de sesión con el token y los datos del usuario
            var loginResult = new LoginResult
            {
                AccessToken = stringToken,
                User = new UserDto
                {
                    UserId = user.UserId,     // ID del usuario
                    Name = user.Name,         // Nombre del usuario
                    Email = user.Email,       // Email del usuario
                    Address = user.Address,   // Dirección del usuario
                    Role = user.Role,         // Rol del usuario
                }
            };

            return Ok(loginResult);
        }

        catch (InvalidOperationException)
        {
            // Si hay algún error, se devuelve Unauthorized
            return Unauthorized("Datos de inicio de sesión incorrectos.");
        }
    }
}