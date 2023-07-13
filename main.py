import eel
from models import initialize_db
import api.base
from scheduler import initialize_scheduler
from api.settings import load_settings

settings = load_settings('settings.json')

initialize_db()

initialize_scheduler()

eel.init('web')
eel.start('index.html', size=(800, 600), block=False, mode=settings['browser'])

eel.setTheme(settings['theme'])

while True:
  eel.sleep(10)
