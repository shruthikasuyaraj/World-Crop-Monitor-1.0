# Developer Guide

**HackEarth Development and Setup Instructions**

This guide provides step-by-step instructions for setting up your development environment and contributing to the HackEarth project.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Development Setup](#development-setup)
4. [Configuration](#configuration)
5. [Secrets Management](#secrets-management)
6. [Running Locally](#running-locally)
7. [Testing](#testing)
8. [Code Style Guidelines](#code-style-guidelines)
9. [Common Development Tasks](#common-development-tasks)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Software Requirements

#### System Level
- **Git**: Version 2.25 or later
- **Docker**: Version 20.10+ (for Docker-based development)
- **Docker Compose**: Version 1.29+ (for multi-container setup)

#### Frontend Development
- **Node.js**: Version 18+ LTS
- **npm**: Version 9.0+
- **Angular CLI**: Latest (installed globally via npm)

#### Backend Development (Climate Maps & Crop Stress)
- **Python**: Version 3.9+
- **pip**: Latest version
- **conda**: Optional but recommended for environment management

#### Data Processing
- **GDAL**: Version 3.11.0+
- **Tippecanoe**: Version 1.19.1 (specific version for GeoJSON compatibility)
- **PostgreSQL**: Optional for advanced data storage

### Access Requirements

| Resource | Access Type | Contact |
|----------|-------------|---------|
| GitHub Repository | Read/Write | [TODO:TECH_OWNER_NAME] |
| Data Sources (APIs) | API Keys | [TODO:SECRET_CONTACT] |
| Development Servers | SSH/Web | [TODO:TECH_OWNER_NAME] |
| Slack Channel | Workspace | [TODO:SLACK_CHANNEL] |

---

## Project Structure

```
hackearth/
├── backend/                             # Legacy Node.js server
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/                            # Legacy static frontend
│   ├── index.html
│   ├── css/
│   └── js/
├── climatemaps/                         # Main project (PRODUCTION)
│   ├── api/                             # FastAPI backend service
│   │   ├── main.py                      # API entry point
│   │   ├── middleware.py                # Request/response middleware
│   │   ├── cache.py                     # Caching layer
│   │   ├── requirements.txt             # Python dependencies
│   │   ├── Dockerfile
│   │   └── __init__.py
│   ├── client/                          # Angular web application
│   │   ├── src/
│   │   │   ├── app/                     # Angular components and services
│   │   │   ├── assets/                  # Static assets
│   │   │   └── environments/            # Environment configs
│   │   ├── package.json
│   │   ├── angular.json
│   │   └── tsconfig.json
│   ├── climatemaps/                     # Python core modules
│   │   ├── __init__.py
│   │   ├── config.py                    # Configuration loader
│   │   ├── data.py                      # Data processing utilities
│   │   ├── contour.py                   # Contour generation
│   │   ├── tile.py                      # Tile generation
│   │   ├── ensemble.py                  # Ensemble calculations
│   │   ├── datasets.py                  # Dataset definitions
│   │   ├── download.py                  # Data download utilities
│   │   ├── geogrid.py                   # Geographic grid utilities
│   │   ├── geotiff.py                   # GeoTIFF file utilities
│   │   ├── logger.py                    # Logging configuration
│   │   ├── settings/                    # Settings modules
│   │   └── tests/                       # Unit tests
│   ├── scripts/                         # Standalone utility scripts
│   │   ├── create_contour.py
│   │   ├── create_ensemble_mean.py
│   │   ├── create_tileserver_config.py
│   │   ├── deploy.sh
│   │   └── download_tiles.sh
│   ├── data/                            # Data directories
│   │   ├── raw/                         # Raw input data
│   │   └── tiles/                       # Generated tiles
│   ├── infra/                           # Infrastructure configuration
│   │   └── openclimatemap.nginx.conf
│   ├── docker-compose.yml               # Multi-container orchestration
│   ├── pyproject.toml                   # Python project metadata
│   ├── requirements.txt                 # Python dependencies
│   ├── requirements-dev.txt             # Development dependencies
│   ├── tileserver_config.json           # TileServer GL configuration
│   └── Dockerfile                       # Production Docker image
└── docs/                                # Documentation
    ├── developer-guide.md               # This file
    ├── user-guide.md
    └── architecture/
```

### Key Component Descriptions

- **api/** - FastAPI backend service providing REST endpoints for climate and crop data
- **client/** - Angular web application (primary UI, replacing legacy frontend)
- **climatemaps/** - Core Python package containing data processing logic
- **scripts/** - Standalone scripts for data processing and tile generation
- **data/** - Local data storage (raw inputs and generated outputs)

---

## Development Setup

### Option 1: Docker Compose (Recommended)

#### 1.1 Clone Repository
```bash
git clone [TODO:REPO_URL]
cd hackearth/climatemaps
```

#### 1.2 Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
nano .env
```

#### 1.3 Start Services
```bash
# Build and start all containers
docker-compose up -d

# View logs
docker-compose logs -f

# Access services:
# Frontend: http://localhost:3000
# API: http://localhost:8000
# TileServer: http://localhost:8080
```

#### 1.4 Initialize Data (First Time)
```bash
# Run inside api container
docker-compose exec api python scripts/download_tiles.sh

# Or run locally with Python installed
python scripts/create_contour.py
python scripts/create_ensemble_mean.py
python scripts/create_tileserver_config.py
```

### Option 2: Manual Setup (Development)

#### 2.1 Backend API Setup

```bash
cd climatemaps

# Create Python virtual environment
python3.9 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements-dev.txt

# Configure environment
cp climatemaps/settings/settings_local_example.py climatemaps/settings/settings_local.py

# Run development server
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

#### 2.2 Frontend Client Setup

```bash
cd climatemaps/client

# Install dependencies
npm install

# Start development server
npm start

# Access at http://localhost:4200
```

#### 2.3 TileServer Setup

```bash
cd climatemaps

# Install globally (macOS/Linux)
npm install -g tileserver-gl

# Or run with Docker
docker run -p 8080:80 klokantech/tileserver-gl \
    --config tileserver_config_dev.json
```

### Option 3: Hybrid Setup (Backend in Docker, Frontend Local)

```bash
cd climatemaps

# Start backend services in Docker
docker-compose up -d api tileserver

# Start frontend locally in separate terminal
cd client
npm install
npm start
```

---

## Configuration

### Environment Variables

Create a `.env` file in the `climatemaps/` directory:

```bash
# FastAPI Configuration
API_HOST=0.0.0.0
API_PORT=8000
API_DEBUG=true
LOG_LEVEL=INFO

# Frontend Configuration
FRONTEND_PORT=3000
API_BASE_URL=http://localhost:8000

# TileServer Configuration
TILESERVER_PORT=8080
TILESERVER_DATA_DIR=./data/tiles

# Climate Data
CLIMATE_DATA_PATH=./data/raw
WORLDCLIM_VERSION=cmip6
CLIMATE_SCENARIOS=SSP1-2.6,SSP2-4.5,SSP3-7.0,SSP5-8.5

# Database (Optional)
DATABASE_URL=postgresql://user:password@localhost:5432/hackearth
DATABASE_POOL_SIZE=20

# Cache (Optional)
REDIS_URL=redis://localhost:6379

# Processing
GDAL_DATA=/usr/share/gdal
NUM_WORKERS=4
```

### Application Configuration

#### Python Backend (settings.py)
```python
# climatemaps/settings/settings.py
DEBUG = True
DATA_DIR = "./data"
CACHE_DIR = "./cache"
LOG_LEVEL = "INFO"
API_TIMEOUT = 300
TILE_CACHE_SIZE = 1000
```

#### Angular Frontend (environment files)
```typescript
// climatemaps/client/src/environments/environment.development.ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8000',
  apiTimeout: 30000,
  mapCenter: [20, 0],
  mapZoom: 3,
  tileUrl: 'http://localhost:8080'
};
```

---

## Secrets Management

### Obtaining Secrets

#### API Keys

| Secret | Purpose | How to Obtain |
|--------|---------|---------------|
| `OPENMETEO_API_KEY` | Weather data access | Public API - no key needed, but use responsibly |
| `COPERNICUS_API_KEY` | Satellite data access | Register at https://cds.climate.copernicus.eu |
| `FAO_API_KEY` | Agricultural data | Contact FAO for API access |
| `TILE_API_KEY` | TileServer GL | Optional - for production security |

#### Database Credentials

```bash
# Local development (use defaults)
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_NAME=hackearth_dev

# Production (request from [TODO:TECH_OWNER_NAME])
# Store in secure secret management system
```

#### Storage Access

```bash
# S3/Cloud Storage (if used)
CLOUD_STORAGE_KEY=[TODO:SECRET_PROCESS]
CLOUD_STORAGE_SECRET=[TODO:SECRET_PROCESS]
CLOUD_STORAGE_BUCKET=hackearth-data
```

### Secret Storage

**Development (Local)**
```bash
# Create .env file (DO NOT commit)
# .gitignore already includes .env
echo "API_KEY=your_key_here" >> .env
```

**Staging/Production**
```bash
# Use environment-specific secrets
# 1. Docker Secrets
docker secret create api_key api_key.txt

# 2. Kubernetes Secrets
kubectl create secret generic hackearth-secrets \
    --from-literal=api_key=value \
    --from-literal=db_password=value

# 3. Cloud Secret Manager (GCP, AWS)
# Handled by deployment pipeline
```

### Handling Secrets in Code

```python
# ✅ CORRECT: Load from environment
import os
api_key = os.getenv('API_KEY', 'default_value')

# ❌ WRONG: Hardcode secrets
api_key = "sk-1234567890"  # Never do this!

# ✅ CORRECT: Use config management
from climatemaps.config import settings
api_key = settings.api_key
```

---

## Running Locally

### Quick Start Commands

```bash
# Using Docker Compose (all services)
cd climatemaps
docker-compose up -d

# Using npm/Python (development without Docker)

# Terminal 1: Backend API
cd climatemaps
source venv/bin/activate
uvicorn api.main:app --reload

# Terminal 2: Frontend
cd climatemaps/client
npm start

# Terminal 3: TileServer (if needed)
tileserver-gl --config tileserver_config_dev.json --port 8080
```

### Verification

```bash
# Check API health
curl http://localhost:8000/health

# Check frontend
open http://localhost:4200

# Check TileServer
open http://localhost:8080
```

### Sample Data

Download sample climate data for testing:

```bash
cd climatemaps
python scripts/download_tiles.sh --region "Africa" --year 2023

# Or use included test data
cd data/raw
# Files should be in format: climate_data_*.tif
```

---

## Testing

### Unit Tests (Python)

```bash
cd climatemaps

# Install test dependencies
pip install -r requirements-dev.txt

# Run all tests
pytest

# Run specific test file
pytest climatemaps/tests/test_contour.py

# Run with coverage
pytest --cov=climatemaps --cov-report=html

# View coverage report
open htmlcov/index.html
```

### Unit Tests (Angular)

```bash
cd climatemaps/client

# Run tests
npm test

# Run with coverage
npm test -- --code-coverage

# Run in headless mode (CI)
npm test -- --watch=false --browsers=ChromeHeadless
```

### E2E Tests (Angular)

```bash
cd climatemaps/client

# Start test server
npm start

# In another terminal
npm run e2e

# Or use ng e2e
ng e2e
```

### Integration Tests

```bash
cd climatemaps

# Test with real API and TileServer running
docker-compose up -d

# Run integration tests
pytest climatemaps/tests/integration/ -v

# Run specific integration test
pytest climatemaps/tests/integration/test_api_flow.py -v
```

### Test Data & Fixtures

```bash
# Download test data
curl -o climatemaps/tests/fixtures/test_climate.tif \
    [TODO:TEST_DATA_URL]

# Generate test tiles
python climatemaps/tests/fixtures/generate_test_data.py
```

---

## Code Style Guidelines

### Python

Follow **PEP 8** with these guidelines:

```bash
# Install linters
pip install black flake8 isort

# Format code
black climatemaps/

# Check style
flake8 climatemaps/

# Sort imports
isort climatemaps/
```

**Python Style Requirements:**
- Max line length: 100 characters
- Use type hints for function parameters and return values
- Use descriptive variable names (no abbreviations)
- Document complex functions with docstrings (Google style)
- Class names: PascalCase
- Function/variable names: snake_case
- Constants: UPPER_SNAKE_CASE

Example:
```python
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)

class ClimateDataProcessor:
    """Process climate data from external sources.
    
    Handles downloading, caching, and processing of climate
    data from WorldClim, ERA5, and other sources.
    
    Attributes:
        cache_dir (str): Directory for cached files
        timeout (int): Request timeout in seconds
    """
    
    def __init__(self, cache_dir: str, timeout: int = 300):
        self.cache_dir = cache_dir
        self.timeout = timeout
    
    def process_climate_data(self, file_path: str) -> Optional[dict]:
        """Process a single climate data file.
        
        Args:
            file_path: Path to the climate data file
            
        Returns:
            Processed data dictionary or None if processing fails
            
        Raises:
            FileNotFoundError: If file does not exist
            ValueError: If data format is invalid
        """
        # Implementation here
        pass
```

### TypeScript/Angular

Follow the **Angular Style Guide**:

```bash
# Install linter
npm install --save-dev @angular/eslint

# Check style
ng lint

# Fix issues
ng lint --fix
```

**TypeScript Style Requirements:**
- Max line length: 120 characters
- Use strict null checking
- Use explicit type annotations
- Use meaningful variable names
- Component names: PascalCase.component.ts
- Service names: snake-case.service.ts
- Use OnInit, OnDestroy lifecycle hooks appropriately
- Unsubscribe from observables to prevent memory leaks

Example:
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ClimateService } from '../services/climate.service';

@Component({
  selector: 'app-climate-map',
  templateUrl: './climate-map.component.html',
  styleUrls: ['./climate-map.component.scss']
})
export class ClimateMapComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  constructor(private climateService: ClimateService) {}
  
  ngOnInit(): void {
    this.loadClimateData();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private loadClimateData(): void {
    this.climateService
      .getClimateData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // Process data
      });
  }
}
```

---

## Common Development Tasks

### Adding a New Climate Variable

1. **Update dataset configuration** (`climatemaps/datasets.py`)
```python
AVAILABLE_VARIABLES = [
    # ... existing variables
    {
        'name': 'soil_moisture',
        'source': 'ERA5',
        'unit': '%',
        'description': 'Volumetric soil water content'
    }
]
```

2. **Add data download logic** (`climatemaps/download.py`)
```python
def download_soil_moisture(date_range, region):
    # Implementation
    pass
```

3. **Create tile generation** (`climatemaps/tile.py`)
4. **Update API endpoint** (`api/main.py`)
5. **Update frontend** (`client/src/app/...`)
6. **Add tests**
7. **Update documentation**

### Adding a New API Endpoint

1. **Create endpoint in `api/main.py`**
```python
@app.get("/api/v1/new-data/{variable_id}")
async def get_new_data(
    variable_id: str,
    lat: float,
    lon: float,
    start_date: str = Query(...)
):
    # Implementation
    pass
```

2. **Add service in `climatemaps/` package**
3. **Add tests in `climatemaps/tests/`**
4. **Update Angular client service**
5. **Create Angular component if needed**
6. **Update API documentation**

### Updating Dependencies

**Python:**
```bash
cd climatemaps
pip list --outdated
pip install --upgrade package_name
pip freeze > requirements.txt
# Test thoroughly before committing
```

**Node.js:**
```bash
cd climatemaps/client
npm outdated
npm update package_name
# Update package.json and package-lock.json
npm test
```

---

## Troubleshooting

### Common Issues

#### Issue: Python Module Not Found

**Problem:** `ModuleNotFoundError: No module named 'climatemaps'`

**Solution:**
```bash
# Ensure you're in the right directory
cd climatemaps

# Install in development mode
pip install -e .

# Or add climatemaps to PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

#### Issue: Port Already in Use

**Problem:** `Address already in use: ('0.0.0.0', 8000)`

**Solution:**
```bash
# Find process using port
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>
# Or use different port
uvicorn api.main:app --port 8001
```

#### Issue: Docker Build Fails

**Problem:** Docker build exits with error

**Solution:**
```bash
# Clear Docker cache
docker system prune -a

# Rebuild with verbose output
docker-compose build --no-cache --verbose

# Check Docker daemon
docker ps  # Should return list, not error
```

#### Issue: Angular Module Not Found

**Problem:** `NG0100: Cannot find module 'some-package'`

**Solution:**
```bash
cd climatemaps/client

# Clear node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Ensure @angular packages match versions
npm list @angular/core  # Should show matching versions
```

#### Issue: GDAL/Tippecanoe Not Found

**Problem:** `gdal2tiles.py: command not found`

**Solution:**

**macOS:**
```bash
brew install gdal
brew install tippecanoe
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install gdal-bin
# For tippecanoe, compile from source
git clone https://github.com/mapbox/tippecanoe.git
cd tippecanoe
git checkout tags/1.19.1
make -j && sudo make install
```

**Docker:**
```bash
# Already installed in Docker image
docker-compose run climatemaps gdal2tiles.py --version
```

#### Issue: Tiles Not Rendering

**Problem:** Map appears blank, tiles not loading

**Solution:**
```bash
# Verify tile generation
ls -la data/tiles/
# Should contain .mbtiles files

# Check TileServer logs
docker-compose logs tileserver

# Verify TileServer config
cat tileserver_config_dev.json
# Ensure correct paths and layer names

# Regenerate tiles
python scripts/create_contour.py --force
python scripts/create_tileserver_config.py
```

### Getting Help

1. **Check logs**
   ```bash
   docker-compose logs -f <service_name>
   ```

2. **Check documentation**
   - Refer to [Architecture Documentation](../architecture/overview.md)
   - Check specific component docs in [docs/architecture/components.md](../architecture/components.md)

3. **Ask in Slack**
   - Channel: [TODO:SLACK_CHANNEL]
   - Tag: @[TODO:TECH_OWNER_NAME]

4. **File an issue**
   - GitHub Issues: [TODO:REPO_URL]/issues
   - Include logs, environment details, reproduction steps

---

## Additional Resources

### Documentation
- [Architecture Overview](../architecture/overview.md)
- [User Guide](../user-guide.md)
- [API Documentation](../api/index.md)

### External Resources
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Angular Documentation](https://angular.io/docs)
- [TileServer GL Documentation](https://tileserver.readthedocs.io/)
- [GDAL Documentation](https://gdal.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Related Projects
- [WorldClim Data](https://www.worldclim.org/)
- [Copernicus Climate Data Store](https://cds.climate.copernicus.eu/)
- [Open-Meteo API](https://open-meteo.com/)

---

**Last Updated**: February 2, 2026

*Documentation generated with AI assistance. For updates or clarifications, contact [TODO:TECH_OWNER_NAME].*
