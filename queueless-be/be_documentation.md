# QueueLess — Backend Documentation

## 1. Backend Overview

QueueLess uses **Node.js** to provide APIs for the frontend and handle the application's business logic.

The backend is responsible for:

- User authentication
- Business management
- Service management
- Queue management
- Customer queue operations
- Queue position calculation
- Waiting-time estimation
- Database communication

The backend communicates with the MySQL database.

## 2. Technology

```text
Node.js
MySQL
REST APIs
```

The frontend communicates with the backend using REST APIs.

```text
React + TypeScript
        ↓
    REST APIs
        ↓
      Node.js
        ↓
       MySQL
```

## 3. Backend Responsibilities

### Authentication

The backend handles:

- User registration
- User login
- User authentication
- User roles

Roles:

```text
CUSTOMER
BUSINESS
```

### Business

The backend handles:

- Create business
- View business
- Update business
- Discover businesses
- Search businesses
- Filter businesses

### Services

The backend handles:

- Create service
- View services
- Update service
- Delete service

### Queues

The backend handles:

- Create queue
- View queue
- Open queue
- Pause queue
- Close queue
- View waiting customers
- Call next customer
- Complete customer
- Skip customer

### Customer Tokens

The backend handles:

- Join queue
- View token
- View queue position
- Leave queue
- View queue history

## 4. API Structure

The APIs are organized around the main resources:

```text
/auth
/businesses
/services
/queues
/tokens
```

## 5. Authentication APIs

### Register

```text
POST /auth/register
```

Creates a new customer or business user.

### Login

```text
POST /auth/login
```

Authenticates the user and returns authentication information.

## 6. Business APIs

### Get Businesses

```text
GET /businesses
```

Returns available businesses.

Used for:

- Business discovery
- Search
- Filtering
- Nearby businesses

### Get Business

```text
GET /businesses/:id
```

Returns details of a specific business.

### Create Business

```text
POST /businesses
```

Creates a new business.

### Update Business

```text
PATCH /businesses/:id
```

Updates business information.

## 7. Service APIs

### Get Services

```text
GET /businesses/:businessId/services
```

Returns services provided by a business.

### Create Service

```text
POST /businesses/:businessId/services
```

Creates a service.

### Update Service

```text
PATCH /services/:id
```

Updates a service.

### Delete Service

```text
DELETE /services/:id
```

Deletes a service.

## 8. Queue APIs

### Get Queue

```text
GET /queues/:id
```

Returns:

- Queue status
- Current token
- Waiting customers
- Queue information

### Create Queue

```text
POST /services/:serviceId/queue
```

Creates a queue for a service.

### Pause Queue

```text
PATCH /queues/:id/pause
```

Pauses the queue.

### Resume Queue

```text
PATCH /queues/:id/resume
```

Resumes the queue.

### Close Queue

```text
PATCH /queues/:id/close
```

Closes the queue.

## 9. Customer Queue APIs

### Join Queue

```text
POST /queues/:id/join
```

Creates a queue token for the customer.

Example:

```text
Token: #118
Status: WAITING
```

### Get Token

```text
GET /tokens/:id
```

Returns token information.

### Leave Queue

```text
PATCH /tokens/:id/cancel
```

Cancels the customer's queue token.

### Queue History

```text
GET /users/:userId/tokens
```

Returns the customer's previous queue visits.

## 10. Business Queue Operations

Business users can manage customers in their queue.

### Call Next Customer

```text
POST /queues/:id/next
```

Moves the next waiting customer to:

```text
SERVING
```

### Complete Customer

```text
PATCH /tokens/:id/complete
```

Marks the customer as:

```text
COMPLETED
```

### Skip Customer

```text
PATCH /tokens/:id/skip
```

Marks the customer as:

```text
SKIPPED
```

## 11. Queue Position

The backend calculates the customer's current queue position.

Example:

```text
#101 → COMPLETED
#102 → COMPLETED
#103 → SERVING
#104 → WAITING
#105 → WAITING
#106 → WAITING
```

For customer `#106`:

```text
People Ahead = 2
```

The backend returns this information to the frontend.

## 12. Waiting-Time Estimation

The backend calculates the estimated waiting time using:

```text
People Ahead × Average Service Time
```

Example:

```text
People Ahead = 5

Average Service Time = 10 minutes

Estimated Wait = 50 minutes
```

The backend returns the estimated waiting time to the frontend.

The frontend displays it as:

```text
Estimated Wait: ~50 minutes
```

The value is an estimate and can change as the queue progresses.

## 13. Queue State Changes

### Queue

```text
OPEN
 ↓
PAUSED
 ↓
OPEN
 ↓
CLOSED
```

### Token

```text
WAITING
   ↓
SERVING
   ↓
COMPLETED
```

Other possible token states:

```text
WAITING → SKIPPED

WAITING → CANCELLED
```

