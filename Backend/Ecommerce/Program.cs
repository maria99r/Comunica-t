using Ecommerce;
using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Repositories.Implementations;
using Ecommerce.Models.Mappers;
using Ecommerce.Models.ReviewModels;
using Ecommerce.Services;
using Microsoft.Extensions.ML;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Stripe;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Inyectamos el DbContext
builder.Services.AddScoped<EcommerceContext>();
builder.Services.AddScoped<UnitOfWork>();

// Inyecci�n de todos los repositorios
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<ReviewRepository>();
builder.Services.AddScoped<ProductRepository>();
builder.Services.AddScoped<ProductOrderRepository>();
builder.Services.AddScoped<ProductCartRepository>();
builder.Services.AddScoped<OrderRepository>();
builder.Services.AddScoped<TemporalOrderRepository>();
builder.Services.AddScoped<TemporalProductOrderRepository>();
builder.Services.AddScoped<CartRepository>();
builder.Services.AddScoped<CheckOutRepository>();

builder.Services.AddScoped<UserMapper>();
builder.Services.AddScoped<CartMapper>();
builder.Services.AddScoped<ProductCartMapper>();

// Inyecci�n de Servicios
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<CartService>();
builder.Services.AddScoped<ProductCartService>();
builder.Services.AddScoped<Ecommerce.Services.ProductService>();
builder.Services.AddScoped<Ecommerce.Services.ReviewService>();
builder.Services.AddScoped<SmartSearchService>();
builder.Services.AddScoped<CheckOutService>();


// Inyeccion de la IA
builder.Services.AddPredictionEnginePool<ModelInput, ModelOutput>()
    .FromFile("ReviewAI.mlnet");


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuraci�n de CORS
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


// Configuraci�n de autenticaci�n
builder.Services.AddAuthentication()
    .AddJwtBearer(options =>
    {
        string key = "A8$wX#pQ3dZ7v&kB1nY!rT@9mL%j6sHf4^g2Uc5*o";

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

// Configuramos Stripe
InitStripe(app.Services);

static void InitStripe(IServiceProvider serviceProvider)
{
    using IServiceScope scope = serviceProvider.CreateScope();
    IOptions<Settings> options = scope.ServiceProvider.GetService<IOptions<Settings>>();

    // Ponemos nuestro secret key (se consulta en el dashboard => desarrolladores)
    StripeConfiguration.ApiKey = "sk_test_51QJzjBGpuU9RUuIN7h9KkhFFkIbRuCHI5MTiTsnylBR63yecr8Qnmvdqi6TPH3BXkj5ClpS1KaTRDUOMlwpvLLGg00hmcoA2Sq";
}
