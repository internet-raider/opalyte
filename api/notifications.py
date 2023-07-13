import eel
from plyer import notification

@eel.expose
def send_notification(title, message):
  notification.notify(
    title=title,
    message=message,
    timeout=10
  )
