from datetime import datetime
import uuid
from movie_api.utils.cloudinary import upload_image, delete_cloudinary_file
from fastapi import HTTPException
from movie_api.db.mongo import db
from movie_api.db.mongo import movies_collection
from movie_api.db.mongo import images_collection

def serialize_movie_image(image_doc):
    return {
        "image_id": image_doc["image_id"],
        "movie_id": image_doc["movie_id"],
        "title": image_doc["title"],
        "people": image_doc["people"],
        "description": image_doc.get("description"),
        "image_url": image_doc["image_url"],
        "uploaded_at": image_doc["uploaded_at"]
    }

class MovieImageService:
    
    @staticmethod
    async def upload_movie_image(
        image_file,
        movie_id: str,
        title: str,
        people: str,
        description: str = None
    ) -> dict:
        """
        Upload a movie image with transaction-like behavior.
        If any step fails, cleanup uploaded image from Cloudinary.
        """
        image_url = None
        
        try:
            # Step 1: Upload image to Cloudinary
            image_url = upload_image(image_file, folder="movie_db/movie_images")
            
            # Step 2: Parse people (comma-separated to list)
            people_list = []
            if people and people.strip():
                people_list = [p.strip() for p in people.split(",") if p.strip()]
            
            # Step 3: Create image document
            image_data = {
                "image_id": str(uuid.uuid4()),
                "movie_id": movie_id,
                "title": title.strip(),
                "people": people_list,
                "description": description.strip() if description else None,
                "image_url": image_url,
                "uploaded_at": datetime.utcnow()
            }
            
            # Step 4: Verify movie exists
            movie = await movies_collection.find_one({"movie_id": movie_id})
            if not movie:
                raise HTTPException(status_code=404, detail=f"Movie with ID {movie_id} not found")
            
            # Step 5: Save to database
            result = await images_collection.insert_one(image_data)
            
            if not result.inserted_id:
                # Database insert failed - cleanup Cloudinary image
                if image_url:
                    delete_cloudinary_file(image_url)
                raise Exception("Failed to save image to database")
            
            # Step 6: Update movie document to reference this image
            await db.movies.update_one(
                {"movie_id": movie_id},
                {"$addToSet": {"images": image_data["image_id"]}}
            )
            
            return serialize_movie_image(image_data)
            
        except HTTPException:
            # Cleanup on HTTPException
            if image_url:
                delete_cloudinary_file(image_url)
            raise
            
        except Exception as e:
            # Cleanup on any other exception
            if image_url:
                try:
                    delete_cloudinary_file(image_url)
                except Exception as cleanup_error:
                    print(f"Warning: Cleanup also failed: {str(cleanup_error)}")
            
            # Re-raise the exception
            raise HTTPException(
                status_code=500, 
                detail=f"Failed to upload movie image: {str(e)}"
            )
    
    @staticmethod
    async def get_movie_images(movie_id: str):
        """Get all images for a specific movie"""
        images = await images_collection.find(
            {"movie_id": movie_id}
        ).sort("uploaded_at", -1).to_list(None)
        
        return [serialize_movie_image(img) for img in images]
    
    @staticmethod
    async def get_image(image_id: str):
        """Get a specific image by ID"""
        image = await images_collection.find_one({"image_id": image_id})
        if not image:
            raise HTTPException(status_code=404, detail="Image not found")
        return serialize_movie_image(image)
    
    @staticmethod
    async def delete_movie_image(image_id: str):
        """Delete a movie image from both database and Cloudinary"""
        # Find the image
        image = await images_collection.find_one({"image_id": image_id})
        if not image:
            raise HTTPException(status_code=404, detail="Image not found")
        
        image_url = image.get("image_url")
        movie_id = image.get("movie_id")
        
        try:
            # Delete from Cloudinary first
            if image_url:
                delete_success = delete_cloudinary_file(image_url)
                if not delete_success:
                    print(f"Warning: Could not delete image from Cloudinary: {image_url}")
            
            # Delete from database
            delete_result = await images_collection.delete_one({"image_id": image_id})
            
            if delete_result.deleted_count > 0 and movie_id:
                # Remove image reference from movie document
                await movies_collection.update_one(
                    {"movie_id": movie_id},
                    {"$pull": {"images": image_id}}
                )
            
            return True
            
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Failed to delete image: {str(e)}"
            )
    
    @staticmethod
    async def update_movie_image(
        image_id: str,
        title: str = None,
        people: str = None,
        description: str = None
    ):
        """Update image metadata (title, people, description)"""
        image = await images_collection.find_one({"image_id": image_id})
        if not image:
            raise HTTPException(status_code=404, detail="Image not found")
        
        update_data = {}
        
        if title is not None:
            update_data["title"] = title.strip()
        
        if people is not None:
            people_list = []
            if people.strip():
                people_list = [p.strip() for p in people.split(",") if p.strip()]
            update_data["people"] = people_list
        
        if description is not None:
            update_data["description"] = description.strip() if description.strip() else None
        
        if update_data:
            await images_collection.update_one(
                {"image_id": image_id},
                {"$set": update_data}
            )
        
        # Return updated image
        updated_image = await images_collection.find_one({"image_id": image_id})
        return serialize_movie_image(updated_image)