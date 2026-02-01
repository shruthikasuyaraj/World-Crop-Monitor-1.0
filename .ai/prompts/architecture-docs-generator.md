# Architecture Documentation Generator Prompt

## Purpose
Generate comprehensive architecture documentation including system overview, component diagrams, sequence diagrams, and data flow documentation using Mermaid diagrams.

## Instructions for AI Agent

Generate architecture documentation with the following structure. Use Mermaid for all diagrams except block architecture diagrams (which may use external tools like Miro).

---

## Architecture Documentation Template

### File: `docs/architecture/README.md`

```markdown
# Architecture Documentation

## Overview

This directory contains the architecture documentation for [PROJECT_NAME].

## Documents

| Document | Description |
|----------|-------------|
| [overview.md](overview.md) | High-level system architecture |
| [components.md](components.md) | Component descriptions and responsibilities |
| [data-flow.md](data-flow.md) | Data flow and sequence diagrams |
| [decisions.md](decisions.md) | Architecture Decision Records (ADRs) |
| [security.md](security.md) | Security architecture |
| [deployment.md](deployment.md) | Deployment architecture |

## External Resources

- **Miro Board**: [TODO:MIRO_LINK] (Block architecture diagrams)
- **Confluence**: [TODO:CONFLUENCE_LINK]
- **Design Documents**: [TODO:DESIGN_DOCS_LINK]
```

---

### File: `docs/architecture/overview.md`

```markdown
# System Architecture Overview

## Executive Summary

[TODO:EXECUTIVE_SUMMARY]
<!--
Provide a 2-3 paragraph summary of:
- What the system does
- Key architectural decisions
- Main technologies used
-->

## System Context

### Context Diagram

```mermaid
graph TB
    subgraph "External Actors"
        USER[👤 End Users]
        ADMIN[👤 Administrators]
        EXT_SYS[🔗 External Systems]
    end
    
    subgraph "System Boundary"
        APP[📦 [PROJECT_NAME]]
    end
    
    subgraph "External Dependencies"
        AUTH[🔐 Identity Provider]
        DB[(🗄️ Database)]
        CACHE[(⚡ Cache)]
        QUEUE[📬 Message Queue]
    end
    
    USER -->|"HTTP/REST"| APP
    ADMIN -->|"HTTP/REST"| APP
    EXT_SYS -->|"API"| APP
    
    APP -->|"OAuth/OIDC"| AUTH
    APP -->|"SQL"| DB
    APP -->|"Redis Protocol"| CACHE
    APP -->|"AMQP"| QUEUE
```

### System Boundaries

| Boundary | Description |
|----------|-------------|
| **In Scope** | [TODO:IN_SCOPE] |
| **Out of Scope** | [TODO:OUT_OF_SCOPE] |
| **Interfaces** | [TODO:INTERFACES] |

## High-Level Architecture

### Block Architecture Diagram

> **Note**: For detailed block architecture diagrams, see the Miro board: [TODO:MIRO_LINK]

![Block Architecture](./images/block-architecture.png)
<!-- TODO: Add block architecture image or link to Miro -->

### Component Overview

```mermaid
graph TB
    subgraph "Presentation Layer"
        API[API Gateway]
        SWAGGER[Swagger UI]
    end
    
    subgraph "Application Layer"
        ROUTER[Routers/Controllers]
        SERVICE[Services]
        VALIDATOR[Validators]
    end
    
    subgraph "Domain Layer"
        ENTITY[Domain Entities]
        RULES[Business Rules]
    end
    
    subgraph "Infrastructure Layer"
        REPO[Repositories]
        EXTERNAL[External Adapters]
        CACHE_ADAPTER[Cache Adapter]
    end
    
    subgraph "Data Layer"
        DB[(Database)]
        CACHE[(Cache)]
        FILES[(File Storage)]
    end
    
    API --> ROUTER
    SWAGGER --> API
    ROUTER --> SERVICE
    SERVICE --> VALIDATOR
    SERVICE --> ENTITY
    ENTITY --> RULES
    SERVICE --> REPO
    SERVICE --> EXTERNAL
    SERVICE --> CACHE_ADAPTER
    REPO --> DB
    CACHE_ADAPTER --> CACHE
    EXTERNAL --> FILES
