using System.Text.Json;
using Microsoft.AspNetCore.ResponseCompression;
using backend_dotnet.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<GzipCompressionProvider>();
});

// our own services
builder.Services.AddSingleton<DatasetStore>();
builder.Services.AddHttpClient<IMLClient, MLClient>(client =>
{
    var baseUrl = Environment.GetEnvironmentVariable("ML_SERVICE_URL")
                 ?? "http://ml-service-python:8000";
    client.BaseAddress = new Uri(baseUrl);
});

var app = builder.Build();

app.UseResponseCompression();

app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

app.Run();
