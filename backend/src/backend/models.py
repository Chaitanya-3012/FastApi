from pydantic import BaseModel


class TaskCreate(BaseModel):
    text: str
    status: str = "pending"


class Task(BaseModel):
    id: int
    text: str
    status: str
