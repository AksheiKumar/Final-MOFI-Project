from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Response, Request, BackgroundTasks
from datetime import datetime, timedelta
from fastapi.responses import RedirectResponse
from jose import jwt, JWTError
from dotenv import load_dotenv
import os
import asyncio

from configuration import producer_collection
from utils.password_utils import hash_password, verify_password
from utils.cloudinary_utils import upload_profile_image_file, delete_image
from utils.email_utils import send_verification_email
from utils.token_utils import create_access_token, create_refresh_token, decode_access_token, decode_refresh_token
from bson import ObjectId

load_dotenv()
JWT_SECRET = os.getenv("JWT_SECRET")
ALGO = "HS256"
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5174")
UNVERIFIED_DELETE_DAYS = int(os.getenv("UNVERIFIED_DELETE_DAYS", 7))

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
async def register_user(
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    confirm_password: str = Form(...),
    contact: str= Form(...),
    dob: str = Form(""),
    nic_number: str = Form(...),
    street_address: str = Form(...),
    city: str = Form(...),
    state: str =Form(...),
    postal:str=Form(...),
    country:str = Form(...),
    professionalName: str = Form(None),
    
    

    profile_pic: UploadFile = File(None),
):
    if password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    # unique email
    if await producer_collection.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already exists")
    

    hashed_pw = hash_password(password)

    pic_url = pic_id = None

    try:
        if profile_pic:
            up = upload_profile_image_file(profile_pic)
            if not up:
                raise HTTPException(status_code=400, detail="Profile upload failed")
            pic_url, pic_id = up["url"], up["public_id"]
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
       
        if pic_id: delete_image(pic_id)
        raise HTTPException(status_code=400, detail="Image upload error")

    now = datetime.utcnow()
    new_doc = {
        "first_name": first_name,
        "last_name": last_name,
        "dob": dob,
        "email": email,
        "professionalName": professionalName,
        "password": hashed_pw,
        "nic_number": nic_number,
        "profile_pic": pic_url,
        "profile_pic_id": pic_id,
        "email_verified": False,
        "street_address":street_address,
        "city":city,
        "state":state,
        "postal":postal,
        "country":country,
        "contact":contact,
        "created_at": now
    }

    await producer_collection.insert_one(new_doc)


    token = jwt.encode({"email": email, "exp": datetime.utcnow() + timedelta(minutes=15)}, JWT_SECRET, algorithm=ALGO)
    send_verification_email(first_name  or "User", email, token)

    return {"message": "Registered. Check email for verification link."}


@router.post("/resend-verification")
async def resend_verification(data: dict):
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email required")
    user = await producer_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="Not found")
    if user.get("email_verified", False):
        return {"message": "Already verified"}
    token = jwt.encode({"email": email, "exp": datetime.utcnow() + timedelta(minutes=15)}, JWT_SECRET, algorithm=ALGO)
    send_verification_email(user.get("first_name") or user.get("username"), email, token)
    return {"message": "Verification email resent"}


@router.get("/verify-email/{token}")
async def verify_email(token: str):
    if not token:
        raise HTTPException(400, "Token required")

    try:
        data = jwt.decode(token, JWT_SECRET, algorithms=[ALGO])
        email = data.get("email")
    except JWTError:
        return RedirectResponse(f"{FRONTEND_URL}/verify?status=invalid")

    await producer_collection.update_one(
        {"email": email},
        {"$set": {"email_verified": True}}
    )

    return RedirectResponse(f"{FRONTEND_URL}/login?verified=success")


@router.post("/login")
async def login(payload: dict, response: Response):
    email = payload.get("email")
    password = payload.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")

    user = await producer_collection.find_one({"email": email})
    if user:
        if not verify_password(password, user["password"]):
            raise HTTPException(status_code=400, detail="Invalid credentials")

        if not user.get("email_verified", False):
            raise HTTPException(status_code=403, detail="Email not verified")


    user_id = str(user["_id"])

    access = create_access_token(user_id)
    refresh = create_refresh_token(user_id)

    response.set_cookie(
        key="refresh_token",
        value=refresh,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 24 * 15
    )

    return {
        "access": access,
        "user": {
            "id": user_id,
            "email": user.get("email"),
            "first_name": user.get("first_name"),  # null for assistant
            "professionalName": user.get("professionalName"),
            "profile_pic": user.get("profile_pic"),
        }
    }




@router.post("/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Missing refresh token")

    try:
        payload = decode_refresh_token(token)

        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        user_id = payload.get("sub")

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    new_access = create_access_token(user_id)
    new_refresh = create_refresh_token(user_id)

    response.set_cookie(
        key="refresh_token",
        value=new_refresh,
        httponly=True,
        secure=False, 
        samesite="lax",
        max_age=60 * 60 * 24 * int(os.getenv("REFRESH_EXPIRE_DAYS", 15))
    )

    return {
        "access": new_access,
    }



@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("refresh_token")
    return {"message": "Logged out"}




@router.get("/me")
async def me(request: Request):
    # Get Authorization header
    auth = request.headers.get("authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing access token")

    token = auth.split(" ")[1]

    # Decode access token
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired access token")

    # Fetch user from DB
    user = await producer_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Return safe user data
    return {
        "id": str(user["_id"]),
        "email": user.get("email"),
        "professionalName": user.get("professionalName"),
        "first_name": user.get("first_name"),
        "profile_pic": user.get("profile_pic"),
    }


