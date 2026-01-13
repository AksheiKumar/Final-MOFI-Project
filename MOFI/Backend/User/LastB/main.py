from fastapi import FastAPI
from routes.auth_routes import Router
from routes.auth_login import UserRouter
from configuration import client
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()




app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(Router)
app.include_router(UserRouter)

