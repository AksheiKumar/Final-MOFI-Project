from fastapi import APIRouter, HTTPException, Request, BackgroundTasks
from datetime import datetime
from jose import JWTError
from bson import ObjectId
from pydantic import BaseModel

from configuration import producer_collection
from utils.password_utils import hash_password, verify_password
from utils.cloudinary_utils import delete_image
from utils.token_utils import decode_access_token

router = APIRouter(prefix="/producer", tags=["account"])

# Password Change Models
class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str

# Account Delete Models
class AccountDeleteRequest(BaseModel):
    professional_name: str

@router.post("/change-password")
async def change_password(
    request: Request,
    password_data: PasswordChangeRequest
):
    """Change user password"""
    # Get Authorization header
    auth = request.headers.get("authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing access token")

    token = auth.split(" ")[1]

    # Decode access token
    try:
        payload = decode_access_token(token)
        user_id = ObjectId(payload.get("sub"))
    except (JWTError, Exception) as e:
        print(f"Token decode error: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired access token")

    # Fetch user
    user = await producer_collection.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify current password
    if not verify_password(password_data.current_password, user["password"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    # Check if new passwords match
    if password_data.new_password != password_data.confirm_password:
        raise HTTPException(status_code=400, detail="New passwords do not match")

    # Check if new password is same as current
    if verify_password(password_data.new_password, user["password"]):
        raise HTTPException(status_code=400, detail="New password must be different from current password")

    # Check password length
    if len(password_data.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    # Update password
    hashed_password = hash_password(password_data.new_password)
    await producer_collection.update_one(
        {"_id": user_id},
        {"$set": {"password": hashed_password, "updated_at": datetime.utcnow()}}
    )

    return {"message": "Password changed successfully"}


@router.delete("/delete-account")
async def delete_account(
    request: Request,
    background_tasks: BackgroundTasks,
    delete_data: AccountDeleteRequest
):
    """Delete user account with professional name verification"""
    # Get Authorization header
    auth = request.headers.get("authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing access token")

    token = auth.split(" ")[1]

    # Decode access token
    try:
        payload = decode_access_token(token)
        user_id = ObjectId(payload.get("sub"))
    except (JWTError, Exception) as e:
        print(f"Token decode error: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired access token")

    # Fetch user
    user = await producer_collection.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify professional name
    user_professional_name = user.get("professionalName", "").strip()
    provided_name = delete_data.professional_name.strip()
    
    if not user_professional_name:
        raise HTTPException(status_code=400, detail="Professional name not found on account")
    
    if user_professional_name.lower() != provided_name.lower():
        raise HTTPException(
            status_code=400, 
            detail=f"Professional name does not match. Please enter exactly: {user_professional_name}"
        )

    # Delete profile image from Cloudinary if exists
    profile_pic_id = user.get("profile_pic_id")
    if profile_pic_id:
        background_tasks.add_task(delete_image, profile_pic_id)
        print(f"Scheduled deletion of Cloudinary image: {profile_pic_id}")

    # Delete user account from database
    result = await producer_collection.delete_one({"_id": user_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=500, detail="Failed to delete account from database")

    print(f"Account deleted: {user.get('email')}, User ID: {user_id}")
    
    return {
        "message": "Account deleted successfully",
        "deleted_email": user.get("email"),
        "deleted_at": datetime.utcnow().isoformat()
    }