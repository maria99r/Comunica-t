using System.Text.Json.Serialization;

namespace Ecommerce.Models.Dtos
{
    public class ProductDto
    {
        public string Name { get; set; }
        public int Stock { get; set; }
        public int Price { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }

    }
}
