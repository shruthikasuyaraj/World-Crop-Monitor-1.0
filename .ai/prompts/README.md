# AI Documentation Prompts

This directory contains prompts for AI coding assistants (GitHub Copilot, Cursor, Qodo, etc.) to generate consistent, high-quality documentation.

## Available Prompts

| Prompt | Purpose | Output |
|--------|---------|--------|
| [complete-docs-generator.md](complete-docs-generator.md) | **Master prompt** - Generates all documentation | Full docs/ structure |
| [docstring-generator.md](docstring-generator.md) | Python docstrings (Google-style) | Code documentation |
| [readme-generator.md](readme-generator.md) | Project README | README.md |
| [developer-guide-generator.md](developer-guide-generator.md) | Developer setup guide | docs/developer-guide.md |
| [architecture-docs-generator.md](architecture-docs-generator.md) | Architecture documentation | docs/architecture/ |
| [user-guide-generator.md](user-guide-generator.md) | End-user documentation | docs/user-guide.md |

## Quick Start

### Option 1: Generate All Documentation

Use the master prompt to generate complete documentation:

1. Open `complete-docs-generator.md`
2. Copy the prompt to your AI assistant
3. Answer the questions about your project
4. AI will generate all documentation files

### Option 2: Generate Specific Documentation

Use individual prompts for specific documentation needs:

```
# For code documentation
Use: docstring-generator.md

# For README
Use: readme-generator.md

# For developer guide
Use: developer-guide-generator.md

# For architecture docs
Use: architecture-docs-generator.md

# For user guide
Use: user-guide-generator.md
```

## Documentation Standards

### Required Documentation

Every project must have:

1. **README.md** (root)
   - Business problem description
   - EAMS record number
   - Ownership & contacts
   - Quick start guide

2. **docs/developer-guide.md**
   - Prerequisites
   - Setup instructions
   - Secrets management
   - Testing guide

3. **docs/user-guide.md** (if applicable)
   - End-user instructions
   - Feature documentation
   - Troubleshooting

4. **docs/architecture/**
   - System overview
   - Component diagrams
   - Data flow diagrams

5. **Code Documentation**
   - All public classes/methods documented
   - Business logic explained
   - Examples provided

### Diagram Standards

| Diagram Type | Tool | Use Case |
|--------------|------|----------|
| Sequence diagrams | Mermaid | API flows, business processes |
| Component diagrams | Mermaid | System structure |
| State diagrams | Mermaid | Entity lifecycles |
| Flowcharts | Mermaid | Decision trees, error handling |
| Block architecture | Miro | High-level system views |

### Placeholder Convention

Use `[TODO:IDENTIFIER]` for unknown information:

```markdown
| EAMS Record | [TODO:EAMS_RECORD] |
| Technical Owner | [TODO:TECH_OWNER_NAME] |
| Support Channel | [TODO:SLACK_CHANNEL] |
```

## Integration with IDE

### VS Code / Cursor

1. Open the prompt file
2. Select all content
3. Use "Ask AI" or chat feature
4. Paste the prompt and provide context

### GitHub Copilot

1. Open the prompt file in a comment block
2. Start typing and let Copilot complete
3. Or use Copilot Chat with the prompt

### Qodo

1. Reference the prompt file in your request
2. Ask Qodo to generate documentation following the prompt

## Customization

To customize prompts for your organization:

1. Fork the prompts to your project
2. Update placeholders with your standards
3. Add organization-specific sections
4. Update the README with your changes

## Contributing

To improve these prompts:

1. Test the prompt with your AI assistant
2. Note any issues or improvements
3. Submit a PR with your changes
4. Include examples of improved output
