# Project YAML Generator Prompt

## Purpose
Generate a `project.yaml` manifest file for the Rouge Documentation Hub. This file is **required** for your project to appear on the Rouge homepage with a project card.

## Instructions

When asked to generate a `project.yaml` file, analyze the project and create a manifest following this exact schema:

## Schema

```yaml
# Project Manifest for Rouge Documentation Hub
# This file defines metadata for the project card display

name: "Project Display Name"
slug: "project-slug"  # URL-friendly (lowercase, hyphens only)
description: "Brief description (1-2 sentences, shown on card)"

# Project classification
language: "Python"  # Python, Java, JavaScript, TypeScript, Go, Rust, etc.
framework: "FastAPI"  # FastAPI, Django, Flask, Spring Boot, Express, etc.
category: "api"  # api, library, service, tool, other

# Tags for filtering (lowercase, hyphenated, 4-8 tags)
tags:
  - tag1
  - tag2

# Display settings
icon: "🐍"  # Single emoji representing the project
color: "#3776ab"  # Optional: Brand color (hex)

# Repository information
repository:
  url: "https://github.com/org/repo"
  branch: "main"
  docs_path: "docs"

# Project status
status: "active"  # active, beta, deprecated, archived

# Maintainers (at least one required)
maintainers:
  - name: "Team Name"
    email: "team@company.com"

# Quick links (shown as buttons on project card)
links:
  - title: "API Reference"
    path: "api/"
    icon: "📚"
  - title: "Getting Started"
    path: "guides/getting-started/"
    icon: "🚀"
  - title: "Architecture"
    path: "architecture/"
    icon: "🏗️"

# Version information
version: "1.0.0"
last_updated: "YYYY-MM-DD"  # Today's date

# Feature flags
features:
  has_api_docs: true
  has_architecture_docs: true
  has_tutorials: false
  has_changelog: false
```

## Field Guidelines

### Required Fields

| Field | Guidelines |
|-------|------------|
| `name` | Human-readable project name (Title Case) |
| `slug` | URL-safe identifier: lowercase, hyphens, no spaces (e.g., `my-awesome-api`) |
| `description` | 1-2 sentences describing what the project does. Keep under 150 characters. |
| `language` | Primary programming language |
| `framework` | Main framework or "None" if not applicable |
| `category` | One of: `api`, `library`, `service`, `tool`, `other` |
| `tags` | 4-8 relevant tags for filtering |
| `icon` | Single emoji that represents the project |
| `status` | Current project status |
| `maintainers` | At least one maintainer with name and email |
| `links` | 2-4 quick links to important documentation sections |
| `last_updated` | Today's date in YYYY-MM-DD format |

### Icon Selection Guide

| Language/Type | Suggested Icons |
|---------------|-----------------|
| Python | 🐍 |
| Java | ☕ |
| JavaScript/Node | 📦 or 🟨 |
| TypeScript | 🔷 |
| Go | 🐹 |
| Rust | 🦀 |
| API/REST | 🔌 or 🌐 |
| Library | 📚 |
| CLI Tool | ⚡ or 🛠️ |
| Service | ⚙️ |
| Database | 🗄️ |
| Security | 🔐 |
| ML/AI | 🤖 |

### Status Values

| Status | When to Use |
|--------|-------------|
| `active` | Actively maintained, production-ready |
| `beta` | In development, may have breaking changes |
| `deprecated` | No longer recommended, use alternative |
| `archived` | Read-only, historical reference |

### Category Values

| Category | Description |
|----------|-------------|
| `api` | REST API, GraphQL, or gRPC service |
| `library` | Reusable code package/module |
| `service` | Background service, worker, or microservice |
| `tool` | CLI tool, utility, or developer tool |
| `other` | Anything that doesn't fit above |

## Analysis Steps

1. **Examine the project structure** to determine:
   - Primary language (check file extensions, package files)
   - Framework (check dependencies in package.json, requirements.txt, pom.xml, etc.)
   - Project type/category

2. **Read existing documentation** to extract:
   - Project name and description
   - Key features for tags
   - Available documentation sections for links

3. **Check for maintainer info** in:
   - README.md
   - CODEOWNERS
   - package.json (author field)
   - pyproject.toml (authors field)

4. **Determine appropriate links** based on:
   - Existing docs/ folder structure
   - README sections
   - API documentation presence

## Example Output

For a Python FastAPI project:

```yaml
# Project Manifest for Rouge Documentation Hub

name: "User Management API"
slug: "user-management-api"
description: "A RESTful API for user authentication and profile management built with FastAPI and PostgreSQL."

language: "Python"
framework: "FastAPI"
category: "api"

tags:
  - api
  - rest
  - authentication
  - users
  - fastapi
  - postgresql

icon: "🐍"
color: "#3776ab"

repository:
  url: "https://github.com/ford/user-management-api"
  branch: "main"
  docs_path: "docs"

status: "active"

maintainers:
  - name: "Platform Team"
    email: "platform@ford.com"

links:
  - title: "API Reference"
    path: "api/"
    icon: "📚"
  - title: "Getting Started"
    path: "guides/getting-started/"
    icon: "🚀"
  - title: "Architecture"
    path: "architecture/"
    icon: "🏗️"

version: "2.1.0"
last_updated: "2025-01-15"

features:
  has_api_docs: true
  has_architecture_docs: true
  has_tutorials: true
  has_changelog: true
```

## Validation Checklist

Before finalizing, verify:

- [ ] `slug` is lowercase with hyphens only
- [ ] `description` is under 150 characters
- [ ] `icon` is a single emoji
- [ ] `status` is one of: active, beta, deprecated, archived
- [ ] `category` is one of: api, library, service, tool, other
- [ ] `last_updated` is in YYYY-MM-DD format
- [ ] At least one maintainer is listed
- [ ] At least 2 links are provided
- [ ] Tags are lowercase and hyphenated

## Usage

To generate a project.yaml, provide:

1. The project repository path or URL
2. Any specific requirements or preferences

Example prompt:
```
Generate a project.yaml for this repository. 
The project is maintained by the Data Platform team (data-platform@ford.com).
```
