// this is the code which will be injected into a given page...

(function(){

    let re = new RegExp();
    let match = "";
    let page = document.documentElement.innerHTML;
    chrome.runtime.sendMessage({"pageBody": page});

    //chrome.browserAction.setBadgeText({text: 'ON'});




    setTimeout(function(){
         for (scriptIndex in document.scripts) {
            if (document.scripts[scriptIndex].src){
                let scriptSRC = document.scripts[scriptIndex].src;
                console.log(scriptSRC)
                if (scriptSRC.startsWith("//")){
                    scriptSRC = location.protocol + scriptSRC
                }
                chrome.runtime.sendMessage({"scriptUrl": scriptSRC});
            }

        }
    },2000)

    let envUrl = window.location.href.replace(/\/$/, "") + "/.env";
    chrome.runtime.sendMessage({"envFile": envUrl});

})()

