// Save for debugging
var xml = new XMLHttpRequest();
var parser = new DOMParser();
var urls = ["", "", "", "", "", "", "", "", "", ""];
var ids = ["", "", "", "", "", "", "", "", "", ""];
var downloaded = JSON.parse(localStorage.getItem("downloaded")) || [];

document.getElementsByClassName("RequireLoginError_GoToSite")[0].addEventListener("click", () => {
	browser.tabs.create({
		url: "https://osu.ppy.sh/"
	});
	close();
});

document.getElementById("DOWNLOAD_ALL_NEW_MAPS").addEventListener("click", () => {
	for (let index = 0; index < 5; index++) {
		download(index, 10000);
	}
});
document.getElementById("DOWNLOAD_ALL_TOP_MAPS").addEventListener("click", () => {
	for (let index = 5; index < 10; index++) {
		download(index, 10000);
	}
});

function download(index, timeout = 1000) {
	var tab = browser.tabs.create({
		url: "https://api.nerinyan.moe/d/" + ids[index],
		active: false
	});
	tab.then((taba) => {
		const id = taba.id;
		setTimeout(() => {
			browser.tabs.remove(id);
		}, timeout);
	});
	if (downloaded.includes(ids[index]) == false) {
		document.getElementsByClassName('Beatmap')[index].children[1].style.opacity = 0.5;
		downloaded.push(ids[index]);
		localStorage.setItem("downloaded", JSON.stringify(downloaded));
	}
}
xml.onload = function () {
	try {
		var xmlDoc = parser.parseFromString(xml.responseText, "text/html");
		loadNewBeatmaps(xmlDoc);
		loadTopBeatmaps(xmlDoc);

		document.getElementsByClassName("Parent")[0].style.display = "flex";
	} catch (e) {
		console.log(e);
		document.getElementsByClassName("RequireLoginError")[0].style.display = "block";
	}
}
xml.open("GET", "https://osu.ppy.sh/", true);
xml.send();

function loadNewBeatmaps(xmlDoc) {
	var beatmaps = xmlDoc.getElementsByClassName("user-home__beatmapsets")[0].children;
	var beatmapsItems = document.getElementsByClassName('Beatmap');
	for (var i = 0; i < 5; i++) {
		beatmapsItems[i].children[1].href = beatmaps[i].href;
		urls[i] = beatmaps[i].href;
		ids[i] = beatmaps[i].href.split('/')[beatmaps[i].href.split('/').length - 1];
		if (downloaded.includes(ids[i])) {
			beatmapsItems[i].children[1].style.opacity = 0.5;
		}
		const _i = i;
		beatmapsItems[i].children[0].children[0].addEventListener("click", (event) => {
			download(_i);
		});
		beatmapsItems[i].children[0].style.backgroundImage = beatmaps[i].children[0].style.getPropertyValue('--bg');
		beatmapsItems[i].children[0].srcSet = beatmaps[i].children[0].srcSet;
		var mode = beatmaps[i].children[1].children[0].children[0].children[0].className;
		if (mode.includes("fa-extra-mode-osu")) {
			beatmapsItems[i].children[0].children[1].innerText = "osu!";
		}
		else if (mode.includes("fa-extra-mode-taiko")) {
			beatmapsItems[i].children[0].children[1].innerText = "osu!taiko";
		}
		else if (mode.includes("fa-extra-mode-mania")) {
			beatmapsItems[i].children[0].children[1].innerText = "osu!mania";
		}
		else if (mode.includes("fa-extra-mode-fruits")) {
			beatmapsItems[i].children[0].children[1].innerText = "osu!catch";
		}
		beatmapsItems[i].children[1].children[0].innerText = beatmaps[i].children[1].children[0].children[1].innerText.trim();
		beatmapsItems[i].children[1].children[1].innerText = beatmaps[i].children[1].children[1].innerText.trim();
		beatmapsItems[i].children[1].children[2].innerText = "by " + beatmaps[i].children[1].children[2].children[0].innerText.trim();
	}
}

function loadTopBeatmaps(xmlDoc) {
	var beatmaps = xmlDoc.getElementsByClassName("user-home__beatmapsets")[1].children;
	var beatmapsItems = document.getElementsByClassName('Beatmap');
	for (var i = 0; i < 5; i++) {
		beatmapsItems[i + 5].children[1].href = beatmaps[i].href;
		urls[i + 5] = beatmaps[i].href;
		ids[i + 5] = beatmaps[i].href.split('/')[beatmaps[i].href.split('/').length - 1];
		if (downloaded.includes(ids[i + 5])) {
			beatmapsItems[i + 5].children[1].style.opacity = 0.5;
		}
		const _i = i + 5;
		beatmapsItems[i + 5].children[0].children[0].addEventListener("click", (event) => {
			download(_i);
		});
		beatmapsItems[i + 5].children[0].style.backgroundImage = beatmaps[i].children[0].style.getPropertyValue('--bg');
		beatmapsItems[i + 5].children[0].srcSet = beatmaps[i].children[0].srcSet;
		var mode = beatmaps[i].children[1].children[0].children[0].children[0].className;
		if (mode.includes("fa-extra-mode-osu")) {
			beatmapsItems[i + 5].children[0].children[1].innerText = "osu!";
		}
		else if (mode.includes("fa-extra-mode-taiko")) {
			beatmapsItems[i + 5].children[0].children[1].innerText = "osu!taiko";
		}
		else if (mode.includes("fa-extra-mode-mania")) {
			beatmapsItems[i + 5].children[0].children[1].innerText = "osu!mania";
		}
		else if (mode.includes("fa-extra-mode-fruits")) {
			beatmapsItems[i + 5].children[0].children[1].innerText = "osu!catch";
		}
		beatmapsItems[i + 5].children[1].children[0].innerText = beatmaps[i].children[1].children[0].children[1].innerText.trim();
		beatmapsItems[i + 5].children[1].children[1].innerText = beatmaps[i].children[1].children[1].innerText.trim();
		beatmapsItems[i + 5].children[1].children[2].innerText = "by " + beatmaps[i].children[1].children[2].children[0].innerText.trim();
	}
}