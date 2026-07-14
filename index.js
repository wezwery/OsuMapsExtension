// Constants
const main_category_height = 533;
const packs_category_height = 420;
const login_error_height = 420;

// Variables
var main_urls = Array(10).fill("");
var main_ids = Array(10).fill("");
var main_names = Array(10).fill("");
var packs_urls = Array(9).fill("");
var daily_challenge = ["", ""];
var download_list = JSON.parse(localStorage.getItem("downloaded")) || [];
var category_selected = -1;
var mode_selected = -1;

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

function createTemplate(templateId) {
	const template = document.getElementById(templateId);
	if (!template) {
		console.error(`Template with id ${templateId} not found`);
		return null;
	}
	return template.content.cloneNode(true);
}

// Category Management
function register_all_categories() {
	Array.from(document.getElementsByClassName("Category-Button")).forEach((category, i) => {
		category.onclick = () => select_category(i);
	});
}

function register_all_mode_categories() {
	Array.from(document.getElementsByClassName("mode_category")).forEach((category, i) => {
		category.onclick = () => select_mode_category(i);
	});
}

register_all_categories();
register_all_mode_categories();

function select_mode_category(index) {
	if (mode_selected === index) return;

	Array.from(document.getElementsByClassName("mode_category")).forEach((category, i) => {
		category.setAttribute("selected", i === index);
	});

	mode_selected = index;
	document.getElementsByClassName("RequireLoginError")[0].style.display = "none";

	if (category_selected == 0)
		load_main_category();
}

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
	document.getElementsByClassName("Main-Category")[0].style.display = "none";
	document.getElementsByClassName("DailyChallengePanel")[0].style.display = "none";
}

function unload_packs_category() {
	document.getElementsByClassName("Packs-Category")[0].style.display = "none";
}

function populateBeatmap(beatmapElement, beatmapData, index, isDaily = false) {
	beatmapElement.children[1].href = beatmapData.href;
	const beatmapId = beatmapData.href.split('/').pop();
	const beatmapName = beatmapData.children[1].children[0].innerText.trim();
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

	const mode = get_beatmap_mode_class(beatmapData.getElementsByClassName("user-home-beatmapset__playmode-icon")[0]?.children[0]?.className);

	if (!mode)
		beatmapElement.children[0].children[1].style.opacity = 0.0;
	else
		beatmapElement.children[0].children[1].classList.add(mode);

	beatmapElement.children[1].children[0].innerText = beatmapName;
	beatmapElement.children[1].children[1].innerText = beatmapArtist;
	beatmapElement.children[1].children[2].innerText = `by ${beatmapCreator}`;
}

function get_beatmap_mode_class(modeClass) {
	if (!modeClass)
		return null;

	if (modeClass.includes("fa-extra-mode-osu")) return "beatmap_mode_osu";
	if (modeClass.includes("fa-extra-mode-taiko")) return "beatmap_mode_taiko";
	if (modeClass.includes("fa-extra-mode-mania")) return "beatmap_mode_mania";
	if (modeClass.includes("fa-extra-mode-fruits")) return "beatmap_mode_fruits";

	return null;
}

function removeElementsByClass(parent, className) {
	const elements = parent.getElementsByClassName(className);
	while (elements.length > 0) {
		elements[0].parentNode.removeChild(elements[0]);
	}
}

function load_main_category() {
	function loadNewBeatmaps(xmlDoc) {
		const beatmaps = xmlDoc.getElementsByClassName("user-home__beatmapsets")[1].children;
		const beatmapsParent = document.getElementsByClassName('NewMapsPanel')[0];
		for (let i = 0; i < 5; i++) {
			beatmapsParent.appendChild(createTemplate("beatmap-template"));
			populateBeatmap(beatmapsParent.lastElementChild, beatmaps[i], i);
		}
	}

	function loadTopBeatmaps(xmlDoc) {
		const beatmaps = xmlDoc.getElementsByClassName("js-popular-beatmapsets-panel")[mode_selected].children;
		const beatmapsParent = document.getElementsByClassName('TopMapsPanel')[0];
		for (let i = 0; i < 5; i++) {
			beatmapsParent.appendChild(createTemplate("beatmap-template"));
			populateBeatmap(beatmapsParent.lastElementChild, beatmaps[i], i + 5);
		}
	}

	function loadDailyBeatmap(xmlDoc) {
		const beatmaps = xmlDoc.getElementsByClassName("user-home__beatmapsets")[0].children;
		const beatmapsParent = document.getElementsByClassName('DailyChallengePanel')[0];
		beatmapsParent.appendChild(createTemplate("beatmap-template"));
		beatmapsParent.lastElementChild.classList.add("Beatmap_daily");
		populateBeatmap(beatmapsParent.lastElementChild, beatmaps[0], null, true);
	}

	var xml = new XMLHttpRequest();
	var parser = new DOMParser();
	xml.onload = function () {
		try {
			var xmlDoc = parser.parseFromString(xml.responseText, "text/html");

			removeElementsByClass(document, "Beatmap");

			loadNewBeatmaps(xmlDoc);
			loadTopBeatmaps(xmlDoc);
			loadDailyBeatmap(xmlDoc);

			document.getElementsByClassName("Main-Category")[0].style.display = "flex";
			document.getElementsByClassName("DailyChallengePanel")[0].style.display = "block";

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

			document.getElementsByClassName("Packs-Category")[0].style.display = "block";
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
	document.getElementsByClassName("RequireLoginError")[0].style.display = "block";
	document.getElementsByClassName("Categories")[0].style.display = "none";
}

select_mode_category(0);
select_category(0);