const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const cd = $('.cd')
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const progress = $('#progress')
const  nextBtn = $('.btn-next')
const  prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const app ={
  isPlaying: false,
  currentIndex : 0 ,
  isRandom: false,
  isRepeat: false,
  isFavorite: false,
songs: [
  {
    name: 'Buồn Hay Vui',
    singer: 'Obito',
    path: 'assets/music/BuonHayVuiFeatRptMckObitoRonboogz-VSOULRPTMCKObitoRonboogz-13159599.mp3',
    image: 'assets/image/buonhayvui.jpg',
},
{
    name: 'Dont Côi',
    singer: 'Le Vu Minh',
    path: 'assets/music/dontcoi.mp3',
    image: 'assets/image/dontcoi.jpg',
},
{
    name: 'Ghé Qua',
    singer: 'Le Vu Minh',
    path: 'assets/music/GheQua-TaynguyenSoundTofuPC-7031399.mp3',
    image: 'assets/image/ghequa.jpg',
},
{
    name: 'Suýt Nữa Thì',
    singer: 'Le Vu Minh',
    path: 'assets/music/SuytNuaThi-Andiez-7625469.mp3',
    image: 'assets/image/suytnuathi.jpg',
},
{
    name: 'Theo Em Về Nhà',
    singer: 'Le Vu Minh',
    path: 'assets/music/TheoEmVeNha-NgocMai-12748537.mp3',
    image: 'assets/image/theoemvenha.jpg',
},
{
    name: 'Thiên Lý Ơi',
    singer: 'Jack 5 củ',
    path: 'assets/music/ThienLyOi-JackJ97-13829746.mp3',
    image: 'assets/image/thienlyoi.jpg',
},
{
    name: 'Yêu Đơn Phương',
    singer: 'Le Vu Minh',
    path: 'assets/music/YeuDonPhuong-OnlyC-7727496.mp3',
    image: 'assets/image/yeudonphuong.jpg',
},
  ],
  render: function(){
    const htmls = this.songs.map((song,index) => {
        return `
        <div class="song ${index === this.currentIndex ? 'active':''} " data-index="${index}">
      <div class="thumb" style="background-image: url('${song.image}')">
      </div>
      <div class="body">
        <h3 class="title">${song.name}</h3>
        <p class="author">${song.singer}</p>
        <button class="favorite-btn">
        <i class="fa-regular fa-heart"></i>
        </button>
      </div>
      <div class="option">
        <i class="fas fa-ellipsis-h"></i>
      </div>
    </div>
        `
    })
    playlist.innerHTML = htmls.join('')
  },

  defineProperties: function() {
    Object.defineProperty(this,'currentSong',{
      get: function() {
        return this.songs[this.currentIndex];
      }
    })
  },

  handleEvents: function(){
    const cdWidth = cd.offsetWidth
    const _this = this

    // Xử lí CD quay và dừng
     const cdThumbAnimate = cdThumb.animate([
      {transform:'rotate(360deg)'}
    ],{
      duration: 10000, // 10 seconds
      iterations: Infinity
    })
    cdThumbAnimate.pause()

    // xử lí phóng to thu nhỏ Cd
    document.onscroll = function(){
        const scrollTop = window.scrollY
        const newCdWidth = cdWidth -scrollTop
        cd.style.width = newCdWidth >0? newCdWidth + 'px': 0 
        cd.style.opacity = newCdWidth / cdWidth
    }
    // xử lí khi click play
    playBtn.onclick = function(){
      if (_this.isPlaying){
        audio.pause();
      } else {
        audio.play();
      }
    // Khi song duoc play 
    audio.onplay = function(){
      _this.isPlaying = true
      player.classList.add('playing')
      cdThumbAnimate.play()
    }
    // Khi song bi pause
    audio.onpause = function(){
      _this.isPlaying = false
      player.classList.remove('playing')
      cdThumbAnimate.pause()
    }
  }
    // Khi tien do bai hat thay doi 
    audio.ontimeupdate = function(){
      if (audio.duration){
        const progressPercent = Math.floor(audio.currentTime/audio.duration *100)
        progress.value = progressPercent
      }
    }
    // Xử lý khi tua bài hát 
    progress.onchange = function(e){
      const seekTime = audio.duration / 100 * e.target.value
      audio.currentTime = seekTime
    }
    // Khi next Song
    nextBtn.onclick = function(){
      if (_this.isRandom){
        _this.playRandomSong()
      }else{
      _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    } 
     // Khi prev Song
     prevBtn.onclick = function(){
      if (_this.isRandom){
        _this.playRandomSong()
      }else{
      _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
      
    } 
  
    // Xu li Random song
    randomBtn.onclick = function(e){
      _this.isRandom = !_this.isRandom
      randomBtn.classList.toggle('active',_this.isRandom)
    }
     // Xử lí next song khi hết bài hát 
    audio.onended = function(){
      if(_this.isRepeat){
        audio.play();
      } else {
      nextBtn.click();
      }
  }
    //  Xử lí phát lại song
    repeatBtn.onclick = function(){
      _this.isRepeat = !_this.isRepeat
      repeatBtn.classList.toggle('active',_this.isRepeat);
    }

  
    // lang nghe hanh vi khi click vao playlist
   playlist.onclick = function(e){
    const songNode = e.target.closest('.song:not(.active)')
    const favoriteButton = e.target.closest('.favorite-btn')
    if(songNode || e.target.closest('.option')){
      // xu li click vao song
      if (songNode){
        _this.currentIndex = Number(songNode.dataset.index);
        _this.loadCurrentSong();
        _this.render(); 
        audio.play();
      }
    }
    if (favoriteButton) {
      favoriteButton.classList.toggle('favorite');
    }
    }
  },
  scrollToActiveSong: function(){
    setTimeout(()=>{
      $('.song.active').scrollIntoView({
      behavior:'smooth',
      block:'nearest',
      })
    },200)
  },
  
  loadCurrentSong: function(){

  heading.textContent = this.currentSong.name
  cdThumb.style.backgroundImage = ` url('${this.currentSong.image}')`
  audio.src = this.currentSong.path

  console.log(heading,cdThumb,audio)

   
  },
  prevSong: function(){
    this.currentIndex--
    if(this.currentIndex < 0 ){
      this.currentIndex = this.songs.length - 1; 
    }
    this.loadCurrentSong()
    },
  nextSong: function(){
    this.currentIndex++
    if(this.currentIndex >= this.songs.length){
      this.currentIndex = 0 ; 
    }
    this.loadCurrentSong()
    },
  playRandomSong: function(){
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * this.songs.length)
    } while ( newIndex === this.currentIndex )
      this.currentIndex = newIndex
      this.loadCurrentSong()

  },

  start: function(){
    //Định nghĩa các thuộc tính cho object
    this.handleEvents()

    //Lắng nghe / xử lý các sự kiện
    this.defineProperties()

    //Tải thông tin bài hát đầu tiền vào UI
    this.loadCurrentSong()

    // Render playlist
    this.render()
  }
}
app.start()