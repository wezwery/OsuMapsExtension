// Constants
const main_category_height = 533;
const packs_category_height = 420;
const login_error_height = 420;
const main_category_new_beatmaps_count = 5;
const main_category_top_beatmaps_count = 5;
const main_category_daily_beatmap_count = 1;
const packs_category_count = 9;
const main_category = document.getElementsByClassName("Main-Category")[0];
const main_category_new_beatmaps_panel = document.getElementsByClassName("NewMapsPanel")[0];
const main_category_top_beatmaps_panel = document.getElementsByClassName("TopMapsPanel")[0];
const packs_category = document.getElementsByClassName("Packs-Category")[0];
const daily_challenge_panel = document.getElementsByClassName("DailyChallengePanel")[0];
const require_login_error = document.getElementsByClassName("RequireLoginError")[0];
const categories = document.getElementsByClassName("Categories")[0];

// Variables
var main_urls = Array(10).fill("");
var main_ids = Array(10).fill("");
var main_names = Array(10).fill("");
var packs_urls = Array(9).fill("");
var daily_challenge = ["", ""];
var download_list = JSON.parse(localStorage.getItem("downloaded")) || [];
var category_selected = -1;

// Utility Functions
function set_body_height(height) {
	document.body.style.setProperty("height", height + "px");
}

