from fastapi import APIRouter
from typing import List, Dict

router = APIRouter()

# Mock templates data
TEMPLATES = [
    {
        "id": "classic",
        "name": "Classic",
        "description": "Traditional CV template with clean layout",
        "preview": "/templates/classic/preview.png"
    },
    {
        "id": "modern",
        "name": "Modern",
        "description": "Contemporary design with accent colors",
        "preview": "/templates/modern/preview.png"
    },
    {
        "id": "minimal",
        "name": "Minimal",
        "description": "Minimalist design for a clean look",
        "preview": "/templates/minimal/preview.png"
    },
    {
        "id": "professional",
        "name": "Professional",
        "description": "Professional template suitable for corporate roles",
        "preview": "/templates/professional/preview.png"
    }
]

@router.get("/")
async def get_templates() -> List[Dict]:
    """Get all available CV templates"""
    return TEMPLATES

@router.get("/{template_id}")
async def get_template(template_id: str) -> Dict:
    """Get specific template by ID"""
    template = next((t for t in TEMPLATES if t["id"] == template_id), None)
    if not template:
        return {"error": "Template not found"}, 404
    return template
