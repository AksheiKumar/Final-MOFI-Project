import os
import random
import string
import httpx
from fastapi import HTTPException, Response
from datetime import datetime
from bson import ObjectId
from jose import jwt as jose_jwt
from configuration import user_collection
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

if not GOOGLE_REDIRECT_URI:
    raise RuntimeError("GOOGLE_REDIRECT_URI is not set")


def google_auth_url():
    return (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={GOOGLE_REDIRECT_URI}"
        f"&response_type=code"
        f"&scope=openid%20email%20profile"
        f"&access_type=offline"
        f"&prompt=consent"
    )


def generate_username_from_name(name: str) -> str:
    """
    Example:
      Name:  John Doe
      Output: johndoeA7X9
    """
    base = ''.join(name.lower().replace(" ", ""))  # johndoe
    random_str = ''.join(random.choices(string.ascii_letters + string.digits, k=4))
    username = f"{base}{random_str}"

    while user_collection.find_one({"username": username}):
        random_str = ''.join(random.choices(string.ascii_letters + string.digits, k=4))
        username = f"{base}{random_str}"

    return username