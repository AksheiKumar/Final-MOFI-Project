from pydantic import BaseModel

class GoogleUserResponse(BaseModel):
    message: str
    access_token: str
    token_type: str = "bearer"
    email: str
    role: str
