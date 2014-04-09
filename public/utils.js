var utils = {
	isURL: function(str){
		var re = /https?:\/\/([a-zA-Z]\.?)+[.]{1}[a-zA-Z]+:{0,1}[0-9]*\/[a-zA-Z0-9#?&=%_,\-]*/;
		return re.test(str);
	},
	youtubeVideo: function(link){
		if(utils.isURL(link)){
			var a = document.createElement("a");
			a.href = link;
			if(a.hostname == "youtu.be"){
				return a.pathname.substr(1);
			}else{
				return false;
			}
		}else{
			return false;
		}
	},
	eachChild: function(elements, callback){
		for(i=0;i<elements.childNodes.length;i++){
			if(elements.childNodes[i].nodeType == 1){
				callback(elements.childNodes[i]);
			}
		}
	},
	parseTwit: function(twit){
		var ents = twit.entities;
		ents = utils.orderEntities(ents);
		ents = ents.reverse();
		var restext = twit.text;
		for(i=0;i<ents.length;i++){

			var prefix = "";
			var suffix = "";
			var replace = "";

			if(ents[i].parseType == "hashtag"){
				prefix = "<a href='https://twitter.com/search?q=%23" + ents[i].text + "'>";
				replace = "#"+ents[i].text;
				suffix = "</a>";
			}

			if(ents[i].parseType == "user_mention"){
				prefix = "<a href='http://twitter.com/" + ents[i].screen_name + "'>";
				replace = "@"+ents[i].screen_name;
				suffix = "</a>";
			}

			if(ents[i].parseType == "url"){
				prefix = "<a href='" + ents[i].expanded_url + "'>";
				replace = ents[i].display_url;
				suffix = "</a>";
			}

			if(ents[i].parseType == "media"){
				prefix = "<i class='fa fa-camera'></i> <a href='" + ents[i].media_url + "'>";
				replace = ents[i].display_url;
				suffix = "</a>";
			}

			restext = restext.substring(0,ents[i].indices[0]) + prefix + replace + suffix + restext.substring(ents[i].indices[1]);
		}
		return restext;
	},
	orderEntities: function(ents){
		var reslist = new Array();
		if(ents.hashtags){
			for(i=0;i<ents.hashtags.length;i++){
				ents.hashtags[i].parseType = "hashtag";
				reslist.push(ents.hashtags[i]);
			}
		}
		if(ents.urls){
			for(i=0;i<ents.urls.length;i++){
				ents.urls[i].parseType = "url";
				reslist.push(ents.urls[i]);
			}
		}
		if(ents.user_mentions){
			for(i=0;i<ents.user_mentions.length;i++){
				ents.user_mentions[i].parseType = "user_mention";
				reslist.push(ents.user_mentions[i]);
			}
		}
		if(ents.media){
			for(i=0;i<ents.media.length;i++){
				ents.media[i].parseType = "media";
				reslist.push(ents.media[i]);
			}
		}
		var repeat = true;
		while(repeat){
			repeat = false;
			for(i=0;i<reslist.length-1;i++){
				if(reslist[i].indices[0] > reslist[i+1].indices[0]){
					var t = reslist[i];
					reslist[i] = reslist[i+1];
					reslist[i+1] = t;
					repeat = true;
				}
			}
		}
		return reslist;
	},
	twitImages: function(twit){
		var res = "";
		if(twit.entities.media){
			var media = twit.entities.media;
			for(i=0;i<media.length;i++){
				if(media[i].type = "photo"){
					res += "<img class='twit_image' src='" + media[i].media_url + "'>";
				}
			}
		}
		return res;
	},
	twitVideos: function(twit){
		var res = "";
		if(twit.entities.urls){
			var urls = twit.entities.urls;
			for(i=0;i<urls.length;i++){
				if(videoid = utils.youtubeVideo(urls[i].expanded_url)){
					res += '<iframe style="width:100%;height:auto;margin:10px 0px" src="http://www.youtube.com/embed/' + videoid + '?rel=0" frameborder="0" allowfullscreen></iframe>';
				}
			}
		}
		return res;
	},
	ping: function(url){
		var processing = false;
		xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 1){
				out.log("Ping: Connection established");
			}else if(xhr.readyState == 2){
				out.log("Ping: Request received");
			}else if(xhr.readyState == 3 && !processing){
				out.log("Ping: Processing...");
				processing = true;
			}else if (xhr.readyState == 4 && xhr.response != "") {
				out.log("Ping: (" + url + ")[" + xhr.response + "]");
			}
		}
		xhr.open("GET",url,true);
		xhr.send();
	},
	dateStringToAppleFormat: function(date){
		var plusHour = parseInt(date.substr(date.length-2,2));
		var plusMins = parseInt(date.substr(date.length-4,2));
		var d = new Date(date.substr(0,date.length-5));
		d.setMinutes(d.getMinutes()+plusMins);
		d.setHours(d.getHours()+plusHour);
		return d.toString();
	},
	prettyDate: function(dateString){
		var date = new Date(dateString);
		var then = date.getTime();
		if(!then){
			date = new Date(utils.dateStringToAppleFormat(dateString));
			then = date.getTime();
		}
		var now = new Date().getTime();
		var time = now - then;
		var val = 0;

		if(time >= 0){
			if(time < 60000){
				return "Ahora mismo";
			}else if(time < 3600000){
				val = Math.round(time / 60000);
				if(val == 1){
					return "Hace " + val + " minuto";
				}else{
					return "Hace " + val + " minutos";
				}
			}else if(time < 86400000){
				val = Math.round(time / 3600000);
				if(val == 1){
					return "Hace " + val + " hora";
				}else{
					return "Hace " + val + " horas";
				}
			}else if(time < 2592000000){
				val = Math.round(time / 86400000);
				if(val == 1){
					return "Hace " + val + " día";
				}else{
					return "Hace " + val + " días";
				}
			}else if(time < 31104000000){
				val = Math.round(time / 2592000000);
				if(val == 1){
					return "Hace " + val + " mes";
				}else{
					return "Hace " + val + " meses";
				}
			}else{
				val = Math.round(time / 31104000000);
				if(val == 1){
					return "Hace " + val + " años";
				}else{
					return "Hace " + val + " años";
				}
			}
		}else{

			date.setMinutes(date.getMinutes() + date.getTimezoneOffset() );

			var hours = date.getHours().toString();
			var minutes = date.getMinutes().toString();
			if(hours.length == 1){
				hours = "0" + hours;
			}
			if(minutes.length == 1){
				minutes = "0" + minutes;
			}
			return utils.prettyDateUtils.getWeekDay(date.getDate()) + " " + date.getDate() + " de " + utils.prettyDateUtils.getMonth(date.getMonth()) + " a las " + hours + ":" + minutes;
		}
	},
	prettyDateUtils: {
		getWeekDay: function(n){
			days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
			return days[(n-1+days.length)%days.length];
		},
		getMonth: function(n){
			months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
			return months[(n-1+months.length)%months.length];
		}
	},
	isPhone: function(){
		re = /(iphone|ipod|ipad|android|blackberry|iemobile)/;
		if (re.test(navigator.userAgent.toLowerCase())) {
			return true;
		} else {
			return false;
		}
	}
}