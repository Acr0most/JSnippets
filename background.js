chrome.runtime.onInstalled.addListener(function () {
  // chrome.storage.sync.clear();

  chrome.storage.sync.set({
    snippet1: {
      name: "Green",
      cmd: "document.querySelector('body').style.backgroundColor = 'green'"
    },
    snippet2: {
      name: "Red",
      cmd: "document.querySelector('body').style.backgroundColor = 'red'"
    },
  });
});
