let video = document.querySelector("video");
// for recoder 
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
// for capture
let captureBtnCont = document.querySelector(".capture-btn-cont")
let captureBtn = document.querySelector(".capture-btn")
let recoderflag = false;
let recoder;
let transparentColor = "transparent";
let constraints = {
    video: true,
    audio: true
}

// navigator -> global obj, store browser info
navigator.mediaDevices.getUserMedia(constraints)
.then((stream) =>{
    video.srcObject = stream;
    recoder = new MediaRecorder(stream);
    recoder.addEventListener("start",function(e){
        chunks = [];
    })
    recoder.addEventListener("dataavailable",function(e){
        chunks.push(e.data);
    })
    recoder.addEventListener("stop",function(){
        // conversion of media chunks data to video 
        let blob = new Blob(chunks, {type : "video/mp4"});
        // let videoURL = URL.createObjectURL(blob);
        
        if(db){
            let videoID = shortid();
            let dbTransection = db.transaction("video","readwrite");
            let videoStore = dbTransection.objectStore("video");
            let videoEntry = {
                id : `vid-${videoID}`,
                blobData : blob
            }
            videoStore.add(videoEntry);
        }
    })
})


recordBtnCont.addEventListener("click",function(e){
    if(!recoder)return;
    recoderflag = !recoderflag;
    if(recoderflag){
        recoder.start();
        recordBtn.classList.add("scale-record");
        startTimer();
    }else{
        recoder.stop();
        recordBtn.classList.remove("scale-record");
        stopTimer();
    }
})

captureBtn.addEventListener("click",function(e){
    captureBtn.classList.add("scale-capture");

    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let tool = canvas.getContext("2d");
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);
    // filtering
    tool.fillStyle = transparentColor;
    tool.fillRect(0,0,canvas.width,canvas.height);

    let imageURL = canvas.toDataURL();
    if(db){
        let imageID = shortid();
        let dbTransection = db.transaction("image","readwrite");
        let imageStore = dbTransection.objectStore("image");
        let imageEntry = {
            id : `img-${imageID}`,
            url : imageURL
        }
        imageStore.add(imageEntry);
    }

    setTimeout(()=>{
        captureBtn.classList.remove("scale-capture");
    },500)
})

let timerID;
let counter = 0;
let timer = document.querySelector(".timer");
function startTimer(){
    timer.style.display = "block";
    function displayTimer(){
        let totalSecond = counter;
        let hours = Number.parseInt(totalSecond/3600);
        totalSecond = totalSecond % 3600;

        let minutes = Number.parseInt(totalSecond/60);
        totalSecond = totalSecond % 60;

        let second = totalSecond;
        hours = (hours<10)? `0${hours}` :hours;
        minutes = (minutes<10)? `0${minutes}` :minutes;
        second = (second<10)? `0${second}` :second;

        timer.innerText = `${hours}:${minutes}:${second}`;
        counter++;
    }
    timerID = setInterval(displayTimer,1000);
}

function stopTimer(){
    timer.style.display = "none";
    clearInterval(timerID);
    timer.innerText = "00:00:00"
}

let allFilters = document.querySelectorAll(".filter");
let filterLayer = document.querySelector(".filter-layer");

allFilters.forEach((filterEle)=>{
    // filterEle.style.backgroundColor
    filterEle.addEventListener("click",function(e){
        transparentColor = getComputedStyle(filterEle).getPropertyValue("background-color");
        filterLayer.style.backgroundColor = transparentColor;
    })
})
