# Developer Guide Generator Prompt

## Purpose
Generate a comprehensive developer guide that enables new developers to quickly get productive with the codebase.

## Instructions for AI Agent

Generate a developer guide with the following structure. Use placeholders for information you cannot determine.

---

## Developer Guide Template

```markdown
# Developer Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Development Environment Setup](#development-environment-setup)
3. [Project Structure](#project-structure)
4. [Configuration](#configuration)
5. [Secrets Management](#secrets-management)
6. [Running Locally](#running-locally)
7. [Testing](#testing)
8. [Code Style](#code-style)
9. [Common Tasks](#common-tasks)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

| Software | Version | Installation |
|----------|---------|--------------|
| Python | 3.11+ | [python.org](https://python.org) or `brew install python@3.11` |
| UV | Latest | `curl -LsSf https://astral.sh/uv/install.sh \| sh` |
| Git | 2.x+ | `brew install git` |
| Docker | 24.x+ | [docker.com](https://docker.com) |
| [TODO:OTHER_PREREQ] | [VERSION] | [INSTALL_INSTRUCTIONS] |

### Access Requirements

Before starting development, ensure you have:

- [ ] Repository access (GitHub/GitLab)
- [ ] [TODO:VAULT_ACCESS] - Secrets vault access
- [ ] [TODO:CLOUD_ACCESS] - Cloud provider access (if applicable)
- [ ] [TODO:DATABASE_ACCESS] - Database access for local development
- [ ] [TODO:OTHER_ACCESS] - Other required access

Contact [TODO:ACCESS_CONTACT] if you need access provisioned.

---

## Development Environment Setup

### 1. Clone the Repository

```bash
git clone [TODO:REPO_URL]
cd [PROJECT_NAME]
```

### 2. Install Dependencies

```bash
# Using UV (recommended)
uv sync

# Or using pip
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -e ".[dev]"
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Copy the example environment file
cp .env.example .env

# Edit with your local settings
vim .env
```

Required environment variables:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | Database connection string | `postgresql://user:pass@localhost/db` | Yes |
| `SECRET_KEY` | Application secret key | `your-secret-key` | Yes |
| `DEBUG` | Enable debug mode | `true` | No (default: false) |
| `[TODO:ENV_VAR]` | [DESCRIPTION] | [EXAMPLE] | [YES/NO] |

### 4. Set Up Local Database

```bash
# Start database with Docker
docker-compose up -d db

# Run migrations
uv run alembic upgrade head

# (Optional) Seed with test data
uv run python scripts/seed_data.py
```

### 5. Verify Setup

```bash
# Run the application
uv run uvicorn [MODULE].main:app --reload

# In another terminal, verify it's working
curl http://localhost:8000/health
# Expected: {"status": "healthy"}
```

---

## Project Structure

```
[PROJECT_NAME]/
├── src/
│   └── [PACKAGE_NAME]/
│       ├── __init__.py          # Package initialization
│       ├── main.py              # Application entry point
│       ├── config.py            # Configuration management
│       ├── models/              # Data models (Pydantic, SQLAlchemy)
│       │   ├── __init__.py
│       │   ├── user.py          # [DESCRIPTION]
│       │   └── [OTHER].py       # [DESCRIPTION]
│       ├── routers/             # API endpoint definitions
│       │   ├── __init__.py
│       │   ├── users.py         # [DESCRIPTION]
│       │   └── [OTHER].py       # [DESCRIPTION]
│       ├── services/            # Business logic layer
│       │   ├── __init__.py
│       │   ├── user_service.py  # [DESCRIPTION]
│       │   └── [OTHER].py       # [DESCRIPTION]
│       └── utils/               # Utility functions
├── tests/                       # Test suite
│   ├── conftest.py             # Pytest fixtures
│   ├── test_users.py           # [DESCRIPTION]
│   └── [OTHER_TESTS].py        # [DESCRIPTION]
├── docs/                        # Documentation
├── scripts/                     # Utility scripts
├── alembic/                     # Database migrations
├── pyproject.toml              # Project configuration
├── .env.example                # Example environment file
└── docker-compose.yml          # Local development services
```

---

## Configuration

### Configuration Files

| File | Purpose | Environment |
|------|---------|-------------|
| `pyproject.toml` | Project dependencies and tools | All |
| `.env` | Local environment variables | Local only |
| `config/[env].yaml` | Environment-specific config | Per environment |

### Configuration Hierarchy

1. Default values in code
2. Configuration files
3. Environment variables (highest priority)

### Accessing Configuration

```python
from [PACKAGE_NAME].config import settings

# Access configuration values
database_url = settings.database_url
debug_mode = settings.debug
```

---

## Secrets Management

### Local Development

For local development, secrets are stored in `.env` file (never commit this file).

```bash
# .env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
SECRET_KEY=local-development-secret-key
API_KEY=[TODO:HOW_TO_GET_API_KEY]
```

### Getting Secrets

| Secret | How to Obtain | Contact |
|--------|---------------|---------|
| Database credentials | [TODO:DB_CREDS_PROCESS] | [TODO:DB_ADMIN] |
| API keys | [TODO:API_KEY_PROCESS] | [TODO:API_ADMIN] |
| [TODO:OTHER_SECRET] | [TODO:PROCESS] | [TODO:CONTACT] |

### Production Secrets

Production secrets are managed via [TODO:SECRETS_MANAGER] (e.g., HashiCorp Vault, AWS Secrets Manager).

```bash
# Fetching secrets (if applicable)
[TODO:SECRETS_FETCH_COMMAND]
```

---

## Running Locally

### Development Server

```bash
# Start with hot reload
uv run uvicorn [PACKAGE_NAME].main:app --reload --host 0.0.0.0 --port 8000

# Or use the convenience script
./scripts/run_dev.sh
```

### With Docker

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Accessing the Application

| Service | URL | Credentials |
|---------|-----|-------------|
| API | http://localhost:8000 | N/A |
| API Docs (Swagger) | http://localhost:8000/docs | N/A |
| API Docs (ReDoc) | http://localhost:8000/redoc | N/A |
| Database | localhost:5432 | See `.env` |
| [TODO:OTHER_SERVICE] | [URL] | [CREDENTIALS] |

---

## Testing

### Running Tests

```bash
# Run all tests
uv run pytest

# Run with coverage
uv run pytest --cov=src/[PACKAGE_NAME] --cov-report=html

# Run specific test file
uv run pytest tests/test_users.py

# Run specific test
uv run pytest tests/test_users.py::test_create_user

# Run with verbose output
uv run pytest -v

# Run only fast tests (exclude slow/integration)
uv run pytest -m "not slow"
```

### Test Categories

| Marker | Description | Command |
|--------|-------------|---------|
| (none) | Unit tests | `pytest` |
| `slow` | Slow tests | `pytest -m slow` |
| `integration` | Integration tests | `pytest -m integration` |
| `e2e` | End-to-end tests | `pytest -m e2e` |

### Writing Tests

```python
# tests/test_example.py
import pytest
from [PACKAGE_NAME].services import SomeService

class TestSomeService:
    """Tests for SomeService business logic."""

    def test_business_operation_success(self):
        """Test that [business operation] succeeds with valid input."""
        # Arrange
        service = SomeService()
        
        # Act
        result = service.do_something(valid_input)
        
        # Assert
        assert result.status == "success"

    def test_business_operation_validation(self):
        """Test that [business operation] validates [business rule]."""
        # ...
```

---

## Code Style

### Formatting

```bash
# Format code with black
uv run black src/ tests/

# Check formatting without changes
uv run black --check src/ tests/
```

### Linting

```bash
# Run ruff linter
uv run ruff check src/ tests/

# Auto-fix issues
uv run ruff check --fix src/ tests/
```

### Type Checking

```bash
# Run mypy
uv run mypy src/
```

### Pre-commit Hooks

```bash
# Install pre-commit hooks
uv run pre-commit install

# Run manually
uv run pre-commit run --all-files
```

---

## Common Tasks

### Adding a New Endpoint

1. Create/update model in `src/[PACKAGE_NAME]/models/`
2. Create/update service in `src/[PACKAGE_NAME]/services/`
3. Create/update router in `src/[PACKAGE_NAME]/routers/`
4. Add tests in `tests/`
5. Update API documentation if needed

### Database Migrations

```bash
# Create a new migration
uv run alembic revision --autogenerate -m "description"

# Apply migrations
uv run alembic upgrade head

# Rollback one migration
uv run alembic downgrade -1

# View migration history
uv run alembic history
```

### Adding Dependencies

```bash
# Add a production dependency
uv add package-name

# Add a development dependency
uv add --dev package-name

# Update dependencies
uv sync
```

---

## Troubleshooting

### Common Issues

#### Issue: [TODO:COMMON_ISSUE_1]

**Symptoms**: [DESCRIPTION]

**Solution**:
```bash
[SOLUTION_COMMANDS]
```

#### Issue: Database Connection Failed

**Symptoms**: `Connection refused` or `could not connect to server`

**Solution**:
1. Ensure database is running: `docker-compose up -d db`
2. Check DATABASE_URL in `.env`
3. Verify network connectivity: `pg_isready -h localhost -p 5432`

#### Issue: Import Errors

**Symptoms**: `ModuleNotFoundError`

**Solution**:
1. Ensure virtual environment is activated
2. Reinstall dependencies: `uv sync`
3. Check PYTHONPATH includes `src/`

### Getting Help

- **Slack Channel**: [TODO:SLACK_CHANNEL]
- **Documentation**: [TODO:DOCS_URL]
- **Team Wiki**: [TODO:WIKI_URL]

---

*Last updated: [DATE]*
*Generated with AI assistance - verify all [TODO:*] placeholders*
```

---

## Agent Interaction Mode

When generating the developer guide, ask for:

### Required Information
1. "What is the package/module name?"
2. "What database is used and how do developers get access?"
3. "What secrets are needed and how are they obtained?"
4. "What is the Slack channel for developer support?"
5. "Are there any special setup steps unique to this project?"

### Optional Information
6. "Are there any common issues developers encounter?"
7. "What external services does this connect to?"
8. "Are there any required VPN or network configurations?"

Update the guide iteratively based on responses.
