using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using backend_dotnet.Models;
using backend_dotnet.Services;

namespace backend_dotnet.Controllers;

[ApiController]
[Route("simulate")]
public class SimulateController : ControllerBase
{
    private readonly IMLClient _ml;
    public SimulateController(IMLClient ml) => _ml = ml;

    [HttpPost]
    [Produces("text/event-stream")]
    public async Task Stream([FromBody] SimulateRequest req, CancellationToken ct)
    {
        Response.StatusCode = 200;
        Response.ContentType = "text/event-stream";
        await foreach (var ev in _ml.SimulateAsync(req, ct))
        {
            var json = JsonSerializer.Serialize(ev);
            await Response.WriteAsync($"data: {json}\n\n", ct); // SSE
            await Response.Body.FlushAsync(ct);
        }
    }
}

