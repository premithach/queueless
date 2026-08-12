# QueueLess Project

## Product Requirements Document

## 1. Product Overview

QueueLess is a queue management platform that helps customers avoid unnecessary physical waiting.

Customers can discover a business, select a service, join its queue remotely, and track their queue position and estimated waiting time.

Businesses can create and manage their services and queues and serve customers in order.

### Core Experience

Find → Join → Track → Estimate → Arrive → Serve

## 2. Problem Statement

Customers visiting hospitals, clinics, salons, restaurants, banks, and service centers often have to wait in physical queues.

The biggest problem is not just the queue itself — it is the uncertainty around the waiting time.

For example, a customer may be told:

> "There are 5 people ahead of you."

But this does not tell the customer when they will actually be served.

A doctor may take longer with one patient, a salon service may take longer than expected, or a business may suddenly become busy.

Because of this, customers:

- Don't know when they should arrive.
- Spend unnecessary time waiting at the location.
- Cannot easily plan their time.
- Have to repeatedly check with staff about the queue.
- May leave and risk missing their turn.

## 3. Problem We Are Solving

QueueLess solves the problem of **uncertain waiting time**.

Instead of only showing customers their token number or number of people ahead, QueueLess provides an estimated waiting time based on the current queue and service duration.

The goal is to help customers answer:

> **"When should I come?"**

## 4. Solution

QueueLess digitizes the physical queue and gives customers visibility into their expected waiting time.

### Traditional Experience

Customer arrives
→ Takes token
→ Sees people waiting
→ Waits without knowing how long
→ Keeps checking the queue
→ Gets served

### QueueLess Experience

Customer finds business
→ Selects service
→ Views current queue
→ Sees estimated waiting time
→ Joins the queue
→ Tracks their position
→ Sees updated waiting time
→ Plans when to arrive
→ Gets served

### Example

A customer wants to visit a doctor.

QueueLess shows:

Your Token: #118

Currently Serving: #105

People Ahead: 13

Estimated Wait: ~45 minutes

The customer can plan their time instead of sitting in the waiting room for 45 minutes.

If a doctor takes longer than expected with a patient, or a service takes longer than usual, the estimated waiting time can increase as the queue progresses.

## 5. Target Users

QueueLess has two primary users.

### 5.1 Customer

A person who wants to use a service and avoid unnecessary waiting.

Examples:

- Patient visiting a hospital.
- Customer visiting a salon.
- Customer waiting for a restaurant table.
- Person visiting a bank.
- Customer visiting a service center.

### 5.2 Business / Staff

A business or staff member who manages customers and queues.

Examples:

- Hospital receptionist.
- Salon receptionist.
- Restaurant staff.
- Bank employee.
- Service center employee.

## 6. Customer Features

Customers can:

- Register and log in.
- Discover businesses.
- Search businesses.
- Filter businesses by category.
- Find nearby businesses.
- View business details.
- View available services.
- View current queue status.
- Join a queue.
- Receive a token number.
- Track their queue position.
- View estimated waiting time.
- Leave a queue.
- View previous queue visits.

## 7. Business Features

Businesses can:

- Register and log in.
- Create their business profile.
- Create and manage services.
- Create and manage queues.
- View waiting customers.
- Call the next customer.
- Complete a customer.
- Skip a customer.
- Cancel a customer.
- Pause a queue.
- Resume a queue.
- View queue history.
- View basic queue statistics.

## 8. Business Types

QueueLess is designed as a generic queue management platform.

It should support different types of businesses using the same queue system.

Initial business categories:

- Hospitals
- Clinics
- Salons
- Restaurants
- Banks
- Service Centers

### Example

Hospital:

General Consultation
Dental
Diagnostics

Salon:

Haircut
Hair Color
Facial

Bank:

Cash Counter
Account Services
Loans

The underlying concept remains:

Business
→ Service
→ Queue
→ Customer Token
→ Customer

## 9. Core Customer Flow

Login / Register
↓
Discover Businesses
↓
Search / Filter
↓
Select Business
↓
Select Service
↓
View Queue
↓
Join Queue
↓
Receive Token
↓
Track Queue Position
↓
Approaching Turn
↓
Arrive at Business
↓
Get Served

## 10. Core Business Flow

