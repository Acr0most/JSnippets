var bkg = chrome.extension.getBackgroundPage();
let id = null

let abort = document.getElementById('abort');
abort.onclick = reset;

let saveElement = document.getElementById('save');
saveElement.onclick = save;

let execute = document.getElementById('execute');
execute.onclick = executeCommand;

window.onload = fillView;

function fillView() {
  document.getElementById("snippets").innerHTML = "";

  cmd = chrome.storage.sync.get(null, (elements) => {
    Object.keys(elements).forEach(key => document.getElementById("snippets").innerHTML += "<div id=\"" + key + "\" class=\"snippet\">" + elements[key].name + "</div>");
  })

  cmd = chrome.storage.sync.get(null, (elements) => {
    Object.keys(elements).forEach(key => document.getElementById(key).addEventListener("click", showOptions));
  })
}

function selectSnippet(id) {
  document.querySelectorAll("#snippets div").forEach(el => el.classList.remove("selected"));
  document.getElementById(id).classList.add("selected");
}

function reset() {
  showOptions(null)
}

function save() {
  chrome.storage.sync.set({
    [id]: {
      name: document.getElementById("options-name").innerText,
      cmd: document.getElementById("options-cmd").innerText,
    }
  })

  fillView()
  printOptions({
    name: "",
    cmd: "",
  })
}

function showOptions(event) {
  id = event == null ? id : event.target.id;

  chrome.storage.sync.get(id, (elements) => {
    let ids = Object.keys(elements);

    if (ids.length == 0 || ids[0] == null) {
      window.alert("command with id" + id + "not found" + elements + elements + id);
      return
    }

    printOptions(elements[ids[0]])
    selectSnippet(id)
  })
}

function executeCommand() {
  if (id == -1) {
    return null;
  }

  chrome.storage.sync.get(id, (elements) => {
    let ids = Object.keys(elements);

    if (ids.length == 0 || ids[0] == null) {
      window.alert("command with id" + id + "not found" + elements + elements + id);
      return
    }

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      chrome.tabs.executeScript(tabs[0].id, { code: elements[ids[0]].cmd });
    });
  })
}

function printOptions(cmd) {
  document.getElementById("options-name").innerText = cmd.name;
  document.getElementById("options-cmd").innerText = cmd.cmd;
}