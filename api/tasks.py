import sys
sys.path.append("..")
import eel
from models import Task
from api.attachments import delete_all_attachments, delete_attachment

# tasks api

@eel.expose
def create_task(name, complete, folder_id):
    task = Task.create(name=name, complete=complete, folder=folder_id)
    return task.id


@eel.expose
def delete_task(id):
    task = Task.get(Task.id == id)
    delete_all_attachments(task.id, 'task')
    return task.delete_instance()
    
@eel.expose
def get_task(id):
    task = Task.get(Task.id == id)
    return {'id': task.id, 'name': task.name, 'complete': task.complete}

@eel.expose
def get_tasks(folder_id):
    tasks = Task.select().where(Task.folder_id == folder_id)
    return [{'id': task.id, 'name': task.name, 'time': task.time, 'complete': task.complete} for task in tasks]


@eel.expose
def update_task(id, complete, folder_id):
    task = Task.get(Task.id == id)
    task.complete = complete
    if folder_id != '':
        task.folder = folder_id
    task.save()
