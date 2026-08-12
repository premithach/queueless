# QueueLess — Frontend Documentation

## 1. Frontend Overview

QueueLess frontend is built with **React.js and TypeScript**.

The frontend provides two main experiences:

- Customer experience
- Business experience

The main focus is to provide a simple, responsive, and easy-to-use interface for managing and tracking queues.

## 2. Technology

```text
React.js
TypeScript
```

The frontend communicates with the Node.js backend through REST APIs.

```text
React + TypeScript
        ↓
      REST API
        ↓
      Node.js
```

## 3. User Roles

QueueLess has two frontend experiences.

### Customer

Customers can:

- Discover businesses
- Search and filter businesses
- View business details
- View available services
- View queue information
- Join a queue
- View their token
- Track queue position
- View estimated waiting time
- Leave a queue
- View queue history

### Business

Business users can:

- View business dashboard
- Manage services
- View queues
- View waiting customers
- Call the next customer
- Complete customers
- Skip customers
- Cancel customers
- Pause and resume queues
- View queue history

## 4. Application Structure

The frontend will be organized into:

```text
src/
│
├── components/
├── pages/
├── layouts/
├── hooks/
├── services/
├── store/
├── types/
├── utils/
└── assets/
```

### Components

Reusable UI components.

Examples:

```text
Button
Input
Modal
Card
Badge
Loader
EmptyState
ErrorState
```

### Pages

Application-level screens.

Examples:

```text
Login
Register
BusinessDiscovery
BusinessDetails
QueueDetails
QueueHistory
BusinessDashboard
QueueManagement
```

### Layouts

Shared page layouts.

Examples:

```text
CustomerLayout
BusinessLayout
AuthLayout
```

### Hooks

Reusable React logic.

Examples:

```text
useAuth
useQueue
useDebounce
```

### Services

API communication.

Examples:

```text
authService
businessService
serviceService
queueService
tokenService
```

### Store

Global application state.

The store will manage state that needs to be shared across multiple components or pages.

### Types

Shared TypeScript types and interfaces.

Examples:

```text
User
Business
Service
Queue
QueueToken
```

### Utils

Reusable helper functions.

Examples:

```text
formatTime
calculatePosition
formatDistance
```

## 5. Main Customer Flow

```text
Login
  ↓
Discover Businesses
  ↓
Select Business
  ↓
View Services
  ↓
Select Service
  ↓
View Queue
  ↓
Join Queue
  ↓
View Token
  ↓
Track Queue
  ↓
View Estimated Wait
  ↓
Get Served
```

## 6. Business Flow

```text
Login
  ↓
Business Dashboard
  ↓
Select Queue
  ↓
View Waiting Customers
  ↓
Call Next
  ↓
Customer is SERVING
  ↓
Complete / Skip
```

## 7. Main Customer Pages

### Login

Allows users to log into QueueLess.

### Register

Allows users to create an account.

### Business Discovery

Customers can:

- Search businesses
- Filter by category
- View nearby businesses
- View queue information

Example:

```text
CityCare Hospital
General Consultation

Estimated Wait: ~20 min
Distance: 1.2 km
```

### Business Details

Displays:

- Business information
- Available services
- Queue status
- Estimated waiting time

### Queue Details

Displays:

```text
Your Token: #118

Currently Serving: #105

People Ahead: 12

Estimated Wait: ~60 minutes
```

The queue information should update as the queue progresses.

### Queue History

Displays the customer's previous queue visits.

## 8. Main Business Pages

### Business Dashboard

Provides an overview of:

- Active queues
- Waiting customers
- Current serving customer
- Queue status

### Queue Management

Allows business users to:

- View waiting customers
- Call next customer
- Complete customer
- Skip customer
- Cancel customer
- Pause queue
- Resume queue

Example:

```text
Current Token: #105

Waiting:

#106
#107
#108

[ Call Next ]
```

### Queue History

Displays previously served, skipped, and cancelled customers.

## 9. State Management

The frontend will have different types of state.

### Local UI State

Used for state specific to a component.

Examples:

```text
Modal open/close
Dropdown state
Form input
Selected filter
```

React state will be used for these cases.

### Global State

Used when multiple parts of the application need the same state.

Examples:

```text
Authenticated user
User role
Selected business
Queue information
```

Redux Toolkit can be used for shared application state.

### Server State

Data received from backend APIs.

Examples:

```text
Businesses
Services
Queues
Queue Tokens
Queue History
```

