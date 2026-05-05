import {timeStamp, chart} from './results.js';

var videoShown = false
var videoPicked = false

function toggleVideo(){
    document.getElementById("videoArrow").classList.toggle("active")
    videoContainer = document.getElementById("videoContainer")


    if(videoContainer.style.display == "none"){
        document.getElementById("showVideoText").innerHTML = "Hide Video"
        videoContainer.style.display = "flex"
        if(chart != null){
            chart.options.plugins.annotation.annotations.timestampLine.display = true
        }
        document.getElementById("resultsGrid").style.gridTemplateColumns = "1.5fr 1fr"
        videoShown = true
        
    }else{
        document.getElementById("showVideoText").innerHTML = "Show Video"
        if(videoPicked){document.getElementById("video_player").pause()}
        videoContainer.style.display = "none"
        if(chart != null){
            chart.options.plugins.annotation.annotations.timestampLine.display = false
        }
        document.getElementById("resultsGrid").style.gridTemplateColumns = "1fr auto"
        videoShown = false
    }
    refresh()
}


async function setUpVideo(){
    const videoSrc = await pickSrc()

    videoContainer.innerHTML = '<video controls id="video_player" class="videoPlayer"><source id = "video_src" type="video/mp4"></video>'
    
    document.getElementById("video_player").src = videoSrc + "#t=" + timeStamp

    document.getElementById("video_player").ontimeupdate  = () => {
        timeStamp = document.getElementById("video_player").currentTime
        
        if(chart != null){
            chart.options.plugins.annotation.annotations.timestampLine.value = timeStamp;
            chart.update()
        }
    }

    var changeVidButton = document.createElement("button")
    changeVidButton.innerHTML = "change video <img class='btnIcon' src='./media/refresh.png'>"
    changeVidButton.id = "changeVidButton"
    changeVidButton.className = "bigButton"
    changeVidButton.onclick = setUpVideo
    videoContainer.appendChild(changeVidButton)
}

function pickSrc(){
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = "video/mp4"
        input.style = "display: none;"
        input.onchange = () => {
            let files =   Array.from(input.files);
            let chosenVideo = files[0]
            if (chosenVideo) {
                let videoSrc = URL.createObjectURL(chosenVideo);
                videoPicked = true
                resolve(videoSrc);
            }else{
                reject("No video file selected.");
            }
        }

        input.click();
    });
}

function playVideo(time){
    if(videoShown){
        document.getElementById("video_player").play()
        document.getElementById("video_player").currentTime = time;
    }
}

export{
    videoShown,
    videoPicked,
    setUpVideo,
    toggleVideo
}