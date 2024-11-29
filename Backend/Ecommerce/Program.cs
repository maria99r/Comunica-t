using Ecommerce;
using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Repositories.Implementations;
using Ecommerce.Models.Mappers;
using Ecommerce.Models.ReviewModels;
using Ecommerce.Services;
using Ecommerce.Services.Blockchain;
using Ecommerce.Services.Email;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.ML;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Stripe;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Leer la configuración
builder.Services.Configure<Settings>(builder.Configuration.GetSection(Settings.SECTION_NAME));

// Inyectamos el DbContext
builder.Services.AddScoped<EcommerceContext>();
builder.Services.AddScoped<UnitOfWork>();

// Inyección de todos los repositorios
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<ReviewRepository>();
builder.Services.AddScoped<ProductRepository>();
builder.Services.AddScoped<ProductOrderRepository>();
builder.Services.AddScoped<ProductCartRepository>();
builder.Services.AddScoped<OrderRepository>();
builder.Services.AddScoped<TemporalOrderRepository>();
builder.Services.AddScoped<TemporalProductOrderRepository>();
builder.Services.AddScoped<CartRepository>();
builder.Services.AddScoped<CheckoutRepository>();
builder.Services.AddTransient<BlockchainService>();

// Inyección de Mappers
builder.Services.AddScoped<UserMapper>();
builder.Services.AddScoped<CartMapper>();
builder.Services.AddScoped<ProductCartMapper>();
builder.Services.AddScoped<TemporalOrderMapper>();
builder.Services.AddScoped<OrderMapper>();

// Inyección de Servicios
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<CartService>();
builder.Services.AddScoped<ProductCartService>();
builder.Services.AddScoped<TemporalOrderService>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<Ecommerce.Services.ProductService>();
builder.Services.AddScoped<Ecommerce.Services.ReviewService>();
builder.Services.AddScoped<SmartSearchService>();

builder.Services.AddHostedService<OrderExpiresService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// Inyeccion de la IA
builder.Services.AddPredictionEnginePool<ModelInput, ModelOutput>()
    .FromFile("ReviewAI.mlnet");


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", builder =>
    {
        builder.AllowAnyOrigin() // Permitir cualquier origen
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});


// Configuración de autenticaci�n
builder.Services.AddAuthentication()
    .AddJwtBearer(options =>
    {
        Settings settings = builder.Configuration.GetSection(Settings.SECTION_NAME).Get<Settings>();
        string key = settings.JwtKey;

        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        };
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// wwwroot
app.UseStaticFiles();

// Permite CORS
app.UseCors("AllowAllOrigins");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();


await SeedDataBaseAsync(app.Services);


// Configuramos Stripe
InitStripe(app.Services);

app.Run();

// metodo para el seeder
static async Task SeedDataBaseAsync(IServiceProvider serviceProvider)
{
    using IServiceScope scope = serviceProvider.CreateScope();
    using EcommerceContext dbContext = scope.ServiceProvider.GetService<EcommerceContext>();

    // Si no existe la base de datos, la creamos y ejecutamos el seeder
    if (dbContext.Database.EnsureCreated())
    {
        Seeder seeder = new Seeder(dbContext);
        await seeder.SeedAsync();
    }
}

static void InitStripe(IServiceProvider serviceProvider)
{
    using IServiceScope scope = serviceProvider.CreateScope();
    IOptions<Settings> options = scope.ServiceProvider.GetService<IOptions<Settings>>();

    // Ponemos nuestro secret key
    StripeConfiguration.ApiKey = options.Value.StripeSecret;
}
