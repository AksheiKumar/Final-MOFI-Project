from pydantic import BaseModel, EmailStr

class EmailVerifyModel(BaseModel):
    token: str
