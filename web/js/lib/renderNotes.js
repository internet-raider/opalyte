async function replaceMarkdownLinks(text) {
  const regex = /\[(.+?)\]\(item:\/\/(.+?)\)/g;
  let replacedText = text;

  while ((match = regex.exec(text))) {
    const [fullMatch, p1, p2] = match;
    let to_type = p2.split(`||`)[0];
    let to_id = p2.split(`||`)[1];
    let mainItem = getCookie('mainItem');
    let from_type = mainItem.split(`||`)[0];
    let from_id = mainItem.split(`||`)[1];
    let html = await loadAttachment(to_id, to_type);

    // Generate a unique ID for the link
    const linkID = `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create a custom link with onclick function
    const replacement = `<div id="${linkID}" class="row">${html}</div>`;

    // Replace the Markdown-style link with the custom link in the text
    replacedText = replacedText.replace(fullMatch, replacement);
  }

  return replacedText;
}

async function processTasks(elementId) {
  const parentElement = document.getElementById(elementId);
  const taskElements = parentElement.querySelectorAll('[id^="task"]');

  for (const taskElement of taskElements) {
    const taskId = taskElement.id.match(/^task(\d+)$/i);

    if (taskId) {
      try {
        const result = await eel.get_task(taskId[1])();
        const checkbox = taskElement.querySelector('input[type="checkbox"]');

        if (checkbox) {
          checkbox.checked = result.complete;
        }
      } catch (error) {
        console.error(`Error processing task ${taskId[1]}:`, error);
      }
    }
  }
}
