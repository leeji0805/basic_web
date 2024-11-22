chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
  });
  
  // Handle JavaScript toggle
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'toggleJS') {
      chrome.contentSettings.javascript.set(
        {
          primaryPattern: "<all_urls>",
          setting: message.enable ? 'allow' : 'block'
        },
        () => {
          sendResponse({ success: true });
        }
      );
      return true; // Asynchronous response
    }
  });