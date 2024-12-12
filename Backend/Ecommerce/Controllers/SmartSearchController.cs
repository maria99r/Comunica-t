using Ecommerce.Models.Database;
using Ecommerce.Services;
using F23.StringSimilarity;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SmartSearchController : ControllerBase
{
    private readonly SmartSearchService _smartSearchService;
    public SmartSearchController(SmartSearchService smartSearchService)
    {
        _smartSearchService = smartSearchService;
    }

    [HttpGet]
    public async Task<IEnumerable<string>> Search([FromQuery] string query)
    {
        return await _smartSearchService.Search(query);
    }
}
