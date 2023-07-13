async function getNotes(folder) {
  let notes = await eel.get_notes(folder)();
  let formAction = `sendTemplate({}, 'create', 'notes', 'main'); getNoteSide('loadFolder()');`;
  let html = await loadTemplate({ 'formAction': formAction, 'title': 'notes', 'icon': 'bi bi-journal-plus'}, 'sectionHeader', 'folders');
  html += await eel.render_template_list(notes, 'notes', 'items')();
  document.getElementById('notes').innerHTML = html;
}

async function createNote() {
  const title = document.getElementById('noteName').value;
  const content = document.getElementById('noteContent').value;
  const folder = getCookie('folder');
  id = await eel.create_note(title, content, folder)();
  await getNote(id);
  setMainItem('note', id);
}

async function getNoteSide(callback, id) {
  let notes = await eel.get_notes(getCookie('folder'))();
  if (id) {
    for (let i = 0; i < notes.length; i++) {
      notes[i].id = notes[i].id + 'i'
      if (notes[i].id == id + 'i') {
        notes.splice(i, 1);
      }
    }
  }
  console.log(notes)
  let html = `
    <div class="row">
      <h3 class="align row center">other notes</h3>
    </div>
`;
  html += await eel.render_template_list(notes, 'notes', 'items')();
  document.getElementById('notesSide').innerHTML = html;
}

async function getNote(id) {
  if (typeof id == 'string') {
    if(id.includes('i')) {
      var strippedString = id.slice(0, -1);
      id = parseInt(strippedString, 10);
    }
    id = parseInt(id, 10);
  }
  let note = await eel.get_note(id)();
  setMainItem('note', id);
  noteContent = await replaceMarkdownLinks(note.content);
  await sendTemplate({ 'id': id, 'name': note.name, 'content': marked.parse(noteContent), 'time': note.time }, 'page', 'notes', 'main');
  await processTasks('main');
  await getNoteSide('getNote(' + id + ')', id);
}

async function editNote(id) {
  note = await eel.get_note(id)();
  await sendTemplate({ 'id': id, 'name': note.name, 'content': note.content}, 'edit', 'notes', 'main');
  await getNoteSide('getNote(' + id + ')', id);
  setMainItem('note', id);
}

async function saveNote(id) {
  const title = document.getElementById('noteName').value;
  const content = document.getElementById('noteContent').value;
  const folder = getCookie('folder');
  await eel.update_note(id, title, content, folder)();
  await getNote(id);
}

async function deleteNote(id) {
  await eel.delete_note(id)();
  await loadFolder();
}