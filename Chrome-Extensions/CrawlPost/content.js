chrome.runtime.sendMessage({todo: "showPageAction"});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.todo == "copy"){
        var article = document.querySelector('article.post-content');
        if(article) {
            console.log(article.firstChild.innerText)
        }
    }
});