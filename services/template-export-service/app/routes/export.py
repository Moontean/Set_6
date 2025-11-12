from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
from typing import List, Dict, Optional
from app.services.pdf_service import generate_pdf
from app.services.docx_service import generate_docx

router = APIRouter()

class ExperienceItem(BaseModel):
    company: str
    position: str
    startDate: str
    endDate: Optional[str] = None
    description: Optional[str] = None

class EducationItem(BaseModel):
    institution: str
    degree: str
    field: str
    startDate: str
    endDate: Optional[str] = None

class CVData(BaseModel):
    fullName: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    summary: Optional[str] = None
    experience: Optional[List[ExperienceItem]] = []
    education: Optional[List[EducationItem]] = []
    skills: Optional[List[str]] = []
    languages: Optional[List[str]] = []
    templateId: Optional[str] = "classic"

@router.post("/pdf")
async def export_to_pdf(cv_data: CVData):
    """Export CV to PDF format"""
    try:
        pdf_bytes = generate_pdf(cv_data.dict())
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=cv_{cv_data.fullName.replace(' ', '_')}.pdf"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")

@router.post("/docx")
async def export_to_docx(cv_data: CVData):
    """Export CV to DOCX format"""
    try:
        docx_bytes = generate_docx(cv_data.dict())
        
        return Response(
            content=docx_bytes,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={
                "Content-Disposition": f"attachment; filename=cv_{cv_data.fullName.replace(' ', '_')}.docx"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate DOCX: {str(e)}")
