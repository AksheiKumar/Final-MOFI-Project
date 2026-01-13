from fastapi import APIRouter, HTTPException,File,Form,UploadFile
from datetime import datetime, timedelta
from jose import jwt, JWTError
from dotenv import load_dotenv
import os
from utils.cloudinary_utils import upload_profile_image,delete_image
from configuration import user_collection
from model.user_model import RegisterRequest
from utils.password_utils import hash_password
from utils.email_utils import send_verification_email, reset_password_email
from utils.cloudinary_utils import delete_image
from schema.passwordreset import EmailRequest, ResetPasswordModel
from fastapi.responses import RedirectResponse
from fastapi import HTTPException

load_dotenv()

Router = APIRouter(prefix="/auth")

JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
FrontendURL=os.getenv("FRONTEND_URL")



@Router.post("/register")
async def register_user(
    first_name: str = Form(...),
    last_name: str = Form(...),
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    confirm_password: str = Form(...),
    dob: str = Form(...),
    file: UploadFile = File(None)
):

    if password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")


    if user_collection.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already exists")


    if user_collection.find_one({"username": username}):
        raise HTTPException(status_code=400, detail="Username already taken")


    hashed_pw = hash_password(password)


    cloud_url = None
    cloud_id = None

    if file:
        uploaded = upload_profile_image(file)

    if not uploaded:
        raise HTTPException(status_code=400, detail="Image upload failed")

    cloud_url = uploaded["url"]
    cloud_id = uploaded["public_id"]



    new_user = {
        "first_name": first_name,
        "last_name": last_name,
        "username": username,
        "dob": dob,
        "email": email,
        "password": hashed_pw,  
        "profile_pic": cloud_url,
        "profile_pic_id": cloud_id,
        "email_verified": False,
        "created_at": datetime.utcnow(),
        "expires_at": datetime.utcnow() + timedelta(minutes=2)
    }

    inserted = user_collection.insert_one(new_user)

    token = jwt.encode(
        {"email": email, "exp": datetime.utcnow() + timedelta(minutes=2)},
        JWT_SECRET,
        algorithm=ALGORITHM
    )


    if not send_verification_email(username, email, token):
        delete_image(cloud_id)
        user_collection.delete_one({"_id": inserted.inserted_id})
        raise HTTPException(status_code=500, detail="Failed to send verification email")

    return {"message": "User registered. Verification email sent. Please verify within 2 minutes."}



@Router.get("/verify/{token}")
async def verify_email(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        email = payload["email"]

        user = user_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        
        user_collection.update_one(
            {"email": email},
            {"$set": {"email_verified": True}, "$unset": {"expires_at": ""}}
        )

        return RedirectResponse(url="http://localhost:5173/")

    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired token")




@Router.post("/request-password-reset")
async def request_password_reset(request: EmailRequest):
    user = user_collection.find_one({"email": request.email})

    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    fullname = f"{user.get('first_name')} {user.get('last_name')}"

    token = jwt.encode(
        {"email": request.email, "exp": datetime.utcnow() + timedelta(minutes=10)},
        JWT_SECRET,
        algorithm=ALGORITHM
    )

    reset_password_email(fullname, request.email, token)

    return {"message": "Password reset link sent to email"}






@Router.post("/reset-password")
async def reset_password(payload: ResetPasswordModel):
    token = payload.token
    new_password = payload.new_password

    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        email = decoded.get("email")
    except:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    hashed_pw = hash_password(new_password)
    result = user_collection.update_one(
        {"email": email},
        {"$set": {"password": hashed_pw}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Password not updated")

    return {"success": True, "message": "Password updated"}




@Router.post("/decode-token")
async def decode_token(data: dict):
    try:
        payload = jwt.decode(data["token"], JWT_SECRET, algorithms=[ALGORITHM])
        return {"email": payload["email"]}
    except:
        raise HTTPException(status_code=400, detail="Invalid token")
    