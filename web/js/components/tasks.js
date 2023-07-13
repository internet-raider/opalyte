async function createTask() {
  const title = document.getElementById('taskName').value;
  const folder = getCookie('folder');
  const id = await eel.create_task(title, false, folder)();
  await getTasks(folder);
}

async function getTasks(folder) {
  const tasks = await eel.get_tasks(folder)();
  let formAction = `sendTemplate({'setName': 'taskName', 'place': 'to do', 'action': 'createTask()', 'button': 'new task'}, 'smallForm', 'home', 'formHolder')`;
  let html = await loadTemplate({ 'formAction': formAction, 'title': 'tasks', 'icon': 'bi bi-clipboard2-check-fill'}, 'sectionHeader', 'folders');
  html += await eel.render_template_list(tasks, 'tasks', 'items')();
  document.getElementById('tasks').innerHTML = html;
  if (getCookie('hidetasks') != 'true') {
    for (let i = 0; i < tasks.length; i++) {
      let task = tasks[i]
      let check = task.complete;
      document.getElementById('taskButton' + task.id).checked = check;
    }
  }

  
}

async function checkTask(id) {
  let complete = document.getElementById('taskButton' + id).checked;
  await eel.update_task(id, complete, '')();
  await eel.get_tasks(getCookie('folder'))();
}

async function deleteTask(id) {
  await eel.delete_task(id)();
  await getTasks(getCookie('folder'));
}

async function reloadTask(id, name, time, template) {
  complete = document.getElementById('taskButton' + id).checked;
  sendTemplate({ 'name': name, 'time': time, 'complete': complete, 'id': id }, template, 'tasks', 'task' + id)
}