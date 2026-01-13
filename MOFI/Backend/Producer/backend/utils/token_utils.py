# utils/token_utils.py
from jose import jwt
from datetime import datetime, timedelta
import os

JWT_SECRET = os.getenv("JWT_SECRET", "change_this")
ALGO = "HS256"
ACCESS_MIN = int(os.getenv("ACCESS_EXPIRE_MINUTES", 15))
REFRESH_DAYS = int(os.getenv("REFRESH_EXPIRE_DAYS", 15))

def create_access_token(user_id: str):
    payload = {
        "sub": user_id,
        "type": "access",
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_MIN)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=ALGO)

def create_refresh_token(user_id: str):
    payload = {
        "sub": user_id,
        "type": "refresh",
        "exp": datetime.utcnow() + timedelta(days=REFRESH_DAYS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=ALGO)

def decode_access_token(token: str):
    return jwt.decode(token, JWT_SECRET, algorithms=[ALGO])

def decode_refresh_token(token: str):
    return jwt.decode(token, JWT_SECRET, algorithms=[ALGO])
