// this is the background code...

// listen for our browerAction to be clicked
// for the current tab, inject the "inject.js" file & execute it


var currentTab;
var version = "1.0";

chrome = browser;

chrome.tabs.query( //get current Tab
    {
        currentWindow: true,
        active: true
    },
    function(tabArray) {
        currentTab = tabArray[0];
        chrome.tabs.executeScript(currentTab.ib, {
            file: 'inject.js'
        });
    }
)

chrome.storage.sync.get(['ranOnce'], function(ranOnce) {
    if (! ranOnce.ranOnce){
        chrome.storage.sync.set({"ranOnce": true});
        chrome.storage.sync.set({"originDenyList": ["https://www.google.com"]});
    }

})


let specifics = {
    "Slack Token": "(xox[pboa]-[0-9]{12}-[0-9]{12}-[0-9]{12}-[a-z0-9]{32})",
    "RSA private key": "-----BEGIN RSA PRIVATE KEY-----",
    "SSH (DSA) private key": "-----BEGIN DSA PRIVATE KEY-----",
    "SSH (EC) private key": "-----BEGIN EC PRIVATE KEY-----",
    "PGP private key block": "-----BEGIN PGP PRIVATE KEY BLOCK-----",
    "Amazon MWS Auth Token": "amzn\\.mws\\.[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}",
    "AWS AppSync GraphQL Key": "da2-[a-z0-9]{26}",
    "Facebook Access Token": "EAACEdEose0cBA[0-9A-Za-z]+",
    "Facebook OAuth": "[fF][aA][cC][eE][bB][oO][oO][kK].{0,20}['|\"][0-9a-f]{32}['|\"]",
    "GitHub": "[gG][iI][tT][hH][uU][bB].{0,20}['|\"][0-9a-zA-Z]{35,40}['|\"]",
   // "Google API Key": "AIza[0-9A-Za-z\\-_]{35}",
   // "Google Cloud Platform API Key": "AIza[0-9A-Za-z\\-_]{35}",
   // "Google Cloud Platform OAuth": "[0-9]+-[0-9A-Za-z_]{32}\\.apps\\.googleusercontent\\.com",
   // "Google Drive API Key": "AIza[0-9A-Za-z\\-_]{35}",
   // "Google Drive OAuth": "[0-9]+-[0-9A-Za-z_]{32}\\.apps\\.googleusercontent\\.com",
    "Google (GCP) Service-account": "\"type\": \"service_account\"",
   // "Google Gmail API Key": "AIza[0-9A-Za-z\\-_]{35}",
   // "Google Gmail OAuth": "[0-9]+-[0-9A-Za-z_]{32}\\.apps\\.googleusercontent\\.com",
   // "Google OAuth Access Token": "ya29\\.[0-9A-Za-z\\-_]+",
   // "Google YouTube API Key": "AIza[0-9A-Za-z\\-_]{35}",
  //  "Google YouTube OAuth": "[0-9]+-[0-9A-Za-z_]{32}\\.apps\\.googleusercontent\\.com",
    "Heroku API Key": "[hH][eE][rR][oO][kK][uU].{0,20}[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}",
    "Json Web Token" : "eyJhbGciOiJ",
    "MailChimp API Key": "[0-9a-f]{32}-us[0-9]{1,2}",
    "Mailgun API Key": "key-[0-9a-zA-Z]{32}",
    "Password in URL": "[a-zA-Z]{3,10}://[^/\\s:@]{3,20}:[^/\\s:@]{3,20}@.{1,100}[\"'\\s]",
    "PayPal Braintree Access Token": "access_token\\$production\\$[0-9a-z]{16}\\$[0-9a-f]{32}",
    "Picatic API Key": "sk_live_[0-9a-z]{32}",
    "Slack Webhook": "https://hooks\\.slack\\.com/services/T[a-zA-Z0-9_]{8}/B[a-zA-Z0-9_]{8}/[a-zA-Z0-9_]{24}",
    "Stripe API Key": "sk_live_[0-9a-zA-Z]{24}",
    "Stripe Restricted API Key": "rk_live_[0-9a-zA-Z]{24}",
    "Square Access Token": "sq0atp-[0-9A-Za-z\\-_]{22}",
    "Square OAuth Secret": "sq0csp-[0-9A-Za-z\\-_]{43}",
    "Telegram Bot API Key": "[0-9]+:AA[0-9A-Za-z\\-_]{33}",
    "Twilio API Key": "SK[0-9a-fA-F]{32}",
    "Github Auth Creds": "https:\/\/[a-zA-Z0-9]{40}@github\.com",
   // "Twitter Access Token": "[tT][wW][iI][tT][tT][eE][rR].*[1-9][0-9]+-[0-9a-zA-Z]{40}",
   // "Twitter OAuth": "[tT][wW][iI][tT][tT][eE][rR].*['|\"][0-9a-zA-Z]{35,44}['|\"]"
}

