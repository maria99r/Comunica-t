﻿using Ecommerce.Models.Database.Repositories;
using Ecommerce.Models.Database.Repositories.Implementations;
using TorchSharp.Modules;

namespace Ecommerce.Models.Database
{
    public class UnitOfWork
    {
        private readonly EcommerceContext _context;

        public UserRepository UserRepository { get; init; }
        public ReviewRepository ReviewRepository { get; init; }
        public ProductRepository ProductRepository { get; init; }
        public ProductOrderRepository ProductOrderRepository { get; init; }
        public ProductCartRepository ProductCartRepository { get; init; }
        public OrderRepository OrderRepository { get; init; }
        public TemporalOrderRepository TemporalOrderRepository { get; init; }
        public TemporalProductOrderRepository TemporalProductOrderRepository { get; init; }
        public CartRepository CartRepository { get; init; }
        public CheckoutRepository CheckOutRepository { get; init; }

        public UnitOfWork(
            EcommerceContext context, 
            UserRepository userRepository,
            ReviewRepository reviewRepository,
            ProductRepository productRepository,
            ProductOrderRepository productOrderRepository,
            ProductCartRepository productCartRepository,
            OrderRepository orderRepository,
            TemporalOrderRepository temporalOrderRepository,
            TemporalProductOrderRepository temporalProductOrderRepository,
            CartRepository cartRepository
            ,
            CheckoutRepository checkOutRepository
            )
        {
            _context = context;

            UserRepository = userRepository;
            ReviewRepository = reviewRepository;
            ProductRepository = productRepository;
            ProductOrderRepository = productOrderRepository;
            ProductCartRepository = productCartRepository;
            OrderRepository = orderRepository;
            TemporalOrderRepository = temporalOrderRepository;
            TemporalProductOrderRepository = temporalProductOrderRepository;
            CartRepository = cartRepository;
            CheckOutRepository = checkOutRepository;
        }

        public async Task<bool> SaveAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
