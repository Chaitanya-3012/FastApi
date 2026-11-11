from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .models import Task
from .db import session

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
tasks_data = [
    Task(id=1, text="Clean Room", status="pending"),
    Task(id=2, text="Study for Exam", status="complete"),
    Task(id=3, text="Workout", status="doing"),
]


# default
@app.get("/")
def greet():
    return {"message": "Hello, Frontend!"}


# read
@app.get("/tasks")
def get_tasks():
    return tasks_data


# create
@app.post("/tasks", response_model=Task)
def create_task(task: Task):
    new_id = max((t.id for t in tasks_data), default=0) + 1
    new_task = Task(id=new_id, text=task.text, status=task.status)
    tasks_data.append(new_task)
    return new_task


# update status
@app.put("/tasks/status/{id}")
def update_task(id: int, status: str):
    for i in range(0, len(tasks_data)):
        if tasks_data[i].id == id:
            tasks_data[i].status = status
            return tasks_data[i]
    return {"message": "Task not found."}


# update task
@app.put("/tasks/edit/{id}")
def edit_task(id: int, task: Task):
    for i in range(0, len(tasks_data)):
        if tasks_data[i].id == id:
            tasks_data[i].text = task.text
            break
    return {"message": "Task updated successfully."}


# delete
@app.delete("/tasks/{id}")
def delete_task(id: int):
    for i in range(0, len(tasks_data)):
        if tasks_data[i].id == id:
            tasks_data.pop(i)
            break
    return {"message": "Task deleted successfully."}