let generics = {
    "Generic API Key": "[aA][pP][iI]_?[kK][eE][yY].{0,20}['|\"][0-9a-zA-Z]{32,45}['|\"]",
    "Generic Secret": "[sS][eE][cC][rR][eE][tT].{0,20}['|\"][0-9a-zA-Z]{32,45}['|\"]",
}

let aws = {
    "AWS API Key": "((?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16})",
}

let denyList = ["AIDAAAAAAAAAAAAAAAAA"]

a = ""
b = ""




var checkData = function(data, src, regexes, fromEncoded=false, parentUrl=undefined, parentOrigin=undefined){
    var findings = [];
    for (let key in regexes){
        let re = new RegExp(regexes[key])
        let match = re.exec(data);
        if (Array.isArray(match)){match = match.toString()}
        if (denyList.includes(match)){
            continue;
        }
        if (match){
            let finding = {};
            finding = {src: src, match:match, key:key, encoded:fromEncoded, parentUrl:parentUrl};
            a = data;
            b = re;
            findings.push(finding);

        }
    }
    if (findings){
        chrome.storage.sync.get(["leakedKeys"], function(result) {
            chrome.storage.sync.get(['uniqueByHostname'], function(uniqueByHostname) {
                if (Array.isArray(result.leakedKeys) || ! result.leakedKeys){
                    var keys = {};
                }else{
                    var keys = result.leakedKeys;
                };
                for (let finding of findings){
                    if(Array.isArray(keys[parentOrigin])){
                        var newFinding = true;
                        for (key of keys[parentOrigin]){
                            if (uniqueByHostname['uniqueByHostname']) {
                                if (extractHostname(key["src"]) == extractHostname(finding["src"]) && key["match"] == finding["match"] && key["key"] == finding["key"] && key["encoded"] == finding["encoded"]) {
                                    newFinding = false;
                                    break;
                                }
                            } else {
                                if (key["src"] == finding["src"] && key["match"] == finding["match"] && key["key"] == finding["key"] && key["encoded"] == finding["encoded"] && key["parentUrl"] == finding["parentUrl"]) {
                                    newFinding = false;
                                    break;
                                }
                            }
                        }
                        if(newFinding){
                            keys[parentOrigin].push(finding)
                            chrome.storage.sync.set({"leakedKeys": keys}, function(){
                                updateTabAndAlert(finding);
                            });
                        }
                    }else{
                        keys[parentOrigin] = [finding];
                        chrome.storage.sync.set({"leakedKeys": keys}, function(){
                            updateTabAndAlert(finding);
                        })
                    }
                }
            });
        })
    }
    let decodedStrings = getDecodedb64(data);
    for (encoded of decodedStrings){
        checkData(encoded[1], src, regexes, encoded[0], parentUrl, parentOrigin);
    }
}
var updateTabAndAlert = function(finding){
    var key = finding["key"];
    var src = finding["src"];
    var match = finding["match"];
    var fromEncoded = finding["encoded"];
    chrome.storage.sync.get(["alerts"], function(result) {
        chrome.storage.sync.get(["notifications"], function(notifications) {
            var alertText;
            var notifyText;
            if (fromEncoded){
                alertText = key + ": " + match + " found in " + src + " decoded from " + fromEncoded.substring(0,9) + "...";
                notifyText = `${match.substring(0,30)}... (orig was encoded) found in ${src}`;
            }else{
                alertText = key + ": " + match + " found in " + src;
                notifyText = `${match.substring(0,30)}... found in ${src}`;
            }
            if (result.alerts == undefined || result.alerts){
                chrome.tabs.executeScript({code : `alert('${alertText}')`});
            }
            if (notifications['notifications']) {
                chrome.notifications.create(src + new Date(), {
                    type: 'basic',
                    iconUrl: 'icon128.png',
                    title: `Trufflehog | ${key}`,
                    message: notifyText,
                    priority: 2
                });
            }
        })
    })
    updateTab();
}

