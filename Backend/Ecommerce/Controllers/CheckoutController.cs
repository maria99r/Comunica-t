using Ecommerce.Models.Dtos;
using Ecommerce.Services;
using Microsoft.AspNetCore.Mvc;

//https://docs.stripe.com/checkout/embedded/quickstart

namespace Ecommerce.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckoutController : ControllerBase
    {
        private readonly CheckOutService _checkOutService;
        public CheckoutController(CheckOutService checkOutService)
        {
            _checkOutService = checkOutService;
        }

        [HttpGet("CartbyUserId/{id}")]
        public async Task<CartDto> GetCartByUserIdAsync(int id)
        {
            CartDto cartDto = await _checkOutService.GetCartByUserIdAsync(id);

            if (cartDto == null)
            {
                return null;
            }

            return cartDto;
        }

        //[HttpPost]
        //public ActionResult Create()
        //{
        //    var domain = "http://localhost:4200";
        //    var options = new SessionCreateOptions
        //    {
        //        UiMode = "embedded",
        //        LineItems = new List<SessionLineItemOptions>
        //        {
        //          new SessionLineItemOptions
        //          {

        //          },
        //        },
        //        Mode = "payment",
        //        ReturnUrl = domain + "/return.html?session_id={CHECKOUT_SESSION_ID}",
        //    };
        //    var service = new SessionService();
        //    Session session = service.Create(options);

        //    return Json(new { clientSecret = session.ClientSecret });
        //}
    }
}