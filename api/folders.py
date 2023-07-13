import sys
sys.path.append("..")
import eel
from models import Folder, Note, Task, Reminder
from api.reminders import delete_reminder
from api.notes import delete_note
from api.tasks import delete_task

# folders api

@eel.expose
def get_folder(folder_id):
    folder = Folder.get(Folder.id == folder_id)
    return {'name': folder.name, 'sections': folder.sections}

@eel.expose
def get_folders():
    folders = Folder.select()
    return [{'id': folder.id, 'name': folder.name} for folder in folders]


@eel.expose
def create_folder(name):
    folder = Folder.create(name=name)
    return folder.id


@eel.expose
def delete_folder(folder_id):
    notes = Note.select().where(Note.folder == folder_id)
    tasks = Task.select().where(Task.folder == folder_id)
    reminders = Reminder.select().where(Reminder.folder == folder_id)
    for note in notes:
        delete_note(note.id)
        
    for task in tasks:
        delete_task(task.id)

    for reminder in reminders:
        delete_reminder(reminder.id)

    folder = Folder.get(Folder.id == folder_id)
    folder.delete_instance()


@eel.expose
def edit_folder(new_name, new_sections, folder_id):
    folder = Folder.get(Folder.id == folder_id)
    folder.name = new_name
    folder.sections = new_sections
    folder.save()
