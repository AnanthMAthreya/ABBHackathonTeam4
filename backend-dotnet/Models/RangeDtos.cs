namespace backend_dotnet.Models;

public record ValidateRangesRequest(
    DateTime TrainStart, DateTime TrainEnd,
    DateTime TestStart,  DateTime TestEnd,
    DateTime SimStart,   DateTime SimEnd
);

public record RangeSummary(int Days, long Records);

public record ValidateRangesResponse(
    string Status,
    RangeSummary Training,
    RangeSummary Testing,
    RangeSummary Simulation
);
