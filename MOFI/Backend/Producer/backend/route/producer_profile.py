from datetime import datetime
from configuration import producer_collection,assistant_collection
from utils.password_utils import hash_password, verify_password
from utils.cloudinary_utils import upload_profile_image_file, delete_image
from utils.email_utils import send_verification_email
from utils.token_utils import create_access_token, create_refresh_token, decode_access_token, decode_refresh_token
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Request, UploadFile, File, Form, BackgroundTasks

router = APIRouter(prefix="/producer", tags=["profile"])
@router.get("/profile")
async def get_profile(request: Request):
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

    # Return complete profile data (excluding sensitive fields)
    return {
        "id": str(user["_id"]),
        "email": user.get("email"),
        "first_name": user.get("first_name"),
        "last_name": user.get("last_name"),
        "professionalName": user.get("professionalName"),
        "profile_pic": user.get("profile_pic"),
        "contact": user.get("contact"),
        "dob": user.get("dob"),
        "nic_number": user.get("nic_number"),
        "street_address": user.get("street_address"),
        "city": user.get("city"),
        "state": user.get("state"),
        "postal": user.get("postal"),
        "country": user.get("country"),
        "email_verified": user.get("email_verified", False),
        "created_at": user.get("created_at")
    }


@router.put("/update/profile")
async def update_profile(
    request: Request,
    background_tasks: BackgroundTasks,
    first_name: str = Form(None),
    last_name: str = Form(None),
    contact: str = Form(None),
    dob: str = Form(None),
    street_address: str = Form(None),
    city: str = Form(None),
    state: str = Form(None),
    postal: str = Form(None),
    country: str = Form(None),
    professionalName: str = Form(None),
    profile_pic: UploadFile = File(None)
):
    # Get Authorization header
    auth = request.headers.get("authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing access token")

    token = auth.split(" ")[1]

    # Decode access token
    try:
        payload = decode_access_token(token)
        user_id = ObjectId(payload.get("sub"))
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired access token")

    # Fetch existing user
    user = await producer_collection.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = {}
    
    # Add fields to update if provided
    if first_name is not None:
        update_data["first_name"] = first_name
    if last_name is not None:
        update_data["last_name"] = last_name
    if contact is not None:
        update_data["contact"] = contact
    if dob is not None:
        update_data["dob"] = dob
    if street_address is not None:
        update_data["street_address"] = street_address
    if city is not None:
        update_data["city"] = city
    if state is not None:
        update_data["state"] = state
    if postal is not None:
        update_data["postal"] = postal
    if country is not None:
        update_data["country"] = country
    if professionalName is not None:
        update_data["professionalName"] = professionalName

    # Handle profile picture update
    if profile_pic:
        try:
            # Delete old profile picture if exists
            old_pic_id = user.get("profile_pic_id")
            if old_pic_id:
                background_tasks.add_task(delete_image, old_pic_id)
            
            # Upload new picture
            up = upload_profile_image_file(profile_pic)
            if not up:
                raise HTTPException(status_code=400, detail="Profile upload failed")
            
            update_data["profile_pic"] = up["url"]
            update_data["profile_pic_id"] = up["public_id"]
        except ValueError as ve:
            raise HTTPException(status_code=400, detail=str(ve))
        except Exception as e:
            raise HTTPException(status_code=400, detail="Image upload error")

    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        await producer_collection.update_one(
            {"_id": user_id},
            {"$set": update_data}
        )

    # Return updated user data
    updated_user = await producer_collection.find_one({"_id": user_id})
    
    return {
        "message": "Profile updated successfully",
        "user": {
            "id": str(updated_user["_id"]),
            "email": updated_user.get("email"),
            "first_name": updated_user.get("first_name"),
            "last_name": updated_user.get("last_name"),
            "professionalName": updated_user.get("professionalName"),
            "profile_pic": updated_user.get("profile_pic"),
            "contact": updated_user.get("contact"),
            "dob": updated_user.get("dob"),
            "nic_number": updated_user.get("nic_number"),
            "street_address": updated_user.get("street_address"),
            "city": updated_user.get("city"),
            "state": updated_user.get("state"),
            "postal": updated_user.get("postal"),
            "country": updated_user.get("country"),
            "email_verified": updated_user.get("email_verified", False)
        }
    }