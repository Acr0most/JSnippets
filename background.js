chrome.runtime.onInstalled.addListener(function () {
 chrome.storage.local.clear();

 chrome.storage.local.set({
    snippet1: {
      name: "Gitlab",
      cmd: `
	var myInterval = setInterval(() => {
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

chrome.tabs.onUpdated.addListener(function
  (tabId, changeInfo, tab) {
    if (changeInfo.url) {
	console.log(tabId, changeInfo, tab);

	chrome.storage.local.get(null, (elements) => {
		Object.values(elements).forEach(cmd => {
			if (!cmd.autoExecute) {
				return
			}

			var myRe = new RegExp(cmd.regex, "g");

			if (myRe.exec(changeInfo.url)) {
				console.log("exodus", changeInfo.url, cmd.regex, cmd.cmd);
				chrome.tabs.executeScript(tab.id, { code: cmd.cmd });
/*
				chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
					chrome.tabs.executeScript(tabs[0].id, { code: cmd.cmd });
				});
*/
			}
		});
	});
    }
  }
);
