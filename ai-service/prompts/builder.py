from schemas.architecture import ArchitectureResponse
from pydantic import ValidationError

def get_architecture_prompt(user_prompt: str) -> str:
    """
    Generates the strict prompt for the LLM to output only JSON architecture config.
    """
    return f"""
You are an expert AI software architect for a SaaS platform. 
A user has requested a new micro-SaaS application with the following description:

USER REQUEST:
"{user_prompt}"

INSTRUCTIONS:
You must design the backend database schema and API routes for this application.
Your output MUST be EXCLUSIVELY a JSON object. Do not include markdown code blocks, explanations, or any other text.
The JSON object must perfectly match the following structure:

{{
  "models": [
    {{
      "name": "CollectionName",  // E.g., "products", "invoices"
      "fields": [
        {{
          "name": "fieldName",
          "type": "String",      // Must be one of: "String", "Number", "Boolean", "Date", "ObjectId"
          "required": true,
          "unique": false
        }}
      ],
      "indexes": ["fieldName"]   // Fields to index for optimization
    }}
  ],
  "routes": [
    {{
      "method": "GET",           // "GET", "POST", "PUT", "DELETE"
      "path": "/api/v1/dynamic/CollectionName",
      "description": "Short description of what the route does",
      "body_model": "CollectionName" // Only required for POST/PUT
    }}
  ],
  "ui_layout_config": {{
    "theme": "dark",
    "primary_color": "#3B82F6",
    "components": [
      {{ "type": "table", "data_source": "CollectionName", "title": "Data List" }}
    ]
  }}
}}

SAFETY RULES:
1. Do NOT generate executable code snippets (no Python, no Node.js).
2. Respond ONLY with the raw JSON object. Never wrap it in markdown.
3. Every field type MUST adhere strictly to the allowed Types (String, Number, Boolean, Date, ObjectId).
"""
