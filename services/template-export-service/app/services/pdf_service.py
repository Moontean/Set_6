from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from io import BytesIO

def generate_pdf(cv_data: dict) -> bytes:
    """Generate PDF from CV data"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#2c3e50'),
        spaceAfter=12
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#34495e'),
        spaceAfter=6,
        spaceBefore=12
    )

    # Name and contact info
    story.append(Paragraph(cv_data.get('fullName', 'N/A'), title_style))
    
    contact_info = []
    if cv_data.get('email'):
        contact_info.append(cv_data['email'])
    if cv_data.get('phone'):
        contact_info.append(cv_data['phone'])
    if cv_data.get('address'):
        contact_info.append(cv_data['address'])
    
    if contact_info:
        story.append(Paragraph(' | '.join(contact_info), styles['Normal']))
    
    story.append(Spacer(1, 0.2*inch))

    # Summary
    if cv_data.get('summary'):
        story.append(Paragraph('Professional Summary', heading_style))
        story.append(Paragraph(cv_data['summary'], styles['Normal']))
        story.append(Spacer(1, 0.2*inch))

    # Experience
    if cv_data.get('experience'):
        story.append(Paragraph('Experience', heading_style))
        for exp in cv_data['experience']:
            company = exp.get('company', 'N/A')
            position = exp.get('position', 'N/A')
            story.append(Paragraph(f"<b>{position}</b> at {company}", styles['Normal']))
            
            dates = f"{exp.get('startDate', 'N/A')} - {exp.get('endDate', 'Present')}"
            story.append(Paragraph(dates, styles['Normal']))
            
            if exp.get('description'):
                story.append(Paragraph(exp['description'], styles['Normal']))
            
            story.append(Spacer(1, 0.1*inch))

    # Education
    if cv_data.get('education'):
        story.append(Paragraph('Education', heading_style))
        for edu in cv_data['education']:
            institution = edu.get('institution', 'N/A')
            degree = edu.get('degree', 'N/A')
            field = edu.get('field', 'N/A')
            story.append(Paragraph(f"<b>{degree}</b> in {field}", styles['Normal']))
            story.append(Paragraph(institution, styles['Normal']))
            
            dates = f"{edu.get('startDate', 'N/A')} - {edu.get('endDate', 'Present')}"
            story.append(Paragraph(dates, styles['Normal']))
            story.append(Spacer(1, 0.1*inch))

    # Skills
    if cv_data.get('skills'):
        story.append(Paragraph('Skills', heading_style))
        skills_text = ', '.join(cv_data['skills'])
        story.append(Paragraph(skills_text, styles['Normal']))
        story.append(Spacer(1, 0.1*inch))

    # Languages
    if cv_data.get('languages'):
        story.append(Paragraph('Languages', heading_style))
        languages_text = ', '.join(cv_data['languages'])
        story.append(Paragraph(languages_text, styles['Normal']))

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
