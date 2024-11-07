using Ecommerce.Models.ReviewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.ML;

namespace Ecommerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ModelController : ControllerBase
    {
        private readonly PredictionEnginePool<ModelInput, ModelOutput> _model;

        public ModelController(PredictionEnginePool<ModelInput, ModelOutput> model)
        {
            _model = model;
        }

        [HttpGet]
        public ModelOutput Predict(string text)
        {
            ModelInput input = new ModelInput
            {
                Text = text
            };
            ModelOutput output = _model.Predict(input);
            return output;
        }
    }
}
