from pydantic import BaseModel, EmailStr
from datetime import datetime




class EmailRequest(BaseModel):
    email: EmailStr


class ResetPasswordModel(BaseModel):
    token: str
    new_password: str


class EmailVerifyModel(BaseModel):
    token: str
