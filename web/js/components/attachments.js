async function getAttachments(from_id, from_type) {
  let attachments = await eel.get_attachments(from_id, from_type)();
  console.log(attachments)
  let attachItems = await eel.render_template_list(attachments, 'attachments', 'items')();
  console.log(attachItems);
  html = await loadTemplate({'attachItems': attachItems, 'type': from_type, 'id': from_id}, 'popup', 'attachments')
  console.log(html);
  document.getElementById('popHolder').innerHTML = html;
  console.log('finished');
} 

function setMainItem(from_type, from_id) {
  setCookie('mainItem', from_type + '||' + from_id, 30);
}

async function createAttachment(from_type, from_id) {
  let attachment = document.getElementById('attachmentId').value;
  let to_type = attachment.split(`||`)[0];
  let to_id = attachment.split(`||`)[1];
  let id = await eel.create_attachment(from_id, from_type, to_id, to_type)();
  await getAttachments(from_id, from_type);
}

async function deleteAttachment(from_id, from_type, id) {
  await eel.delete_attachment(id)();
  await getAttachments(from_id, from_type);
}

async function loadAttachment(to_id, to_type) {
  let html = '';
  switch (to_type) {
    case 'task':
      const task = await eel.get_task(to_id)();
      task.id = to_id;
      html = await eel.render_template_list([task], 'tasks', 'items')();
      break;

    case 'note':
      const note = await eel.get_note(to_id)();
      note.id = to_id;
      html = await eel.render_template_list([note], 'notes', 'items')();
      break;

    case 'reminder':
      const reminder = await eel.get_reminder(to_id)();
      reminder.id = to_id;
      html = await eel.render_template_list([reminder], 'reminders', 'items')();
      break;

    default:
      break;
  }

  return html;
}

async function callAttachment(to_id, to_type, from_id, from_type, back) {
  let html = await loadAttachment(to_id, to_type);  

  if (back) {
    back = "sendTemplate({}, 'void', 'home', 'popHolder')";
  } else {
    back = "getAttachments(`" + from_id + "`, `" + from_type + "`)";
  }

  html = await loadTemplate({'html': html, 'back': back}, 'page', 'attachments');
  document.getElementById('popHolder').innerHTML = html;
  if (to_type == 'task') {
    const task = await eel.get_task(to_id)();
    document.getElementById('taskButton' + to_id).checked = task.complete;
  }
}