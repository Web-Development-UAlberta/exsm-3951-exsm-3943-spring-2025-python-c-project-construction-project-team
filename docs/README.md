# Renovation Project

A full-stack web application developed for **Bob & Susan Renovations**, designed to streamline communication and project management for both homeowners and contractors. Built with a modern tech stack, the app supports secure authentication, service browsing, project tracking, and more.

---

## 🔧 Tech Stack

* **Backend:** .NET Core API
* **Frontend:** React
* **Database:** PostgreSQL
* **Containerization:** Docker
* **Reverse Proxy:** NGINX

---

## 📁 Project Structure

```
src/RenovationApp/
├── RenovationApp.Server/     # Backend API (.NET Core)
├── renovationapp.client/     # Frontend (React)
├── docker-compose.yml        # Docker configuration
├── nginx.conf                # NGINX configuration
└── certs/                    # SSL certificates
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

* [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
* [Node.js + npm](https://nodejs.org/)
* [PostgreSQL](https://www.postgresql.org/)
* [Docker & Docker Compose](https://docs.docker.com/desktop/)

### Running the Application

1. **Clone the repository**

2. **Start Docker Desktop**

3. **Generate and export a developer https certificate**

Under src\RenovationApp, do

* dotnet dev-certs https --export-path ./certs/devLocalCert.pem --format PEM -p AStrongPassword --trust
* echo AStrongPassword > .\certs\devLocalCert.pw

4. **Launch the project**

   * Open `RenovationApp.sln` in Visual Studio.
   * Select `docker-compose` as the startup item and run.

This will:

* Set up the PostgreSQL database
* Build and run the backend and frontend
* Start the NGINX reverse proxy

5. **Access the App**

   * Frontend: [http://localhost](http://localhost)
   * Backend API: [http://localhost/api](http://localhost/api)
   * Swagger Docs: [https://localhost:60848/swagger/index.html](https://localhost:60848/swagger/index.html)

---
## 📋 Usage

### Role-Specific Workflows
This shows the workflow as a Homeowner user and as a Project Manager or Admin.
#### 🔑 Authentication
Clicking the Login will direct you to the sign up / sign in page.

1. **Registration**
- Sends a confirmation email
- Complete the rest of the registration form.

2. **Login**
- Enter your credentials on the login page

![LoginSignup](demo/LoginSignup.gif)

#### 🏠 For Homeowners
1. **Browsing Services**
- Navigate to the Service tab to view available options.
2. **Gallery**
- Navigate to the Gallery tab to view all project photos.
- Filterable by room type, style, and budget

![GalleryFilter](demo/Gallery.gif)

**Accessible only by login**

3. **Submitting a Renovation Request**
- Navigate to the Request a Quote
- Fill out the details form
- Upload (multiple) files for references
- Submit and wait for contractor response

4. **Check Renovation Requests**
- Under Account Management section, navigate to Submitted Requests
- See all submitted requests
- Check status progress on requests
- View details on submitted requests

![RenovationRequestHomeowner](demo/SubmitRequest.gif)

5. **Account Management**
- Navgiate to the user profile icon and go to the Personal Information tab
- Edit and save personal information
- Edit address

#### 🧰 Contractors
Contractors and Admins are directed to the internal dashboard.

1. **Managing Requests**
- View incoming requests on the Requests tab
- View details of submitted requests
- Accepting requests generates project and creates a quote estimate to send

2. **Generate Quotes**
- Use quote builder to itemize costs
- Add or remove items as needed
- Edit items as needed
- Send to homeowner for approval

3. **Project Management**
- Navigate to Projects tab
- Track all or ongoing projects
- Update project status
- View projects

4. **Project Details**

   **Overview Tab**
   - View project and contact details
   - Add notes to project as needed
   - See tasks for the project

   **Files Tab**
   - View files from submitted request form
   - Add or delete files

   **Invoices Tab**
   - View invoices for project
   - Check payment status

5. **Contact Management**
- Navigate to Contacts tab
- View all Contacts and contact details

## 🔧 Troubleshooting

### Startup Issues
If you are unable to access the application for the backend or frontend:

1. **Backend with Swagger**
- Open `RenovationApp.sln` in Visual Studio
- Select `RenovationApp.Server` as the start up project
- Click the ▶️ Debug button or press F5 to start. Make sure you are using `Container (Dockerfile)`.

2. **Frontend with Vite**
- cd to the renovationapp.client folder
   ```bash
   cd src/RenovationApp/renovationapp.client
   ```
- Click the ▶️ Debug button or press F5 to start. Make sure you are using `Chrome + Vite Only`.

### SSL Certificate Issues
1. **Certificate warnings**
- Add development certificates to trusted roots
- Use `dotnet dev-certs https --trust` for development
```bash
dotnet dev-certs https --export-path ./certs/devLocalCert.perm --format PEM -p {strongpassword} --trust
```

## 🧰 Features

### 🏠 Homeowner Portal

* Account registration with email verification
* Browse renovation services
* Submit detailed renovation requests
* View a searchable, filterable project gallery

### 🧰 Contractor Portal

* Manage renovation requests
* Assign project managers
* Create and send custom quotes
* Chat with homeowners
* Track project timelines and status
* Use built-in CRM tools and calendars

---

## 👥 Roles & Permissions

| Role            | Capabilities                                                   |
| --------------- | -------------------------------------------------------------- |
| Homeowner       | Browse services, submit requests, view gallery                 |
| Project Manager | Manage requests, assign projects, communicate, generate quotes |
| Admin           | Full access to users, services, and system settings            |

---

## 🔮 Future Enhancements

* 3D Room Planner integration
* Payment gateway support
* SMS notifications
* Advanced analytics dashboard

---

## 👨‍💻 Authors

* Clarisse Buniel
* David Rochefort
* Evan Gamble
* Xiaojing Shi

---

**Created:** 2025-04-25
**Last Updated:** 2025-05-07