Login / Register
↓
Create Business
↓
Create Services
↓
Create Queue
↓
Open Queue
↓
Customers Join
↓
View Waiting Customers
↓
Call Next Customer
↓
Serve Customer
↓
Complete / Skip Customer
↓
Continue Queue

## 11. Customer Journey Example

### Without QueueLess

Go to salon
↓
Take token
↓
8 people waiting
↓
Wait at salon
↓
Get haircut

The customer has to physically stay at the salon while waiting.

### With QueueLess

Open QueueLess
↓
Find nearby salon
↓
Select Haircut
↓
8 people waiting
↓
Join queue
↓
Receive token #24
↓
Track queue position
↓
Arrive when turn is approaching
↓
Get haircut

The goal is to reduce unnecessary physical waiting.

## 12. Location-Based Discovery

QueueLess will support location-based business discovery.

Customers can use their location to find businesses that are convenient for them.

Example:

Nearby Businesses

CityCare Hospital
1.2 km
General Consultation
~25 min wait

Style Studio
0.8 km
Haircut
~12 min wait

Spice Garden
2.1 km
~30 min wait

Customers can:

- Use their location.
- Search for businesses.
- Filter by category.
- Sort by distance.
- Compare waiting times.

Location discovery is a supporting feature.

The core product remains queue management.

## 13. Business Details

When a customer selects a business, they should be able to see:

- Business name.
- Business category.
- Location.
- Available services.
- Queue status.
- Number of waiting customers.
- Estimated waiting time.

Example:

CityCare Hospital

General Consultation
12 people waiting
~25 minutes

Dental Consultation
5 people waiting
~15 minutes

## 14. Service Selection

Businesses can provide multiple services.

Example:

CityCare Hospital

General Consultation
Average service time: 15 minutes

Dental Consultation
Average service time: 20 minutes

Diagnostics
Average service time: 10 minutes

The customer selects the service they need before joining its queue.

## 15. Joining a Queue

After selecting a service, the customer can join its queue.

QueueLess generates a token for the customer.

Example:

Current Token: #105

Your Token: #118

People Ahead: 13

Estimated Wait: ~22 minutes

The customer can then leave the physical location and track their queue through QueueLess.

## 16. Queue Information

For every active queue, customers should be able to see:

- Current token.
- Their token.
- People ahead.
- Estimated waiting time.
- Queue status.

Example:

Your Token
#118

Currently Serving
#105

People Ahead
13

Estimated Wait
~22 minutes

The customer should always have a clear understanding of their position.

## 17. Queue Position

As customers are served, the user's position should change.

Example:

13 people ahead
↓
12 people ahead
↓
11 people ahead
↓
10 people ahead
↓
5 people ahead
↓
3 people ahead
↓
Your turn

The customer should not have to repeatedly contact the business to know their position.

## 18. Approaching Turn

When the customer's turn is getting closer, the interface should clearly communicate this.

Example:

You are almost next!

3 people ahead.

Estimated wait:
~5 minutes

When the customer's turn arrives:

It's your turn!

Token #118

Please proceed to the service counter.

## 19. Waiting-Time Estimation

QueueLess will provide an estimated waiting time to help customers plan when to arrive.

The initial calculation will be:

People Ahead × Average Service Time

Example:

People Ahead = 5

Average Service Time = 5 minutes

Estimated Wait = 25 minutes

The estimated waiting time may change as the queue progresses and actual service times vary.

QueueLess will always show this as an estimate, not an exact waiting time.

The calculation can be improved later using actual queue history.

## 20. Queue States

A queue can have three primary states.

### OPEN

Customers can join the queue.

### PAUSED

Existing customers remain in the queue, but new customers cannot join.

### CLOSED

The queue is no longer active and does not accept customers.

Queue state flow:

OPEN
↓
PAUSED
↓
OPEN
↓
CLOSED

## 21. Token States

Each customer token has a lifecycle.

### Normal Flow

WAITING
↓
SERVING
↓
COMPLETED

### Cancelled Flow

WAITING
↓
CANCELLED

### Skipped Flow

WAITING
↓
SKIPPED

Supported token states:

- WAITING
- SERVING
- COMPLETED
- SKIPPED
- CANCELLED

## 22. Business Queue Management

Businesses can manage their active queues.

Example:

CityCare Hospital

General Consultation

Currently Serving
#105

Waiting Customers
13

Estimated Wait
~22 minutes

