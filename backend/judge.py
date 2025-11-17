import aiohttp
import asyncio
import base64
import os
from typing import List, Dict, Optional
from dotenv import load_dotenv

load_dotenv()

JUDGE0_API_URL = os.getenv("JUDGE0_API_URL", "https://judge0-ce.p.rapidapi.com")
JUDGE0_API_KEY = os.getenv("JUDGE0_API_KEY", "")

# Language ID mapping for Judge0
LANGUAGE_IDS = {
    "python": 71,      # Python 3.8.1
    "javascript": 63,  # JavaScript (Node.js 12.14.0)
    "java": 62,        # Java (OpenJDK 13.0.1)
    "cpp": 54,         # C++ (GCC 9.2.0)
    "c": 50,           # C (GCC 9.2.0)
    "go": 60,          # Go (1.13.5)
    "rust": 73,        # Rust (1.40.0)
    "ruby": 72,        # Ruby (2.7.0)
    "php": 68,         # PHP (7.4.1)
}

async def run_tests(code: str, language: str, tests: List[dict]) -> Dict:
    """
    Run code against test cases using Judge0 API
    
    Args:
        code: Source code to execute
        language: Programming language
        tests: List of test cases with stdin and expected_output
    
    Returns:
        Dictionary with passed status, output, and errors
    """
    language_id = LANGUAGE_IDS.get(language.lower())
    if not language_id:
        return {
            "passed": False,
            "errors": f"Unsupported language: {language}"
        }
    
    # Run all tests
    results = []
    all_passed = True
    total_time = 0.0
    
    async with aiohttp.ClientSession() as session:
        for i, test in enumerate(tests):
            try:
                # Create submission
                submission_data = {
                    "source_code": base64.b64encode(code.encode()).decode(),
                    "language_id": language_id,
                    "stdin": base64.b64encode((test.get("stdin") or "").encode()).decode(),
                    "expected_output": base64.b64encode(test["expected_output"].encode()).decode(),
                }
                
                headers = {
                    "content-type": "application/json",
                }
                
                # If using RapidAPI
                if JUDGE0_API_KEY:
                    headers["X-RapidAPI-Key"] = JUDGE0_API_KEY
                    headers["X-RapidAPI-Host"] = "judge0-ce.p.rapidapi.com"
                
                # Submit code
                async with session.post(
                    f"{JUDGE0_API_URL}/submissions?base64_encoded=true&wait=true",
                    json=submission_data,
                    headers=headers
                ) as response:
                    if response.status != 200 and response.status != 201:
                        return {
                            "passed": False,
                            "errors": f"Judge0 API error: {response.status}"
                        }
                    
                    result = await response.json()
                    
                    # Check result
                    status_id = result.get("status", {}).get("id")
                    stdout = result.get("stdout")
                    stderr = result.get("stderr")
                    compile_output = result.get("compile_output")
                    time = result.get("time")
                    
                    if stdout:
                        stdout = base64.b64decode(stdout).decode().strip()
                    if stderr:
                        stderr = base64.b64decode(stderr).decode().strip()
                    if compile_output:
                        compile_output = base64.b64decode(compile_output).decode().strip()
                    
                    # Status ID meanings:
                    # 3 = Accepted
                    # 4 = Wrong Answer
                    # 5 = Time Limit Exceeded
                    # 6 = Compilation Error
                    # 11 = Runtime Error
                    
                    test_passed = status_id == 3
                    expected = test["expected_output"].strip()
                    
                    results.append({
                        "test_case": i + 1,
                        "passed": test_passed,
                        "input": test.get("stdin") or "",
                        "expected": expected,
                        "actual": stdout or "",
                        "stderr": stderr or "",
                        "compile_output": compile_output or "",
                        "status": result.get("status", {}).get("description", "Unknown"),
                        "time": time or 0,
                    })
                    
                    if not test_passed:
                        all_passed = False
                    
                    if time:
                        total_time += float(time)
                
            except Exception as e:
                results.append({
                    "test_case": i + 1,
                    "passed": False,
                    "error": str(e),
                })
                all_passed = False
    
    # Compile error message if any failed
    error_msg = None
    if not all_passed:
        failed_tests = [r for r in results if not r.get("passed")]
        error_details = []
        for ft in failed_tests:
            msg = f"Test {ft['test_case']}: {ft.get('status', 'Failed')}"
            if ft.get("stderr"):
                msg += f"\n  Error: {ft['stderr']}"
            if ft.get("compile_output"):
                msg += f"\n  Compile: {ft['compile_output']}"
            if ft.get("expected") and ft.get("actual"):
                msg += f"\n  Expected: {ft['expected']}\n  Got: {ft['actual']}"
            error_details.append(msg)
        error_msg = "\n\n".join(error_details)
    
    return {
        "passed": all_passed,
        "output": results,
        "errors": error_msg,
        "execution_time": total_time,
    }


# Fallback function for testing without Judge0
async def run_tests_mock(code: str, language: str, tests: List[dict]) -> Dict:
    """
    Mock test runner for development without Judge0 API
    """
    # Simple mock - just check if code is not empty
    if not code or len(code) < 10:
        return {
            "passed": False,
            "errors": "Code too short"
        }
    
    return {
        "passed": True,
        "output": [{"test_case": i+1, "passed": True} for i in range(len(tests))],
        "execution_time": 0.1 * len(tests),
    }
