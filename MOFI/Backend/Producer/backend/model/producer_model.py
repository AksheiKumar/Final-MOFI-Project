from pydantic import BaseModel, EmailStr

class ProducerRegister(BaseModel):
    first_name: str
    last_name: str
    dob: str = None
    email: EmailStr
    username: str
    password: str
    confirm_password: str
    nic_number: str
