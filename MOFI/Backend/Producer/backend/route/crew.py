from fastapi import APIRouter, HTTPException
from bson import ObjectId
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from configuration import crew_collection  

router = APIRouter(prefix="/crew", tags=["crew"])

# Models
class CrewPermission(BaseModel):
    video: bool = False
    image: bool = False
    live: bool = False
    scripts: bool = False
    crew: bool = False

class MovieCrewData(BaseModel):
    movie_id: str
    contribution: str
    permissions: CrewPermission
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class CrewMemberCreate(BaseModel):
    linkedin_id: str
    movie_data: MovieCrewData  # Changed from separate fields

class CrewMemberUpdate(BaseModel):
    linkedin_id: Optional[str] = None
    movie_data: Optional[MovieCrewData] = None

class CrewMemberResponse(BaseModel):
    id: str
    linkedin_id: str
    movies: Dict[str, Dict[str, Any]]  # movie_id: {contribution, permissions, etc.}
    created_at: datetime
    updated_at: datetime

# Get all crew members for a movie
@router.get("/movie/{movie_id}", response_model=List[Dict[str, Any]])
async def get_crew_members(movie_id: str):
    """
    Get all crew members for a specific movie
    Returns flattened structure for frontend
    """
    try:
        # Find crew members who have worked on this movie
        crew_members = await crew_collection.find(
            {f"movies.{movie_id}": {"$exists": True}}
        ).to_list(length=None)
        
        response = []
        for member in crew_members:
            movie_data = member["movies"].get(movie_id)
            if movie_data:
                response.append({
                    "id": str(member["_id"]),
                    "linkedin_id": member["linkedin_id"],
                    "movie_id": movie_id,
                    "contribution": movie_data.get("contribution", ""),
                    "permissions": movie_data.get("permissions", {}),
                    "created_at": movie_data.get("created_at"),
                    "updated_at": movie_data.get("updated_at")
                })
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch crew members: {str(e)}")

