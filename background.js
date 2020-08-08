// this is the background code...

// listen for our browerAction to be clicked
// for the current tab, inject the "inject.js" file & execute it


var currentTab;
var version = "1.0";

chrome.tabs.query( //get current Tab
    {
        currentWindow: true,
        active: true
    },
    function(tabArray) {
        currentTab = tabArray[0];
        console.log("hi");
        chrome.tabs.executeScript(currentTab.ib, {
            file: 'inject.js'
        });
    }
)