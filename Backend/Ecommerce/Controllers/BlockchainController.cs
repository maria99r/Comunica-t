using Ecommerce.Models.Dtos;
using Ecommerce.Services.Blockchain;
using Examples.WebApi.Models.Dtos;
using Microsoft.AspNetCore.Mvc;
using System.Web;

namespace Ecommerce.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlockchainController : Controller
    {
        private readonly BlockchainService _blockchainService;

        public BlockchainController(BlockchainService blockchainService)
        {
            _blockchainService = blockchainService;
        }

        [HttpGet]
        public Task<Erc20ContractDto> GetContractInfoAsync([FromQuery] ContractInfoRequest data)
        {
            return _blockchainService.GetContractInfoAsync(data.NetworkUrl, data.ContractAddress);
        }

        [HttpPost("transaction")]
        public Task<EthereumTransaction> CreateTransaction([FromBody] CreateTransactionRequest data)
        {
            data.NetworkUrl = HttpUtility.UrlDecode(data.NetworkUrl);

            return _blockchainService.GetEthereumInfoAsync(data);
        }

        [HttpPost("check")]
        public Task<bool> CheckTransactionAsync([FromBody] CheckTransactionRequest data)
        {
            return _blockchainService.CheckTransactionAsync(data);
        }
    }
}
