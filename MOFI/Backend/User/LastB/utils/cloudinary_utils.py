import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("CLOUD_API_KEY"),
    api_secret=os.getenv("CLOUD_API_SECRET"),
    secure=True
)


def upload_profile_image(file):
    allowed_types = ["image/jpeg", "image/png", "image/jpg", "image/webp"]

    # Validate type
    if not hasattr(file, "content_type") or file.content_type not in allowed_types:
        raise ValueError("Invalid image type. Allowed: JPG, PNG, WEBP")

    try:
        # 🔥 FIX: Cloudinary requires file.file, not file or coroutine
        result = cloudinary.uploader.upload(
            file.file,   # <<< THIS FIXES THE ERROR
            folder="users/profile_pics",
            resource_type="image",
            unique_filename=True,
            overwrite=False
        )

        return {
            "url": result.get("secure_url"),
            "public_id": result.get("public_id")
        }

    except Exception as e:
        print("Cloudinary Upload Error:", e)
        return None



def delete_image(public_id: str):
    """
    Delete image safely (no throw)
    """
    if not public_id:
        return True
    try:
        cloudinary.uploader.destroy(public_id)
        return True
    except:
        return False


def upload_image_from_url(image_url: str):
    """
    Keep this for Google login callback
    """
    try:
        return cloudinary.uploader.upload(
            image_url,
            folder="users/profile_pics",
            use_filename=True,
            unique_filename=True
        )
    except Exception as e:
        print("Cloudinary URL Upload Error:", e)
        return None
