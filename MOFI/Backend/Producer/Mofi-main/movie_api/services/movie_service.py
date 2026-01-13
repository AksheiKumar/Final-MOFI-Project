# services/movie_service.py
from movie_api.db.mongo import db, movies_collection, crew_collection
import uuid
from movie_api.schemas import MovieCreate, MovieUpdate
from typing import Optional
from bson import ObjectId
from datetime import datetime


def serialize_movie(movie):
    return {
        "movie_id": movie["movie_id"],
        "user_id": movie["user_id"],
        "imdbID": movie["imdbID"],
        "type": movie["type"],
        "title": movie["title"],
        "description": movie["description"],
        "directors": movie["directors"],
        "writers": movie["writers"],
        "genres": movie["genres"],
        "release_date": movie["release_date"],
        "duration": movie["duration"],
        "image1": movie["image1"],
        "image2": movie["image2"],
        "rate": movie.get("rate", {}),
        "reactions": movie.get("reactions", {}),
    }


class MovieService:
    @staticmethod
    async def create_movie(movie_data: MovieCreate) -> dict:
        movie_dict = movie_data.dict()

        # Check if movie with same IMDb ID exists
        existing = await db.movies.find_one({"imdbID": movie_dict["imdbID"]})
        if existing:
            raise Exception("Movie with this IMDb ID already exists")
        
        # Generate unique movie_id
        movie_dict["movie_id"] = str(uuid.uuid4())

        # Add default ratings
        movie_dict["rate"] = {
            "pre": {
                "rate_vote": 0,
                "rate_count": 0,
                "rate": 0
            },
            "post": {
                "rate_vote": 0,
                "rate_count": 0,
                "rate": 0
            }
        }

        # Insert movie into movies collection
        await db.movies.insert_one(movie_dict)
        
        # ========== ADD CREATOR TO CREW COLLECTION ==========
        now = datetime.utcnow()
        user_id = movie_dict["user_id"]
        movie_id = movie_dict["movie_id"]
        
        # Check if user already exists in crew_collection
        existing_crew = await crew_collection.find_one({"linkedin_id": user_id})
        
        if existing_crew:
            # Add new movie to existing crew member as Creator
            await crew_collection.update_one(
                {"linkedin_id": user_id},
                {"$set": {
                    f"movies.{movie_id}": {
                        "contribution": "Creator",
                        "permissions": {
                            "video": True,
                            "image": True,
                            "live": True,
                            "scripts": True,
                            "crew": True
                        },
                        "created_at": now,
                        "updated_at": now,
                        "access_type": "creator"
                    },
                    "updated_at": now
                }}
            )
        else:
            # Create new crew entry for the creator
            crew_member = {
                "linkedin_id": user_id,
                "movies": {
                    movie_id: {
                        "contribution": "Creator",
                        "permissions": {
                            "video": True,
                            "image": True,
                            "live": True,
                            "scripts": True,
                            "crew": True
                        },
                        "created_at": now,
                        "updated_at": now,
                        "access_type": "creator"
                    }
                },
                "created_at": now,
                "updated_at": now
            }
            await crew_collection.insert_one(crew_member)
        # ========== END OF CREW ADDITION ==========

        return serialize_movie(movie_dict)


    @staticmethod
    async def get_all_movies() -> list:
        movies = []
        async for movie in db.movies.find():
            movies.append(serialize_movie(movie))
        return movies


    @staticmethod
    async def get_movie(movie_id: str) -> Optional[dict]:
        movie = await db.movies.find_one({"movie_id": movie_id})

        if movie:
            return serialize_movie(movie)

        return None


    @staticmethod
    async def update_movie(movie_id: str, update_data: MovieUpdate) -> Optional[dict]:
        update_fields = {
            key: value
            for key, value in update_data.dict().items()
            if value is not None
        }

        if not update_fields:
            return None

        result = await db.movies.update_one(
            {"movie_id": movie_id},
            {"$set": update_fields}
        )

        if result.modified_count == 0:
            return None

        updated_movie = await db.movies.find_one({"movie_id": movie_id})
        return serialize_movie(updated_movie)


    @staticmethod
    async def delete_movie(movie_id: str) -> bool:
        # Also remove movie from crew_collection entries
        # Find all crew members who have this movie
        crew_members = await crew_collection.find(
            {f"movies.{movie_id}": {"$exists": True}}
        ).to_list(length=None)
        
        # Remove movie from each crew member
        for member in crew_members:
            await crew_collection.update_one(
                {"_id": member["_id"]},
                {"$unset": {f"movies.{movie_id}": ""}}
            )
            
            # If crew member has no more movies, delete the entry
            updated = await crew_collection.find_one({"_id": member["_id"]})
            if not updated.get("movies"):
                await crew_collection.delete_one({"_id": member["_id"]})
        
        # Delete movie from movies collection
        result = await db.movies.delete_one({"movie_id": movie_id})
        return result.deleted_count == 1

    
    @staticmethod
    async def get_movies_by_user(user_id: str) -> list:
        movies = []
        async for movie in db.movies.find({"user_id": user_id}):
            movies.append(serialize_movie(movie))
        return movies
    
    @staticmethod
    async def update_movie_rating(
        movie_id: str,
        stars: int,
        is_new_rating: bool,
        old_stars: int | None = None
    ):
        movie = await movies_collection.find_one({"movie_id": movie_id})

        if not movie:
            raise Exception("Movie not found")

        rate = movie.get("rate")

        #  FORCE SAFE INITIALIZATION
        if not rate or rate.get("rate_count", 0) < 0:
            rate = {
                "rate_vote": 0,
                "rate_count": 0,
                "rate": 0.0
            }

        if is_new_rating:
            rate["rate_vote"] += stars
            rate["rate_count"] += 1
        else:
            if old_stars is not None:
                rate["rate_vote"] = rate["rate_vote"] - old_stars + stars

        #  SAFE AVERAGE CALCULATION
        rate["rate"] = round(
            rate["rate_vote"] / rate["rate_count"], 2
        ) if rate["rate_count"] > 0 else 0

        await movies_collection.update_one(
            {"movie_id": movie_id},
            {"$set": {"rate": rate}}
        )

    
    @staticmethod
    async def get_full_movie_details(movie_id: str) -> dict:
        movie = await db.movies.find_one({"movie_id": movie_id})
        if not movie:
            return None

        ratings = await db.ratings.find_one({"movie_id": movie_id})
        reactions = await db.reactions.find_one({"movie_id": movie_id})

        trailers = []
        async for trailer in db.trailers.find({"movie_id": movie_id}):
            trailer["trailer_id"] = str(trailer["_id"])
            trailer.pop("_id", None)
            trailers.append(trailer)

        stream = await db.streams.find_one({"movie_id": movie_id})

        # remove Mongo _id safely
        movie.pop("_id", None)
        if ratings: ratings.pop("_id", None)
        if reactions: reactions.pop("_id", None)
        if stream: stream.pop("_id", None)

        return {
            "movie": movie,
            "ratings": ratings or {},
            "reactions": reactions or {},
            "trailers": trailers,
            "stream": stream or {}
        }