# Add a new crew member or add movie to existing crew member
@router.post("/add", response_model=Dict[str, Any])
async def add_crew_member(crew_data: CrewMemberCreate):
    try:
        now = datetime.utcnow()
        
        # Check if crew member already exists
        existing_crew = await crew_collection.find_one({
            "linkedin_id": crew_data.linkedin_id
        })
        
        if existing_crew:
            # Crew member exists, add new movie data
            movie_id = crew_data.movie_data.movie_id
            
            # Check if already working on this movie
            if movie_id in existing_crew.get("movies", {}):
                raise HTTPException(
                    status_code=400, 
                    detail=f"Crew member already added to movie {movie_id}"
                )
            
            # Add new movie data
            update_data = {
                f"movies.{movie_id}": {
                    "contribution": crew_data.movie_data.contribution,
                    "permissions": {
                        "video": crew_data.movie_data.permissions.video,
                        "image": crew_data.movie_data.permissions.image,
                        "live": crew_data.movie_data.permissions.live,
                        "scripts": crew_data.movie_data.permissions.scripts,
                        "crew": crew_data.movie_data.permissions.crew
                    },
                    "created_at": now,
                    "updated_at": now
                },
                "updated_at": now
            }
            
            result = await crew_collection.update_one(
                {"_id": existing_crew["_id"]},
                {"$set": update_data}
            )
            
            # Get updated document
            updated = await crew_collection.find_one({"_id": existing_crew["_id"]})
            movie_data = updated["movies"][movie_id]
            
            return {
                "id": str(updated["_id"]),
                "linkedin_id": updated["linkedin_id"],
                "movie_id": movie_id,
                "contribution": movie_data["contribution"],
                "permissions": movie_data["permissions"],
                "created_at": movie_data["created_at"],
                "updated_at": movie_data["updated_at"]
            }
        else:
            # Create new crew member
            crew_member = {
                "linkedin_id": crew_data.linkedin_id,
                "movies": {
                    crew_data.movie_data.movie_id: {
                        "contribution": crew_data.movie_data.contribution,
                        "permissions": {
                            "video": crew_data.movie_data.permissions.video,
                            "image": crew_data.movie_data.permissions.image,
                            "live": crew_data.movie_data.permissions.live,
                            "scripts": crew_data.movie_data.permissions.scripts,
                            "crew": crew_data.movie_data.permissions.crew
                        },
                        "created_at": now,
                        "updated_at": now
                    }
                },
                "created_at": now,
                "updated_at": now
            }
            
            result = await crew_collection.insert_one(crew_member)
            movie_data = crew_member["movies"][crew_data.movie_data.movie_id]
            
            return {
                "id": str(result.inserted_id),
                "linkedin_id": crew_data.linkedin_id,
                "movie_id": crew_data.movie_data.movie_id,
                "contribution": movie_data["contribution"],
                "permissions": movie_data["permissions"],
                "created_at": movie_data["created_at"],
                "updated_at": movie_data["updated_at"]
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add crew member: {str(e)}")

# Delete a crew member from a specific movie
@router.delete("/{crew_id}/movie/{movie_id}")
async def delete_crew_member_from_movie(crew_id: str, movie_id: str):
    try:
        result = await crew_collection.update_one(
            {"_id": ObjectId(crew_id)},
            {"$unset": {f"movies.{movie_id}": ""}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Crew member not found or not associated with this movie")
        
        # Check if crew member has any other movies
        crew = await crew_collection.find_one({"_id": ObjectId(crew_id)})
        if not crew.get("movies"):
            # Delete entire crew member if no movies left
            await crew_collection.delete_one({"_id": ObjectId(crew_id)})
        
        return {"message": "Crew member removed from movie successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete crew member: {str(e)}")

# Edit crew member's data for a specific movie
@router.patch("/{crew_id}/movie/{movie_id}", response_model=Dict[str, Any])
async def edit_crew_member_for_movie(crew_id: str, movie_id: str, crew_data: CrewMemberUpdate):
    """
    Edit crew member's data for a specific movie
    """
    try:
        # Build update data
        update_fields = {"updated_at": datetime.utcnow()}
        
        if crew_data.linkedin_id is not None:
            update_fields["linkedin_id"] = crew_data.linkedin_id
        
        # Update movie-specific data if provided
        if crew_data.movie_data is not None:
            movie_update = {
                f"movies.{movie_id}.updated_at": datetime.utcnow()
            }
            
            if crew_data.movie_data.contribution:
                movie_update[f"movies.{movie_id}.contribution"] = crew_data.movie_data.contribution
            
            if crew_data.movie_data.permissions:
                movie_update[f"movies.{movie_id}.permissions"] = {
                    "video": crew_data.movie_data.permissions.video,
                    "image": crew_data.movie_data.permissions.image,
                    "live": crew_data.movie_data.permissions.live,
                    "scripts": crew_data.movie_data.permissions.scripts,
                    "crew": crew_data.movie_data.permissions.crew
                }
            
            # Combine updates
            if len(movie_update) > 1:  # More than just updated_at
                update_fields.update(movie_update)
        
        result = await crew_collection.update_one(
            {"_id": ObjectId(crew_id), f"movies.{movie_id}": {"$exists": True}},
            {"$set": update_fields}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Crew member not found for this movie")
        
        # Get updated document
        updated = await crew_collection.find_one({"_id": ObjectId(crew_id)})
        movie_data = updated["movies"][movie_id]
        
        return {
            "id": str(updated["_id"]),
            "linkedin_id": updated["linkedin_id"],
            "movie_id": movie_id,
            "contribution": movie_data["contribution"],
            "permissions": movie_data["permissions"],
            "created_at": movie_data["created_at"],
            "updated_at": movie_data["updated_at"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update crew member: {str(e)}")

# Get a crew member by ID with all movies
@router.get("/{crew_id}", response_model=CrewMemberResponse)
async def get_crew_member(crew_id: str):
    try:
        crew = await crew_collection.find_one({"_id": ObjectId(crew_id)})
        if not crew:
            raise HTTPException(status_code=404, detail="Crew member not found")
        
        return {
            "id": str(crew["_id"]),
            "linkedin_id": crew["linkedin_id"],
            "movies": crew.get("movies", {}),
            "created_at": crew.get("created_at"),
            "updated_at": crew.get("updated_at", crew.get("created_at"))
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch crew member: {str(e)}")