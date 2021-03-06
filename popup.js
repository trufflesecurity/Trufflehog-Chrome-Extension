
let toggles = ["generics", "specifics", "aws", "checkEnv"];


for (let toggle of toggles){
    chrome.storage.sync.get([toggle], function(result) {
        if (result[toggle] == undefined || result[toggle] == true){
            console.log(toggle);
            document.getElementById(toggle).checked = true;
            console.log("wat");
            var setObj = {}
            setObj[toggle] = true;
            chrome.storage.sync.set(setObj);
        }

    });
    document.getElementById(toggle).addEventListener('click', function(){
        var toggleChecked = document.getElementById(toggle).checked;
        var value = false;
        if (toggleChecked){
            value = true;
        }
        var setObj = {}
        setObj[toggle] = value;
        chrome.storage.sync.set(setObj);

    });

}

