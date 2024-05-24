function download() {
	setTimeout(() => {
		try {
			document.getElementsByClassName("btn-osu-big btn-osu-big--beatmapset-header ")[0].click();
		} catch {
			download();
			return;
		}
		setTimeout(() => {
			close();
		}, 2000);
	}, 500);
}

if (document.readyState === 'complete') {
	download();
}
else {
	document.addEventListener("DOMContentLoaded", (event) => {
		download();
	});
}

undefined;