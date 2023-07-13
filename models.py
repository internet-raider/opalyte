from peewee import *
import os
import sys
import datetime

db = SqliteDatabase('notes.db')


class BaseModel(Model):
    time = CharField(default=datetime.datetime.now().strftime('%m-%d %H:%M'))

    def save(self, *args, **kwargs):
        self.time = datetime.datetime.now().strftime('%m-%d %H:%M')
        super().save(*args, **kwargs)

    class Meta:
        database = db


class Folder(BaseModel):
    id = AutoField()
    name = TextField()
    sections = CharField(default='notes|tasks|reminders')


class Note(BaseModel):
    id = AutoField()
    name = TextField()
    content = TextField()
    folder = ForeignKeyField(Folder, backref='notes', null=True)


class Task(BaseModel):
    id = AutoField()
    name = TextField()
    complete = BooleanField()
    folder = ForeignKeyField(Folder, backref='tasks', null=True)


class Reminder(BaseModel):
    id = AutoField()
    name = TextField()
    frequency = TextField()
    day_of_week = IntegerField(null=True)
    day_of_month = IntegerField(null=True)
    month_of_year = IntegerField(null=True)
    time_of_day = TimeField(null=True)
    end_datetime = DateTimeField(null=True)
    deleted = BooleanField()
    folder = ForeignKeyField(Folder, backref='reminders', null=True)


class Attachment(BaseModel):
    id = AutoField()
    from_type = TextField()
    from_id = TextField()
    to_type = IntegerField()
    to_id = IntegerField()
    to_name = TextField()


def initialize_db():
    db.connect()
    db.create_tables([Folder, Note, Task, Reminder, Attachment])
