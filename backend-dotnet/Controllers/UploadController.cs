using Microsoft.AspNetCore.Mvc;
using backend_dotnet.Models;
using backend_dotnet.Services;

namespace backend_dotnet.Controllers;

[ApiController]
[Route("upload")]
public class UploadController : ControllerBase
{
    private readonly DatasetStore _store;
    public UploadController(DatasetStore store) => _store = store;

    /// <summary>
    /// Upload a CSV dataset file.
    /// </summary>
    [HttpPost]
    [Consumes("multipart/form-data")]
    public ActionResult<UploadMetadataResponse> Upload([FromForm] UploadFileRequest request)
    {
        var file = request.File;

        if (file is null || file.Length == 0)
            return BadRequest("No file uploaded");

        if (!file.FileName.EndsWith(".csv", StringComparison.OrdinalIgnoreCase))
            return BadRequest("Only .csv files are allowed.");

        using var s = file.OpenReadStream();
        var (rows, cols, passRate, minTs, maxTs) = _store.LoadAndAugmentCsv(s, file.FileName);

        var resp = new UploadMetadataResponse(
            file.FileName,
            rows,
            cols,
            $"{passRate:P0}",
            minTs,
            maxTs
        );
        return Ok(resp);
    }
}
