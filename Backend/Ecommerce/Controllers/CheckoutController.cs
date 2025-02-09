﻿using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;
using Ecommerce.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Stripe.Checkout;

namespace Ecommerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CheckoutController : ControllerBase
    {
        private readonly IOptions<Settings> _settings;
        private readonly TemporalOrderService _temporalOrderService;
        private readonly CartService _cartService;
        private readonly UserService _userService;
        public CheckoutController(TemporalOrderService temporalOrderService, CartService cartService, UserService userService)
        {
            _temporalOrderService = temporalOrderService;
            _cartService = cartService;
            _userService = userService;
        }

        [Authorize]
        [HttpGet("embedded")]
        public async Task<ActionResult> EmbededCheckout([FromQuery] int temporalOrderId)
        {
            // Obtener id de usuario desde el Token
            UserDto user = await ReadToken();

            if (user == null)
            {
                return BadRequest("El usuario es null");
            }

            var lineItems = new List<SessionLineItemOptions>();

            // Hay que importar los productos
            TemporalOrder order = await _temporalOrderService.GetByIdAsyncWithoutUser(temporalOrderId);


            foreach (TemporalProductOrder product in order.TemporalProductOrder)
            {
                lineItems.Add(new SessionLineItemOptions()
                {
                    PriceData = new SessionLineItemPriceDataOptions()
                    {
                        Currency = "eur",
                        UnitAmount = (long)(product.Product.Price),
                        ProductData = new SessionLineItemPriceDataProductDataOptions()
                        {
                            Name = product.Product.Name,
                            Description = product.Product.Description,
                            Images = [product.Product.Image]
                        }
                    },
                    Quantity = product.Quantity,
                });
            }

            // Configuración de la sesión
            SessionCreateOptions options = new SessionCreateOptions
            {
                UiMode = "embedded",
                Mode = "payment",
                PaymentMethodTypes = ["card"],
                CustomerEmail = user.Email,
                RedirectOnCompletion = "never",
                LineItems = lineItems
            };

            SessionService service = new SessionService();
            Session session = await service.CreateAsync(options);

            return Ok(new
            {
                clientSecret = session.ClientSecret
            });
        }

        [HttpGet("status/{sessionId}")]
        public async Task<ActionResult> SessionStatus(string sessionId)
        {
            SessionService sessionService = new SessionService();
            Session session = await sessionService.GetAsync(sessionId);

            if (session.PaymentStatus == "paid")
            {
                //Crear la orden definitiva :(
            }

            //TODO - Crear orden definitiva
            return null;
        }

        // Leer datos del token
        private async Task<UserDto> ReadToken()
        {
            try
            {
                string id = User.Claims.FirstOrDefault().Value;
                UserDto user = await _userService.GetUserByIdAsync(Int32.Parse(id));
                return user;
            }
            catch (Exception)
            {
                Console.WriteLine("La ID del usuario es null");
                return null;
            }
        }
    }
}