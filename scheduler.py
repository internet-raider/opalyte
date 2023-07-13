from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from models import Reminder
from api.attachments import get_attachments
from api.base import render_template_list
from api.notifications import send_notification
import eel
from datetime import datetime
import uuid

scheduler = BackgroundScheduler()
scheduler.start()


def schedule_reminder(reminder):
    # Handle day_of_week, day_of_month, and month_of_year. If they're None, replace with '*'
    time = reminder.time_of_day if reminder.time_of_day is not None else '*'
    day_of_week = str(reminder.day_of_week) if reminder.day_of_week is not None else '*'
    day_of_month = str(reminder.day_of_month) if reminder.day_of_month is not None else '*'
    month_of_year = str(reminder.month_of_year) if reminder.month_of_year is not None else '*'
    job_id = str(reminder.id) if reminder.id else str(uuid.uuid4())

    if reminder.deleted:
        # If the reminder is marked as deleted, delete it from the database
        reminder_db = Reminder.get(Reminder.id == reminder.id)
        return reminder_db.delete_instance()

    if reminder.time_of_day:
        # Schedule the reminder with CronTrigger based on the specified time and frequency
        scheduler.add_job(
            run_reminder,
            CronTrigger(
                day_of_week=day_of_week,
                day=day_of_month,
                month=month_of_year,
                hour=time.hour,
                minute=time.minute),
            kwargs={'reminder_id': reminder.id},
            id=job_id
        )
    else:
        # Schedule a one-time reminder at the specified end_datetime
        scheduler.add_job(
            run_reminder,
            run_date=reminder.end_datetime,
            kwargs={'reminder_id': reminder.id},
            id=job_id
        )


def run_reminder(reminder_id):
    # Retrieve the reminder from the database
    reminder = Reminder.get(Reminder.id == reminder_id)
    # Get attachments for the reminder
    attachments = get_attachments(reminder_id, 'reminder')
    # Render attachments as HTML
    html = render_template_list(attachments, 'attachments', 'items')

    if reminder.deleted:
        # If the reminder is marked as deleted, delete it from the database
        reminder_db = Reminder.get(Reminder.id == reminder.id)
        return reminder_db.delete_instance()

    # Trigger UI update in the frontend with reminder details
    eel.trigger_ui(reminder.name, reminder.id, html)
    # Send notification for the reminder
    send_notification(reminder.name, 'Your reminder is up. Check the app to see it.')
    print(f"Running reminder: {reminder.name}")


def get_all_reminders():
    # Retrieve all reminders from the database
    return Reminder.select()


def initialize_scheduler():
    # Load the reminders and schedule them
    reminders = get_all_reminders()
    for reminder in reminders:
        schedule_reminder(reminder)