function convertDirectUrlToHref(url) {
	return url.replace(/ /g, '%20').replace(/!/g, '%21').replace(/#/g, '%23');
}

function updateDownloadedStatus(url, element) {
	if (download_list.includes(url)) {
		element.style.opacity = 0.5;
	} else {
		element.style.opacity = 1.0;
	}
}

function downloadFile(url, filename) {
	browser.downloads.download({ url, filename });
	download_list.push(url);
}

// Elements Builders
function createBeatmapCard() {
	const template = document.getElementById("template-beatmap-card");
	const node = template.content.cloneNode(true);
	return node.firstElementChild;
}

function createBeatmapsCardsToCategories() {
	for (let index = 0; index < main_category_new_beatmaps_count; index++)
		main_category_new_beatmaps_panel.appendChild(createBeatmapCard());

	for (let index = 0; index < main_category_top_beatmaps_count; index++)
		main_category_top_beatmaps_panel.appendChild(createBeatmapCard());

	var daily_beatmap_card = createBeatmapCard();
	daily_beatmap_card.style.marginLeft = "auto";
	daily_beatmap_card.style.marginRight = "auto";
	daily_challenge_panel.appendChild(daily_beatmap_card);
}
createBeatmapsCardsToCategories();

// Event Handlers
document.getElementsByClassName("RequireLoginError_GoToSite")[0].onclick = () => {
	browser.tabs.create({ url: "https://osu.ppy.sh/" });
	close();
};

document.getElementById("DOWNLOAD_ALL_NEW_MAPS").onclick = () => {
	for (let index = 0; index < 5; index++) download_beatmap(index);
};

document.getElementById("DOWNLOAD_ALL_TOP_MAPS").onclick = () => {
	for (let index = 5; index < 10; index++) download_beatmap(index);
};

// Category Management
function register_all_categories() {
	Array.from(document.getElementsByClassName("Category-Button")).forEach((category, i) => {
		category.onclick = () => select_category(i);
	});
}
register_all_categories();

function select_category(index) {
	if (category_selected === index) return;

	Array.from(document.getElementsByClassName("Category-Button")).forEach((category, i) => {
		category.getElementsByClassName("Category-Selector")[0].setAttribute("data-selected", i === index);
	});

	category_selected = index;
	document.getElementsByClassName("RequireLoginError")[0].style.display = "none";

	if (index === 0) load_main_category();
	else unload_main_category();

	if (index === 1) load_packs_category();
	else unload_packs_category();
}

// Download Functions
function download_pack(index) {
	downloadFile(packs_urls[index]);
	updateDownloadedStatus(packs_urls[index], document.getElementsByClassName('Pack')[index]);
	localStorage.setItem("downloaded", JSON.stringify(download_list));
}

function download_beatmap(index) {
	const url = `https://api.nerinyan.moe/d/${main_ids[index]}`;
	const filename = `${main_ids[index]} ${main_names[index]}.osz`;
	downloadFile(url, filename);
	updateDownloadedStatus(url, document.getElementsByClassName('Beatmap')[index]);
	localStorage.setItem("downloaded", JSON.stringify(download_list));
}

function download_daily_beatmap() {
	const url = `https://api.nerinyan.moe/d/${daily_challenge[0]}`;
	const filename = `${daily_challenge[0]} ${daily_challenge[1]}.osz`;
	downloadFile(url, filename);
	updateDownloadedStatus(daily_challenge[0], document.getElementsByClassName('Beatmap')[10]);
	localStorage.setItem("downloaded", JSON.stringify(download_list));
}

// Category Load/Unload
function unload_main_category() {
	main_category.style.display = "none";
	daily_challenge_panel.style.display = "none";
}

function unload_packs_category() {
	packs_category.style.display = "none";
}

function populateBeatmap(beatmapElement, beatmapData, index, isDaily = false) {
	beatmapElement.children[1].href = beatmapData.href;
	const beatmapId = beatmapData.href.split('/').pop();
	const beatmapName = beatmapData.children[1].children[0].children[1].innerText.trim();
	const beatmapArtist = beatmapData.children[1].children[1].innerText.trim();
	const beatmapCreator = beatmapData.children[1].children[2].children[0].innerText.trim();

	if (isDaily) {
		daily_challenge[0] = beatmapId;
		daily_challenge[1] = beatmapName;
	} else {
		main_urls[index] = beatmapData.href;
		main_ids[index] = beatmapId;
		main_names[index] = beatmapName;
	}

	updateDownloadedStatus(`https://api.nerinyan.moe/d/${beatmapId}`, beatmapElement);

	beatmapElement.children[0].children[0].onclick = () => {
		isDaily ? download_daily_beatmap() : download_beatmap(index);
	};
	beatmapElement.children[0].style.backgroundImage = beatmapData.children[0].style.getPropertyValue('--bg');
	beatmapElement.children[0].srcSet = beatmapData.children[0].srcSet;

	const modeClass = beatmapData.children[1].children[0].children[0].children[0].className;
	beatmapElement.children[0].children[1].innerText = getModeText(modeClass);

	beatmapElement.children[1].children[0].innerText = beatmapName;
	beatmapElement.children[1].children[1].innerText = beatmapArtist;
	beatmapElement.children[1].children[2].innerText = `by ${beatmapCreator}`;
}

function getModeText(modeClass) {
	if (modeClass.includes("fa-extra-mode-osu")) return "osu!";
	if (modeClass.includes("fa-extra-mode-taiko")) return "osu!taiko";
	if (modeClass.includes("fa-extra-mode-mania")) return "osu!mania";
	if (modeClass.includes("fa-extra-mode-fruits")) return "osu!catch";
	return "";
}

function load_main_category() {
	function loadNewBeatmaps(xmlDoc) {
		const beatmaps = xmlDoc.getElementsByClassName("user-home__beatmapsets")[1].children;
		const beatmapsItems = document.getElementsByClassName('Beatmap');
		for (let i = 0; i < 5; i++) {
			populateBeatmap(beatmapsItems[i], beatmaps[i], i);
		}
	}

	function loadTopBeatmaps(xmlDoc) {
		const beatmaps = xmlDoc.getElementsByClassName("user-home__beatmapsets")[2].children;
		const beatmapsItems = document.getElementsByClassName('Beatmap');
		for (let i = 0; i < 5; i++) {
			populateBeatmap(beatmapsItems[i + 5], beatmaps[i], i + 5);
		}
	}

	function loadDailyBeatmap(xmlDoc) {
		const beatmaps = xmlDoc.getElementsByClassName("user-home__beatmapsets")[0].children;
		const beatmapsItem = document.getElementsByClassName('Beatmap')[10];
		populateBeatmap(beatmapsItem, beatmaps[0], null, true);
	}

	var xml = new XMLHttpRequest();
	var parser = new DOMParser();
	xml.onload = function () {
		try {
			var xmlDoc = parser.parseFromString(xml.responseText, "text/html");
			loadNewBeatmaps(xmlDoc);
			loadTopBeatmaps(xmlDoc);
			loadDailyBeatmap(xmlDoc);

			main_category.style.display = "flex";
			daily_challenge_panel.style.display = "block";

			set_body_height(main_category_height);
		} catch (e) {
			console.log(e);
			show_login_error();
		}
	};
	xml.open("GET", "https://osu.ppy.sh/", true);
	xml.send();
}

function load_packs_category() {
	function extractPackData(online_pack) {
		const name = online_pack.children[0].children[0].innerText;
		const date = online_pack.children[0].children[1].children[0].innerText;
		const author = online_pack.children[0].children[1].children[1].innerText;
		const datapacktag = online_pack.getAttribute("data-pack-tag");
		const downloadUrl = convertDirectUrlToHref(`https://packs.ppy.sh/${datapacktag} - ${name}.zip`);
		return { name, date, author, downloadUrl };
	}

	function populatePackElement(local_pack, packData, index) {
		local_pack.children[0].innerText = packData.name;
		local_pack.children[1].innerText = `${packData.date} ${packData.author}`;
		local_pack.onclick = () => download_pack(index);
		updateDownloadedStatus(packData.downloadUrl, local_pack);
	}

	function loadPacks(xmlDoc) {
		const packs = xmlDoc.getElementsByClassName("beatmap-pack");
		const packsItems = document.getElementsByClassName('Pack');

		for (let i = 0; i < 9; i++) {
			const packData = extractPackData(packs[i]);
			packs_urls[i] = packData.downloadUrl;
			populatePackElement(packsItems[i], packData, i);
		}
	}

	var xml = new XMLHttpRequest();
	var parser = new DOMParser();
	xml.onload = function () {
		try {
			var xmlDoc = parser.parseFromString(xml.responseText, "text/html");
			loadPacks(xmlDoc);

			packs_category.style.display = "block";
			set_body_height(packs_category_height);
		} catch (e) {
			console.log(e);
			show_login_error();
		}
	};
	xml.open("GET", "https://osu.ppy.sh/beatmaps/packs", true);
	xml.send();
}

function show_login_error() {
	select_category(-1);
	set_body_height(login_error_height);
	require_login_error.style.display = "block";
	categories.style.display = "none";
}

select_category(0);