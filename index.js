var xml = new XMLHttpRequest();
var parser = new DOMParser();
var beatmaps;
try{
	xml.onload = function () {
		var xmlDoc = parser.parseFromString(xml.responseText, "text/html");
		beatmaps = xmlDoc.getElementsByClassName("user-home__beatmapsets")[0].children;
		var beatmapsItems = document.getElementsByClassName('Beatmap');

		for (var i = 0; i < 5; i++) {
			beatmapsItems[i].href = beatmaps[i].href;
			beatmapsItems[i].children[0].style.backgroundImage = beatmaps[i].children[0].style.getPropertyValue('--bg');
			beatmapsItems[i].children[0].srcSet = beatmaps[i].children[0].srcSet;
			var mode = beatmaps[i].children[1].children[0].children[0].children[0].className;
			if(mode.includes("fa-extra-mode-osu"))
			{
				beatmapsItems[i].children[0].children[0].innerText = "osu!";
			}
			else if(mode.includes("fa-extra-mode-taiko"))
			{
				beatmapsItems[i].children[0].children[0].innerText = "osu!taiko";
			}
			else if(mode.includes("fa-extra-mode-mania"))
			{
				beatmapsItems[i].children[0].children[0].innerText = "osu!mania";
			}
			else if(mode.includes("fa-extra-mode-catch"))
			{
				beatmapsItems[i].children[0].children[0].innerText = "osu!catch";
			}
			beatmapsItems[i].children[1].children[0].innerText = beatmaps[i].children[1].children[0].children[1].innerText.trim();
			beatmapsItems[i].children[1].children[1].innerText = beatmaps[i].children[1].children[1].innerText.trim();
			beatmapsItems[i].children[1].children[2].innerText = "by " + beatmaps[i].children[1].children[2].children[0].innerText.trim();
		}

		document.getElementsByClassName("Parent")[0].style.display='block';
	}
	xml.open("GET","https://osu.ppy.sh/", true);
	xml.send();
}catch(e){
	window.alert("\"" + e + "\"");
}