API-related state should be handled separately from purely local UI state.

## 10. API Integration

The frontend communicates with the backend through REST APIs.

Example:

```text
React Component
      ↓
Service / API Layer
      ↓
Node.js API
      ↓
MySQL
```

Example API services:

```text
authService
businessService
serviceService
queueService
tokenService
```

Components should not contain direct API implementation.

## 11. Queue State

The frontend needs to represent different queue states.

### Queue

```text
OPEN
PAUSED
CLOSED
```

### Token

```text
WAITING
SERVING
COMPLETED
SKIPPED
CANCELLED
```

The UI should display the appropriate interface based on the current state.

## 12. Queue Tracking UI

The queue tracking screen is one of the main features of QueueLess.

Example:

```text
--------------------------------
       Your Queue Status
--------------------------------

Your Token

       #118

Currently Serving

       #105

People Ahead

        12

Estimated Wait

       ~60 min

--------------------------------

        Leave Queue
--------------------------------
```

The UI should clearly communicate:

- Current token
- Current serving token
- People ahead
- Estimated waiting time
- Queue status

## 13. Loading States

Every API-driven screen should handle loading states.

Examples:

```text
Loading businesses...
Loading services...
Loading queue...
Joining queue...
Updating queue...
```

The UI should use appropriate loading indicators or skeletons.

## 14. Error States

The frontend should handle API and UI errors clearly.

Examples:

```text
Unable to load businesses.

Unable to load queue.

Unable to join queue.

Something went wrong.
```

The user should always receive a clear message and an appropriate action where possible.

Example:

```text
Unable to load queue.

[ Try Again ]
```

## 15. Empty States

The frontend should handle cases where there is no data.

Examples:

```text
No businesses found.

No services available.

No customers waiting.

No queue history.
```

Empty states should explain what happened instead of showing a blank screen.

## 16. Forms and Validation

Forms should provide client-side validation before sending data to the backend.

Examples:

### Login

```text
Email
Password
```

### Business

```text
Business Name
Category
Address
```

### Service

```text
Service Name
Description
Average Service Time
```

Validation should provide clear feedback to the user.

## 17. Search and Filtering

Business discovery will support:

- Search by business name
- Filter by category
- Location-based discovery
- Sorting by distance
- Viewing queue/wait information

Example:

```text
Search: Hospital

Filters:
[ Hospital ]
[ Clinic ]
[ Salon ]

Sort:
Nearest
Shortest Wait
```

Search input can use debouncing to avoid unnecessary API requests.

## 18. Responsive Design

QueueLess should work across:

```text
Mobile
Tablet
Desktop
```

The customer experience should be especially optimized for mobile because customers may use QueueLess while travelling to a business.

The business dashboard should work well on desktop and tablet screens.

The UI should use responsive layouts rather than creating separate applications for different screen sizes.

## 19. Reusable Components

Common UI elements should be built as reusable components.

Examples:

```text
BusinessCard
ServiceCard
QueueCard
TokenCard
QueuePosition
WaitTime
StatusBadge
SearchBar
FilterPanel
Modal
Button
Input
Loader
EmptyState
ErrorState
```

Reusable components should receive data through props and avoid containing unnecessary business-specific logic.

## 20. TypeScript

TypeScript will be used to define the structure of application data.

Example:

```text
User
Business
Service
Queue
QueueToken
```

This helps keep API responses, component props, and application state type-safe.

## 21. Performance

The frontend should avoid unnecessary rendering and API requests.

Where appropriate, we can use:

```text
React.memo
useMemo
useCallback
Lazy Loading
Debouncing
```

Performance optimizations should be added only where they provide a real benefit.

## 22. Frontend Testing

Important frontend functionality should have tests.

Examples:

```text
Login
Business search
Queue joining
Queue position
Waiting-time display
Queue actions
Form validation
Error handling
```

Tests should cover:

- Happy paths
- Edge cases
- Error states

## 23. Accessibility

The frontend should follow basic accessibility practices.

Examples:

- Semantic HTML
- Keyboard navigation
- Accessible form labels
- Proper button usage
- Meaningful error messages
- Appropriate focus states
- Sufficient text readability

## 24. Frontend Architecture Goal

The frontend should be:

- Reusable
- Maintainable
- Responsive
- Type-safe
- Performant
- Accessible
- Easy to understand

The main goal is to build a production-style React application that provides a smooth queue experience for both customers and businesses.