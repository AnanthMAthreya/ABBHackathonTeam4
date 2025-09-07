using Microsoft.AspNetCore.Mvc;
using backend_dotnet.Models;
using backend_dotnet.Services;

namespace backend_dotnet.Controllers;

[ApiController]
[Route("train-model")]
public class TrainController : ControllerBase
{
    private readonly DatasetStore _store;
    private readonly IMLClient _ml;
    public TrainController(DatasetStore store, IMLClient ml) { _store = store; _ml = ml; }

    [HttpPost]
    public async Task<ActionResult<TrainModelResponse>> Train([FromBody] TrainModelRequest req, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(_store.AugmentedPath))
            return BadRequest("Upload dataset first.");
        var result = await _ml.TrainAsync(req, ct);
        if (result is null) return StatusCode(502, "ML service did not respond.");
        return Ok(result);
    }
}
