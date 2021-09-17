let req=indexedDB.open("gallery",1);

let database;
req.addEventListener("success",function(){
    database=req.result;
    // console.log(database);
});
req.addEventListener("upgradeneeded",function(){
    let db=req.result;
    console.log(1);
    db.createObjectStore("media",{keyPath: "mId"});
});
req.addEventListener("error",function(){});
function saveMedia(media){
    if(! database) return;

    let data={
        mId:Date.now(),
        mediaData: media,
    };

    let tx=database.transaction("media","readwrite");
    let mediaObjectStore=tx.objectStore("media");
    mediaObjectStore.add(data);
}
function viewMedia(){
    if(!database)return;
    let tx=database.transaction("media", "readonly");
    let mediaObjectStore=tx.objectStore("media");
    let req=mediaObjectStore.openCursor();

    req.addEventListener("success",function(){
        let cursor=req.result;
        let galleryContainer=document.querySelector(".gallery-container");
        if(cursor){
            let mediaCard=document.createElement("div");
            mediaCard.classList.add("media-card");
            mediaCard.innerHTML=`<div class="actual-media"></div>
            <div class="media-buttons">
                <button class="media-download">Download</button>
                <button class="media-delete">Delete</button>
            </div>`
            let actualMedia=mediaCard.querySelector(".actual-media");
            let data=cursor.value.mediaData;
            let type=typeof(data);
            // console.log(type);
            if(type=="string"){
                let img=document.createElement("img");
                img.src=data;
                actualMedia.append(img);
            }else if(type=="object"){
                let video=document.createElement("video")
                let url=URL.createObjectURL(data);
                video.src=url;
                video.autoplay=true;
                video.controls=true;
                video.muted=true;
                video.loop=true;
                actualMedia.append(video);
            }
            console.log(cursor.value);
            galleryContainer.append(mediaCard);
            cursor.continue();
        }
    })
}