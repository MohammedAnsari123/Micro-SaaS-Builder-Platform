from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, ValidationError
import json
from schemas.architecture import ArchitectureResponse
from schemas.response import APIResponse
from services.llm import QwenLocalService
from prompts.builder import get_architecture_prompt

router = APIRouter()
llm_service = QwenLocalService()

class GenerateRequest(BaseModel):
    prompt: str

@router.post("/generate-tool", response_model=APIResponse)
async def generate_tool(request: GenerateRequest):
    """
    Accepts a user prompt and returns a validated JSON architecture configuration.
    """
    try:
        # 1. Get the strict prompt
        full_prompt = get_architecture_prompt(request.prompt)

        # 2. Call the LLM (Simulated or Local API)
        raw_response = await llm_service.generate_architecture(full_prompt)

        # 3. Clean and parse JSON
        # Sometimes LLMs wrap in markdown even when instructed not to
        cleaned_response = raw_response.strip()
        if cleaned_response.startswith("```json"):
            cleaned_response = cleaned_response[7:]
        if cleaned_response.startswith("```"):
            cleaned_response = cleaned_response[3:]
        if cleaned_response.endswith("```"):
            cleaned_response = cleaned_response[:-3]
        
        cleaned_response = cleaned_response.strip()

        # Parse JSON
        parsed_data = json.loads(cleaned_response)

        # 4. Validate with Pydantic
        # This acts as the Safety Layer & Validation Layer.
        validated_architecture = ArchitectureResponse(**parsed_data)

        # 5. Return structured config
        return APIResponse(
            success=True,
            data=validated_architecture.model_dump(),
            message="Architecture generated successfully"
        )

    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {e}\nRaw LLM Output:\n{raw_response}")
        raise HTTPException(
            status_code=500, 
            detail="AI generated malformed JSON. Please try again."
        )
    except ValidationError as e:
        print(f"Pydantic Validation Error: {e}\nParsed Output:\n{parsed_data}")
        raise HTTPException(
            status_code=500, 
            detail="AI generated an architecture that did not meet strict schema rules. Please try again."
        )
    except Exception as e:
        print(f"Unexpected Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