var updateTab = function(){
    chrome.tabs.query({currentWindow: true, active: true}).then(function(tabs) {
        var tabId = tabs[0].id;
        var tabUrl = tabs[0].url;
        var origin = (new URL(tabUrl)).origin
        chrome.storage.sync.get(["leakedKeys"], function(result) {
            if (Array.isArray(result.leakedKeys[origin])){
                var originKeys = result.leakedKeys[origin].length.toString();
            }else{
                var originKeys = "";
            }
            chrome.browserAction.setBadgeText({text: originKeys});
            chrome.browserAction.setBadgeBackgroundColor({color: '#ff0000'});
        })
    });
}

chrome.tabs.onActivated.addListener(function(activeInfo) {
    updateTab();
});

var getStringsOfSet = function(word, char_set, threshold=20){
    let count = 0;
    let letters = "";
    let strings = [];
    if (! word){
        return []
    }
    for(let char of word){
        if (char_set.indexOf(char) > -1){
            letters += char;
            count += 1;
        } else{
            if ( count > threshold ){
                strings.push(letters);
            }
            letters = "";
            count = 0;
        }
    }
    if(count > threshold){
        strings.push(letters);
    }
    return strings
}

var getDecodedb64 = function(inputString){
    let b64CharSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let encodeds = getStringsOfSet(inputString, b64CharSet);
    let decodeds = [];
    for (encoded of encodeds){
        try {
            let decoded = [encoded, atob(encoded)];
            decodeds.push(decoded);
        } catch(e) {
        }
    }
    return decodeds;
}

const extractHostname = (url) => {
    return new URL(url).hostname;
}

var checkIfOriginDenied = function(check_url, cb){
    let skip = false;
    chrome.storage.sync.get(["originDenyList"], function(result) {
        let originDenyList = result.originDenyList.filter(url => url.length > 1);
        for (origin of originDenyList){
            if(check_url.startsWith(origin)){
                skip = true;
            }
        }
        cb(skip);
    })
}
var checkForGitDir = function(data, url){
    if(data.startsWith("[core]")){
        alert(".git dir found in " + url + " feature to check this for secrets not supported");
    }

}
var js_url;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    chrome.storage.sync.get(['generics'], function(useGenerics) {
        chrome.storage.sync.get(['specifics'], function(useSpecifics) {
            chrome.storage.sync.get(['aws'], function(useAws) {
                chrome.storage.sync.get(['checkEnv'], function(checkEnv) {
                    chrome.storage.sync.get(['checkGit'], function(checkGit) {
                        let regexes = {};
                        if(useGenerics["generics"] || useGenerics["generics"] == undefined){
                            regexes = {
                                ...regexes,
                                ...generics
                            }
                        }
                        if(useSpecifics["specifics"] || useSpecifics["specifics"] == undefined){
                            regexes = {
                                ...regexes,
                                ...specifics
                            }
                        }
                        if(useAws["aws"] || useAws["aws"] == undefined){
                            regexes = {
                                ...regexes,
                                ...aws
                            }
                        }
                        if (request.scriptUrl) {
                            let js_url = request.scriptUrl;
                            let parentUrl = request.parentUrl;
                            let parentOrigin = request.parentOrigin;
                            checkIfOriginDenied(js_url, function(skip){
                                if (!skip){
                                    fetch(js_url, {"credentials": 'include'})
                                        .then(response => response.text())
                                        .then(data => checkData(data, js_url, regexes, undefined, parentUrl, parentOrigin));
                                }

                            })

                        }else if(request.pageBody){
                            checkIfOriginDenied(request.origin, function(skip){
                                if (!skip){
                                    checkData(request.pageBody, request.origin, regexes, undefined, request.parentUrl, request.parentOrigin);
                                }
                            })
                        }else if(request.envFile){
                            if(checkEnv['checkEnv']){
                                checkIfOriginDenied(request.envFile, function(skip){
                                    if (!skip){
                                        fetch(request.envFile, {"credentials": 'include'})
                                        .then(response => response.text())
                                        .then(data => checkData(data, ".env file at " + request.envFile, regexes, undefined, request.parentUrl, request.parentOrigin));
                                    }
                                });
                            }
                        }else if(request.openTabs){
                            for (tab of request.openTabs){
                                window.open(tab);
                                console.log(tab)
                            }
                        }else if(request.gitDir){
                            if(checkGit['checkGit']){
                                checkIfOriginDenied(request.envFile, function(skip){
                                    if (!skip){
                                        fetch(request.gitDir, {"credentials": 'include'})
                                        .then(response => response.text())
                                        .then(data => checkForGitDir(data, request.gitDir));
                                    }
                                });
                            }
                        }
                    });
                });
            });

        });
    });



});

