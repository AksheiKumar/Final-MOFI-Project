from fastapi import FastAPI
from fastapi import APIRouter
from fastapi.middleware.cors import CORSMiddleware
from route.producer_auth import router as producer_router
from route.producer_profile import router as producer_profile_router
from route.producer_manage import router as producer_manage_router
from route.crew import router as crew_router


app = FastAPI()

origins = ["http://localhost:5174"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(producer_router)
app.include_router(producer_profile_router)
app.include_router(producer_manage_router)
app.include_router(crew_router)
