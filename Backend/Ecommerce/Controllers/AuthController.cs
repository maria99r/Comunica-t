using Ecommerce.Helpers;
using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;
using Ecommerce.Models.Mappers;
using Ecommerce.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
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
    private readonly UserMapper _userMapper;

    public AuthController(UserService userService, UserMapper userMapper, IOptionsMonitor<JwtBearerOptions> jwtOptions)
    {
        _userService = userService;
        _userMapper = userMapper;
        _tokenParameters = jwtOptions.Get(JwtBearerDefaults.AuthenticationScheme).TokenValidationParameters;
    }

    // LOGIN 
    [AllowAnonymous]
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
                    { ClaimTypes.NameIdentifier, user.Id },  // ID del usuario
                    { ClaimTypes.Name, user.Name },              // Nombre del usuario
                    { ClaimTypes.Role, user.Role }               // Rol del usuario
                },
                // Expiración del token en 5 años
                Expires = DateTime.UtcNow.AddYears(5),

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
                User = _userMapper.UserToDto(user)
            };

            return Ok(loginResult);
        }

        catch (InvalidOperationException)
        {
            // Si hay algún error, se devuelve Unauthorized
            return Unauthorized("Datos de inicio de sesión incorrectos.");
        }
    }


    // SIGN UP CREAR NUEVO USUARIO
    [HttpPost("Signup")]
    public async Task<ActionResult<RegisterDto>> SignUp([FromBody] RegisterDto model)
    {

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Verifica si ya existe un usuario con el mismo correo
        var existingUser = await _userService.GetByEmail(model.Email);
        if (existingUser != null)
        {
            return Conflict("El correo electrónico ya está en uso.");
        }

        var newUser = await _userService.RegisterAsync(model);

        var userDto = _userMapper.UserToDto(newUser);

        return CreatedAtAction(nameof(Login), new { email = userDto.Email }, userDto);
    }

    [Authorize]
    [HttpGet("read")]
    public void ReadToken() // Leer datos del token
    {
        string id = User.FindFirst("id").Value;
        string role = User.FindFirst(ClaimTypes.Role).Value;
    }

}
