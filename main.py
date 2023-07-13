import eel
from models import initialize_db
import api.base
from scheduler import initialize_scheduler
from api.settings import load_settings

settings = load_settings('settings.json')

initialize_db()

initialize_scheduler()

eel.init('web')
eel.start('index.html', size=(600, 400), block=False)

eel.setTheme(settings['theme'])

while True:
  eel.sleep(10)
