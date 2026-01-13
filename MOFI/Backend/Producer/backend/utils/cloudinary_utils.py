# utils/cloudinary_utils.py
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
import os

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("CLOUD_API_KEY"),
    api_secret=os.getenv("CLOUD_API_SECRET"),
    secure=True
)

ALLOWED = {"image/jpeg", "image/jpg", "image/png", "image/webp"}

def upload_profile_image_file(upload_file):
    # upload_file is starlette UploadFile
    if not hasattr(upload_file, "content_type") or upload_file.content_type not in ALLOWED:
        raise ValueError("Invalid image type. Allowed: JPG, PNG, WEBP")
    try:
        # pass file.file (a file-like object)
        res = cloudinary.uploader.upload(
            upload_file.file,
            folder="producers/profile_pics",
            resource_type="image",
            unique_filename=True,
            overwrite=False
        )
        return {"url": res.get("secure_url"), "public_id": res.get("public_id")}
    except Exception as e:
        print("Cloudinary upload error:", e)
        return None

def upload_image_from_url(image_url: str):
    try:
        return cloudinary.uploader.upload(
            image_url,
            folder="producers/profile_pics",
            use_filename=True,
            unique_filename=True
        )
    except Exception as e:
        print("Cloudinary URL upload error:", e)
        return None

def delete_image(public_id: str):
    if not public_id:
        return True
    try:
        cloudinary.uploader.destroy(public_id)
        return True
    except:
        return False
