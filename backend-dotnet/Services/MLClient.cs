using System.Net.Http.Json;
using backend_dotnet.Models;

namespace backend_dotnet.Services;

public interface IMLClient
{
    Task<TrainModelResponse?> TrainAsync(TrainModelRequest req, CancellationToken ct);
    IAsyncEnumerable<SimulateEvent> SimulateAsync(SimulateRequest req, CancellationToken ct);
}

public class MLClient : IMLClient
{
    private readonly HttpClient _http;
    public MLClient(HttpClient http) => _http = http;

    public async Task<TrainModelResponse?> TrainAsync(TrainModelRequest req, CancellationToken ct)
    {
        var res = await _http.PostAsJsonAsync("/train-model", req, ct);
        res.EnsureSuccessStatusCode();
        return await res.Content.ReadFromJsonAsync<TrainModelResponse>(cancellationToken: ct);
    }

    public async IAsyncEnumerable<SimulateEvent> SimulateAsync(SimulateRequest req, [System.Runtime.CompilerServices.EnumeratorCancellation] CancellationToken ct)
    {
        var cursor = 0;
        const int batch = 25;

        while (!ct.IsCancellationRequested)
        {
            var res = await _http.PostAsJsonAsync("/simulate-batch", new {
                simStart = req.SimStart, simEnd = req.SimEnd, cursor, take = batch
            }, ct);

            if (!res.IsSuccessStatusCode) yield break;
            var items = await res.Content.ReadFromJsonAsync<List<SimulateEvent>>(cancellationToken: ct) ?? new();
            if (items.Count == 0) yield break;

            foreach (var ev in items) yield return ev;

            cursor += items.Count;
            await Task.Delay(1000, ct); // ~1 row/sec pacing
        }
    }
}
