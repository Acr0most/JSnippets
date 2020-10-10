let id = null

function fillView() {
  document.getElementById("outlet").innerHTML = "";

  cmd = chrome.storage.local.get(null, (elements) => {
    const dynamicElements = Object.keys(elements).reduce(
      (str, key) =>
        str + `<div id="${key}" class="snippet">${elements[key].name}</div>`,
      ""
    );

    document.getElementById("outlet").innerHTML = dynamicElements;
  });

  cmd = chrome.storage.local.get(null, (elements) => {
    Object.keys(elements).forEach(key => document.getElementById(key).addEventListener("click", showOptions));
  });
}

function selectSnippet(id) {
  Array.from(document.querySelectorAll("#outlet div")).forEach(el => el.classList.remove("selected"));
  document.getElementById(id).classList.add("selected");
}

function reset() {
  showOptions(null);
}

function save() {
  chrome.storage.local.set({
    [id]: {
      name: document.getElementById("options-name").innerText,
      cmd: document.getElementById("options-cmd").innerText,
      autoExecute: document.getElementById("options-autoexecute").checked,
      regex: document.getElementById("options-regex").innerText
    }
  });

  fillView();
}

function showOptions(event) {
  id = event == null ? id : event.target.id;

  chrome.storage.local.get(id, (elements) => {
    let ids = Object.keys(elements);

    if (ids.length === 0 || ids[0] == null) {
      showInfo("command with id" + id + "not found" + elements + id, "red", 1000);
      return;
    }

    printOptions(elements[ids[0]]);
    selectSnippet(id);
  });
}

function showInfo(message, color, timeout) {
  setTimeout(() => {
    document.querySelector('#output').style.backgroundColor = "white";
    document.querySelector('#output').innerText = "";
  }, timeout);

  document.querySelector('#output').style.backgroundColor = color;
  document.querySelector('#output').innerText = message;
}

function executeCommand() {
  if (id === -1) {
    showInfo("invalid id", "red", 1000);
    return null;
  }

  chrome.storage.local.get(id, (elements) => {
    let ids = Object.keys(elements);

    if (ids.length === 0 || ids[0] == null) {
      showInfo("command with id" + id + "not found" + elements + id, "red", 1000);
      return;
    }

    chrome.tabs.query({
      currentWindow: true,
      active: true
    }, (tabs) => {
      chrome.tabs.executeScript(tabs[0].id, {
        code: elements[ids[0]].cmd
      });
    });

    showInfo("executed", "#00b940", 1000);
  });
}

function printOptions(cmd) {
  document.getElementById("options-name").innerText = cmd.name;
  document.getElementById("options-cmd").innerText = cmd.cmd;
  document.getElementById("options-autoexecute").checked = cmd.autoExecute;
  document.getElementById("options-regex").innerText = cmd.regex;
}

const add = document.getElementById("add");

add.addEventListener('focus', (event) => {
  if (event.target.innerText === "+") {
    event.target.innerText = "";
    event.target.classList.remove("centered");
  }
});

add.addEventListener('blur', (event) => {
  if (event.target.innerText === "") {
    event.target.innerText = "+";
    event.target.classList.add("centered");
  }
});


add.addEventListener("keyup", async event => {
  if (event.keyCode !== 13) {
      return;
  }

  event.preventDefault();

  let newId = await getNextId();

  chrome.storage.local.set({
    [newId]: {
      name: document.getElementById("add").value,
      cmd: "",
      autoExecute: false,
      regex: ""
    }
  });

  fillView();
  add.value = "";
});

function deleteSnippet() {
	chrome.storage.local.remove(id);
	fillView();
}

async function getNextId() {
	return new Promise(resolve => {
        chrome.storage.local.get(null, (elements) => {
            const keys = Object.keys(elements).map(el => parseInt(el.replace("snippet", "")));
            const last = keys.sort((a,b) => a-b)[keys.length-1];
            return resolve(`snippet${parseInt(last + 1)}`);
        });
    });
}


document.getElementById('remove').addEventListener('click', deleteSnippet);
document.getElementById('abort').addEventListener('click', reset);
document.getElementById('save').addEventListener('click', save);
document.getElementById('execute').addEventListener('click', executeCommand);
window.addEventListener('load', fillView);
