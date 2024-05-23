// Save for debugging
var xml = new XMLHttpRequest();
var parser = new DOMParser();
var beatmaps;
var urls = ["","","","",""];
var tab;

document.getElementsByClassName("RequireLoginError_GoToSite")[0].addEventListener("click", ()=>{
	browser.tabs.create({
		url: "https://osu.ppy.sh/"
	});
	close();
});

function executeScript(tabId, changeInfo, tabInfo){
	if(tabId != tab.id) return;
	browser.tabs.executeScript(tab.id, {
		file: "download.js"
	});
	browser.tabs.onUpdated.removeListener(executeScript);
}

function download(url){
	browser.tabs.onUpdated.addListener(executeScript);
	tab = browser.tabs.create({
		url: url,
		active: false
	});
	tab.then((tabInfo) => { tab = tabInfo; });
}
xml.onload = function () {
	try{
	var xmlDoc = parser.parseFromString(xml.responseText, "text/html");
	beatmaps = xmlDoc.getElementsByClassName("user-home__beatmapsets")[0].children;
	var beatmapsItems = document.getElementsByClassName('Beatmap');
	for (var i = 0; i < 5; i++) {
		beatmapsItems[i].children[1].href = beatmaps[i].href;
		urls[i] = beatmaps[i].href;
		const _i = i;
		beatmapsItems[i].children[0].children[0].addEventListener("click", (event) => {
			download(urls[_i]);
		});
		beatmapsItems[i].children[0].style.backgroundImage = beatmaps[i].children[0].style.getPropertyValue('--bg');
		beatmapsItems[i].children[0].srcSet = beatmaps[i].children[0].srcSet;
		var mode = beatmaps[i].children[1].children[0].children[0].children[0].className;
		if(mode.includes("fa-extra-mode-osu"))
		{
			beatmapsItems[i].children[0].children[1].innerText = "osu!";
		}
		else if(mode.includes("fa-extra-mode-taiko"))
		{
			beatmapsItems[i].children[0].children[1].innerText = "osu!taiko";
		}
		else if(mode.includes("fa-extra-mode-mania"))
		{
			beatmapsItems[i].children[0].children[1].innerText = "osu!mania";
		}
		else if(mode.includes("fa-extra-mode-catch"))
		{
			beatmapsItems[i].children[0].children[1].innerText = "osu!catch";
		}
		beatmapsItems[i].children[1].children[0].innerText = beatmaps[i].children[1].children[0].children[1].innerText.trim();
		beatmapsItems[i].children[1].children[1].innerText = beatmaps[i].children[1].children[1].innerText.trim();
		beatmapsItems[i].children[1].children[2].innerText = "by " + beatmaps[i].children[1].children[2].children[0].innerText.trim();
	}

	document.getElementsByClassName("Parent")[0].style.display='block';
	} catch
	{
		document.getElementsByClassName("RequireLoginError")[0].style["display"] = "block";
	}
}
xml.open("GET","https://osu.ppy.sh/", true);
xml.send();