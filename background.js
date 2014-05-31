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
console.log("load");
notif();
/* In background page */
chrome.runtime.onMessage.addListener(function(msg, sender) {
    console.log("recieve");
    if(msg.action == 'notif'){
        notif(msg.msg);
    }else if(msg.action == 'username'){
        
    }

});