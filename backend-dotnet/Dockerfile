FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
VOLUME ["/data"]
ENV ASPNETCORE_URLS=http://+:5000
ENV ML_SERVICE_URL=http://ml-service-python:8000
COPY --from=build /app .
EXPOSE 5000
ENTRYPOINT ["dotnet", "backend-dotnet.dll"]
