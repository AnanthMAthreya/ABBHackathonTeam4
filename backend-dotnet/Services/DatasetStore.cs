using System.Data;
using System.Globalization;
using CsvHelper;
using CsvHelper.Configuration;

namespace backend_dotnet.Services;

public sealed class DatasetStore
{
    private readonly object _lock = new();
    private DataTable? _table;
    private string _dataDir;
    private string _augmentedPath = string.Empty;

    public DatasetStore()
    {
        // shared folder for docker volume later
        _dataDir = Path.Combine(AppContext.BaseDirectory, "..", "..", "data");
        Directory.CreateDirectory(_dataDir);
    }

    public string AugmentedPath => _augmentedPath;

    public (long rows, int cols, double passRate, DateTime minTs, DateTime maxTs)
        LoadAndAugmentCsv(Stream csvStream, string fileName)
    {
        lock (_lock)
        {
            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                PrepareHeaderForMatch = args => args.Header.Trim(),
                MissingFieldFound = null,
                BadDataFound = null,
                DetectDelimiter = true
            };

            var table = new DataTable();
            using var reader = new StreamReader(csvStream);
            using var csv = new CsvReader(reader, config);

            csv.Read(); csv.ReadHeader();
            foreach (var h in csv.HeaderRecord!) table.Columns.Add(h, typeof(string));

            while (csv.Read())
            {
                var row = table.NewRow();
                foreach (DataColumn c in table.Columns)
                    row[c.ColumnName] = csv.GetField(c.ColumnName);
                table.Rows.Add(row);
            }

            if (!table.Columns.Contains("Response"))
                throw new InvalidOperationException("CSV must include 'Response'.");

            var tsCol = "synthetic_timestamp";
            if (!table.Columns.Contains(tsCol))
                table.Columns.Add(tsCol, typeof(DateTime));

            var start = new DateTime(2021,1,1,0,0,0,DateTimeKind.Utc);
            for (int i=0; i<table.Rows.Count; i++)
                table.Rows[i][tsCol] = start.AddSeconds(i);

            long rows = table.Rows.Count;
            int cols = table.Columns.Count;
            long pass = 0;
            foreach (DataRow r in table.Rows)
            {
                var v = Convert.ToString(r["Response"])?.Trim();
                if (v == "1" || v?.ToLowerInvariant() == "true") pass++;
            }
            double passRate = rows == 0 ? 0 : (double)pass / rows;

            var times = table.AsEnumerable().Select(r => (DateTime)r[tsCol]).ToList();
            var minTs = times.Min();
            var maxTs = times.Max();

            _augmentedPath = Path.Combine(_dataDir, "dataset_augmented.csv");
            WriteCsv(table, _augmentedPath);

            _table = table;
            return (rows, cols, passRate, minTs, maxTs);
        }
    }

    public (long count, int days) CountInRange(DateTime start, DateTime end)
    {
        lock (_lock)
        {
            if (_table is null) return (0,0);
            var ts = "synthetic_timestamp";
            var c = _table.AsEnumerable().Count(r => {
                var t = (DateTime)r[ts];
                return t >= start && t <= end;
            });
            var days = (end.Date - start.Date).Days + 1;
            return (c, days);
        }
    }

    public (DateTime minTs, DateTime maxTs) GetBounds()
    {
        lock (_lock)
        {
            if (_table is null) return (DateTime.MinValue, DateTime.MinValue);
            var ts = "synthetic_timestamp";
            var times = _table.AsEnumerable().Select(r => (DateTime)r[ts]).ToList();
            return (times.Min(), times.Max());
        }
    }

    private static void WriteCsv(DataTable dt, string path)
    {
        using var writer = new StreamWriter(path);
        using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);

        foreach (DataColumn c in dt.Columns) csv.WriteField(c.ColumnName);
        csv.NextRecord();

        foreach (DataRow row in dt.Rows)
        {
            foreach (DataColumn c in dt.Columns)
            {
                if (row[c] is DateTime d) csv.WriteField(d.ToString("yyyy-MM-dd HH:mm:ss"));
                else csv.WriteField(row[c]?.ToString());
            }
            csv.NextRecord();
        }
    }
}
