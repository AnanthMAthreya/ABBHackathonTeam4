namespace backend_dotnet.Models;

public record TrainModelRequest(
    DateTime TrainStart, DateTime TrainEnd,
    DateTime TestStart,  DateTime TestEnd
);

public record TrainModelResponse(
    string Status,
    Metrics Metrics,
    Charts? Charts
);

public record Metrics(double Accuracy, double Precision, double Recall, double F1);
public record Charts(string? TrainingCurve, string? ConfusionMatrix);
