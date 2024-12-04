using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;
using Ecommerce.Models.Mappers;
using Ecommerce.Services.Email;

namespace Ecommerce.Services;

public class OrderService
{
    private readonly UnitOfWork _unitOfWork;
    private readonly OrderMapper _orderMapper;
    private readonly IEmailService _emailService;
    public OrderService(UnitOfWork unitOfWork, OrderMapper orderMapper, IEmailService emailService)
    {
        _unitOfWork = unitOfWork;
        _orderMapper = orderMapper;
        _emailService = emailService;
    }

    // obtener por id
    public async Task<OrderDto> GetByIdAsync(int id)
    {
        var order = await _unitOfWork.OrderRepository.GetOrderById(id);

        if (order == null)
        {
            return null;
        }

        return _orderMapper.OrderToDto(order);
    }

    // obtener pedidos dto por id de usuario
    public async Task<List<OrderDto>> GetOrderByUser(int id)
    {
        if (id <= 0) throw new ArgumentException("El ID no es válido.");

        var orders = await _unitOfWork.OrderRepository.GetOrderByUser(id);

        if (orders.Count == 0)
        {
            return null;
        }

        var ordersDto = _orderMapper.OrdersToDto(orders).ToList();

        return ordersDto;
    }



    // crear un pedido, elimina orden temporal, ENVIA CORREO A USER
    public async Task<Order> CreateOrderAsync(int idtemporal)
    {
        var t = await _unitOfWork.TemporalOrderRepository.GetByIdAsync(idtemporal);

        // creo pedido
        var newOrder = new Order
        {
            UserId = (int)t.UserId,
            PaymentDate = DateTime.Now,
            PaymentMethod = t.PaymentMethod,
            TotalPrice = t.TotalPrice,
            // agregar productos
            ProductsOrder = t.TemporalProductOrder.Select(pc => new ProductOrder
            {
                Quantity = pc.Quantity,
                ProductId = pc.Product.Id,
                // añadir pricePay
            }).ToList(),
        };

        // guardo pedido
        var order = await _unitOfWork.OrderRepository.InsertAsync(newOrder);



        /*  NO FUNCIONA
        // Quitas del carrito
        var cart = await _unitOfWork.CartRepository.GetCartByUserId((int)t.UserId); // carrito del usuario

        foreach (var p in temporal.TemporalProductOrder)
        {
            var quantity = p.Quantity; // cantidad a restar
            
            foreach (var pc in cart.ProductCarts)
            {
                // busca el producto en el carrito y resta la cantidad
                if (pc.ProductId == p.ProductId)
                {
                    pc.Quantity -= quantity;
                }

                // si la cantidad es 0, se elimina del carrito
                if (pc.Quantity <= 0)
                {
                    await _unitOfWork.ProductCartRepository.Delete(pc);
                }
                else _unitOfWork.ProductCartRepository.Update(pc);
            }
        };
*/
        // Elimino la orden temporal para que no restaure el stock con el servicio
        await _unitOfWork.TemporalOrderRepository.Delete(t);
             
        await _unitOfWork.SaveAsync();

        // envia correo a user
        var user = await _unitOfWork.UserRepository.GetByIdAsync(newOrder.UserId);
        if (user != null)
        {
            var email = new EmailDto
            {
                To = user.Email,
                Subject = "Confirmación de pedido",
                Body = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Confirmación de Pedido</title>
                </head>
                <body>
                    <h1>Gracias por tu compra, {user.Name}</h1>
                    <p>Tu pedido de ha procesado con éxito. Aquí tienes los detalles:</p>
                    <p><strong>ID del pedido:</strong> {order.Id}</p>
                    <p><strong>Método de Pago:</strong> {order.PaymentMethod}</p>
                    <p><strong>Fecha de Pago:</strong> {order.PaymentDate.ToString("f", new System.Globalization.CultureInfo("es-ES"))}</p>
                    <p><strong>Precio total:</strong> {order.TotalPrice / 100}€</p>
                    <p>¡Gracias por confiar en Innovacom!</p>
                </body>
                </html>"
            };
            _emailService.SendEmail(email);
        }

        return order;
     

    }
}
