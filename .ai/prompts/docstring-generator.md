# Python Docstring Generator Prompt

## Purpose
Generate comprehensive Google-style docstrings for Python code that document the **business logic and intent**, not just the programming language syntax.

## Instructions for AI Agent

When generating docstrings, follow these guidelines:

### 1. Module-Level Docstrings

```python
"""
[Brief one-line description of what this module does in business terms]

[Detailed description explaining:
- The business problem this module solves
- How it fits into the larger system
- Key responsibilities and boundaries]

Business Context:
    [Explain the business domain this module operates in]

Dependencies:
    [List key dependencies and why they're needed]

Example:
    [Provide a practical usage example]

Note:
    [Any important considerations, limitations, or gotchas]

See Also:
    [Related modules or documentation]
"""
```

### 2. Class Docstrings

```python
class ClassName:
    """
    [One-line description of what this class represents in business terms]

    [Detailed description explaining:
    - The business entity or concept this class models
    - Its role in the system
    - Key behaviors and responsibilities]

    Attributes:
        attr_name (type): [Business meaning, not just "the attribute"]
            Example: user_id (int): Unique identifier for the customer account
                     in the billing system.

    Business Rules:
        - [List any business rules this class enforces]
        - [Validation rules with business context]

    Example:
        [Show how to create and use this class in a real scenario]

    Raises:
        ExceptionType: [When and why this exception occurs in business terms]

    See Also:
        [Related classes or documentation]
    """
```

### 3. Method/Function Docstrings

```python
def function_name(param1: Type, param2: Type) -> ReturnType:
    """
    [One-line description of what this function accomplishes - business outcome]

    [Detailed description explaining:
    - The business operation being performed
    - Why this operation is needed
    - Any side effects or state changes]

    Args:
        param1 (Type): [Business meaning and valid values]
            Must be [constraints in business terms].
        param2 (Type): [Business meaning and valid values]
            Defaults to [default] which means [business implication].

    Returns:
        ReturnType: [What the return value represents in business terms]
            - [Describe structure if complex]
            - [Explain what different return values mean]

    Raises:
        ValueError: [Business scenario that causes this]
        PermissionError: [Business scenario that causes this]

    Business Rules:
        - [Rule 1 with business context]
        - [Rule 2 with business context]

    Example:
        >>> result = function_name(value1, value2)
        >>> # Expected outcome in business terms

    Note:
        [Performance considerations, caching behavior, etc.]

    See Also:
        [Related functions or documentation]
    """
```

### 4. Key Principles

1. **Document the WHY, not the WHAT**
   - ❌ "Loops through the list and returns filtered items"
   - ✅ "Filters active customer accounts to identify those eligible for the loyalty program based on purchase history"

2. **Use Business Domain Language**
   - ❌ "Sets the value of x to y"
   - ✅ "Updates the customer's subscription tier based on their annual spending threshold"

3. **Include Business Context**
   - Explain business rules being enforced
   - Reference relevant business processes
   - Mention compliance or regulatory requirements if applicable

4. **Provide Realistic Examples**
   - Use domain-specific example data
   - Show common use cases
   - Include edge cases with business meaning

5. **Document Exceptions in Business Terms**
   - ❌ "Raises ValueError if input is invalid"
   - ✅ "Raises ValueError when the order amount exceeds the customer's credit limit ($10,000 for standard accounts)"

### 5. Placeholders for Unknown Information

When information is not available, use searchable placeholders:

```python
"""
[TODO:BUSINESS_CONTEXT] - Describe the business context for this module
[TODO:OWNER] - Add the team/person responsible
[TODO:EAMS_RECORD] - Add EAMS record number
[TODO:BUSINESS_RULE] - Document the business rule being implemented
[TODO:EXAMPLE] - Add a realistic usage example
[TODO:COMPLIANCE] - Add any compliance requirements
"""
```

### 6. Type Hints

Always include type hints that are self-documenting:

```python
from typing import Optional, List, Dict, Union
from datetime import datetime
from decimal import Decimal

def process_order(
    customer_id: int,
    items: List[Dict[str, Union[str, int, Decimal]]],
    discount_code: Optional[str] = None,
    ship_date: Optional[datetime] = None
) -> Dict[str, Union[str, Decimal, List[str]]]:
    """..."""
```

## Agent Interaction Mode

If operating as an interactive agent, ask for the following information when documenting code:

1. "What business problem does this code solve?"
2. "Who are the primary users of this functionality?"
3. "What business rules or constraints apply?"
4. "Are there any compliance or regulatory requirements?"
5. "What are common error scenarios in business terms?"
6. "Can you provide a real-world example use case?"

Update the documentation iteratively based on responses.
