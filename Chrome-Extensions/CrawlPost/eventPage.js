
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.todo == "showPageAction")
    {
        //phai co dong nay thi popup moi hien len
        //neu ko phai chinh trong manifest.json va dung browser_action thay vi page_action
        chrome.tabs.query({active:true,currentWindow: true}, function(tabs){
            chrome.pageAction.show(tabs[0].id);
            // chrome.tabs.executeScript(tabs[0].id, { code: `localStorage.setItem('token','skdjfljasldfl')` });
        });
        console.log(chrome);
        localStorage.setItem('name','hoang thai');
    }
});






