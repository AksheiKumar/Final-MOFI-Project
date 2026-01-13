from fastapi import APIRouter, HTTPException
from movie_api.db.mongo import db, crew_collection
from typing import List, Dict, Any

router = APIRouter(prefix="/accessible/Movie", tags=["crew Accessible Movies"])

@router.get("/{linkedin_id}/accessible-movies", response_model=Dict[str, Any])
async def get_accessible_movies(linkedin_id: str):
    """
    Get all movies that a user has access to:
    1. Movies where user is listed as creator in crew_collection
    2. Movies where user is listed as crew member in crew_collection
    3. Movies where user is creator in movies_collection (backward compatibility)
    """
    try:
        accessible_movies = []
        
        # 1. Check crew_collection first (primary source for permissions)
        crew_member = await crew_collection.find_one({"linkedin_id": linkedin_id})
        
        if crew_member:
            for movie_id, movie_data in crew_member.get("movies", {}).items():
                # Get full movie details from movies_collection
                movie = await db.movies.find_one({"movie_id": movie_id})
                
                if movie:
                    # Determine access type based on contribution
                    is_creator = movie_data.get("contribution") == "Creator"
                    access_type = "creator" if is_creator else "crew_member"
                    
                    # Format movie for frontend
                    formatted_movie = {
                        "movie_id": movie.get("movie_id"),
                        "title": movie.get("title"),
                        "description": movie.get("description"),
                        "image1": movie.get("image1"),
                        "image2": movie.get("image2"),
                        "directors": movie.get("directors", []),
                        "writers": movie.get("writers", []),
                        "genres": movie.get("genres", []),
                        "release_date": movie.get("release_date"),
                        "duration": movie.get("duration"),
                        "type": movie.get("type"),
                        "imdbID": movie.get("imdbID"),
                        "access_type": access_type,
                        "contribution": movie_data.get("contribution", ""),
                        "permissions": movie_data.get("permissions", {}),
                        "is_creator": is_creator
                    }
                    accessible_movies.append(formatted_movie)
        
        # 2. For backward compatibility: Check movies_collection
        # (For movies created before crew collection was implemented)
        created_movies_cursor = db.movies.find({"user_id": linkedin_id})
        created_movies = await created_movies_cursor.to_list(length=None)
        
        for movie in created_movies:
            # Check if already added from crew_collection
            if not any(m["movie_id"] == movie["movie_id"] for m in accessible_movies):
                formatted_movie = {
                    "movie_id": movie.get("movie_id"),
                    "title": movie.get("title"),
                    "description": movie.get("description"),
                    "image1": movie.get("image1"),
                    "image2": movie.get("image2"),
                    "directors": movie.get("directors", []),
                    "writers": movie.get("writers", []),
                    "genres": movie.get("genres", []),
                    "release_date": movie.get("release_date"),
                    "duration": movie.get("duration"),
                    "type": movie.get("type"),
                    "imdbID": movie.get("imdbID"),
                    "access_type": "creator",
                    "contribution": "Creator",
                    "permissions": {
                        "video": True,
                        "image": True,
                        "live": True,
                        "scripts": True,
                        "crew": True
                    },
                    "is_creator": True
                }
                accessible_movies.append(formatted_movie)
        
        # Count movies by access type
        created_count = len([m for m in accessible_movies if m["access_type"] == "creator"])
        crew_member_count = len([m for m in accessible_movies if m["access_type"] == "crew_member"])
        
        return {
            "accessible_movies": accessible_movies,
            "created_count": created_count,
            "crew_member_count": crew_member_count,
            "total_count": len(accessible_movies)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch accessible movies: {str(e)}")

@router.get("/{linkedin_id}/movie/{movie_id}/permissions", response_model=Dict[str, Any])
async def get_movie_permissions(linkedin_id: str, movie_id: str):
    """
    Get specific permissions for a user on a particular movie
    """
    try:
        # First check crew_collection (covers both creators and crew members)
        crew_member = await crew_collection.find_one({
            "linkedin_id": linkedin_id,
            f"movies.{movie_id}": {"$exists": True}
        })
        
        if crew_member:
            movie_data = crew_member["movies"][movie_id]
            movie = await db.movies.find_one({"movie_id": movie_id})
            
            is_creator = movie_data.get("contribution") == "Creator"
            
            return {
                "has_access": True,
                "access_type": "creator" if is_creator else "crew_member",
                "permissions": movie_data.get("permissions", {}),
                "contribution": movie_data.get("contribution", ""),
                "movie_details": {
                    "title": movie.get("title") if movie else "Unknown",
                    "description": movie.get("description") if movie else ""
                },
                "is_creator": is_creator
            }
        
        # Check movies_collection for backward compatibility
        movie = await db.movies.find_one({"movie_id": movie_id, "user_id": linkedin_id})
        if movie:
            return {
                "has_access": True,
                "access_type": "creator",
                "permissions": {
                    "video": True,
                    "image": True,
                    "live": True,
                    "scripts": True,
                    "crew": True
                },
                "contribution": "Creator",
                "movie_details": {
                    "title": movie.get("title"),
                    "description": movie.get("description")
                },
                "is_creator": True
            }
        
        return {
            "has_access": False,
            "access_type": "none",
            "permissions": {},
            "message": "No access to this movie"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to check permissions: {str(e)}")

@router.get("/{linkedin_id}/created-movies", response_model=List[Dict[str, Any]])
async def get_created_movies(linkedin_id: str):
    """
    Get only movies created by this user
    """
    try:
        created_movies = []
        
        # Check crew_collection first
        crew_member = await crew_collection.find_one({"linkedin_id": linkedin_id})
        
        if crew_member:
            for movie_id, movie_data in crew_member.get("movies", {}).items():
                if movie_data.get("contribution") == "Creator":
                    movie = await db.movies.find_one({"movie_id": movie_id})
                    if movie:
                        created_movies.append({
                            "movie_id": movie.get("movie_id"),
                            "title": movie.get("title"),
                            "description": movie.get("description"),
                            "image1": movie.get("image1"),
                            "image2": movie.get("image2"),
                            "directors": movie.get("directors", []),
                            "writers": movie.get("writers", []),
                            "genres": movie.get("genres", []),
                            "release_date": movie.get("release_date"),
                            "duration": movie.get("duration"),
                            "type": movie.get("type"),
                            "imdbID": movie.get("imdbID"),
                            "access_type": "creator"
                        })
        
        # Also check movies_collection for backward compatibility
        movies_cursor = db.movies.find({"user_id": linkedin_id})
        movies = await movies_cursor.to_list(length=None)
        
        for movie in movies:
            if not any(m["movie_id"] == movie["movie_id"] for m in created_movies):
                created_movies.append({
                    "movie_id": movie.get("movie_id"),
                    "title": movie.get("title"),
                    "description": movie.get("description"),
                    "image1": movie.get("image1"),
                    "image2": movie.get("image2"),
                    "directors": movie.get("directors", []),
                    "writers": movie.get("writers", []),
                    "genres": movie.get("genres", []),
                    "release_date": movie.get("release_date"),
                    "duration": movie.get("duration"),
                    "type": movie.get("type"),
                    "imdbID": movie.get("imdbID"),
                    "access_type": "creator"
                })
        
        return created_movies
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch created movies: {str(e)}")

@router.get("/{linkedin_id}/crew-movies", response_model=List[Dict[str, Any]])
async def get_crew_movies(linkedin_id: str):
    """
    Get movies where user is a crew member (not creator)
    """
    try:
        crew_member = await crew_collection.find_one({"linkedin_id": linkedin_id})
        if not crew_member:
            return []
        
        result = []
        for movie_id, movie_data in crew_member.get("movies", {}).items():
            if movie_data.get("contribution") != "Creator":  # Only non-creator roles
                movie = await db.movies.find_one({"movie_id": movie_id})
                if movie:
                    result.append({
                        "movie_id": movie.get("movie_id"),
                        "title": movie.get("title"),
                        "description": movie.get("description"),
                        "image1": movie.get("image1"),
                        "image2": movie.get("image2"),
                        "directors": movie.get("directors", []),
                        "genres": movie.get("genres", []),
                        "contribution": movie_data.get("contribution", ""),
                        "permissions": movie_data.get("permissions", {}),
                        "access_type": "crew_member"
                    })
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch crew movies: {str(e)}")