[Call Next]

When the business calls the next customer:

#105 → COMPLETED

#106 → SERVING

The queue then continues with the next waiting customer.

## 23. Business Queue Actions

Businesses can perform the following actions.

### Call Next

Moves the next waiting customer to SERVING.

### Complete Customer

Marks the current customer as COMPLETED.

### Skip Customer

Skips a customer who is unavailable.

### Cancel Customer

Cancels a customer's token.

### Pause Queue

Temporarily prevents new customers from joining.

### Resume Queue

Allows customers to join again.

## 24. Queue History

QueueLess will maintain queue history.

Example:

Date       Service                 Token    Status

12 Aug     General Consultation    #101     COMPLETED
12 Aug     General Consultation    #102     COMPLETED
12 Aug     General Consultation    #103     CANCELLED

Customers can use history to view previous queue visits.

Businesses can use history to understand previous queue activity.

## 25. Basic Business Statistics

Businesses can view basic queue statistics.

Initial statistics may include:

- Total customers served.
- Average waiting time.
- Average service time.
- Number of cancelled tokens.
- Number of skipped tokens.
- Queue volume.
- Service-wise queue volume.

Statistics are secondary to the core queue management experience.

## 26. MVP Scope

The first version of QueueLess will focus on the core queue-management problem.

### Customer MVP

- Authentication.
- Business discovery.
- Location-based discovery.
- Search.
- Category filtering.
- Business details.
- Service selection.
- Queue viewing.
- Joining a queue.
- Token generation.
- Queue position.
- Estimated waiting time.
- Leaving a queue.
- Queue history.

### Business MVP

- Authentication.
- Business creation.
- Service management.
- Queue management.
- Customer management.
- Call next.
- Complete customer.
- Skip/cancel customer.
- Pause/resume queue.
- Queue history.
- Basic statistics.

## 27. Technology Stack

QueueLess will use only the following technologies:

- React
- TypeScript
- Node.js
- MySQL

The project will intentionally keep the technology stack simple and focused.

## 28. High-Level Architecture

QueueLess will have three main parts:

Customer / Business
↓
React + TypeScript
↓
Node.js
↓
MySQL

Detailed frontend, backend, and database architecture will be documented separately.

## 29. MVP Success Criteria

### Customer

The MVP is successful when a customer can:

Find a business
↓
Select a service
↓
View the queue
↓
Join the queue
↓
Receive a token
↓
Track their position
↓
Know their estimated wait

### Business

The MVP is successful when a business can:

Create a service
↓
Create a queue
↓
Accept customers
↓
View waiting customers
↓
Call the next customer
↓
Complete / skip customer
↓
Continue managing the queue

Both flows must work using real data stored in MySQL.

## 30. Product Goal

### Primary Goal

Reduce unnecessary physical waiting for customers while giving businesses a simple way to manage their queues.

### Core Experience

Find
  ↓
Join
  ↓
Track
  ↓
Estimate
  ↓
Arrive
  ↓
Serve

## 31. Product Principles

### 1. Solve a real problem

Every feature should have a clear purpose related to reducing waiting or improving queue management.

### 2. Keep the experience simple

Customers should immediately understand:

- Where they are.
- How many people are ahead.
- How long they may wait.
- When they should arrive.

### 3. Build for different businesses

The queue system should work for hospitals, salons, restaurants, banks, and other service businesses without creating completely different systems.

### 4. Focus on the core product

The primary experience is:

Find → Join → Track → Estimate → Arrive → Serve

Additional features should not make this flow complicated.

### 5. Build incrementally

We will first build the core MVP and improve it as we develop the product.

## 32. Out of Scope for the First Version

The following features are intentionally not part of the initial MVP:

- Payments.
- Medical records.
- Video consultations.
- Food ordering.
- SMS integration.
- Mobile application.
- Advanced appointment scheduling.
- Advanced maps.
- AI-based predictions.
- Business subscription management.

These features can be considered later if they become necessary.

## 33. Final Product Vision

QueueLess aims to change the experience from:

"I have to wait here until my number comes."

to:

"I know my place in the queue, I know approximately how long I'll wait, and I can decide when to arrive."

For businesses:

"I can digitally manage my queue and understand how customers move through my services."

### QueueLess

Less physical waiting.
Better queue visibility.
Simpler queue management.