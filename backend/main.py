from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from judge import run_tests

app = FastAPI(title="Code Golf Judge Service")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TestCase(BaseModel):
    stdin: Optional[str] = None
    expected_output: str

class JudgeRequest(BaseModel):
    code: str
    language: str
    tests: List[TestCase]
    matchId: str
    playerId: str

class JudgeResponse(BaseModel):
    passed: bool
    output: Optional[List[dict]] = None
    errors: Optional[str] = None
    execution_time: Optional[float] = None

@app.get("/")
async def root():
    return {"message": "Code Golf Judge Service", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/judge", response_model=JudgeResponse)
async def judge_submission(request: JudgeRequest):
    """
    Judge a code submission against test cases using Judge0 API
    """
    try:
        result = await run_tests(
            code=request.code,
            language=request.language,
            tests=request.tests
        )
        
        return JudgeResponse(
            passed=result["passed"],
            output=result.get("output"),
            errors=result.get("errors"),
            execution_time=result.get("execution_time")
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
