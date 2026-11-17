import sys
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from src.pdf_parser import extract_text_from_pdf
from src.resume_analyzer import analyze_resume


app = FastAPI(
    title="AI Resume Analyzer API"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():

    return {
        "message": "AI Resume Analyzer API is running"
    }


@app.post("/analyze")
async def analyze_resume_api(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):

    resume_text = extract_text_from_pdf(
        resume.file
    )

    result = analyze_resume(
        resume_text,
        job_description
    )

    return result