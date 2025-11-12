from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import templates, export

app = FastAPI(
    title="Template/Export Service",
    description="CV template and export service for PDF and DOCX",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "template-export-service"}

# Include routers
app.include_router(templates.router, prefix="/api/templates", tags=["templates"])
app.include_router(export.router, prefix="/api/export", tags=["export"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3003)
