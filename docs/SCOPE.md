# Project Scope
**Project Title:** Home Renovation Business Website & Online Management System
**Client:** Bo Cen, James Grieve
**Prepared by:** Clarisse Buniel, David Rochefort, Evan Gamble, Xiaojing Shi

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
7. [Timeline (Estimated)](#8-timeline-estimated)
8. [Approval](#9-approval)
</details>

## 1. Project Purpose
To design and develop a comprehensive online platform for a home renovation business. The platform will serve both as a marketing site for homeowners and a project management/CRM tool for the business’s internal team.

## 2. Project Objectives
- Provide a public-facing website where homeowners can:
    - Browse renovation services and project galleries
    - Submit detailed renovation requests
- Offer a secure backend portal for the internal team to:
    - Manage customer requests, project status, and scheduling
    - Generate estimates and quotes
    - Handle invoices, file uploads, and team communication

## 3. In Scope
### 3.1 Client Portal
- Account registration/login for homeowners
- Renovation services listing pages (kitchen, bathroom, basement, additions)
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
- All users will have internet access
- File uploads are limited to images and PDFs under 10MB

## 7. Timeline (Estimated)
| Phase                            | Duration |
| -------------------------------- |:--------:|
| Requirements & Planning          | 1 week   |
| UI/UX & Wireframes               | 1 week   |
| Development (Frontend + Backend) | 2 weeks  |
| Testing & QA                     | 1 week   |
| Deployment & Handover            | 2-3 days |

## 8. Approval
By approving this scope document, the client agrees to the functionalities, boundaries, and deliverables outlined above.

### Last Update
2025-04-17

### Creation Date
2025-04-17

<p align="right">(<a href="#project-scope">back to top</a>)</p>