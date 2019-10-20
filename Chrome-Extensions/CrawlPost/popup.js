
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const key = "foobar"

        chrome.tabs.query({active:true,currentWindow: true}, function(tabs){
            chrome.pageAction.show(tabs[0].id);
            chrome.tabs.executeScript(tabs[0].id, { code: `localStorage.setItem('token2','skdjfljasldfl')` });
        });
    } 
    catch(err) {
        // Log exceptions
    }
});