The backend is responsible for validating these state changes.

## 14. Basic Validation

The backend validates important operations.

Examples:

### Joining a Queue

A customer can join only if:

```text
Queue status = OPEN
```

### Calling Next Customer

The backend finds the next customer with:

```text
status = WAITING
```

### Completing Customer

Only a customer currently in:

```text
SERVING
```

can be completed.

### Cancelling Customer

A customer can leave an active queue by cancelling their token.

## 15. Error Handling

The backend returns appropriate responses when an operation fails.

Examples:

```text
400 → Invalid request
401 → Not authenticated
403 → Not authorized
404 → Resource not found
409 → Operation conflicts with current state
500 → Server error
```

The frontend uses these responses to display appropriate error states.

## 16. Backend Flow

### Customer

```text
Customer
   ↓
Login
   ↓
Discover Business
   ↓
Select Service
   ↓
View Queue
   ↓
Join Queue
   ↓
Receive Token
   ↓
Track Position
   ↓
View Estimated Wait
   ↓
Get Served
```

### Business

```text
Business User
      ↓
Login
      ↓
Select Business
      ↓
View Queue
      ↓
View Waiting Customers
      ↓
Call Next
      ↓
Serve Customer
      ↓
Complete / Skip
```

## 17. Backend and Database

The backend communicates with MySQL to read and update application data.

```text
React + TypeScript
        ↓
      Node.js
        ↓
       MySQL
```

Example:

```text
Customer joins queue
        ↓
POST /queues/:id/join
        ↓
Node.js
        ↓
Create queue_token
        ↓
MySQL
        ↓
Return token
        ↓
React
```

# QueueLess API Documentation

## API Endpoints

| # | Method | Endpoint | Access | Purpose |
|---|---|---|---|---|
| 1 | `POST` | `/auth/register` | Public | Register a new customer |
| 2 | `POST` | `/auth/register-business` | Public | Register a business and business user |
| 3 | `POST` | `/auth/login` | Public | Login for customers and businesses and receive an authentication token |
| 4 | `GET` | `/businesses` | Public | Get all businesses |
| 5 | `GET` | `/businesses/search?search_term={term}` | Public | Search businesses by search term |
| 6 | `GET` | `/businesses?category={category}` | Public | Filter businesses by category |
| 7 | `GET` | `/businesses/nearby?latitude={lat}&longitude={lng}&radius={km}` | Public | Find businesses within a specified radius |
| 8 | `GET` | `/businesses/:id` | Public | Get details of a specific business |
| 9 | `GET` | `/businesses/:id/services` | Public | Get all services offered by a business |
| 10 | `POST` | `/businesses/:id/services` | Business | Create a new service |
| 11 | `PATCH` | `/services/:id` | Business | Update an existing service |
| 12 | `DELETE` | `/services/:id` | Business | Delete a service |
| 13 | `POST` | `/services/:id/queue` | Business | Create a queue for a service |
| 14 | `PATCH` | `/queues/:id` | Business | Open, pause, resume, or close a queue |
| 15 | `POST` | `/queues/:id/join` | Customer | Join an open queue and receive a token number |
| 16 | `GET` | `/users/me/queue-history` | Customer | View the customer's previous queue visits |
| 17 | `POST` | `/tokens/:id/cancel` | Customer | Leave or cancel the customer's own queue token |
| 18 | `GET` | `/queues/:queueId/tokens/:tokenId/status` | Public | Get token status, people ahead, and estimated waiting time |
| 19 | `GET` | `/queues/:id/tokens` | Business | View customers and tokens in a queue |
| 20 | `POST` | `/queues/:id/next` | Business | Call the next waiting customer |
| 21 | `POST` | `/queues/:id/complete` | Business | Mark the currently served customer as completed |
| 22 | `POST` | `/queues/:id/skip` | Business | Skip the currently served customer |
| 23 | `POST` | `/queues/:id/cancel` | Business | Cancel the currently served customer |
| 24 | `GET` | `/queues/:id/history` | Business | View historical customers and queue activity |
| 25 | `GET` | `/queues/:id/statistics` | Business | Get queue statistics including total, completed, skipped, cancelled, average wait time, and average service time |

## Authentication

| Access | Authorization |
|---|---|
| Public | No authentication required |
| Customer | `Authorization: Bearer <customer_token>` |
| Business | `Authorization: Bearer <business_token>` |

## Queue Statuses

| Status | Meaning |
|---|---|
| `OPEN` | Customers can join the queue |
| `PAUSED` | Queue is temporarily paused |
| `CLOSED` | Queue is closed |

## Token Statuses

| Status | Meaning |
|---|---|
| `WAITING` | Customer is waiting in the queue |
| `SERVING` | Customer is currently being served |
| `COMPLETED` | Service has been completed |
| `SKIPPED` | Customer was skipped |
| `CANCELLED` | Token was cancelled by the customer or business |