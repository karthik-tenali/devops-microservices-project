from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory data store
users_db = {}

# User model
class User(BaseModel):
    id: int
    name: str
    email: str

@app.get("/")
def read_root():
    return {"message": "User Service is running"}

@app.get("/users", response_model=List[User])
def get_users():
    return list(users_db.values())

@app.get("/users/{user_id}", response_model=User)
def get_user(user_id: int):
    user = users_db.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/users", response_model=User)
def create_user(user: User):
    if user.id in users_db:
        raise HTTPException(status_code=400, detail="User ID already exists")
    users_db[user.id] = user
    return user

@app.put("/users/{user_id}", response_model=User)
def update_user(user_id: int, user: User):
    if user_id != user.id:
        raise HTTPException(status_code=400, detail="User ID mismatch")
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    users_db[user_id] = user
    return user

@app.delete("/users/{user_id}")
def delete_user(user_id: int):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    del users_db[user_id]
    return {"detail": "User deleted"}

