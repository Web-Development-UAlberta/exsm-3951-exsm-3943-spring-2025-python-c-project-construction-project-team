# Renovation Project

## Project Overview

This project is a web application for renovation services. It consists of a backend API developed with .NET Core, a frontend built with React, and a PostgreSQL database. The application is containerized using Docker, allowing seamless deployment and development. NGINX serves as a reverse proxy.

### Tech Stack

* Backend: .NET Core API
* Frontend: React
* Database: PostgreSQL
* Containerization: Docker
* Reverse Proxy: NGINX

## Prerequisites

* Docker and Docker Compose installed
* Environment variables configured (.env file)

### Environment Variables

Create a `.env` file in the project root with the following variables:

```
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=your_db_name
```

## Project Structure

```
project-root/
├── RenovationApp.Server/     # Backend API (.NET Core)
├── renovationapp.client/     # Frontend (React)
├── docker-compose.yml        # Docker configuration
├── nginx.conf                # NGINX configuration
└── certs/                    # SSL certificates
```

## Getting Started

### Clone the Repository

### Launch the project

In Visiual Studio, double click RenovationApp.sln and then click docker-compose to launch the project

This command will:

1. Set up the PostgreSQL database.
2. Build and run the backend server.
3. Build and run the frontend client.
4. Start the NGINX reverse proxy.

### Access the Application

* Frontend: [http://localhost](http://localhost)
* Backend API: [http://localhost/api](http://localhost/api)

### Stopping the Services

In Visiual Studio, click stop

### Troubleshooting

* Make sure Docker is running.
* Check the logs for any errors:

## License

This project is licensed under the MIT License.