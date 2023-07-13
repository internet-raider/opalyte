async function sendTemplate(initData, template, folder, place) {
  const data = JSON.stringify(initData);  // Data to be passed as JSON
  const loadedTemplate = await eel.render_template(data, folder, template)();
  document.getElementById(place).innerHTML = loadedTemplate;
}

async function loadTemplate(initData, template, folder) {
  const data = JSON.stringify(initData);  // Data to be passed as JSON
  const loadedTemplate = await eel.render_template(data, folder, template)();
  return loadedTemplate;
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=Strict;";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return false;
}

function toggleDisplay(ids) {
  if (typeof ids === 'string') {
    // If a single ID is provided, convert it into an array
    ids = [ids];
  }

  ids.forEach(function (id) {
    var element = document.getElementById(id);

    if (element) {
      var currentDisplay = window.getComputedStyle(element).display;

      if (currentDisplay === 'none') {
        element.style.display = 'flex';
      } else {
        element.style.display = 'none';
      }
    }
    
    if (id.includes("Menu")) {
      var prefix = id.split("Menu")[0];
      var elementsToHide = document.querySelectorAll("[id^='" + prefix + "Menu']");
      elementsToHide.forEach(function (elem) {
        if (elem.id !== id) {
          elem.style.display = 'none';
        }
      });
    }
  });
}

function toggleCookie(cookieName) {
  // Get the current value of the cookie
  var currentValue = getCookie(cookieName);

  // Toggle the value between true and false
  var newValue = (currentValue === 'true') ? 'false' : 'true';

  // Set the updated cookie value
  setCookie(cookieName, newValue, 30);
}

eel.expose(alertUI)
function alertUI(message) {
  document.getElementById('alertHolder').innerHTML = message;
  setTimeout(function() {
    document.getElementById('alertHolder').innerHTML = '';
  }, 2000)
}

// disable deprecated markdown renderer flags
marked.use({
  mangle: false,
  headerIds: false,
});

// expose a function to set the theme on app init
eel.expose(setTheme)
function setTheme(theme) {
  document.getElementById('color-scheme').href = 'css/' + theme + '.css';
}
