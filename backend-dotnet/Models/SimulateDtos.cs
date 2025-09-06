namespace backend_dotnet.Models;

public record SimulateRequest(DateTime SimStart, DateTime SimEnd);

public record SimulateEvent(
    DateTime Timestamp,
    long SampleId,
    string Prediction,
    double Confidence,
    double Temperature,
    double Pressure,
    double Humidity
);

public record SimulateSummary(long Total, long Pass, long Fail, double AvgConfidence);
