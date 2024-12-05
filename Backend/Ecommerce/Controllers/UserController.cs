using Ecommerce.Models;
using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Database.Repositories.Implementations;
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
        public async Task<IActionResult> ModifyUser([FromBody] UserProfileDto userDto)
        {

            // Obtener datos del usuario para modificarse a si mismo
            UserProfileDto userData = await ReadToken();

            if (userData == null)
            {
                Console.WriteLine("Token inválido o usuario no encontrado.");
                return BadRequest("El usuario es null");
            }

            Console.WriteLine($"Usuario autenticado: ID = {userData.UserId}, Email = {userData.Email}");
            userDto.UserId = userData.UserId;
            try
            {
                await _userService.ModifyUserAsync(userDto);
                return Ok("Usuario actualizado correctamente.");
            }
            catch (InvalidOperationException)
            {
                return BadRequest("No pudo modificarse el usuario.");
            }
        }

        // Solo pueden usar este método los usuarios cuyo rol sea admin
        //[Authorize(Roles = "Admin")] Descomentar esto cuando esté implementado en front (en swagger no se puede probar)
        [HttpPut("modifyUserRole/{userId}")]
        public async Task<IActionResult> ModifyUserRole(int userId, string newRole)
        {

            // Obtener datos del usuario
            UserDto userData = await _userService.GetUserByIdAsync(userId);

            if (userData == null)
            {
                return BadRequest("El usuario es null");
            }

            try
            {
                if (newRole == "User" || newRole == "Admin")
                {
                    await _userService.ModifyUserRoleAsync(userId, newRole);
                    return Ok("Rol de usuario actualizado correctamente.");
                }
                else
                {
                    return BadRequest("El nuevo rol debe ser User o Admin");
                }
                
            }
            catch (InvalidOperationException)
            {
                return BadRequest("No pudo modificarse el rol del usuario.");
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
