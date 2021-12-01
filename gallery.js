setTimeout(() =>{
    if(db){
        // video 
        //images
        let dbTransaction = db.transaction("video","readonly");
        let videoStore = dbTransaction.objectStore("video");
        let videoReq = videoStore.getAll(); //event driven
        videoReq.onsuccess = (e) => {
            let videoResult = videoReq.result;
            let galleryCont = document.querySelector(".gallery-cont");
            videoResult.forEach((videoObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class","media-cont");
                mediaElem.setAttribute("id",videoObj.id);
                let url = URL.createObjectURL(videoObj.blobData);
                mediaElem.innerHTML = `
                <div class="media">
                    <video autoplay loop src="${url}"> </video>
                </div>
                <div class="download actionBtn">DOWNLOAD</div>
                <div class="delete actionBtn">DELETE</div>`;
                
                galleryCont.appendChild(mediaElem);

                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click",deleteListener);
                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener("click",downloadListener);
            })
        }



        //images
        let dbImgTransaction = db.transaction("image","readonly");
        let imageStore = dbImgTransaction.objectStore("image");
        let imageReq = imageStore.getAll(); //event driven
        imageReq.onsuccess = (e) => {
            let imageResult = imageReq.result;
            let galleryCont = document.querySelector(".gallery-cont");
            imageResult.forEach((imageObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class","media-cont");
                mediaElem.setAttribute("id",imageObj.id);
                let url = imageObj.url;
                mediaElem.innerHTML = `
                <div class="media">
                    <img  src="${url}" />
                </div>
                <div class="download actionBtn">DOWNLOAD</div>
                <div class="delete actionBtn">DELETE</div>`;

                galleryCont.appendChild(mediaElem);

                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click",deleteListener);
                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener("click",downloadListener);
            })
        }
    }
},1000)

// remove UI , DB remove
function deleteListener(e){
    let id = e.target.parentElement.getAttribute("id");
    if(id.slice(0,3) == "vid"){
        let dbTransaction = db.transaction("video","readwrite");
        let videoStore = dbTransaction.objectStore("video");
        videoStore.delete(id);
    }else if(id.slice(0,3) == "img"){
        let dbImgTransaction = db.transaction("image","readwrite");
        let imageStore = dbImgTransaction.objectStore("image");
        imageStore.delete(id);
    }

    //uI
    e.target.parentElement.remove();
}

function downloadListener(e){
    let id = e.target.parentElement.getAttribute("id");
    if(id.slice(0,3) == "vid"){
        let dbTransaction = db.transaction("video","readwrite");
        let videoStore = dbTransaction.objectStore("video");
        let videoReq = videoStore.get(id);
        videoReq.onsuccess = (e) => {
            let videoresult = videoReq.result;
            let videUrl = URL.createObjectURL(videoresult.blobData);
            let a = document.createElement("a");
            a.href = videUrl;
            a.download = "stream.mp4";
            a.click();
        }
    }else if(id.slice(0,3) == "img"){
        let dbImgTransaction = db.transaction("image","readwrite");
        let imageStore = dbImgTransaction.objectStore("image");   
        let imageReq = imageStore.get(id);
        imageReq.onsuccess = (e) => {
            let imageresult = imageReq.result;
            let a = document.createElement("a");
            a.href = imageresult.url;
            a.download = "Image.jpg";
            a.click();
        }
    }
}