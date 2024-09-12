
let currentsong=new Audio();
let songs;
let currfolder;
function secondstominutesseconds(seconds){
  if(isNaN(seconds) || seconds<0){
    return "00:00";
  }
  const minutes=Math.floor(seconds / 60);
  const remainingseconds=Math.floor(seconds % 60);
  // const formattedminutes=String(minutes).padStart(2,'0');
  // const formattedseconds=String(remainingseconds).padStart(2,'0');

  const formattedminutes = minutes.toString().padStart(2, '0');
  const formattedseconds = remainingseconds.toString().padStart(2, '0');
  return `${formattedminutes}:${formattedseconds}`;
}

async function getsongs(folder){
  currfolder=folder;
     let a=await fetch(`http://127.0.0.1:5501/${folder}/`)
    let response=await a.text();
    let div=document.createElement("div")
    div.innerHTML=response;
    let as=div.getElementsByTagName("a")
     songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

 //show all the song in playlist
  let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0]
  songul.innerHTML= ""
  for(const song of songs) {
      songul.innerHTML = songul.innerHTML + `<li><img class="invert" width="34" src="music.svg" alt="">
     <div class="info">
     <div> ${song.replaceAll("%20"," ")}</div>
     <div>Artist</div>
   </div>
   <div class="playnow">
     <span>Play Now</span>
   <img class="invert" src="play.svg" alt="">
   </div> </li>`;
  }

//attach an event listner to each song
 Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
   e.addEventListener("click",element=>{
     playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

   })  
 })
 return songs;
}


const playmusic = (track, pause = false)=>{
 currentsong.src=`/${currfolder}/`+ track
 if(!pause){
  currentsong.play()
  play.src="pause.svg"
 }
  document.querySelector(".songinfo").innerHTML=decodeURI(track)
  document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}


// // async function displayalbums(){
// //   let a=await fetch(`http://127.0.0.1:5501/songs/`)
// //    let response=await a.text();
// //    let div=document.createElement("div")
// //     div.innerHTML=response;
// //     let anchors=div.getElementsByTagName("a")
// //     let cardcontainer=document.querySelector(".cardcontainer") 
// //    let array=Array.from(anchors)
// //    for (let index = 0; index < array.length; index++) {
// //     const e = array[index];
// //        if(e.href.includes("/songs")){
// //         let folder=e.href.split("/").slice(-2)[0]
// //   //     let res=await fetch(`http://127.0.0.1:5501/songs/${folder}/info.json`)
      
// //   //  let resresponse=await res.json();
// //   //  console.log(response);

// //    let res = await fetch(`http://127.0.0.1:5501/songs/${folder}/info.json`);
// //    console.log(`Fetching info.json from: http://127.0.0.1:5501/songs/${folder}/info.json`);
// //    let jsonResponse = await res.json();
// //    console.log(jsonResponse);

// //    cardcontainer.innerHTML=cardcontainer.innerHTML +` <div data-folder="${folder}" class="card">
// //    <div class="play">
// //        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" class="Svg-sc-ytk21e-0 bneLcE">
// //          <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z" />
         
// //        </svg>
// //      </div>
  
// //  <img src="/songs/${folder}/cover.jpg" alt="">
// //  <h2>${jsonResponse.title}</h2>
// //  <p>${jsonResponse.description}</p>
// //  </div>`        
// //      }
// //   }

// //   //load the playlist whenever card is clicked
// //    Array.from(document.getElementsByClassName("card")).forEach(e=>{
// //     e.addEventListener("click",async item=>{
// //       songs=await getsongs(`songs/${item.currentTarget.dataset.folder}`)
// //       playmusic(songs[0])
// //     })
// //   })
// // }




async function displayalbums(){
  let a = await fetch(`http://127.0.0.1:5501/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
 console.log(div)
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);
  
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
      let folder = e.href.split("/").slice(-2)[0];
        try {
        let res = await fetch(`http://127.0.0.1:5501/songs/${folder}/info.json`);
        console.log(res)
       let jsonResponse = await res.json();
        cardContainer.innerHTML += `
          <div data-folder="${folder}" class="card">
            <div class="play">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" class="Svg-sc-ytk21e-0 bneLcE">
                <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z" />
              </svg>
            </div>
            <img src="/songs/${folder}/cover.jpg" alt="">
            <h2>${jsonResponse.title}</h2>
            <p>${jsonResponse.description}</p>
            
          </div>`;
     } 
   catch (error) {
       console.error("Error fetching or parsing info.json for folder", folder, error);
     }
   }
 }
//   //load the playlist whenever card is clicked
   Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
      songs=await getsongs(`songs/${item.currentTarget.dataset.folder}`)
      playmusic(songs[0])
    })
  })
}


async function main(){
    //get the list of all song
 await getsongs("songs/ncs")
 playmusic(songs[0],true)

//display all the albums on the page
 await displayalbums()
  //attach an event listner to play ,next and previous
  play.addEventListener("click",()=>{
    if(currentsong.paused){
      currentsong.play()
      play.src="pause.svg"
    }
    else{
      currentsong.pause()
      play.src="play.svg"
    }
  })

  
  //listner for timeupdate event
  currentsong.addEventListener("timeupdate",()=>{
   // console.log(currentsong.currentTime,currentsong.duration);
   document.querySelector(".songtime").innerHTML=`${secondstominutesseconds(currentsong.
    currentTime)} / ${secondstominutesseconds(currentsong.duration)}`
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";

  })


  //addd an event listner to seekbar
  document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent=(e.offsetX / e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left=percent+ "%";
    currentsong.currentTime=((currentsong.duration)*percent)/100;
     })
  
     
  //addd an event listner to hamburger
  document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0";
  })


     //addd an event listner to close button
  document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-120%";
  })


// Event listener for the "previous" button
previous.addEventListener("click", () => {
  currentsong.pause();
  let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
  if ((index - 1) >= 0) {
      playmusic(songs[index - 1]);
  }
});


// Event listener for the "next" button
next.addEventListener("click", () => {
  currentsong.pause();
  let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
  if ((index + 1) < songs.length) {
      playmusic(songs[index + 1]);
  }
})

//add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
  currentsong.volume=parseInt(e.target.value)/100 
})

//add event lisner to mute the track
document.querySelector(".volume>img").addEventListener("click",e=>{ 
  if(e.target.src.includes("volume.svg")){
    e.target.src=e.target.src.replace("volume.svg","mute.svg")
    currentsong.volume=0;
    document.querySelector(".range").getElementsByTagName("input")[0].value=0
  }
  else{
    e.target.src= e.target.src.replace("mute.svg","volume.svg")
    currentsong.volume=.10;
    document.querySelector(".range").getElementsByTagName("input")[0].value=10
  }
  
})

}
main()













