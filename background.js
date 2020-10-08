chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.clear();

  chrome.storage.local.set({
    snippet1: {
      name: "Gitlab",
      cmd: `const myInterval = setInterval(() => {
	if (document.querySelector(".diff-files-holder.container-limited.limit-container-width.mx-lg-auto.px-3") != null) {
		document.querySelector(".diff-files-holder.container-limited.limit-container-width.mx-lg-auto.px-3").style.maxWidth="none"
		clearInterval(myInterval)
	}
}, 300);`,
      regex: "gitlab(.*)diffs",
      autoExecute: true,
    },
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!changeInfo.url) {
    return;
  }

<<<<<<< HEAD
  chrome.storage.local.get(null, (elements) => {
    Object.values(elements).forEach((cmd) => {
      if (!cmd.autoExecute || !cmd.regex) {
        return;
      }

      const regexes = cmd.regex.split(/\n/g);

      for (let i = 0; i < regexes.length; i++) {
        if (new RegExp(regexes[i], "g").exec(changeInfo.url)) {
          chrome.tabs.executeScript(tab.id, { code: cmd.cmd });
        }
      }
    });
  });
});
=======
	chrome.storage.local.get(null, (elements) => {
		Object.values(elements).forEach(cmd => {
			if (!cmd.autoExecute || !cmd.regex) {
				return
			}

			const regexes = cmd.regex.split(/\n/g);
			for (let i = 0; i < regexes.length; i++) {
				if (new RegExp(regexes[i], "g").exec(changeInfo.url)) {
					chrome.tabs.executeScript(tab.id, { code: cmd.cmd });
				}
			}
		});
	});
  }
);
>>>>>>> styles fixes, improve some methods
