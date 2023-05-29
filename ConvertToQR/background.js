// background.js

// Create a context menu item for hyperlinks
browser.contextMenus.create({
  id: "convertToQR",
  title: "Convert to QR",
  contexts: ["link", "editable", "selection"]
});

// Handle context menu item click
browser.contextMenus.onClicked.addListener(async function(info, tab) {
  if (info.menuItemId === "convertToQR") {
    var selectedText = "";
    if (info.selectionText) {
      // If a portion of text is selected, use it as the input
      selectedText = info.selectionText;
    } else if (info.linkUrl) {
      // If a hyperlink is selected, use its URL as the input
      selectedText = info.linkUrl;
    }

    if (selectedText) {
      // Replace dl=0 with dl=1 for Dropbox links
      if (isDropboxLink(selectedText)) {
        selectedText = replaceDropboxLinkParam(selectedText, "dl", "1");
      }

      // Send a message to the active tab with the selected text
      browser.tabs.sendMessage(tab.id, { text: selectedText });
    }
  }
});

// Function to get the value of the selected textbox
function getSelectedTextboxValue(tabId) {
  return browser.tabs.executeScript(tabId, {
    code: "document.activeElement.value"
  }).then(function(results) {
    return results[0];
  });
}

// Function to check if the link is a Dropbox link
function isDropboxLink(link) {
    // Customize the logic to detect Dropbox links
    return link.includes("dropbox.com");
}

// Function to replace a query parameter in a URL
function replaceQueryParam(url, paramName, paramValue) {
    var pattern = new RegExp(`([?&])${paramName}=.*?(&|$)`);
    if (url.match(pattern)) {
        return url.replace(pattern, `$1${paramName}=${paramValue}$2`);
    }
    return url + (url.indexOf("?") === -1 ? "?" : "&") + paramName + "=" + paramValue;
}

// Function to replace a specific query parameter in a Dropbox link
function replaceDropboxLinkParam(link, paramName, paramValue) {
    // Replace the query parameter in the Dropbox link
    var url = new URL(link);
    url.href = replaceQueryParam(url.href, paramName, paramValue);
    return url.href;
}