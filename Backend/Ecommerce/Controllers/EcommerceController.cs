using Ecommerce.Models;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EcommerceController : ControllerBase
    {
        private EcommerceContext _dbContext;

        public EcommerceController(EcommerceContext dbContext) {
            _dbContext = dbContext;
        }

        [HttpGet]
        public IEnumerable<User> GetUser()
        {
            return _dbContext.Users;

        }
    }
}
