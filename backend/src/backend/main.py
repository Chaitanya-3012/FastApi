from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .models import Task

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
@app.post("/tasks")
def create_task(task: Task):
    tasks_data.append(task)
    return task


# update complete
@app.put("/tasks/done/{id}")
def update_task(id: int):
    for i in range(0, len(tasks_data)):
        if tasks_data[i].id == id:
            tasks_data[i].status = "complete"
            break
    return {"message": "Task updated successfully."}


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
