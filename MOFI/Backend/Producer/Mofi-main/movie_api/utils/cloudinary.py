import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
import os
import re

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("CLOUD_API_KEY"),
    api_secret=os.getenv("CLOUD_API_SECRET"),
)

def upload_image(upload_file, folder: str):
    file_bytes = upload_file.file.read()   

    return cloudinary.uploader.upload(
        file_bytes,
        folder=folder,
        resource_type="image"
    )["secure_url"]

def upload_video(upload_file, folder: str):
    file_bytes = upload_file.file.read()
    result = cloudinary.uploader.upload(
        file_bytes,
        folder=folder,
        resource_type="video"
    )
    return result.get("secure_url")


def extract_public_id_from_url(url: str) -> str:
    """Extract public ID from Cloudinary URL"""
    # Remove protocol and split
    url_parts = url.split('/')
    
    # Find the index of 'upload'
    try:
        upload_index = url_parts.index('upload')
        # Get everything after upload
        if len(url_parts) > upload_index + 1:
            # Check if next part is a version (starts with 'v')
            if url_parts[upload_index + 1].startswith('v'):
                public_id_parts = url_parts[upload_index + 2:]
            else:
                public_id_parts = url_parts[upload_index + 1:]
            
            # Join parts and remove file extension
            public_id = '/'.join(public_id_parts)
            # Remove file extension if present
            public_id = re.sub(r'\.[^/.]+$', '', public_id)
            return public_id
    except (ValueError, IndexError):
        pass
    
    # Fallback: try to extract from URL pattern
    pattern = r'/(?:v\d+/)?([^/]+/)*[^/.]+(?=\.\w+$)'
    match = re.search(pattern, url)
    if match:
        return match.group(0).lstrip('/v0123456789/')
    
    raise ValueError(f"Cannot extract public ID from URL: {url}")

def delete_cloudinary_file(file_url: str) -> bool:
    """Delete file from Cloudinary by URL"""
    try:
        public_id = extract_public_id_from_url(file_url)
        result = cloudinary.uploader.destroy(public_id)
        return result.get('result') == 'ok'
    except Exception as e:
        print(f"Failed to delete file from Cloudinary: {str(e)}")
        return False