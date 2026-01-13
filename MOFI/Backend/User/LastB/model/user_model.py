from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    username: str
    dob: str
    email: EmailStr
    password: str
    profile_pic: str       
    profile_pic_id: str   
