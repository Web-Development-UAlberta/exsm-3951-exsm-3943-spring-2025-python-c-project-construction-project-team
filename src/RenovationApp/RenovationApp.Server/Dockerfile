# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

ARG POSTGRES_HOST
ARG POSTGRES_PORT
ARG POSTGRES_USERNAME
ARG POSTGRES_DATABASE
ARG POSTGRES_PASSWORD

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
ENV POSTGRES_HOST = $POSTGRES_HOST
ENV POSTGRES_PORT = $POSTGRES_PORT
ENV POSTGRES_USERNAME = $POSTGRES_USERNAME
ENV POSTGRES_DATABASE = $POSTGRES_DATABASE
ENV POSTGRES_PASSWORD = $POSTGRES_PASSWORD
USER $APP_UID
WORKDIR /app
EXPOSE 80
EXPOSE 443


# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS with-node
RUN apt-get update
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash
RUN apt-get -y install nodejs


FROM with-node AS build
ARG BUILD_CONFIGURATION=Release
ENV POSTGRES_HOST = $POSTGRES_HOST
ENV POSTGRES_PORT = $POSTGRES_PORT
ENV POSTGRES_USERNAME = $POSTGRES_USERNAME
ENV POSTGRES_DATABASE = $POSTGRES_DATABASE
ENV POSTGRES_PASSWORD = $POSTGRES_PASSWORD
WORKDIR /src
COPY ["RenovationApp.Server/RenovationApp.Server.csproj", "RenovationApp.Server/"]
COPY ["renovationapp.client/renovationapp.client.esproj", "renovationapp.client/"]
RUN dotnet restore "./RenovationApp.Server/RenovationApp.Server.csproj"
COPY . .
WORKDIR "/src/RenovationApp.Server"
RUN dotnet build "./RenovationApp.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./RenovationApp.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RenovationApp.Server.dll"]