```

## Technology Stack

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| **Language** | Python | 3.11+ | [TODO:RATIONALE] |
| **Framework** | FastAPI | 0.109+ | [TODO:RATIONALE] |
| **Database** | PostgreSQL | 15+ | [TODO:RATIONALE] |
| **Cache** | Redis | 7+ | [TODO:RATIONALE] |
| **Message Queue** | [TODO:MQ] | [VERSION] | [TODO:RATIONALE] |
| **Container** | Docker | 24+ | [TODO:RATIONALE] |
| **Orchestration** | [TODO:ORCH] | [VERSION] | [TODO:RATIONALE] |

## Key Design Decisions

| Decision | Choice | Rationale | Alternatives Considered |
|----------|--------|-----------|------------------------|
| API Style | REST | [TODO:RATIONALE] | GraphQL, gRPC |
| Database | PostgreSQL | [TODO:RATIONALE] | MySQL, MongoDB |
| [TODO:DECISION] | [CHOICE] | [RATIONALE] | [ALTERNATIVES] |

See [decisions.md](decisions.md) for detailed Architecture Decision Records.

## Non-Functional Requirements

### Performance

| Metric | Target | Current |
|--------|--------|---------|
| Response Time (p95) | < 200ms | [TODO:CURRENT] |
| Throughput | 1000 req/s | [TODO:CURRENT] |
| Availability | 99.9% | [TODO:CURRENT] |

### Scalability

```mermaid
graph LR
    subgraph "Horizontal Scaling"
        LB[Load Balancer]
        APP1[App Instance 1]
        APP2[App Instance 2]
        APP3[App Instance N]
    end
    
    subgraph "Data Layer"
        DB_PRIMARY[(Primary DB)]
        DB_REPLICA[(Read Replica)]
        CACHE[(Redis Cluster)]
    end
    
    LB --> APP1
    LB --> APP2
    LB --> APP3
    
    APP1 --> DB_PRIMARY
    APP2 --> DB_PRIMARY
    APP3 --> DB_PRIMARY
    
    APP1 -.->|reads| DB_REPLICA
    APP2 -.->|reads| DB_REPLICA
    APP3 -.->|reads| DB_REPLICA
    
    APP1 --> CACHE
    APP2 --> CACHE
    APP3 --> CACHE
```

### Security

See [security.md](security.md) for detailed security architecture.

## Integration Points

| System | Protocol | Direction | Purpose |
|--------|----------|-----------|---------|
| [TODO:SYSTEM_1] | REST/HTTP | Inbound | [PURPOSE] |
| [TODO:SYSTEM_2] | REST/HTTP | Outbound | [PURPOSE] |
| [TODO:SYSTEM_3] | Events | Bidirectional | [PURPOSE] |

---

*Last updated: [DATE]*
```

---

### File: `docs/architecture/data-flow.md`

```markdown
# Data Flow Documentation

## Overview

This document describes how data flows through the system for key operations.

## Request/Response Flow

### General API Request Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant GW as API Gateway
    participant AUTH as Auth Service
    participant API as Application
    participant CACHE as Cache
    participant DB as Database
    
    C->>GW: HTTP Request
    GW->>AUTH: Validate Token
    AUTH-->>GW: Token Valid
    GW->>API: Forward Request
    
    API->>CACHE: Check Cache
    alt Cache Hit
        CACHE-->>API: Cached Data
    else Cache Miss
        API->>DB: Query Data
        DB-->>API: Data
        API->>CACHE: Store in Cache
    end
    
    API-->>GW: Response
    GW-->>C: HTTP Response
```

## Key Business Flows

### [TODO:FLOW_1_NAME] Flow

**Business Context**: [TODO:BUSINESS_CONTEXT]

```mermaid
sequenceDiagram
    participant U as User
    participant API as API
    participant SVC as Service
    participant VAL as Validator
    participant DB as Database
    participant EXT as External System
    
    U->>API: [TODO:ACTION]
    API->>VAL: Validate Request
    VAL-->>API: Validation Result
    
    alt Validation Failed
        API-->>U: 400 Bad Request
    else Validation Passed
        API->>SVC: Process Request
        SVC->>DB: [TODO:DB_OPERATION]
        DB-->>SVC: Result
        
        opt External Integration
            SVC->>EXT: [TODO:EXTERNAL_CALL]
            EXT-->>SVC: Response
        end
        
        SVC-->>API: Business Result
        API-->>U: 200 OK
    end
```

### [TODO:FLOW_2_NAME] Flow

**Business Context**: [TODO:BUSINESS_CONTEXT]

```mermaid
sequenceDiagram
    participant [TODO:PARTICIPANTS]
    
    Note over [PARTICIPANTS]: [TODO:FLOW_DESCRIPTION]
    
    [TODO:SEQUENCE_STEPS]
```

## State Diagrams

### [TODO:ENTITY_NAME] State Machine

```mermaid
stateDiagram-v2
    [*] --> Created
    Created --> Active: activate()
    Active --> Suspended: suspend()
    Suspended --> Active: reactivate()
    Active --> Completed: complete()
    Suspended --> Cancelled: cancel()
    Completed --> [*]
    Cancelled --> [*]
    
    note right of Active
        [TODO:STATE_DESCRIPTION]
    end note
```

## Data Transformation

### Input to Output Mapping

