
async function saveSettings() {
  const settings = await eel.load_settings('settings.json')();
  const elements = document.getElementsByName('theme');
  const browser = document.getElementById('browserName').value;
  const elLength = elements.length;
  for (let i = 0; i < elLength; i++) {
    const elementId = elements[i].id
    if (elements[i].clicked == true) {
      console.log(elementId);
      settings['theme'] = elementId;
    }
  }

  if (browser != "") {
    settings['browser'] = browser;
  }
  
  await eel.save_settings(settings, 'settings.json')();
  await getFolders();
}

async function getSettings() {
    const settings = await eel.load_settings('settings.json')();
    console.log(settings);
    await loadFolder();
    const html = await loadTemplate(settings, 'page', 'settings');
    document.getElementById('main').innerHTML = html;
    if (settings['theme']) {
      const elements = document.getElementsByName('theme');
      const elLength = elements.length;
      for (let i = 0; i < elLength; i++) {
        const elementId = elements[i].id
        if (settings['theme'] == elementId) {
          elements[i].click();
          elements[i].clicked = true;
        } else {
          elements[i].clicked = false;
        }
      }
    }
}

function setSetting(id, setting) {
  const setEl = document.getElementById(id);
  const name = setEl.name;
  const namelength = name.length;
  for (let i = 0; i < namelength -1; i++) {
    const element = document.getElementsByName(setting)[i];
    document.getElementsByName(setting)[i].clicked = false;
  }
  setEl.clicked = true;
}
