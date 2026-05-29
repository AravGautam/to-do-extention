// Content script — injected into every web page
// CAN access the DOM, CANNOT make cross-origin API calls

function getPageData() {
  return {
    url:   location.href,
    title: document.title,
    meta:  document.querySelector('meta[name="description"]')
              ?.getAttribute('content') ?? '',
    selectedText: window.getSelection()?.toString() ?? ''
  }
}

// Listen for the extension icon click (via popup message)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'GET_PAGE_DATA') {
    sendResponse({ data: getPageData() })
  }
})

// Example: auto-save page data to your API via background
chrome.runtime.sendMessage({
  type:    'SAVE_PAGE',
  payload: getPageData()
}, (res) => {
  if (res?.error) console.warn('Save failed:', res.error)
})