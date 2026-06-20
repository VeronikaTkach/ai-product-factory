# NestJS Architecture

## Module Boundaries

Organize modules around business domains.

Good module examples:

- `UsersModule`
- `OrdersModule`
- `BillingModule`
- `AuthModule`

Avoid modules organized only by technical type:

- `ControllersModule`
- `ServicesModule`
- `DtosModule`

## Controllers

Controllers should:

- define HTTP routes
- accept validated DTOs
- call services
- map results to response shapes
- throw HTTP exceptions when needed

Controllers should not:

- contain business workflows
- call Prisma directly
- implement authorization logic inline when a guard/policy abstraction is appropriate
- transform complex domain state deeply

## Services

Services should:

- implement business use cases
- coordinate persistence and domain rules
- expose clear public methods
- use transactions for multi-step writes that must be atomic

Services should not:

- depend on request objects unless necessary
- return transport-specific details
- silently swallow errors

## Providers

Use providers for:

- domain policies
- external clients
- repositories
- mappers
- shared backend utilities

Avoid creating providers that only wrap one line without adding a boundary or test seam.

## DTOs

Use DTOs for:

- request body validation
- query validation
- params validation when needed

Rules:

- use `class-validator` decorators when the project uses Nest validation pipes
- use `class-transformer` for numeric query params and date conversion when needed
- keep DTOs focused on transport input
- do not put business logic in DTOs

## Guards

Use guards for:

- authentication checks
- role checks
- permission checks
- route-level access decisions

Use service-level policy checks when the decision depends on loaded domain data.

## Interceptors and Pipes

Use pipes for:

- validation
- parsing
- transformation at the boundary

Use interceptors for:

- response mapping
- logging
- timing
- cross-cutting concerns

Do not hide business behavior in interceptors.

## Suggested Feature Structure

```text
orders/
  dto/
  guards/
  orders.controller.ts
  orders.module.ts
  orders.service.ts
```

Add repositories, policies, mappers, or tests when the feature needs them.
