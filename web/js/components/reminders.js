async function getReminders(folder) {
  let formAction = `sendTemplate({}, 'form', 'reminders', 'formHolder')`;
  let reminders = await eel.get_reminders(folder)();
  let html = await loadTemplate({ 'formAction': formAction, 'title': 'reminders', 'icon': 'bi bi-calendar-plus' }, 'sectionHeader', 'folders');
  html += await eel.render_template_list(reminders, 'reminders', 'items')();
  document.getElementById('reminders').innerHTML = html;
}

async function deleteReminder(id) {
  await eel.delete_reminder(id)();
  getReminders(getCookie('folder'));
}

async function createReminder() {
  let name = document.getElementById('reminderName').value;
  let folder_id = getCookie('folder');
  let frequency = document.getElementById('frequency').value;
  let time = null; // your format might vary
  let week = null; // for example, Wednesday
  let month = null;
  let month_of_year = null;
  let end_datetime = null;

  switch (frequency) {
    case 'none':
      end_datetime = document.getElementById('end_datetime').value;
      break;
    case 'daily':
      time = document.getElementById('time').value;
      break;
    case 'weekly':
      week = document.getElementById('day_of_week').value;
      time = document.getElementById('time').value;
      break;
    case 'monthly':
      month = document.getElementById('day_of_month').value;
      time = document.getElementById('time').value;
      break;
    case 'yearly':
      month_of_year = document.getElementById('month_of_year').value;
      month = document.getElementById('day_of_month').value;
      time = document.getElementById('time').value;
      break;
  }

  await eel.create_reminder(name, folder_id, frequency, time, week, month, month_of_year, end_datetime, false)();
  await sendTemplate({}, 'void', 'home', 'formHolder');
  await getReminders(getCookie('folder'));
}

async function loadReminder(id) {
  let reminder = await eel.get_reminder(id)();
  sendTemplate(reminder, 'page', 'reminders', 'popHolder');
}

eel.expose(trigger_ui);
function trigger_ui(name, id, html) {
  getReminders(getCookie('folder'));
  if (document.getElementById('popHolder').innerHTML == "") {
    sendTemplate({'name': name, 'id': id, 'html': html}, 'popup', 'reminders', 'popHolder');
  } else {
    document.getElementById('popHolder').innerHTML += loadTemplate({'html': html, 'name': name, 'id': id}, 'popup', 'reminders');
  }
}

function updateRemindForm(frequency) {
  let dayOfWeekDiv = document.getElementById('day_of_week_div');
  let dayOfMonthDiv = document.getElementById('day_of_month_div');
  let monthOfYearDiv = document.getElementById('month_of_year_div');
  let endDatetimeDiv = document.getElementById('end_datetime_div');
  let timeDiv = document.getElementById('time_div');

  // Initially hide all optional fields
  timeDiv.style.display = 'flex';
  dayOfWeekDiv.style.display = 'none';
  dayOfMonthDiv.style.display = 'none';
  monthOfYearDiv.style.display = 'none';
  endDatetimeDiv.style.display = 'none';

  // Display the appropriate fields based on the selected frequency
  switch (frequency) {
    case 'none':
      endDatetimeDiv.style.display = 'flex';
      timeDiv.style.display = 'none';
      break;
    case 'weekly':
      dayOfWeekDiv.style.display = 'flex';
      break;
    case 'monthly':
      dayOfMonthDiv.style.display = 'flex';
      break;
    case 'yearly':
      monthOfYearDiv.style.display = 'flex';
      dayOfMonthDiv.style.display = 'flex';
      break;
  }
}
