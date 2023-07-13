async function getFolders() {
  const folders = await eel.get_folders()();
  const html = await eel.render_template_list(folders, 'folders', 'items')();
  document.getElementById('folders').innerHTML = html;
  loadFolder()
}

function setFolder(id) {

  setCookie('folder', id, 30);
  loadFolder();
}

function styleFolders() {
  if (getCookie('folder')) {
    id = getCookie('folder');
    let folders = document.getElementById('folders').children;
    for (let i = 0; i < folders.length; i++) {
      let folder = folders[i];
      if (getCookie('hideFold') == 'true') {
        folder.style.display = 'none';
      } else {
        folder.style.display = 'flex';
        folder.style['background'] = 'var(--card)';
        folder.children[1].style.display = 'none';
      }
    }
    let folder = document.getElementById('folder' + id);
    if (getCookie('hideFold') == 'true') {
      folder.style.display = 'flex';
    } else {
      folder.children[1].style.display = 'flex';
    }
    folder.style['background'] = 'var(--accent)';
  }
}

async function loadFolder() {
  let id = getCookie('folder');
  let folder = await eel.get_folder(id)();
  console.log(folder);
  styleFolders();
  await sendTemplate({}, 'void', 'home', 'notesSide');
  await sendTemplate({ 'name': folder.name, 'id': id }, 'page', 'folders', 'main');
  let sections = folder.sections.split('|');
  for (let i = 0; i < sections.length; i++) {
    let section = sections[i];
    switch (section) {
      case 'notes':
        await getNotes(id);
      break;
      
      case 'tasks':
        await getTasks(id);
      break;
      
      case 'reminders':
        await getReminders(id);
      break;
        
    }
  }
}

async function createFolder() {
  const name = document.getElementById('folderName').value;
  await eel.create_folder(name)();
  await getFolders();
}

async function deleteFolder(id) {
  await eel.delete_folder(id)();
  await getFolders();
  sendTemplate({}, 'void', 'home', 'main');
}

async function editFolder(id) {
  const folder = await eel.get_folder(id)();
  await sendTemplate({'id': id, 'name': folder.name}, 'editPage', 'folders', 'main');
  let sections = folder.sections.split('|');
  setTimeout(function () {
    for (let i = 0; i < sections.length; i++) {
      let section = sections[i];
      switch (section) {
        case 'notes':
          document.getElementById('notes-option').checked = 'true';
          break;

        case 'tasks':
          document.getElementById('tasks-option').checked = 'true';
          break;

        case 'reminders':
          document.getElementById('reminders-option').checked = 'true';
          break;
      }
    }
    }, 200)
}

async function saveFolder(id) {
  const folder = await eel.get_folder(id)();
  const name = document.getElementById('folderName').value;
  let sections = [];
  if (document.getElementById('notes-option').checked == true) {
    sections.push('notes');
  }
  if (document.getElementById('tasks-option').checked == true) {
    sections.push('tasks');
  }
  if (document.getElementById('reminders-option').checked == true) {
    sections.push('reminders');
  }
  const sectionList = sections.join('|');
  console.log(sectionList);
  await eel.edit_folder(name, sectionList, id)();
  await getFolders();
}

// Function to check if the current viewport orientation is landscape
function isLandscape() {
  return window.innerWidth > window.innerHeight;
}

// Function to update the 'hideFold' cookie value based on viewport orientation
function updateCookieOnOrientationChange() {
  const isLandscapeMode = !window.matchMedia("(max-width: 33em)").matches;
  if (isLandscapeMode) {
    setCookie('hideFold', 'false');
  } else {
    setCookie('hideFold', 'true');
  }
  styleFolders();
}

// Attach the event listener to the 'resize' event
window.addEventListener('resize', updateCookieOnOrientationChange);
