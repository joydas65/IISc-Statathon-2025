from fastapi import HTTPException

class PolicyViolation(HTTPException):
    def __init__(self, detail: str, status_code: int = 400):
        super().__init__(status_code=status_code,
                         detail={"error": "POLICY_VIOLATION", "message": detail})

class RateLimited(HTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=429, detail={"error": "RATE_LIMIT", "message": detail})