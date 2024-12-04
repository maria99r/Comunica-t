using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;
using Ecommerce.Models.Mappers;
using Ecommerce.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly UserMapper _userMapper;

        public UserController(UserService userService, UserMapper userMapper)
        {
            _userService = userService;
            _userMapper = userMapper;
        }

        // devuelve un usuario buscado por email
        [HttpGet("/email/{email}")]
        public async Task<IActionResult> GetByEmailAsync(string email)
        {
            var user = await _userService.GetUserByEmailAsync(email);

            if (user == null) // si no se encuentra el correo
            {
                return NotFound(new { message = $"El usuario con el correo: '{email}' no ha sido encontrado." });
            }

            return Ok(user);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);

            if (user == null)
            {
                return NotFound(new { message = $"El usuario con el id '{id}' no ha sido encontrado." });
            }

            return Ok(user);
        }

        //obtener todos los usuarios
        [HttpGet("allUsers")]
        public async Task<IActionResult> GetAllUsersAsync()
        {
            var user = await _userService.GetAllUsersAsync();

            return Ok(user);
        }

        [Authorize]
        [HttpPut("modifyUser")]
        public async Task<IActionResult> ModifyUser([FromBody] UserProfileDto userDto, int userId)
        {

            // Obtener datos del usuario para modificarse a si mismo
            UserProfileDto userData = await ReadToken();

            if (userData == null)
            {
                return BadRequest("El usuario es null");
            }

            if (userData.Role != "Admin" && userData.UserId != userId)
            {
                return BadRequest("No tienes permisos para modificar este usuario.");
            }

            try
            {
                await _userService.ModifyUserAsync(userData);
                return Ok("Usuario actualizado correctamente.");
            }
            catch (InvalidOperationException)
            {
                return BadRequest("No pudo modificarse el usuario.");
            }
        }

        // Elimina un usuario
        [HttpDelete("deleteUser/{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            try
            {
                await _userService.DeleteUserAsync(userId);

                return Ok("Usuario eliminado correctamente.");
            }
            catch (InvalidOperationException)
            {
                return BadRequest("No pudo eliminarse el usuario");
            }
        }

        // Leer datos del token
        private async Task<UserProfileDto> ReadToken()
        {
            try
            {
                string id = User.Claims.FirstOrDefault().Value;
                User user = await _userService.GetUserByIdAsyncNoDto(Int32.Parse(id));
                UserProfileDto userDto = _userMapper.UserProfileToDto(user);
                return userDto;
            }
            catch (Exception)
            {
                Console.WriteLine("La ID del usuario es null");
                return null;
            }
        }
    }
}
