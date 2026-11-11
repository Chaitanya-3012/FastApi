from typing import Literal
from pydantic import BaseModel, ConfigDict


class Task(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int | None = None
    text: str
    status: Literal["pending", "doing", "complete"] = "pending"
