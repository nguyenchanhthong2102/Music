const $ = document.querySelector.bind(document);
const $$=document.querySelectorAll.bind(document);
const heading= $('header h2');
const thumbnail= $('.cd-thumb');
const audio=$('#audio');
const playBtn=$('.btn-toggle-play');
const Player=$('.player')
const progress=$('#progress');
const nextBtn=$('.btn-next');
const prevBtn=$('.btn-prev');
const randomBtn=$('.btn-random');
const repeatBtn=$('.btn-repeat');
const playList=$('.playlist')
const app={
    currentIndex:0,
    isRandom:false,
    isRepeat:false,
     songs:[{
        name:"Làm Người Luôn Yêu Em",
        singer:"Sơn Tùng MTP",
        path:'./music/Lam-Nguoi-Luon-Yeu-Em-MTP.mp3',
        image:'./singer/mtp.jpg'
    },
    {
        name:"Sao cũng được",
        singer:"Binz",
        path:'./music/Sao-Cung-Duoc-Binz.mp3',
        image:'./singer/binz.jpg'
    },
    {
        name:"Thương",
        singer:"Karik",
        path:'./music/Thuong-Karik-Uyen-Pim-Bet-Band.mp3',
        image:'./singer/karik.jpg'
    },
    {
        name:"Lạc nhau có phải muôn đời",
        singer:"Erik",
        path:'./music/Lac-Nhau-Co-Phai-Muon-Doi-Cho-Em-Den-Ngay-Mai-OST-ERIK.mp3',
        image:'./singer/erik.jpg'
    },
    {
        name:"Yêu một người sao buồn đến thế",
        singer:"Noo Phước Thịnh",
        path:'./music/Yeu-Mot-Nguoi-Sao-Buon-Den-The-Noo-Phuoc-Thinh.mp3',
        image:'./singer/noo.jpg'
    },
    {
        name:"Vài lần đón đưa",
        singer:"Soobin Hoàng Sơn",
        path:'./music/Vai-Lan-Don-Dua-Cover-SOOBIN-Touliver.mp3',
        image:'./singer/soobin.jpg'
    }
],
    isPlaying:false,
    render:function(){
        const html=this.songs.map((song,index)=>{
            return `
        <div class="song ${index===this.currentIndex? 'active' : ' '}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `
        })
        $('.playlist').innerHTML=html.join('')
    },
    defineProperties:function(){
        Object.defineProperty(this,'currentSong',{
            get:function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    nextSong:function(){
        this.currentIndex++;
        if(this.currentIndex>=this.songs.length){
            this.currentIndex=0;
        }
        this.loadCurrentSong();
    },
    prevSong:function(){
        this.currentIndex--;
        if(this.currentIndex<0){
            this.currentIndex=this.songs.length-1;
        }
        this.loadCurrentSong();
    },
    //Ngẫu nhiên không trùng với bài hát hiện tại
    playRandomSong:function(){
        let newIndex;
        do{
            newIndex=Math.floor(Math.random()*this.songs.length)
        }
        while(newIndex===this.currentIndex);
        this.currentIndex=newIndex;
        this.loadCurrentSong();
    },
    handleEvents:function(){
        const _this=this;
        const cd=$('.cd');
        const cdWidth=cd.offsetWidth
        //Xử lý phóng to thu nhỏ CD
        document.onscroll=function(){
         const scrollTop=window.scrollY || document.documentElement.scrollTop;
         const newCDWidth=cdWidth-scrollTop;
        cd.style.width=newCDWidth>0?newCDWidth+'px':0;
        cd.style.opacity=newCDWidth/cdWidth;
        }
        //Xử lý khi click play
        playBtn.onclick=function(){
           if(_this.isPlaying){
            audio.pause();
           }else{
            audio.play();
           }
        }
        //CD xoay 360 độ
        const cdThumnail=thumbnail.animate([{
            transform:'rotate(360deg)'
        }],{
            duration:10000,
            iterations:Infinity,
        })
        cdThumnail.pause();
        //khi song được play 
        audio.onplay=function(){
            _this.isPlaying=true;
            Player.classList.add('playing');
            cdThumnail.play();
        }
        //khi song được pause
        audio.onpause=function(){
            _this.isPlaying=false;
            Player.classList.remove('playing');
            cdThumnail.pause();

        }
        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate=function(){
            if(audio.duration){
                const progressPercent=Math.floor(audio.currentTime/audio.duration *100);
                progress.value=progressPercent;
            }
        }
      
        //Xử lý khi tua nhạc
        progress.onchange=function(e){
            const seekTime=audio.duration/100* e.target.value;
            audio.currentTime=seekTime;
        }
        //bài tiếp theo next Song
        nextBtn.onclick=function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
        }
        //khi prev song
        prevBtn.onclick=function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }else{
            _this.prevSong();
            }
            audio.play();
            _this.render();
        }

        randomBtn.onclick=function(){
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active',_this.isRandom);
        }
        //kết thúc bài hát khi onended
        audio.onended=function(){
            //Nếu bấm lặp thì sẽ hát lại bài hát
            if(_this.isRepeat){
                audio.play();
            }else{
                     //tự động bấm nút next 
                nextBtn.click();
            }
        }
        //repeat btn khi nhảy bài mới hoặc lùi bài cũ
        repeatBtn.onclick=function(){
            _this.isRepeat=!_this.isRepeat;
            repeatBtn.classList.toggle('active',_this.isRepeat);
        }
        //Lắng nghe hành vi khi click vào playlist
      
    },
    //Hiển thị giao diện 
    loadCurrentSong:function(){
        heading.textContent=this.currentSong.name;
        thumbnail.style.backgroundImage=`url('${this.currentSong.image}')`
        audio.src=this.currentSong.path;
    },
    start:function(){
        //Định nghĩa các thuộc tính của Object
        this.defineProperties();
        //Render ra giao diện người dùng
        this.render();
        //Tải thông tin bài hát đầu tiên vào UI khi dùng ứng dụng
        this.loadCurrentSong();
        //Xử lý các sự kiện 
        this.handleEvents();
    }
}
app.start();