var main_urls = ["", "", "", "", "", "", "", "", "", ""];
var main_ids = ["", "", "", "", "", "", "", "", "", ""];
var main_names = ["", "", "", "", "", "", "", "", "", ""];
var packs_urls = ["", "", "", "", "", "", "", "", ""];
var main_downloaded = JSON.parse(localStorage.getItem("downloaded")) || [];
var packs_downloaded = JSON.parse(localStorage.getItem("packs_downloaded")) || [];

var category_selected = -1;

document.getElementsByClassName("RequireLoginError_GoToSite")[0].onclick = () => {
	browser.tabs.create({
		url: "https://osu.ppy.sh/"
	});
	close();
};

document.getElementById("DOWNLOAD_ALL_NEW_MAPS").onclick = () => {
	for (let index = 0; index < 5; index++) {
		download_beatmap(index);
	}
};
document.getElementById("DOWNLOAD_ALL_TOP_MAPS").onclick = () => {
	for (let index = 5; index < 10; index++) {
		download_beatmap(index);
	}
};

function register_all_categories() {
	var i = 0;
	for (const category of document.getElementsByClassName("Category-Button")) {
		const _i = i;
		category.onclick = () => {
			select_category(_i);
		};
		i++;
	}
}
register_all_categories();

function convertDirectUrlToHref(url) {
	let encodedUrl = url.replace(/ /g, '%20');
	encodedUrl = encodedUrl.replace(/!/g, '%21').replace(/#/g, '%23');
	return encodedUrl;
}

function select_category(index) {
	if (category_selected == index) return;

	var i = 0;
	for (const category of document.getElementsByClassName("Category-Button")) {
		if (i == index) {
			category.getElementsByClassName("Category-Selector")[0].setAttribute("data-selected", true);
		}
		else {
			category.getElementsByClassName("Category-Selector")[0].setAttribute("data-selected", false);
		}
		i++;
	}

	category_selected = index;

	document.getElementsByClassName("RequireLoginError")[0].style.display = "none";

	if (index == 0) {
		load_main_category();
	}
	else {
		unload_main_category();
	}
	if (index == 1) {
		load_packs_category();
	}
	else {
		unload_packs_category();
	}
}

function download_pack(index) {
	browser.downloads.download({
		url: packs_urls[index]
	});
	if (packs_downloaded.includes(packs_urls[index]) == false) {
		document.getElementsByClassName('Pack')[index].style.opacity = 0.5;
		packs_downloaded.push(packs_urls[index]);
		localStorage.setItem("packs_downloaded", JSON.stringify(packs_downloaded));
	}
}

function download_beatmap(index) {
	browser.downloads.download({
		url: "https://api.nerinyan.moe/d/" + main_ids[index],
		filename: main_ids[index] + " " + main_names[index] + ".osz"
	});

	if (main_downloaded.includes(main_ids[index]) == false) {
		document.getElementsByClassName('Beatmap')[index].style.opacity = 0.5;
		main_downloaded.push(main_ids[index]);
		localStorage.setItem("downloaded", JSON.stringify(main_downloaded));
	}
}
function unload_main_category() {
	document.getElementsByClassName("Main-Category")[0].style.display = "none";
}
function load_main_category() {
	function loadNewBeatmaps(xmlDoc) {
		var beatmaps = xmlDoc.getElementsByClassName("user-home__beatmapsets")[0].children;
		var beatmapsItems = document.getElementsByClassName('Beatmap');
		for (var i = 0; i < 5; i++) {
			beatmapsItems[i].children[1].href = beatmaps[i].href;
			main_urls[i] = beatmaps[i].href;
			main_ids[i] = beatmaps[i].href.split('/')[beatmaps[i].href.split('/').length - 1];
			if (main_downloaded.includes(main_ids[i])) {
				beatmapsItems[i].style.opacity = 0.5;
			}
			else {
				beatmapsItems[i].style.opacity = 1;
			}
			const _i = i;
			beatmapsItems[i].children[0].children[0].onclick = () => {
				download_beatmap(_i);
			};
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
			main_names[i] = beatmapsItems[i].children[1].children[0].innerText;
		}
	}
	function loadTopBeatmaps(xmlDoc) {
		var beatmaps = xmlDoc.getElementsByClassName("user-home__beatmapsets")[1].children;
		var beatmapsItems = document.getElementsByClassName('Beatmap');
		for (var i = 0; i < 5; i++) {
			beatmapsItems[i + 5].children[1].href = beatmaps[i].href;
			main_urls[i + 5] = beatmaps[i].href;
			main_ids[i + 5] = beatmaps[i].href.split('/')[beatmaps[i].href.split('/').length - 1];
			if (main_downloaded.includes(main_ids[i + 5])) {
				beatmapsItems[i + 5].children[1].style.opacity = 0.5;
			}
			const _i = i + 5;
			beatmapsItems[i + 5].children[0].children[0].onclick = () => {
				download_beatmap(_i);
			};
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
			main_names[i + 5] = beatmapsItems[i + 5].children[1].children[0].innerText;
		}
	}
	var xml = new XMLHttpRequest();
	var parser = new DOMParser();
	xml.onload = function () {
		try {
			var xmlDoc = parser.parseFromString(xml.responseText, "text/html");
			loadNewBeatmaps(xmlDoc);
			loadTopBeatmaps(xmlDoc);

			document.getElementsByClassName("Main-Category")[0].style.display = "flex";
		} catch (e) {
			console.log(e);
			document.getElementsByClassName("RequireLoginError")[0].style.display = "block";
		}
	}
	xml.open("GET", "https://osu.ppy.sh/", true);
	xml.send();
}
function unload_packs_category() {
	document.getElementsByClassName("Packs-Category")[0].style.display = "none";
}
function load_packs_category() {
	function loadPacks(xmlDoc) {
		var packs = xmlDoc.getElementsByClassName("beatmap-pack");
		var packsItems = document.getElementsByClassName('Pack');

		for (let i = 0; i < 9; i++) {
			const _i = i;
			const online_pack = packs[i];
			const local_pack = packsItems[i];
			const name = online_pack.children[0].children[0].innerText;
			var date = online_pack.children[0].children[1].children[0].innerText;
			var author = online_pack.children[0].children[1].children[1].innerText;
			var datapacktag = online_pack.getAttribute("data-pack-tag");
			const downloadUrl = convertDirectUrlToHref("https://packs.ppy.sh/" + datapacktag + " - " + name + ".zip");
			packs_urls[i] = downloadUrl;
			local_pack.children[0].innerText = name;
			local_pack.children[1].innerText = date + " " + author;
			local_pack.onclick = () => {
				download_pack(_i);
			};
			if (packs_downloaded.includes(packs_urls[i])) {
				local_pack.style.opacity = 0.5;
			}
			else {
				local_pack.style.opacity = 1;
			}
		}
	}
	var xml = new XMLHttpRequest();
	var parser = new DOMParser();
	xml.onload = function () {
		try {
			var xmlDoc = parser.parseFromString(xml.responseText, "text/html");
			loadPacks(xmlDoc);

			document.getElementsByClassName("Packs-Category")[0].style.display = "block";
		} catch (e) {
			console.log(e);
			document.getElementsByClassName("RequireLoginError")[0].style.display = "block";
		}
	}
	xml.open("GET", "https://osu.ppy.sh/beatmaps/packs", true);
	xml.send();
}

select_category(0);