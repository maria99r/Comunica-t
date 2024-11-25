
using Ecommerce.Models.Database;

namespace Ecommerce.Services;


// servicio que borra las ordenes temporales que hayan expirado
public class OrderExpiresService : BackgroundService
{

    private readonly IServiceProvider _serviceProvider;

    public OrderExpiresService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _serviceProvider.CreateScope())

            {
                var unitOfWork = scope.ServiceProvider.GetRequiredService<UnitOfWork>();

                var orders = await unitOfWork.TemporalOrderRepository.GetAllAsync();

                foreach (var order in orders)
                {
                    if (order.ExpiresAt < DateTime.UtcNow)
                    {
                        await unitOfWork.TemporalOrderRepository.Delete(order);
                    }
                }

                await unitOfWork.SaveAsync();
            }

                await Task.Delay(60000, stoppingToken); // 1 min
        }
    }
}

