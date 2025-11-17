# Python Backend for Code Golf Judge Service

This FastAPI service acts as a wrapper around the Judge0 API for executing and judging code submissions.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure Judge0 API:
   - Sign up at https://rapidapi.com/judge0-official/api/judge0-ce
   - Get your API key
   - Add it to `.env`

## Run

```bash
python main.py
```

Or with uvicorn:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Docker

Build:
```bash
docker build -t codegolf-judge .
```

Run:
```bash
docker run -p 8000:8000 --env-file .env codegolf-judge
```

## API Endpoints

### POST /judge
Judge a code submission against test cases.

Request:
```json
{
  "code": "print('Hello World')",
  "language": "python",
  "tests": [
    {
      "stdin": "",
      "expected_output": "Hello World"
    }
  ],
  "matchId": "...",
  "playerId": "..."
}
```

Response:
```json
{
  "passed": true,
  "output": [...],
  "errors": null,
  "execution_time": 0.123
}
```

## Supported Languages

- Python
- JavaScript (Node.js)
- Java
- C++
- C
- Go
- Rust
- Ruby
- PHP
