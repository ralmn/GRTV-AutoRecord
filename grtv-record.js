var streamerRequest = "Groum";


chrome.storage.sync.get({
	username: "Groum"
}, function(items) {
	console.log(items);
	streamerRequest = items.username;
	console.log(streamerRequest);

 

	function checkForRecord(){

		if(getStreamer() == streamerRequest){
			if(isPub()){
				if(document.getElementById('stop-record') != null){
					stopRecord();
				}else{
					notif("c'est la pub mais pas de record lancé")
				}
			}else{
				if(document.getElementById('start-record') != null){
					startRecord();
				}else{
					notif("Impossible de lancer le record")
					console.log(document.getElementById('start-record'))
				}
			}
		}else{
			console.log("c'est pas a toi de stream");
		}	
		return false;
	}

	function getChannel(){
		var href = location.href.replace("http://www.gamingroom.tv/","").split('/');
		if(href[0] !== undefined){
			return href[0];
		}
		return null;
	}

	function getStreamer(){
		var request = new XMLHttpRequest();
		request.open("GET","http://www.gamingroom.tv/" + getChannel() + "/infos", false);
		request.send(null);
		var data = JSON.parse(request.responseText);
		return data.live_streamer;
	}


	function startRecord(){
		if(location.href == "http://www.gamingroom.tv/" + getChannel() + "/admin/stream"){
			var form = document.getElementById('start-record');
			console.log(typeof form);
			if(form != null){
				console.log(form);
				var formData = new FormData(form);
				var request = new XMLHttpRequest();
				request.open("POST",form.getAttribute('action'));
				request.send(formData);
				notif("Le record est lancé");
				setTimeout(function(){
					location.reload();
				}, 2000);
			}
		}else{
			notif("Erreur, tu n'es pas sur la bonne page pour stream");
		}

	}

	function stopRecord(){
		if(location.href == "http://www.gamingroom.tv/" + getChannel() + "/admin/stream"){
			var form = document.getElementById('stop-record');
			console.log(form);

			if(form != null){
				var formData = new FormData(form);
				var request = new XMLHttpRequest();
				request.open("POST",form.getAttribute('action'));
				request.send(formData);
				var timeforReload = document.getElementById('spinner-01').value * 35;
				console.log(timeforReload);
				setTimeout(function(){
					location.reload();
				}, timeforReload);
				notif("Le record est stopé");
			}
		}else{
			notif("Erreur, tu n'es pas sur la bonne page pour stream");
		}
	}

	function isPub(){
		if(location.href == "http://www.gamingroom.tv/" + getChannel() + "/admin/stream"){
			if(document.getElementById('ads_buttons_div').style.display == "none"){
				return true;
			}
		}
		return false;
	}

	function notif(msg){

		/* In content script */
		chrome.runtime.sendMessage({
			action: 'notif',
			msg: msg
		});
		console.log("send " + msg);
		
	}

	
	var observer = new MutationObserver(function() {
		setInterval(function(){
		checkForRecord();
	}, 5000);

		observer.disconnect();
	});
	var config = { subtree: true, attributes: true }
	observer.observe(document, config);
});