from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class FieldSchema(BaseModel):
    name: str = Field(..., description="Name of the field in the database")
    type: str = Field(..., description="Data type (String, Number, Boolean, Date, ObjectId)")
    required: bool = Field(False, description="Is the field required")
    unique: bool = Field(False, description="Is the field unique")

class ModelSchema(BaseModel):
    name: str = Field(..., description="Name of the MongoDB model/collection")
    fields: List[FieldSchema] = Field(..., description="List of fields belonging to the model")
    indexes: List[str] = Field([], description="Fields to index for optimization")

class RouteSchema(BaseModel):
    method: str = Field(..., description="HTTP Method (GET, POST, PUT, DELETE)")
    path: str = Field(..., description="Endpoint path, e.g., /api/resource")
    description: str = Field(..., description="Functionality of the route")
    body_model: Optional[str] = Field(None, description="Model to use for the request body")

class ArchitectureResponse(BaseModel):
    models: List[ModelSchema] = Field(..., description="Generated database schema models")
    routes: List[RouteSchema] = Field(..., description="Generated API routes")
    ui_layout_config: Dict[str, Any] = Field(..., description="JSON configuration for the frontend UI components")
