from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from movie_api.services.movie_image_service import MovieImageService

router = APIRouter(prefix="/movie-images", tags=["movie-images"])

@router.post("/create/movie_image", response_model=dict)
async def upload_movie_image(
    movie_id: str = Form(...),
    title: str = Form(...),
    people: str = Form(...),
    description: Optional[str] = Form(None),
    image: UploadFile = File(...)
):
    """
    Upload an image for a specific movie.
    
    Parameters:
    - movie_id: ID of the movie this image belongs to
    - title: Title of the image
    - people: Comma-separated list of people in the image
    - description: Optional description of the image
    - image: The image file (PNG, JPG, GIF up to 10MB)
    """
    # Validate file type
    allowed_types = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
    if image.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail="Invalid file type. Only PNG, JPG, GIF are allowed"
        )
    
    # Validate file size (10MB)
    image.file.seek(0, 2)  # Seek to end
    file_size = image.file.tell()
    image.file.seek(0)  # Reset to beginning
    
    if file_size > 10 * 1024 * 1024:  # 10MB
        raise HTTPException(
            status_code=400, 
            detail="File too large. Maximum size is 10MB"
        )
    
    # Upload image
    image_data = await MovieImageService.upload_movie_image(
        image_file=image,
        movie_id=movie_id,
        title=title,
        people=people,
        description=description
    )
    
    return {
        "message": "Movie image uploaded successfully",
        "image": image_data
    }

@router.get("/movie/image/{movie_id}", response_model=dict)
async def get_all_movie_images(movie_id: str):
    """Get all images for a specific movie"""
    images = await MovieImageService.get_movie_images(movie_id)
    return {
        "movie_id": movie_id,
        "images": images,
        "count": len(images)
    }

@router.get("/getimage/{image_id}", response_model=dict)
async def get_movie_image(image_id: str):
    """Get a specific movie image by ID"""
    image = await MovieImageService.get_image(image_id)
    return image

@router.put("/update/{image_id}", response_model=dict)
async def update_movie_image(
    image_id: str,
    title: Optional[str] = Form(None),
    people: Optional[str] = Form(None),
    description: Optional[str] = Form(None)
):
    """Update image metadata"""
    image = await MovieImageService.update_movie_image(
        image_id=image_id,
        title=title,
        people=people,
        description=description
    )
    
    return {
        "message": "Image updated successfully",
        "image": image
    }

@router.delete("/image/delete/{image_id}", response_model=dict)
async def delete_movie_image(image_id: str):
    """Delete a movie image"""
    success = await MovieImageService.delete_movie_image(image_id)
    
    if success:
        return {"message": "Image deleted successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to delete image")