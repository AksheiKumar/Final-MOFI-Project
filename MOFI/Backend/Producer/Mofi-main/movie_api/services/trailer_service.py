import uuid
from typing import Optional, List
from bson import ObjectId
from movie_api.db.mongo import db
from movie_api.schemas import TrailerCreate, TrailerUpdate

trailer_collection = db["trailers"]


class TrailerService:

    @staticmethod
    def to_trailer_dict(tr):
        """Convert MongoDB document to dictionary format."""
        return {
            "trailer_id": tr["trailer_id"],
            "movie_id": tr["movie_id"],
            "trailer_name": tr["trailer_name"],
            "thumbnail_url": tr.get("thumbnail_url"),
            "video_url": tr.get("video_url"),
        }

    @staticmethod
    async def create_trailer(data: TrailerCreate):
        """Create a new trailer."""
        trailer_dict = data.dict()
        trailer_dict["trailer_id"] = str(uuid.uuid4())   # Custom ID like movies

        await trailer_collection.insert_one(trailer_dict)

        return TrailerService.to_trailer_dict(trailer_dict)

    @staticmethod
    async def get_trailer_by_id(trailer_id: str):
        """Get a trailer by its ID."""
        trailer = await trailer_collection.find_one({"trailer_id": trailer_id})
        if trailer:
            return TrailerService.to_trailer_dict(trailer)
        return None
    
    @staticmethod
    async def get_trailers_by_movie_id(movie_id: str):
        """Get all trailers for a specific movie."""
        trailers = await trailer_collection.find({"movie_id": movie_id}).to_list(None)
        return [TrailerService.to_trailer_dict(t) for t in trailers]

    @staticmethod
    async def get_all_trailers():
        """Get all trailers."""
        trailers = []
        async for tr in trailer_collection.find():
            trailers.append(TrailerService.to_trailer_dict(tr))
        return trailers

    @staticmethod
    async def update_trailer(trailer_id: str, update_data: TrailerUpdate):
        """Update a trailer."""
        update_fields = {
            key: value
            for key, value in update_data.dict().items()
            if value is not None
        }

        if not update_fields:
            return None

        result = await trailer_collection.update_one(
            {"trailer_id": trailer_id},
            {"$set": update_fields}
        )

        if result.modified_count == 0:
            return None

        updated = await trailer_collection.find_one({"trailer_id": trailer_id})
        return TrailerService.to_trailer_dict(updated)

    @staticmethod
    async def delete_trailer(trailer_id: str) -> bool:
        """Delete a trailer."""
        result = await trailer_collection.delete_one({"trailer_id": trailer_id})
        return result.deleted_count == 1