# Home Renovation Design Document
- **Project Name:** Renovation Station  
- **Client(s):** Bo Cen, James Grieve  
- **Developer Team:** Clarisse Buniel, David Rochefort, Evan Gamble, Xiaojing Shi  

<details>
<summary>Table of Contents</summary>

1. [Introduction](#1-introduction)
  
    1.1 [Purpose](#11-purpose)

    1.2 [Scope](#12-scope)
2. [Functional Requirements](#2-functional-requirements)

    **2.1** [Public Website (Homeowners)](#21-public-website-homeowners)

    2.1.1 [User Authentication](#211-user-authentication)

    2.1.2 [Services Browsing](#212-services-browsing)

    2.1.3 [Renovation Request Form](#213-renovation-request-form)

    **2.2** [Business Portal (Renovation Team)](#22-business-portal-renovation-team)

    2.2.1 [Request Management](#221-request-management)

    2.2.2 [CRM Dashboard](#222-crm-dashboard)
3. [Solution-level Requirements](#3-solution-level-requirements)
4. [System Architecture](#4-system-architecture)

    4.1 [Architecture Overview](#41-architecture-overview)
  
    4.2 [Technology Stack](#42-technology-stack)
  
    4.3 [Database](#43-database)
  
    4.4 [Authentication and Roles](#44-authentication-and-roles)

5. [UI/UX Wireframes](#5-uiux-wireframes)
6. [3D Room Planning Tool (Optional / Future Phase)](#6-3d-room-planning-tool-optional--future-phase)
7. [Deployment Plan](#7-deployment-plan)
8. [Timeline (Tentative)](#8-timeline-tentative)
9. [Risks & Assumptions](#9-risks--assumptions)

</details>

## 1. Introduction

### 1.1 Purpose

This document outlines the architecture and design for the Home Renovation System, Renovation Station, an intuitive platform for homeowner and project management.

### 1.2 Scope

The system will develop a comprehensive home renovation business platform, consisting of two main components:

1. **Client (Homeowners) Portal:** A public-facing website for homeowners to browse the services and galleries before submitting a request.
2. **Business Portal:** A secure backend for staff to manage renovation requests, generate quotes, and track projects through a Customer Relationship Management (CRM) system.

## 2. Functional Requirements
### 2.1 Public Website (Homeowners)

#### 2.1.1 User Authentication

- Register / Login / Logout  
- Email confirmation / password reset

#### 2.1.2 Services Browsing

- Pages for:
  - Kitchen Remodels
  - Bathroom Renovations
  - Basement Finishing
  - Home Additions
- Each service includes:
  - Descriptions  
  - Photo Gallery (taggable by style, room type, budget)  
  - Filtering with tags or criteria

#### 2.1.3 Renovation Request Form

- Multi-step form with fields:
  - Service Type  
  - Room Dimensions  
  - Preferred Materials  
  - Design Style Tags  
  - Target Budget  
  - Location  
  - File Uploads (inspiration images, floorplans)  
- Data captured and stored in database
- *Optional (future enhancement):* Integration or placeholder for 3D modeling tool

### 2.2 Business Portal (Renovation Team)

#### 2.2.1 Request Management

- View all incoming renovation requests  
- Commenting system on each request  
- Assign requests to Project Managers (PMs)
- Generate customized quotes and previews

#### 2.2.2 CRM Dashboard

- Customer profiles with contact info  
- Communication history (email log, notes)  
- Scheduling calendar  
- Project/job status tracking  
- Task lists for team members  
- File uploads per project (invoices, contracts)  
- Invoice creation and download  
- *Optional (future enhancement):* Payment processsing

## 3. Solution-level Requirements

- Responsive design  
- Secure file uploads and authentication (HTTPS, token-based or cookies)  
- Scalable backend and modular MVC structure  
- Data validation on client and server side  
- Activity logs for request processing

## 4. System Architecture

### 4.1 Architecture Overview

The system follows a modular, service-oriented architecture designed to support both client-facing (Homeowners) and internal business operations through secure and scalable web applications.

**Primary Components:**

- React Single Page Applications (SPA) for UI  
- ASP.NET MVC RESTful API for business logic  
- PostgreSQL database for data persistence  
- File system for document and media storage  
- JWT-based authentication and authorization

### 4.2 Technology Stack

- **Frontend:** React SPA  
- **Backend:** ASP.NET MVC / Web API (C#) 
- **Database:** PostgreSQL  
- **Authentication:** JSON Web Tokens (JWT)

### 4.3 Database

**Main Tables:**

- Users (Homeowners, Admins)  
- Services  
- Tags  
- Photos
- RenovationRequests  
- Projects  
- Invoices  
- Tasks
- Files  
- Communications

### 4.4 Authentication and Roles

- Role-based access control (Admin, Project Manager, Homeowner)  
- ASP.NET Identity for authentication  
- Authorization filters on controller actions

## 5. UI/UX Wireframes

![Client Home Page](assets/Wireframes_ClientHomePage.png)
![Service Detail Page](assets/Wireframes_ServiceDetailPage.png)
![Admin Dashboard - Request Page](assets/Wireframes_AdminDashboard_RequestPage.png)
![Admin Dashboard - Customers Page](assets/Wireframes_AdminDashboard_CustomersPage.png)
![Admin Dashboard - Customer Details Page](assets/Wireframes_AdminDashboard_CustomerDetailPage.png)

## 6. 3D Room Planning Tool (Optional / Future Phase)

- Embed existing web-based 3D planner (like Planner 5D, Roomstyler) or integrate a custom module via iframe  
- Let users save/export designs with their request

## 7. Deployment Plan

- **Hosting:** Azure or IIS-based Windows hosting  
- **CI/CD:** Manual or GitHub Actions for deployments  
- **Backups:** Daily SQL Server backups

## 8. Timeline (Tentative)

| Phase                | Duration | Description                          |
|----------------------|----------|--------------------------------------|
| Planning & Wireframes| 2 weeks  | Gather assets, finalize pages        |
| Backend Dev          | 1 week   | Setup EF, DB schema                  |
| Frontend Dev         | 1 week   | Build pages & forms                  |
| Admin Panel          | 1 week   | Dashboard, CRM, invoice tools        |
| Testing & QA         | 1 week   | Manual + automated tests             |

## 9. Risks & Assumptions

- 3D tool might require third-party licensing  
- Reference images and file uploads could be large – need file size limits  
- Quote generator logic may grow in complexity

<p align="right">(<a href="#home-renovation-design-document">back to top</a>)</p>