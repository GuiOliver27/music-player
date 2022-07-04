const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
mainAudio = wrapper.querySelector("#main-audio"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = progressArea.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
moreMusicBtn = wrapper.querySelector("#more-music"),
closemoreMusic = musicList.querySelector("#close");

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;

window.addEventListener("load", ()=>{
    loadMusic(musicIndex);
    playingSong();
})

function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].src}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

//função de executar música
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

//função de pausar música
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

//função de voltar música
function prevMusic(){
    musicIndex--; //decremento de musicIndex by 1
    //se musicIndex for menor que 1, musicIndex será o comprimento da matriz para que a última música seja reproduzida
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong(); 
}

//função de próxima música
function nextMusic(){
    musicIndex++; //incremento de musicIndex por 1
    //se musicIndex for maior que o comprimento da matriz, musicIndex será 1, então a primeira música será reproduzida
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

//botão de evento de iniciar ou pausar
playPauseBtn.addEventListener("click", ()=>{
    const isMusicPlay = wrapper.classList.contains("paused");
    //se isPlayMusic for verdadeiro então chame a pausa Música caso contrário chame play Música
    isMusicPlay ? pauseMusic() : playMusic();
    playingSong();
});

//botão de evento de música anterior
prevBtn.addEventListener("click", ()=>{
    prevMusic
});

//botão de evento de próxima música
nextBtn.addEventListener("click", ()=>{
    nextMusic();
});

//atualizar a largura da barra de progresso de acordo com o tempo atual da música
mainAudio.addEventListener("timeupdate", (e)=>{
    const currentTime = e.target.currentTime; //tocando a música currentTime
    const duration = e.target.duration; //fica tocando a duração total da música
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;
  
    let musicCurrentTime = wrapper.querySelector(".current-time"),
    musicDuartion = wrapper.querySelector(".max-duration");
    mainAudio.addEventListener("loadeddata", ()=>{
      // atualizar duração total da música
      let mainAdDuration = mainAudio.duration;
      let totalMin = Math.floor(mainAdDuration / 60);
      let totalSec = Math.floor(mainAdDuration % 60);
      if(totalSec < 10){ //se sec for menor que 10, adicione 0 antes dele
        totalSec = `0${totalSec}`;
      }
      musicDuartion.innerText = `${totalMin}:${totalSec}`;
    });
    // atualizar a hora atual da música tocando
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10){ //se sec for menor que 10, adicione 0 antes dele
      currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

  // atualize a reprodução da música currentTime de acordo com a largura da barra de progresso
progressArea.addEventListener("click", (e)=>{
    let progressWidth = progressArea.clientWidth; //obtendo largura da barra de progresso
    let clickedOffsetX = e.offsetX; //obtendo o valor de deslocamento x
    let songDuration = mainAudio.duration; //obtendo a duração total da música
    
    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    playMusic(); //chamando a função playMusic
    playingSong();
});

//alterar loop, embaralhar, repetir ícone ao clicar
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
  let getText = repeatBtn.innerText; //obtendo esta tag innerText
  switch(getText){
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

//código para o que fazer depois que a música terminou
mainAudio.addEventListener("ended", ()=>{
    /* faremos de acordo com o ícone significa que se o usuário tiver definido o ícone para
música em loop, então repetiremos a música atual e faremos de acordo */
    let getText = repeatBtn.innerText; //obtendo esta tag innerText
    switch(getText){
      case "repeat":
        nextMusic(); //chamando a função nextMusic
        break;
      case "repeat_one":
        mainAudio.currentTime = 0; //definindo o tempo atual de áudio para 0
        loadMusic(musicIndex); //chamando a função loadMusic com argumento, no argumento há um índice da música atual
        playMusic(); //chamando a função playMusic
        break;
      case "shuffle":
        let randIndex = Math.floor((Math.random() * allMusic.length) + 1); //gerando índice/número aleatório com intervalo máximo de comprimento da matriz
        do{
          randIndex = Math.floor((Math.random() * allMusic.length) + 1);
        }while(musicIndex == randIndex); //este loop é executado até que o próximo número aleatório não seja o mesmo do musicIndex atual
        musicIndex = randIndex; //passando randomIndex para musicIndex
        loadMusic(musicIndex);
        playMusic();
        playingSong();
        break;
    }
});

//mostrar lista de músicas ao clicar no ícone de música
moreMusicBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", ()=>{
    moreMusicBtn.click();
});

const ulTag = wrapper.querySelector("ul");
// deixe criar tags li de acordo com o comprimento do array para a lista
for (let i = 0; i < allMusic.length; i++) {
  //vamos passar o nome da música, artista do array
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag); //inserindo o li dentro da tag ul

  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", ()=>{
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if(totalSec < 10){ //se sec for menor que 10, adicione 0 antes dele
      totalSec = `0${totalSec}`;
    };
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adicionando o atributo t-duration com o valor total da duração
  });
}

//tocar uma música específica da lista ao clicar na tag li
function playingSong(){
    const allLiTag = ulTag.querySelectorAll("li");
    
    for (let j = 0; j < allLiTag.length; j++) {
      let audioTag = allLiTag[j].querySelector(".audio-duration");
      
      if(allLiTag[j].classList.contains("playing")){
        allLiTag[j].classList.remove("playing");
        let adDuration = audioTag.getAttribute("t-duration");
        audioTag.innerText = adDuration;
      }
  
      //se o índice da tag li for igual ao musicIndex, adicione a classe de reprodução nele
      if(allLiTag[j].getAttribute("li-index") == musicIndex){
        allLiTag[j].classList.add("playing");
        audioTag.innerText = "Playing";
      }
  
      allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
}

//função li particular clicada
function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //atualizando o índice de música atual com o índice li clicado
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}