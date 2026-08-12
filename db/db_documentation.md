# QueueLess — Database Documentation

## 1. Database

QueueLess uses **MySQL** to store users, businesses, services, queues, and customer tokens.

The database contains 5 main tables:

```text
users
businesses
services
queues
queue_tokens
```

## 2. Tables

### users

Stores all QueueLess users.

```text
id
name
email
password
role
business_id
created_at
updated_at
```

Roles:

```text
CUSTOMER
BUSINESS
```

- `CUSTOMER` uses QueueLess to join and track queues.
- `BUSINESS` manages a business and its queues.
- `business_id` is used for business users and is `NULL` for customers.

---

### businesses

Stores information about businesses.

```text
id
name
category
address
latitude
longitude
created_at
updated_at
```

Examples:

```text
Hospital
Clinic
Salon
Restaurant
Bank
```

`latitude` and `longitude` are used for nearby business discovery.

### services

Stores services provided by businesses.

```text
id
business_id
name
description
average_service_time
created_at
updated_at
```

Example:

```text
CityCare Hospital
    ├── General Consultation
    ├── Dental Consultation
    └── Diagnostics
```

`average_service_time` is used to estimate customer waiting time.

### queues

Stores queues for services.

```text
id
business_id
service_id
status
current_token
created_at
updated_at
```

Queue status:

```text
OPEN
PAUSED
CLOSED
```

- `OPEN` → Customers can join.
- `PAUSED` → Existing customers remain, but new customers cannot join.
- `CLOSED` → Queue is no longer active.

### queue_tokens

Stores customers who join a queue.

```text
id
queue_id
user_id
token_number
status
joined_at
called_at
completed_at
created_at
updated_at
```

Token status:

```text
WAITING
SERVING
COMPLETED
SKIPPED
CANCELLED
```

Normal flow:

```text
WAITING → SERVING → COMPLETED
```

Other flows:

```text
WAITING → SKIPPED
WAITING → CANCELLED
```

## 3. Database Relationships

```text
Business
   ↓
Service
   ↓
Queue
   ↓
Queue Token
   ↓
Customer
```

Business user:

```text
Business User
      ↓
   Business
```



### Foreign Keys

```text
users.business_id
        ↓
businesses.id

services.business_id
        ↓
businesses.id

queues.business_id
        ↓
businesses.id

queues.service_id
        ↓
services.id

queue_tokens.queue_id
        ↓
queues.id

queue_tokens.user_id
        ↓
users.id
```

## 4. Queue Example

```text
CityCare Hospital
       ↓
General Consultation
       ↓
General Consultation Queue
       ↓
#101 → COMPLETED
#102 → COMPLETED
#103 → SERVING
#104 → WAITING
#105 → WAITING
```

For customer `#105`:

```text
People Ahead = 1
```

If the average service time is 10 minutes:

```text
Estimated Wait
= People Ahead × Average Service Time

= 1 × 10
= ~10 minutes
```

The waiting time is always an **estimate** and can change as the queue progresses.

## 5. Queue History

A separate history table is not required.

Completed, skipped, and cancelled tokens remain in `queue_tokens`.

This allows us to show:

- Customer queue history
- Business queue history
- Basic queue statistics

