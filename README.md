# Event Check-In and Attendance System

A Node.js command-line application for managing events and attendee check-ins, with support for multiple storage backends, input validation, and automated testing.

## Features

-Create events with unique ID, name, and date
-Register attendees with unique email addresses and names
-Check-in attendees with validation (prevents double check-ins)
-Generate attendance reports (JSON output to console)
-Input normalization: trims whitespace, lowercases emails, validates formats
-Supports in-memory and file-based storage

## Getting Started

### Prerequisites

- Node.js (>=14)

### Install

```bash
npm install
```

### Running the application

```bash
npm start
```

The CLI prompt supports the following commands:
- `create <id> <name> <date>`  — `name` may be multiple words (e.g. `Event One`).
- `register <eventId> <email> <name>` — `name` may be multiple words (e.g. `John Doe`).
- `checkin <eventId> <email>`
- `report <eventId>`  — returns a JSON object containing `eventName`, `totalRegistered`, `totalCheckedIn`, and an array of `checkedInAttendees`.
- `exit`

Notes:
- Inputs are trimmed. Emails are lowercased and validated. Empty or whitespace-only names/emails are rejected.

### Running tests

```bash
npm test
```

This runs both unit and integration tests via Jest. The test suite includes cases for input trimming, email normalization, and storage lookup behavior.

### Example CLI session

```text
$ npm start
Event Check-In System
Commands: create, register, checkin, report, exit
> create 1 Event One 2026-01-01
Created { id: '1', name: 'Event One', date: '2026-01-01', attendees: [] }

> register 1  ALICE@Example.COM   Alice Smith  
Registered { email: 'alice@example.com', name: 'Alice Smith', checkedIn: false }

> register 1 bob@example.com Bob
Registered { email: 'bob@example.com', name: 'Bob', checkedIn: false }

> checkin 1 alice@example.com
Checked in { email: 'alice@example.com', name: 'Alice Smith', checkedIn: true }

> report 1
{
  "eventName": "Event One",
  "totalRegistered": 2,
  "totalCheckedIn": 1,
  "checkedInAttendees": [
    { "email": "alice@example.com", "name": "Alice Smith", "checkedIn": true }
  ]
}

> exit
```

## Continuous Integration

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs on push and pull requests to install dependencies and run all tests.

## Repository Structure

```
├─ src/                        # Source code
│   ├─ services/               # Business logic split by responsibility
│   │   ├─ EventService.js
│   │   ├─ RegistrationService.js
│   │   ├─ CheckInService.js
│   │   └─ ReportService.js
│   │
│   ├─ storage/                # Data persistence abstractions
│   │   ├─ InMemoryStorage.js  # includes findAttendee
│   │   └─ FileStorage.js      # includes findAttendee
│   │
│   ├─ EventManager.js         # Wrapper combining services
│   └─ cli.js                  # CLI interface (supports multi-word names)
│
├─ tests/
│   ├─ unit/                   # Unit tests with fake/mock storage
│   │   ├─ EventManager.test.js
│   │   └─ RegistrationService.test.js
│   │
│   └─ integration/            # Integration tests with real persistence (FileStorage)
│       ├─ EventManager.integration.test.js
│       └─ Workflow.integration.test.js
│
├─ .github/
│   └─ workflows/
│       └─ ci.yml              # GitHub Actions workflow
│
├─ package.json
├─ package-lock.json
└─ README.md


