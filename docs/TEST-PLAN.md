# Renovation Station Test Plan

## Overview

This test plan focuses on ensuring the platform functions correctly, meets client requirements, and delivers a seamless experience for homeowners and contractors.

This document covers the scope, components, success and error conditions for a React-based web platform with a back-end service for the ***Renovations by Bob*** company.


## Scope

- **Frontend**: React-based UI for homeowners and contractors.
- **Backend**: RESTful API using a modern backend framework (e.g., Node.js, ASP.NET MVC (C#), PostgreSQL).
- **Authentication**: JWT-based login and registration.

### Out of Scope:

- Performance/load testing (unless explicitly added)
- Third-party services (e.g., Payments)
- 3D Room Planner
- Short message service (SMS) integration


## Stakeholder Roles in Testing

| Role | Main Responsibilities |
|------|-----------------------|
| **Client / Business Owner** | - Approve feature expectations<br>- Provide sample renovation specs or mock data<br>- Review User Acceptance Testing (UAT) feedback<br>- Provide written sign-off |
| **Homeowner Testers** | - Register an account<br>- Browse renovation services<br>- Filter galleries<br>- Submit Request for quote (RFQ)<br>- Enter test results in UAT feedback document |
| **Admin/Staff Testers** | - Access admin dashboard<br>- Assign project managers<br>- Manage RFQ lifecycles<br>- Manage user profiles<br>- Oversee communication logs and calendar tasks<br>- Enter test results in UAT feedback document |
| **Project Manager Testers** | - Log in to portal<br>- Review incoming RFQ<br>- Submit quotes and update project statuses<br>- Enter test results in UAT feedback document |
| **Development Team** | - Support UAT environment<br>- Fix bugs raised in UAT feedback document <br>- Coordinate test deployment |
| **Quality Assurance (QA) Team** | - Prepare and manage test cases<br>- Log and validate bug reports<br>- Ensure critical paths are tested |


### User Role Coverage Matrix

| **Feature / Test Area**      | **Homeowner** | **Project Manager** | **Admin/Staff** |
|-----------------------------|----------------|----------------------|------------------|
| Register/Login              | ✅              | ✅                   | ✅               |
| Browse Renovation Services  | ✅              |                      |                  |
| Submit RFQ   | ✅              |                      |                  |
| View Gallery                | ✅              | ✅                   |                  |
| Assign Project Manager      |                | ✅                   | ✅               |
| Quote Generation            |                | ✅                   | ✅               |
| Communication Log           | ✅              | ✅                   | ✅               |
| Task Calendar Access        |                | ✅                   | ✅               |

## System

### Environment

- Dedicated staging server isolated from production
- Includes demo data and login accounts

### Models

- **Homeowner**: First/Last Name, Address, Contact Info, Account Details
- **Gallery**: Photos, Videos, Renovation Type, Tags
- **RenovationType**: Name (e.g., Kitchen, Bathroom)
- **RequestForQuote**: Room Dimensions, Materials, Budget, Notes, Requestor
- **Project**: Linked RFQ, Status, Assigned Manager, Start Date, End Date
- **CommunicationLog**: Linked to RFQ or Project, contains timestamp, author, message content
- **TaskCalendar**: Task name, assigned user, due date, completion status, linked to a specific project

### Views

- `/register`: Homeowner registration
- `/login`: Homeowner/staff login
- `/profile`: User profile page
- `/services`: Renovation services
- `/gallery`: View past projects
- `/submit-rfq`: RFQ submission
- `/contractor`: Contractor dashboard

### Controllers / Business Logic

- Handle authentication, user management
- Display galleries and services
- Process RFQ
- Manage project workflows


## Sample Test Scenarios

- User Registration
- User Authentication
- Login
- Email confirmation
- Responsive/mobile layout behavior
- Gallery Viewing/Browsing
- RFQ Lifecycle
    - RFQ Submission
    - Comment on RFQ
- Contractor Project Management
    - Project Workflow
    - Assigning Project Managers
    - Invoicing (create/download)


### Sample Test Cases


```
Test Case #1: Responsive Layout Testing

Preconditions:
- Use tools, such as Playwright or browser dev tools

Steps:
1.	Open homepage on desktop, tablet, and mobile resolutions
2.	Navigate through services, gallery, and RFQ form
3.	Interact with inputs, filters, menus

Expected Result:
•	Layout adjusts for screen size
•	No elements overlap or break
•	Navigation remains usable
```

```
Test Case #2: Role Access Restriction for Contractor

Preconditions:
- Contractor account is logged in

Steps:
1. Attempt to access `/admin` role

Expected Result:
- Contractor is redirected or shown “Access Denied”
- No data from admin panel is leaked
```

```
Test Case #3: File Upload Limit Exceeded

Preconditions: 
- User is logged in (homeowner or contractor)
- RFQ or Project File Upload form is available

Steps:
1. Navigate to the file upload section (e.g., RFQ form or document management)
2. Select a file larger than 10MB (e.g., 12MB PDF or image)
3. Attempt to upload the file

Expected Result:
- Upload is rejected
- Clear error message is displayed: "File exceeds the maximum allowed size of 10MB."
- File is not stored or referenced in the database
- No backend exceptions or server crashes
```

```
Test Case #4: Upload Invalid File Type

Preconditions:
- User is logged in
- File upload field is accessible

Steps:
1. Navigate to file upload section
2. Select an `.exe` or `.js` file
3. Attempt to upload

Expected Result:
- Upload is rejected
- Error message:
    “Unsupported file type”
- No file saved or logged
```

```
Test Case #5: Log Communication on RFQ

Preconditions:
- Contractor is logged in
- A RFQ exists

Steps:
1. Navigate to RFQ details page
2. Enter a message in the communication/comment section
3. Submit the message

Expected Result:
- Message appears in communication log with author name and timestamp
- Other users can view the message
- Message is saved in the database and persists on reload
```

```
Test Case #6: Assign Project Manager to RFQ

Preconditions:
- RFQ exists
- contractor or admin logged in

Steps:
1.	Open RFQ
2.	Choose a project manager from dropdown
3.	Save assignment

Expected Result:
•	RFQ updated with assigned PM
•	Assignment shows in RFQ details
```

```
Test Case #7: Orphaned Project Prevention

Preconditions:
- RFQ exists and is linked to a project

Steps:
1. Delete the linked RFQ (if allowed)
2. Check the associated project

Expected Result:
- Either RFQ deletion is prevented or Project is updated to reflect loss
- No foreign key violations
```

```
Test Case #8: Create and View Calendar Task for a Project

Preconditions:
- Admin or Project Manager is logged in
- Project exists with task management enabled

Steps:
1. Go to project details
2. Create a new task with a title, due date, and assignee
3. Save the task
4. Navigate to calendar view

Expected Result:
- Task appears in project task list
- Task is visible on calendar at correct due date
- Assigned user can view the task in their dashboard
```

## Success and Error Conditions

### Overall Success Criteria
- at least 2 homeowners complete full test journey
- At least one contractor submits a quote
- at least 1 contractor user performs end-to-end quote process
- Create and submit at least 1 RFQ
- View filtered galleries
- Upload relevant files

### Database Constraints

- Username: Unique
- Error on duplicates

### API Endpoints

| Endpoint | Expected Results |
|----------|------------------|
| `POST /api/user/register` | 201 Created or 400 Validation Error |
| `POST /api/user/authorize` | 200 JWT or 401 Unauthorized |
| `GET /api/user?id={id}` | 200 OK or 400/401/403/404 errors |

### Frontend Interactions

#### `/login`
- Form sends encoded Authorization header to `/api/user/authorize`
- Errors shown per field or general message

#### `/profile`
- Sends `FormData` with JWT
- Redirect or error based on status codes


## Testing Tools

| Tool | Purpose |
|------|---------|
| **Docker** | Integration environment for services |
| **Jest / React Testing Library** | Unit/component tests |
| **xUnit / NUnit** | Backend (C#) unit tests |
| **Playwright** | End-to-end UI testing |
| **PostgreSQL** | Test database fixtures |

## 🗓️ Testing Timeline

| **Phase** | **Activities** | **Dates** | **Responsible** |
|-----------|----------------|-----------|------------------|
| Unit Testing | Backend and frontend unit/component testing | April 26 – April 30, 2025 | Development Team |
| Integration Testing | API authentication, database relationships | May 1 – May 3, 2025 | Development Team + QA |
| Staging Deployment | Deploy full system with demo data | May 4, 2025 | Development Team |
| User Acceptance Testing (UAT) | Stakeholder user journeys | May 5 – May 10, 2025 | QA + Stakeholders |
| Bug Fix Sprint | Resolve UAT-discovered issues | May 11 – May 14, 2025 | Development Team |
| Final Client Review | Final walkthrough and feedback | May 15 – May 17, 2025 | Client + PM |
| Production Deployment | Launch to production | May 20, 2025 | Development Team |

```
⚠️ Note

Dates in this plan are tentative and may be adjusted as needed based on development progress, stakeholder availability, feedback,
unforeseen issues, or testing outcomes.

Any significant schedule changes will be communicated promptly to all stakeholders.
```

## Risks and Assumptions

| **Risk/Assumption** | **Description** | **Mitigation** |
|---------------------|-----------------|----------------|
| Stakeholder availability | Delays in UAT feedback | Identify backup testers, reminders |
| Demo data issues | Missing or incorrect data | Pre-review and validate staging data |
| API/backend delays | Integration delays | Use mocks, early integration |
| Browser/device compatibility | UI issues on mobile or old browsers | Test on Chrome, Edge, iOS, Android |
| Short fix timeline | Last-minute critical bugs | Buffer days after UAT for bug fixes |

---

##  Test Entry and Exit Criteria

### Entry Criteria

- All critical features deployed to staging
- Demo data populated
- Test users/accounts created
- APIs reachable and authenticated
- Test scenarios approved

### Exit Criteria

- All critical/high bugs resolved or mitigated
- 90%+ test case pass rate
- Core user journeys validated
- Client provides written UAT sign-off
- Go-live checklist reviewed and approved


## ✅ Final Acceptance Criteria

| Criteria Area | Requirements |
|---------------|--------------|
| **Functionality** | - Critical workflows operate without major bugs<br>- Forms validate correctly and submit to backend<br>- Communication logs and calendar tasks function reliably |
| **Usability** | - UI is easy to navigate for clients<br>- Filters, galleries, and quotes are understandable<br>- Calendar and comment interfaces are intuitive |
| **Security** | - Only authorized users access homeowner profiles, RFQ, and communication logs |
| **Performance** | - Pages load within 2 seconds on staging<br>- Uploads and file previews work as expected |
| **Client Sign-off** | - Written approval from client confirming feature readiness and business fit |

---
### Last Update

2025-04-25

### Creation Date

2025-04-18