import sys
sys.path.append("..")
import eel
from models import Reminder
from datetime import datetime
from api.attachments import delete_all_attachments, delete_attachment

# reminders api

def reminder_freq_set(reminder_dict, reminder):
  if reminder.frequency == 'none' and reminder.end_datetime is not None:
    reminder_dict['end_datetime'] = reminder.end_datetime.strftime("%Y-%m-%d %I:%M%p")

  elif reminder.frequency == 'daily' and reminder.time_of_day is not None:
    reminder_dict['time'] = reminder.time_of_day.strftime("%I:%M%p")

  elif reminder.frequency == 'weekly' and reminder.time_of_day is not None and reminder.day_of_week is not None:
    reminder_dict['time'] = reminder.time_of_day.strftime("%I:%M%p")
    reminder_dict['week'] = reminder.day_of_week

  elif reminder.frequency == 'monthly' and reminder.time_of_day is not None and reminder.day_of_month is not None:
    reminder_dict['time'] = reminder.time_of_day.strftime("%I:%M%p")
    reminder_dict['month'] = reminder.day_of_month

  elif reminder.frequency == 'yearly' and reminder.time_of_day is not None and reminder.day_of_month is not None and reminder.month_of_year is not None:
    reminder_dict['time'] = reminder.time_of_day.strftime("%I:%M%p")
    reminder_dict['month'] = reminder.day_of_month
    reminder_dict['month_of_year'] = reminder.month_of_year


@eel.expose
def get_reminders(folder_id):
    reminders = Reminder.select().where(Reminder.folder_id == folder_id)
    current_time = datetime.now()
    reminders_list = []

    for reminder in reminders:
        reminder_dict = {'id': reminder.id, 'name': reminder.name, 'frequency': reminder.frequency, 'deleted': reminder.deleted, 'current_time': current_time.strftime("%Y-%m-%d %I:%M%p").lower()}
        reminder_freq_set(reminder_dict, reminder)
        reminders_list.append(reminder_dict)

    return reminders_list

@eel.expose
def get_reminder(id):
    reminder = Reminder.get(Reminder.id == id)
    current_time = datetime.now()
    reminder_dict = {'id': reminder.id, 'name': reminder.name, 'frequency': reminder.frequency, 'deleted': reminder.deleted, 'current_time': current_time.strftime("%Y-%m-%d %I:%M%p").lower()}
        
    reminder_freq_set(reminder_dict, reminder)

    return reminder_dict
    

@eel.expose
def delete_reminder(id):
    reminder = Reminder.get(Reminder.id == id)
    reminder.deleted = True
    delete_all_attachments(id, 'reminder')
    reminder.save()


def get_all_reminders():
    return Reminder.select()


@eel.expose
def create_reminder(
        name, folder_id,
        frequency,
        time,
        week=None,
        month=None,
        month_of_year=None,
        end_datetime=None,
        deleted=None
):
    if end_datetime:
        end_datetime = datetime.strptime(end_datetime, "%Y-%m-%dT%H:%M")

    if time:
        time = datetime.strptime(time, '%H:%M').time()

    reminder = Reminder.create(
        name=name,
        folder=folder_id,
        frequency=frequency,
        time_of_day=time,
        day_of_week=week,
        day_of_month=month,
        month_of_year=month_of_year,
        end_datetime=end_datetime,
        deleted=deleted
    )

    from scheduler import schedule_reminder, run_reminder
    schedule_reminder(reminder)


