using Microsoft.AspNetCore.Http;

namespace backend_dotnet.Models;

public class UploadFileRequest
{
    /// <summary>
    /// CSV file to upload (must contain Response column).
    /// </summary>
    public IFormFile File { get; set; } = default!;
}

public record UploadMetadataResponse(
    string FileName,
    long TotalRecords,
    int TotalColumns,
    string PassRate,
    DateTime EarliestTimestamp,
    DateTime LatestTimestamp
);
