import sys
sys.path.append("..")
import eel
from models import Note
from api.attachments import delete_all_attachments, delete_attachment

# notes api


@eel.expose
def get_notes(folder_id):
    notes = Note.select().where(Note.folder_id == folder_id)
    return [{'id': note.id, 'name': note.name, 'time': note.time} for note in notes]


@eel.expose
def get_note(id):
    note = Note.get(Note.id == id)
    return {'name': note.name, 'content': note.content, 'time': note.time}


@eel.expose
def delete_note(id):
    note = Note.get(Note.id == id)
    delete_all_attachments(note.id, 'note')
    return note.delete_instance()


@eel.expose
def create_note(name, content, folder_id):
    note = Note.create(name=name, content=content, folder=folder_id)
    return note.id


@eel.expose
def update_note(note_id, name, content, folder_id):
    note = Note.get(Note.id == note_id)
    note.name = name
    note.content = content
    if folder_id != '':
        note.folder = folder_id
    note.save()
