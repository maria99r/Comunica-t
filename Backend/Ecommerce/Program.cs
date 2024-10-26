using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Repositories.Implementations;
using Ecommerce.Models.Database.Repositories.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Inyectamos el DbContext
builder.Services.AddScoped<EcommerceContext>();
builder.Services.AddScoped<UnitOfWork>();

// Inyección de todos los repositorios
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<ReviewRepository>();
builder.Services.AddScoped<ProductRepository>();
builder.Services.AddScoped<ProductOrderRepository>();
builder.Services.AddScoped<ProductCartRepository>();
builder.Services.AddScoped<CustomerOrderRepository>();
builder.Services.AddScoped<CartRepository>();


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

if (builder.Environment.IsDevelopment()) 
{
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(builder =>
        {
            builder.SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
    });
}

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

    // Permite CORS
    app.UseCors();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
