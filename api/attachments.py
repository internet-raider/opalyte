import sys
sys.path.append("..")
import eel
from models import Attachment

# attachments api

@eel.expose
def get_attachments(from_id, from_type):
    attachments = Attachment.select().where(Attachment.from_id == from_id, Attachment.from_type == from_type)
    
    return [{'id': attachment.id, 'to_name': attachment.to_name, 'to_type': attachment.to_type, 'to_id': attachment.to_id, 'from_id': from_id, 'from_type': from_type} for attachment in attachments]


@eel.expose
def create_attachment(from_id, from_type, to_id, to_type):
    from api.notes import get_note
    from api.tasks import get_task
    from api.reminders import get_reminder
    
    if to_type == 'reminder':
        to_name = get_reminder(to_id)['name']
    elif to_type == 'task':
        to_name = get_task(to_id)['name']
    elif to_type == 'note':
        to_name = get_note(to_id)['name']
    else:
        to_name = ''

    print(from_id, from_type, to_id, to_type, to_name)

    attachment = Attachment.create(
        from_id=from_id, from_type=from_type, to_id=to_id, to_type=to_type, to_name=to_name)
    return attachment.id

@eel.expose
def delete_attachment(attachment_id):
    attachment = Attachment.get(Attachment.id == attachment_id)
    attachment.delete_instance()

def delete_all_attachments(from_id, from_type):
    attachments = Attachment.select().where(Attachment.from_id == from_id, Attachment.from_type == from_type)

    for attachment in attachments:
        delete_attachment(attachment.id)