console.log('Lets write JavaScript');
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();

    console.log("📥 Server Response:", response); // ✅ Check server response

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    console.log("🔗 Found Links:", as.length); // ✅ Kitne `<a>` tags mile

    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        console.log(`🎵 Checking Link ${index + 1}:`, element.href); // ✅ Check each link

        if (element.href.endsWith(".mp3")) {
            let songName = element.href.substring(element.href.lastIndexOf("/") + 1); // ✅ Fix split logic
            console.log(`✅ Extracted Song:`, songName); // ✅ Final extracted song
            songs.push(songName);
        }
    }

    console.log("🎶 Final Songs List:", songs); // ✅ Final array check

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML += `<li><img class="invert" width="34" src="img/music.svg" alt="">
                            <div class="info">
                                <div> ${(song || "").replaceAll("%20", " ")}</div>
                                <div>Harry</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div> </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });

    return songs;
}


const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs" + track)
    currentSong.src = `${currFolder}/${track}`;

    if (!pause) {

        currentSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"



}






async function main() {


    await getSongs("songs/ncs")
    playMusic(songs[0], true)


    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    });


    currentSong.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });


    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    });


    document.querySelector(".hamburger").addEventListener("click", e => {
        document.querySelector(".left").style.left = "0"
    });

    document.querySelector(".close").addEventListener("click", e => {
        document.querySelector(".left").style.left = "-120%"
    });

    previous.addEventListener("click", () => {

        let index = songs.indexOf((currentSong.src.split("/").slice(-1)[0]))
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }

    });

    next.addEventListener("click", () => {
        currentSong.pause()

        let index = songs.indexOf((currentSong.src.split("/").slice(-1)[0]))
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }

    });

    document.addEventListener("wheel", function (event) {
        if (event.ctrlKey) {
            event.preventDefault();
        }
    }, { passive: false });

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs");

            
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            console.log("Songs Array:", songs); 

            if (!songs.length) {
                console.error("⚠️ No songs found in the folder!");
                return; // ⚠️ Stop if no songs
            }
            playMusic(songs[0])

        });
    });
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    });

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    });
}
main()