```mermaid
flowchart LR
    subgraph Input
        REQ[Request DTO]
    end
    
    subgraph Processing
        VAL[Validation]
        TRANS[Transformation]
        BIZ[Business Logic]
    end
    
    subgraph Output
        RESP[Response DTO]
    end
    
    REQ --> VAL
    VAL --> TRANS
    TRANS --> BIZ
    BIZ --> RESP
```

## Error Handling Flow

```mermaid
flowchart TD
    START[Request Received] --> VALIDATE{Validate Input}
    
    VALIDATE -->|Invalid| ERR_400[400 Bad Request]
    VALIDATE -->|Valid| AUTH{Authorized?}
    
    AUTH -->|No| ERR_401[401 Unauthorized]
    AUTH -->|Yes| PROCESS[Process Request]
    
    PROCESS --> BIZ{Business Rules OK?}
    
    BIZ -->|No| ERR_422[422 Unprocessable]
    BIZ -->|Yes| PERSIST[Persist Data]
    
    PERSIST --> DB_ERR{DB Error?}
    
    DB_ERR -->|Yes| ERR_500[500 Internal Error]
    DB_ERR -->|No| SUCCESS[200 OK]
    
    ERR_400 --> LOG[Log Error]
    ERR_401 --> LOG
    ERR_422 --> LOG
    ERR_500 --> LOG
    SUCCESS --> END[End]
    LOG --> END
```

## Event Flow (if applicable)

```mermaid
flowchart LR
    subgraph Producers
        SVC1[Service A]
        SVC2[Service B]
    end
    
    subgraph Message Broker
        TOPIC1[Topic: user-events]
        TOPIC2[Topic: order-events]
    end
    
    subgraph Consumers
        CONS1[Consumer 1]
        CONS2[Consumer 2]
        CONS3[Consumer 3]
    end
    
    SVC1 -->|publish| TOPIC1
    SVC2 -->|publish| TOPIC2
    
    TOPIC1 -->|subscribe| CONS1
    TOPIC1 -->|subscribe| CONS2
    TOPIC2 -->|subscribe| CONS3
```

---

*Last updated: [DATE]*
```

---

### File: `docs/architecture/components.md`

```markdown
# Component Documentation

## Component Overview

```mermaid
graph TB
    subgraph "API Layer"
        R1[Users Router]
        R2[Items Router]
        R3[[TODO:ROUTER]]
    end
    
    subgraph "Service Layer"
        S1[User Service]
        S2[Item Service]
        S3[[TODO:SERVICE]]
    end
    
    subgraph "Repository Layer"
        REPO1[User Repository]
        REPO2[Item Repository]
        REPO3[[TODO:REPO]]
    end
    
    R1 --> S1
    R2 --> S2
    R3 --> S3
    
    S1 --> REPO1
    S2 --> REPO2
    S3 --> REPO3
```

## Component Details

### [Component Name]

| Attribute | Value |
|-----------|-------|
| **Location** | `src/[package]/[module].py` |
| **Responsibility** | [TODO:RESPONSIBILITY] |
| **Dependencies** | [TODO:DEPENDENCIES] |
| **Dependents** | [TODO:DEPENDENTS] |

**Description**: [TODO:DESCRIPTION]

**Key Methods**:
- `method_name()`: [PURPOSE]
- `method_name()`: [PURPOSE]

**Business Rules Enforced**:
- [TODO:RULE_1]
- [TODO:RULE_2]

---

*Last updated: [DATE]*
```

---

## Agent Interaction Mode

When generating architecture documentation, ask for:

### Required Information
1. "What is the high-level purpose of this system?"
2. "What are the main components and their responsibilities?"
3. "What external systems does this integrate with?"
4. "What are the key business flows that need to be documented?"
5. "Is there a Miro board link for block architecture diagrams?"

### Optional Information
6. "What are the non-functional requirements (performance, availability)?"
7. "What security considerations are important?"
8. "Are there any Architecture Decision Records (ADRs) to reference?"

Generate diagrams using Mermaid syntax. For block architecture diagrams that require more visual flexibility, include a placeholder for Miro board links.

## Mermaid Diagram Types to Use

| Diagram Type | Use Case | Mermaid Syntax |
|--------------|----------|----------------|
| Flowchart | System context, component relationships | `graph TB/LR` |
| Sequence | API flows, interactions | `sequenceDiagram` |
| State | Entity lifecycles | `stateDiagram-v2` |
| Class | Domain models | `classDiagram` |
| ER | Database schema | `erDiagram` |
| Gantt | Timelines | `gantt` |

## Placeholder Reference

| Placeholder | Description |
|-------------|-------------|
| `[TODO:MIRO_LINK]` | Link to Miro board |
| `[TODO:CONFLUENCE_LINK]` | Link to Confluence page |
| `[TODO:BUSINESS_CONTEXT]` | Business context for a flow |
| `[TODO:RATIONALE]` | Rationale for a decision |
