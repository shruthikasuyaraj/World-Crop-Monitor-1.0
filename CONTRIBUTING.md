# Contributing to HackEarth

Thank you for your interest in contributing to HackEarth! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Code of Conduct](#code-of-conduct)
3. [How to Contribute](#how-to-contribute)
4. [Development Workflow](#development-workflow)
5. [Pull Request Process](#pull-request-process)
6. [Coding Standards](#coding-standards)
7. [Testing Requirements](#testing-requirements)
8. [Documentation](#documentation)
9. [Reporting Bugs](#reporting-bugs)
10. [Feature Requests](#feature-requests)

---

## Getting Started

### Prerequisites

- Git knowledge (basic commands)
- [Developer environment set up](docs/developer-guide.md)
- GitHub account
- Slack access (for collaboration)

### Fork & Clone

```bash
# 1. Fork the repository on GitHub
# Visit: https://github.com/[TODO:ORG]/hackearth/fork

# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/hackearth.git
cd hackearth

# 3. Add upstream remote
git remote add upstream [TODO:REPO_URL]

# 4. Verify remotes
git remote -v
# Should show:
# origin    https://github.com/YOUR-USERNAME/hackearth.git
# upstream  [TODO:REPO_URL]
```

---

## Code of Conduct

HackEarth is committed to providing a welcoming and inclusive environment.

### Expected Behavior

- Be respectful of different opinions and experiences
- Focus on constructive criticism
- Collaborate in good faith
- Support fellow contributors
- Report inappropriate behavior

### Unacceptable Behavior

- Harassment, discrimination, or offensive language
- Trolling or insulting comments
- Private harassment or unwanted contact
- Sharing others' private information
- Other conduct that harms the community

### Reporting Issues

Contact: [TODO:CONDUCT_EMAIL]

---

## How to Contribute

### Types of Contributions

**Code Contributions:**
- Bug fixes
- Feature implementations
- Performance improvements
- Refactoring and cleanup

**Documentation:**
- README updates
- API documentation
- User guide improvements
- Architecture documentation

**Testing:**
- Bug reports
- Test case contributions
- Test coverage improvements
- User testing feedback

**Other:**
- Data improvements
- Translations
- Community support
- Issue triage

---

## Development Workflow

### 1. Create a Branch

```bash
# Update main branch
git fetch upstream
git checkout main
git rebase upstream/main

# Create feature branch
# Format: type/description
# Examples: feature/climate-export, bugfix/tile-rendering
git checkout -b feature/my-feature-name

# Naming conventions:
# - feature/* : New functionality
# - bugfix/*  : Bug fixes
# - docs/*    : Documentation
# - refactor/*: Code improvements
# - test/*    : Test additions
```

### 2. Make Changes

```bash
# Make your code changes
# Follow coding standards (see below)
# Commit frequently with clear messages

git add .
git commit -m "Add climate data export functionality"

# Format: "Verb noun - description"
# Examples:
# - "Add climate data export to CSV format"
# - "Fix tile rendering for zoom level 14"
# - "Refactor climate service to use async/await"
```

### 3. Keep Branch Updated

```bash
# If main branch has updates
git fetch upstream
git rebase upstream/main
# OR merge if rebase causes issues
git merge upstream/main
```

### 4. Push to Your Fork

```bash
git push origin feature/my-feature-name
```

### 5. Create Pull Request

- Go to GitHub
- Click "New Pull Request"
- Select your branch and main
- Fill out PR template
- Submit for review

---

## Pull Request Process

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Fixes #123

## Changes Made
- Item 1
- Item 2
- Item 3

## Testing Done
Describe testing performed

## Screenshots (if applicable)
Add before/after screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tested locally
- [ ] Commits are logical
```

### Review Process

1. **Automated Checks**
   - CI/CD pipeline runs tests
   - Linters check code style
   - Coverage reports generated

2. **Code Review**
   - Minimum 1 approval required
   - Maintainers review for:
     - Code quality
     - Test coverage
     - Documentation
     - Performance impact

3. **Merge**
   - Approved PRs merged by maintainer
   - Branch automatically deleted
   - Issue closed automatically (if linked)

### Review Timeline

- Bug fixes: 24-48 hours
- Features: 48-72 hours
- Documentation: 24 hours

---

## Coding Standards

### Python

Follow **PEP 8** with these additional standards:

```bash
# Format code
black climatemaps/ --line-length=100

# Check style
flake8 climatemaps/

# Sort imports
isort climatemaps/

# Type checking
mypy climatemaps/
```

**Requirements:**
- Type hints for all functions
- Docstrings (Google style)
- Max line length: 100 characters
- Test coverage: > 80%

**Example:**
```python
from typing import Optional, Dict
import logging

logger = logging.getLogger(__name__)

def calculate_climate_impact(
    temperature_change: float,
    precipitation_change: float,
    region: str
) -> Dict[str, float]:
    """Calculate climate impact on agriculture.
    
    Estimates the combined impact of temperature and 
    precipitation changes on crop yields for a specific region.
    
    Args:
        temperature_change: Temperature change in °C
        precipitation_change: Precipitation change as percentage
        region: Geographic region identifier
        
    Returns:
        Dictionary with impact scores:
        - 'yield_impact': Estimated yield change (%)
        - 'confidence': Confidence level (0-1)
        - 'risk_level': 'Low', 'Medium', 'High', or 'Critical'
        
    Raises:
        ValueError: If temperature > 10°C (unrealistic value)
        ValueError: If region not recognized
    """
    if abs(temperature_change) > 10:
        raise ValueError(f"Unrealistic temperature change: {temperature_change}°C")
    
    # Implementation
    pass
```

### TypeScript/Angular

Follow **Angular Style Guide**:

```bash
# Format code
npm run lint -- --fix

# Check style
npm run lint

# Build for production
npm run build
```

**Requirements:**
- Strict null checking enabled
- Explicit type annotations
- Max line length: 120 characters
- Test coverage: > 80%

**Example:**
```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClimateDataService {
  constructor(private http: HttpClient) {}

  /**
   * Fetch climate data for coordinates.
   * 
   * @param latitude Geographic latitude
   * @param longitude Geographic longitude
   * @param variable Climate variable (temperature, precipitation)
   * @returns Observable of climate data
   */
  getClimateData(
    latitude: number,
    longitude: number,
    variable: string
  ): Observable<ClimateData> {
    return this.http.get<ClimateData>(
      `/api/v1/climate/data`,
      {
        params: {
          lat: latitude,
          lon: longitude,
          variable: variable
        }
      }
    );
  }
}
```

---

## Testing Requirements

### Python Tests

```bash
# Run all tests
pytest

# Run specific test
pytest climatemaps/tests/test_contour.py::test_contour_generation

# Run with coverage
pytest --cov=climatemaps --cov-report=html

# Minimum coverage: 80%
```

**Test Structure:**
```python
import pytest
from climatemaps.contour import generate_contours

class TestContourGeneration:
    def test_contour_generation_valid_data(self):
        """Test contour generation with valid data."""
        data = [[20, 21], [22, 23]]
        result = generate_contours(data, levels=[20.5, 21.5, 22.5])
        assert len(result) == 3
        assert all(isinstance(r, Polygon) for r in result)
    
    def test_contour_generation_empty_data(self):
        """Test contour generation with empty data."""
        with pytest.raises(ValueError):
            generate_contours([], levels=[20])
```

### TypeScript/Angular Tests

```bash
# Run all tests
npm test

# Run specific test
npm test -- --include='**/climate.service.spec.ts'

# Run with coverage
npm test -- --code-coverage

# Minimum coverage: 80%
```

**Test Structure:**
```typescript
describe('ClimateService', () => {
  let service: ClimateService;
  let httpClientMock: HttpClientTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClimateService]
    });
    service = TestBed.inject(ClimateService);
    httpClientMock = TestBed.inject(HttpClientTestingController);
  });

  it('should fetch climate data', () => {
    const mockData: ClimateData = { temperature: 25.5 };
    service.getClimateData(0, 0, 'temperature').subscribe(data => {
      expect(data.temperature).toBe(25.5);
    });

    const request = httpClientMock.expectOne(req => 
      req.url === '/api/v1/climate/data'
    );
    request.flush(mockData);
    httpClientMock.verify();
  });
});
```

---

## Documentation

### When to Document

- New features (in code and user guide)
- API changes (update API docs)
- Breaking changes (update migration guide)
- Complex algorithms (add explanations)
- Configuration options (document in README)

### Documentation Standards

1. **Docstrings/Comments**
   - Describe "why" not just "what"
   - Include examples for complex functions
   - Document parameters and return values

2. **README**
   - Project overview
   - Installation instructions
   - Basic usage examples
   - Links to detailed docs

3. **Developer Guide**
   - Setup instructions
   - Architecture explanation
   - Common tasks
   - Troubleshooting

4. **User Guide**
   - Feature descriptions
   - Step-by-step instructions
   - Screenshots/diagrams
   - FAQ

---

## Reporting Bugs

### Bug Report Template

**Title:** [BUG] Brief description

**Environment:**
```
- OS: Windows/macOS/Linux
- Browser: Chrome/Firefox/Safari
- Version: [from footer]
- Setup: Docker/Local/Production
```

**Description:**
```
What were you trying to do?
What did you expect to happen?
What actually happened?
```

**Steps to Reproduce:**
```
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error
```

**Attachments:**
- Screenshot/video
- Error message
- Debug logs

### Bug Report Channel

- **Email:** [TODO:BUG_EMAIL]
- **Slack:** [TODO:SLACK_CHANNEL]
- **GitHub:** Issues tab

---

## Feature Requests

### Feature Request Template

**Title:** [FEATURE] Brief description

**Problem Statement:**
```
What problem does this solve?
Who would benefit?
```

**Proposed Solution:**
```
How would this feature work?
User interface/API changes?
```

**Alternative Solutions:**
```
Other approaches considered?
```

**Additional Context:**
```
Related features?
Mockups or examples?
```

### Feature Proposal Channel

- **Email:** [TODO:FEATURE_EMAIL]
- **Slack:** [TODO:SLACK_CHANNEL]
- **Discussion:** GitHub Discussions (future)

---

## Community Resources

### Chat & Support

- **Slack Channel:** [TODO:SLACK_CHANNEL]
- **Office Hours:** [TODO:OFFICE_HOURS]
- **Developer Community:** [TODO:COMMUNITY_LINK]

### Learning Resources

- [Developer Guide](docs/developer-guide.md)
- [Architecture Overview](docs/architecture/overview.md)
- [API Documentation](docs/api/index.md)

### Getting Help

1. Check documentation first
2. Search existing issues
3. Ask in Slack or GitHub Discussions
4. Create a GitHub issue if bug
5. Contact maintainers for urgent issues

---

## Recognition

### Contributors

Contributors are recognized in:
- `CONTRIBUTORS.md` (all contributors)
- GitHub "Contributors" page
- Release notes (if applicable)
- Project website (major contributions)

---

## License

By contributing to HackEarth, you agree that your contributions will be licensed under the MIT License.

---

## Questions?

- **General Questions:** Post in [TODO:SLACK_CHANNEL]
- **Development Help:** Contact [TODO:TECH_OWNER_NAME]
- **Policy Questions:** Contact [TODO:PRODUCT_OWNER_NAME]

---

**Last Updated**: February 2, 2026

*Thank you for contributing to HackEarth!*
