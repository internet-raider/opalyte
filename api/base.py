import eel
import json
import os
from jinja2 import Environment, FileSystemLoader
import api.folders
import api.reminders
import api.notes
import api.tasks
import api.attachments
import api.notifications
import api.settings


@eel.expose
def render_template(data, folder, file_name):
    env = Environment(loader=FileSystemLoader(os.path.join('views', folder)))
    template = env.get_template(file_name + ".html")

    # Parse the JSON data
    data = json.loads(data)

    # Render the template with the provided data
    rendered = template.render(**data)

    return rendered


@eel.expose
def render_template_list(data, folder, file_name):
    env = Environment(loader=FileSystemLoader(os.path.join('views', folder)))
    template = env.get_template(file_name + ".html")

    print(data)

    rendered = template.render(items=data)
    return rendered