import eel
import sys
sys.path.append("..")
import json

@eel.expose
def save_settings(settings, filename):
    with open(filename, 'w') as file:
        json.dump(settings, file, indent=4)

@eel.expose
def load_settings(filename):
    with open(filename, 'r') as file:
        settings = json.load(file)
    return settings