# Renovation Station

Welcome to **Renovation Station**, a web platform built to streamline project acquisition, service browsing, and renovation management for homeowners and contractors.

## Project Overview

Renovation Station connects homeowners seeking renovation services with a professional renovation team.  

It provides a smooth experience for:
- Browsing services
- Submitting renovation requests
- Managing projects and customer communications


## Features

### Homeowner Portal
- Account registration and login with email verification
- Browse available renovation services:
  - Kitchen remodels
  - Bathroom renovations
  - Basement finishing
  - Home additions
- Submit detailed renovation requests:
  - Room dimensions
  - Preferred materials
  - Budget
  - Design styles
  - Upload reference images
- View a project gallery with filtering and search

### Contractor Portal
- View and manage incoming renovation requests
- Assign Project Managers (PMs)
- Generate custom quotes for clients
- Communicate with homeowners
- Track project statuses and timelines
- Access task calendars and Customer relationship management (CRM) dashboard


## Tech Stack

| Frontend | Backend | Database |
|:--------:|:-------:|:--------:|
| React.js | ASP.NET Core MVC | PostgresSQL |

- **Authentication**: JSON Web Tokens (JWT)
- **API**: RESTful API endpoints
- **Styling**: Tailwind CSS


## Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [Node.js + npm](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Web-Development-UAlberta/exsm-3951-exsm-3943-spring-2025-python-c-project-construction-project-team.git
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   dotnet restore
   dotnet ef database update
   dotnet run
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Application:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

---

## Testing

- Backend tests: `dotnet test`
- Frontend tests: `npm run test`


## Roles & Permissions

| Role          | Capabilities |
|---------------|--------------|
| Homeowner     | Browse, Submit Requests, View Gallery |
| Project Manager | Manage Requests, Assign Projects, Communicate, Generate Quotes |
| Admin         | Full access to user management, service management, and system configurations |



## Future Enhancements

- 3D Room Planner Integration
- Payment gateway integration
- SMS notification system
- Advanced project analytics dashboard


## Contributing

Please open an issue first to discuss changes you would like to make.

### Contribution Steps
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request


## Authors

- Clarisse Buniel
- David Rochefort
- Evan Gamble
- Xiaojing Shi

---

### Last Update

2025-04-25

### Creation Date

2025-04-25