var isRecording = false;
var display = false;
function notif(msg){
    chrome.notifications.getPermissionLevel(function(p){
        console.log(p);
        var opt = {
            type: "basic",
            title: "GRTV Record",
            message: msg,
            iconUrl: '48.png'
        }

        chrome.notifications.create('grtv-replay-test', opt, function(i){
            console.log(i);
            console.log("pop")
        });
    })
}


function updateIcon(){
    var img = "48gris.png";
    if(isRecording){
        img = "48.png";
    }
    if(display){
        chrome.browserAction.setTitle({title: "GRTV AutoReplay " + (isRecording ?"record en cours" : "pas de record")});
        chrome.browserAction.setIcon({path:img});
        chrome.browserAction.enable();
        console.log("display")
    }else{
         chrome.browserAction.setTitle({title: "GRTV AutoReplay - Aucun de stream detecter"});
        chrome.browserAction.disable();
    }

}

console.log("load");
notif();
/* In background page */
chrome.runtime.onMessage.addListener(function(msg, sender) {
    console.log("recieve");
    if(msg.action == 'notif'){
        notif(msg.msg);
    }else if(msg.action == 'username'){
        
    }else if(msg.action == "state"){
        console.log(msg);
        if(msg.state == "start"){
            isRecording = true;
        }else if(msg.state == 'stop'){
            isRecording = false;
        }else if(msg.state == 'show'){
            display = true;
        }else if(msg.state == 'hide'){
            display = false;
        }
        updateIcon();
    }

});