function download(){
	setTimeout(()=>{
		document.getElementsByClassName("btn-osu-big btn-osu-big--beatmapset-header ")[0].click();
		setTimeout(()=>{
			close();
		}, 2000);
	}, 2000);
}

if(document.readyState === 'complete'){
	download();
}
else{
	document.addEventListener("DOMContentLoaded", (event) =>{
		download();
	});
}

undefined;