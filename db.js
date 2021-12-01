// open database 
// Create object 
// make transection
let db;
let openRequest = indexedDB.open("myDataBase");
openRequest.addEventListener("success",function(e){
    console.log("success");
    db = openRequest.result;
})

openRequest.addEventListener("error",function(e){
    console.log("error");
})

openRequest.addEventListener("upgradeneeded",function(e){
    console.log("upgraded");
    db = openRequest.result;

    db.createObjectStore("video",{keyPath : "id"});
    db.createObjectStore("image",{keyPath : "id"});

})