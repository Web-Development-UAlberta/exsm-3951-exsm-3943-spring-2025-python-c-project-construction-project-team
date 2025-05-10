# Project Scope

- **Project Name:** Renovation Station
- **Client(s):** Bo Cen, James Grieve
- **Prepared by:** Clarisse Buniel, David Rochefort, Evan Gamble, Xiaojing Shi
- **Deadline:** May 21, 2025

<details>
<summary>Table of Contents</summary>

1. [Project Purpose](#1-project-purpose)
2. [Project Objectives](#2-project-objectives)
3. [In Scope](#3-in-scope)

    3.1 [Client Portal](#31-client-portal)

    3.2 [Business Portal](#32-business-portal)

    3.3 [General Features](#33-general-features)
4. [Out of Scope (For Now)](#4-out-of-scope-for-now)
5. [Deliverables](#5-deliverables)
6. [Assumptions](#6-assumptions)
7. [Constraints](#7-constraints)
8. [Timeline (Estimated)](#8-timeline-estimated)
9. [Approval](#9-approval)
</details>

## 1. Project Purpose
To design and develop a comprehensive online platform for a home renovation business. The platform will serve both as a marketing site for homeowners and for the admins/project managers, as a project management and Customer Relationship Management (CRM) tool.

## 2. Project Objectives
- Provide a public-facing website where homeowners can:
    - Browse renovation services and project galleries
    - Submit detailed renovation requests
- Offer a secure backend portal for the internal team to:
    - Manage customer requests, project status, and scheduling.
    - Generate estimates, and quotes.
    - Handle invoices, file uploads, and team communication.

## 3. In Scope
### 3.1 Client Portal
- Account registration/login for homeowners
- Renovation services listing pages (kitchen, bathroom, basement, and home additions)
- Photo galleries for past projects
- Gallery filtering system (e.g., by style, room type, budget)
- Renovation request for quote (RFQ) submission form:
    - Room dimensions, materials, budget, design styles
    - Reference image uploads

### 3.2 Business Portal
- Secure login for staff (admin/project manager roles)
- Dashboard for managing RFQs
- Ability to comment on and assign RFQ
- Generate quotes and send them to homeowners
    - Per-”task” line items
- CRM features:
    - Track communication history
    - Job/project status updates
    - Task and calendar management
        - Most granular - subcontractors
- Invoicing and payment status tracking
- File/document management per customer/project

### 3.3 General Features
- Responsive web design
- Role-based access control
- Secure file uploads
- Basic reporting (e.g., total requests per service type)

## 4. Out of Scope (For Now)
- Online payment gateway integration
- SMS or push notification system
- AI-based quote generation
- Full-featured 3D design module (can be integrated later)
- Mobile app version

## 5. Deliverables
- Fully functional website (public and admin sides)
- PostgreSQL Server database schema and seed data
- Admin dashboard for team use
- All source code delivered via Git or ZIP
- Basic deployment and hosting setup
- *Optional:* User guide for admins

## 6. Assumptions
- Client will provide:
    - Service descriptions and categories
    - Photos for galleries
    - Logo and branding material
- Users will have internet access
- File uploads are limited to images and PDFs under 10MB

## 7. Constraints
- **Time:** Project must be completed no later than May 21, 2025.
- **Client Communication:** Limited client availability for feedback and approvals. A maximum 48-hour response time is expected. Delays in communication and unclear requirements may slow down development.
- **Resource (internal) Availability:** Limited availability of team members or unexpected absences may slow down development.
- **File Upload:** File uploads are limited to images and PDFs under 10MB as specified in the [Assumptions](#6-assumptions) section.


## 8. Timeline (Estimated)
| Phase                            | Duration |
| -------------------------------- |:--------:|
| Requirements & Planning          | 1 week   |
| UI/UX & Wireframes               | 1 week   |
| Development (Frontend + Backend) | 2 weeks  |
| Testing & QA                     | 1 week   |
| Deployment & Handover            | 2-3 days |

## 9. Approval
By approving this scope document, the client agrees to the functionalities, boundaries, and deliverables outlined above.

### Last Update
2025-04-24

### Creation Date
2025-04-17

<p align="right">(<a href="#project-scope">back to top</a>)</p>