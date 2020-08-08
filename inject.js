// this is the code which will be injected into a given page...

(function(){
    let re = /AKIA[0-9A-Z]{16}/;
    let match = re.exec(document.documentElement.innerHTML);
    if (match){
        alert(match + " found in doc tree");
    }
    setTimeout(function(){
         for (scriptIndex in document.scripts) {
            if (document.scripts[scriptIndex].src){
                let scriptSRC = document.scripts[scriptIndex].src;
                console.log(scriptSRC)
                fetch(scriptSRC).then(res=>{
                    res.blob().then(data=>{ data.text().then(text=>{
                        let match = re.exec(text);
                        if (match){
                            alert(match + " found in " + scriptSRC);
                        }
                     })})
                 })

            }

        }
    },2000)

})()

