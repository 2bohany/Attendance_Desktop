# MVC Architecture

## Overview

The backend follows an MVC-inspired architecture adapted for NestJS REST/API:

```text
Request
   ↓
Controller    ← Receives HTTP requests, validates DTOs, returns responses
   ↓
Service       ← Business logic, application rules, coordinates repositories
   ↓
Repository    ← Database operations, Prisma queries, data persistence
   ↓
PrismaService ← Single PrismaClient instance (NestJS DI)
   ↓
SQLite
```

## Layer Responsibilities

### Controller

- Receives and routes HTTP requests
- Validates input via DTOs and global ValidationPipe
- Delegates to services
- Returns structured HTTP responses

**Must NOT contain:** Business logic, database queries, Prisma imports.

### Service

- Implements business logic and application rules
- Coordinates one or more repositories
- Handles domain-level validation

**Must NOT contain:** Direct Prisma queries, HTTP response formatting.

### Repository

- Encapsulates all database operations for a domain
- Uses injected `PrismaService` for queries
- Returns domain data to services

**Must NOT contain:** Business logic, HTTP concerns.

### Model

Represented through:

- **Prisma models** — Database schema (`schema.prisma`)
- **DTOs** — Request/response validation (class-validator)
- **Shared types** — Cross-layer type definitions (`@attendance/shared`)

## Example: Health Module

```text
modules/health/
├── health.controller.ts   # GET /api/health
├── health.service.ts      # Orchestrates health check logic
├── health.repository.ts   # prisma.ping() database check
└── health.module.ts       # Wires DI: Controller → Service → Repository
```

### Flow

1. `HealthController.check()` receives GET request
2. Calls `HealthService.check()`
3. Service calls `HealthRepository.checkConnection()`
4. Repository uses injected `PrismaService.ping()`
5. Result flows back up the chain as `HealthCheckResponse`

## Module Placeholders

Future business modules are registered in `app.module.ts`:

```text
modules/
├── auth/         # Phase: Authentication
├── users/        # Phase: User management
├── employees/    # Phase: Employee records
├── attendance/   # Phase: Attendance tracking
├── leaves/       # Phase: Leave management
├── holidays/     # Phase: Holiday calendar
├── reports/      # Phase: Reporting
├── settings/     # Phase: App settings
└── backup/       # Phase: Backup/restore
```

Each module will follow the same Controller → Service → Repository pattern.

## NestJS Dependency Injection

All layers use NestJS constructor injection:

```typescript
@Injectable()
export class HealthRepository {
  constructor(private readonly prisma: PrismaService) {}
}

@Injectable()
export class HealthService {
  constructor(private readonly healthRepository: HealthRepository) {}
}

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}
}
```

## Error Handling

A global `AllExceptionsFilter` catches all unhandled exceptions and returns structured JSON responses without exposing stack traces to clients.

## Validation

Global `ValidationPipe` with `whitelist: true` and `forbidNonWhitelisted: true` ensures only declared DTO properties are accepted.
