# backend/routes/auth.py
from fastapi import APIRouter, HTTPException, Response, Request
from fastapi.responses import RedirectResponse
from passlib.context import CryptContext
from bson import ObjectId
from datetime import datetime
import httpx
from jose import jwt as jose_jwt
import os
from configuration import user_collection
from utils.token_utils import create_access_token, create_refresh_token, decode_token
from utils.oauth_utils import google_auth_url, generate_username_from_name

UserRouter = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# -------------------- NORMAL LOGIN --------------------
@UserRouter.post("/login")
async def login(data: dict, response: Response):
    email = data.get("email")
    password = data.get("password")

    user = user_collection.find_one({"email": email})
    if not user or not pwd_context.verify(password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    user_id = str(user["_id"])
    access = create_access_token(user_id)
    refresh = create_refresh_token(user_id)

    response.set_cookie(
        key="refresh_token",
        value=refresh,
        httponly=True,
        secure=False,  # local dev HTTP
        samesite="lax",
        max_age=60*60*24*15,
        path="/",
    )

    return {
        "access": access,
        "user": {
            "id": user_id,
            "email": user["email"],
            "name": user.get("name"),
            "picture": user.get("profile_pic")
        }
    }

# -------------------- TOKEN ROTATION --------------------
@UserRouter.post("/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Missing refresh token")

    try:
        payload = decode_token(token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        user_id = payload.get("sub")
    except Exception as e:
        print("Refresh token error:", e)
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    new_access = create_access_token(user_id)
    new_refresh = create_refresh_token(user_id)

    response.set_cookie(
        key="refresh_token",
        value=new_refresh,
        httponly=True,
        secure=False,  # local dev
        samesite="lax",
        max_age=60*60*24*15,
        path="/",
    )

    return {"access": new_access}

# -------------------- LOGOUT --------------------
@UserRouter.post("/logout")
async def logout(response: Response):
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out"}

# -------------------- GET CURRENT USER --------------------
@UserRouter.get("/me")
async def me(request: Request):
    auth = request.headers.get("authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401)

    token = auth.split(" ")[1]
    payload = decode_token(token)
    user = user_collection.find_one({"_id": ObjectId(payload["sub"])})

    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user.get("name"),
        "picture": user.get("profile_pic")
    }

# -------------------- GOOGLE LOGIN --------------------
@UserRouter.get("/google/login")
async def google_login():
    return {"url": google_auth_url()}

from fastapi.responses import RedirectResponse

@UserRouter.get("/callback")
async def google_callback(code: str):
    FRONTEND_URL = "http://localhost:5173"

    # 1️⃣ Exchange code for tokens
    token_url = "https://oauth2.googleapis.com/token"
    payload = {
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": os.getenv("GOOGLE_REDIRECT_URI"),
    }

    async with httpx.AsyncClient() as client:
        google_resp = await client.post(token_url, data=payload)
        token_data = google_resp.json()

    if "id_token" not in token_data:
        raise HTTPException(status_code=400, detail="Google auth failed")

    user_info = jose_jwt.get_unverified_claims(token_data["id_token"])
    email = user_info["email"]
    name = user_info["name"]
    picture = user_info.get("picture")

    user = user_collection.find_one({"email": email})
    if not user:
        user = {
            "email": email,
            "name": name,
            "username": generate_username_from_name(name),
            "provider": "google",
            "profile_pic": picture,
            "created_at": datetime.utcnow(),
        }
        user["_id"] = user_collection.insert_one(user).inserted_id

    user_id = str(user["_id"])
    access = create_access_token(user_id)
    refresh = create_refresh_token(user_id)

    # 2️⃣ Create RedirectResponse
    redirect_resp = RedirectResponse(
        url=f"{FRONTEND_URL}/?access={access}",
        status_code=302,
    )

    # 3️⃣ Set cookie directly on redirect
    redirect_resp.set_cookie(
        key="refresh_token",
        value=refresh,
        httponly=True,
        secure=False,  # True in prod
        samesite="lax",
        max_age=60 * 60 * 24 * 15,
        path="/",
    )

    return redirect_resp


# -------------------- LOGOUT --------------------
@UserRouter.post("/logout")
async def logout(response: Response):
    response.delete_cookie("refresh_token")
    return {"message": "Logged out"}
