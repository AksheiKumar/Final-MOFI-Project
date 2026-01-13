from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from movie_api.utils.cloudinary import cloudinary
from movie_api.controllers.movie_controller import router as movie_router
from movie_api.controllers.trailer_controller import router as trailer_router
from movie_api.controllers.movie_image_controller import router as movie_image_router
from movie_api.controllers.accessible_movies_controller import router as accessible_movies_router
load_dotenv()


app = FastAPI(
    title="Movie API",
    description="Handle Movie + Trailer Services",
    version="1.0.0"
)



origins = [
    "http://localhost:5174",
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
     allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(movie_router, prefix="/movies", tags=["Movies"])
app.include_router(trailer_router, prefix="/trailers", tags=["Trailers"])
app.include_router(movie_image_router)
app .include_router(accessible_movies_router)

@app.get("/")
def home():
    return {"message": "Movie API is running"}
