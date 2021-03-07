// this is the code which will be injected into a given page...

(function(){

    let re = new RegExp();
    let match = "";
    let page = document.documentElement.innerHTML;
    chrome.runtime.sendMessage({"pageBody": page, "origin":window.origin});

    //chrome.browserAction.setBadgeText({text: 'ON'});




    setTimeout(function(){
         for (scriptIndex in document.scripts) {
            if (document.scripts[scriptIndex].src){
                let scriptSRC = document.scripts[scriptIndex].src;
                if (scriptSRC.startsWith("//")){
                    scriptSRC = location.protocol + scriptSRC
                }
                chrome.runtime.sendMessage({"scriptUrl": scriptSRC});
            }

        }
    },2000)
    let origin = window.location.origin;
    let originalPath = window.location.pathname;
    let newPath = originalPath.substr(0, originalPath.lastIndexOf("/"));
    let newHref = origin + newPath;
    let envUrl = newHref + "/.env";
    chrome.runtime.sendMessage({"envFile": envUrl});

})()

