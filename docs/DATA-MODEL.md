
# Data Entities

## Client
An entity capturing the client information
Linked to authentication
- Name, contact info
- Billing address

### Create
Created when a user registers with the site

### Update
Clients can update their profiles

---

## RFQ
*(Request for Quote)*
An entity that contains information on the client's request for renovations:
- Links to uploaded images elsewhere in the solution
- A link to the "Client" entity
- RFQ parameters (size, service, location, etc)
- Metadata (Date entered)
- State

### Create
Created by a client user through web form

### Read
Client users need to be able to see their RFQ info and status
Project manager users need to be able to review all open RFQs

### Update
Project manager users need to be able to accept or reject RFQs.
"Closed" when project is quoted

---

## Project
Primary data entity for the solution
Contains:
- Link to RFQ
- Link to Client
- Links to Services
- Schedule Info
- Client Approval Info
- Client Invoice Info
- Links to pictures of the finished work
- Work tags (bathroom, kitchen, etc)
- Status
- Bool to display in portfolio

### Create
Created by Project Manager based on an RFQ

### Read
Projects that are complete and marked for display should be displayed on the public site
Project Managers should be able to review open projects
Clients should be able to review some info from their projects (total costs, schedule, status)

### Update
Project Managers (PMs) will add services to the project as part of the quoting process
Once the quote is complete, PMs can set the project status to "pending approval" for client review
Clients will approve or decline a "pending approval" project
Project Managers keep the schedule up to date as the project enters active construction
Project Managers can close the project and set whether or not the completed project should be shown in the portfolio

---

## Services
Represents a billed service or material delivered as part of the renovation
Supplier may be a subcontractor providing a service or a material supplier
Supplier might not be set during the quoting phase
Contains:
- Link to the Project
- Link to the Supplier entity
- Info (Name and description)
- Service Type
- Quote Price
- Quote Start Date
- Quote End Date
- Link to Invoices
- Actual Start Date
- Actual End Date

### Create
Created by Project Managers during the quote process

### Read
Project Managers and clients can view services in the context of their projects

### Update
Project Managers can update with actual start and end dates after project starts

---

## Service Type
List of the various service type
Kept as entities to allow for easy expansion
Contains:
- Names
Ex Material - Countertops or Service - Plumbing

### Create
Project Managers can create?

### Read
Used by quoting form

---

## Supplier
Captures information on where a service comes from
Contains:
- Name, contact info
- Billing address
- Link to Service Types provided

### Create
Project Managers can create

### Read
Used by quoting form

---

## Supplier Invoice
Payment requests for a service from suppliers
Contains
- Link to supplier
- Link to service
- Value
- Info (payment terms, etc)

### Create
Project Managers can create

### Read
Used by active project view

---

## Client Invoice
Payment requests for a service from suppliers
Contains
- Link to supplier
- Link to service
- Value
- Info (payment terms, etc)

### Create
Project Managers can create

### Read
Used by active project view
Clients should have a page