
window.onfocus=function(){
}
window.onload=function(){
 window.focus(); // 현재 window 즉 익스플러러를 윈도우 최상단에 위치
window.moveTo(0,0); // 웹 페이지의 창 위치를 0,0 (왼쪽 최상단) 으로 고정
window.resizeTo(700,700); // 웹페이지의 크기를 가로 1280 , 세로 800 으로 고정(확장 및 축소)
window.scrollTo(0,250); // 페이지 상단 광고를 바로 볼 수 있게 스크롤 위치를 조정
}


// 캔버스 셋팅
let canvas;
let ctx;

canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas);

//이미지 로드
let backgroundImage,spaceshipImage,bulletImage,gameOverImage;
let gameOver=false; // ture면 게임종료
let score=0;


//우주선 좌표: 계속 바뀌기에 따로 지정
let spaceshipX = canvas.width/2-24
let spaceshipY = canvas.height-68

let bulletList =[] //총알들을 저장하는 리스트
function Bullet(){
    this.x=0;
    this.y=0;
    this.init=function(){
        this.x = spaceshipX +12
        this.y = spaceshipY
        this.alive = true // true면 살아있는 총알
        bulletList.push(this);
    };
    this.update = function(){
        this.y -= 7;
    };

    this.checkHit=function(){
        for(let i=0; i < enemyList.length; i++){
            if(this.y <= enemyList[i].y &&
               this.x >= enemyList[i].x &&
               this.x <= enemyList[i].x + 48
               ){
                // 총알이 닿으면 적군 없어짐, 점수획득
                score++;
                this.alive=false;
                enemyList.splice(i,1);
            }
        }
        
    }
}

function generateRandomValue(min,max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min
    return randomNum
}

let enemyList=[]
function Enemy(){
    this.x =0;
    this.y =0;
    this.init =function(){
        this.y=0
        this.x=generateRandomValue(0, canvas.width-48)
        enemyList.push(this);
    };
    this.update=function(){
        this.y += 2 //적군의 속도조절

        if(this.y >= canvas.height-48){
            gameOver = true;
            console.log("game over");
        }
    }
}

function loadImage(){ 
    backgroundImage = new Image();
    backgroundImage.src="images/background.png";

    spaceshipImage = new Image();
    spaceshipImage.src="images/space-fighter.png";

    bulletImage = new Image();
    bulletImage.src="images/bullet.png";

    enemyImage = new Image();
    enemyImage.src="images/enemy.png";

    gameOverImage = new Image();
    gameOverImage.src="images/game over.png";
}

//방향키 누르면!
let keysDown={};
function setupKeyboardListener(){
    document.addEventListener("keydown",function(event){
        //console.log("무슨키가 눌렸어?",event.keyCode) : 키보드 키값확인
        keysDown[event.keyCode] = true;
        //console.log("키다운객체에 들어간 값은?",keysDown);
    });
    document.addEventListener("keyup",function(event){
        delete keysDown[event.keyCode];
        //console.log("버튼클릭 후",keysDown); : 방향키떼면 값 삭제

        if(event.keyCode == 32){
            createBullet()//총알 생성(스페이스를 누르고 뗄떼마다 그래서 keyup)
        }
    });
}

function createBullet(){
    //console.log("총알생성");
    let b = new Bullet(); //총알 하나 생성
    b.init();
    //console.log("새로운 총알 리스트", bulletList);
}

function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy()
        e.init()
    },1000)
}


function update(){
    if(39 in keysDown){// right
        spaceshipX += 5;//우주선의 속도
    }
    if(37 in keysDown){// left
        spaceshipX -= 5;//우주선의 속도
    }
    
    // 배경밖으로 우주선이 나가지 않도록 하려면?
    if(spaceshipX <=0){
        spaceshipX=0;
    }
    if(spaceshipX >= canvas.width-48){
        spaceshipX=canvas.width-48;
    } 

    //총알의 y좌표 업데이트 한 함수 호출
    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
            bulletList[i].update();
            bulletList[i].checkHit();
        }
        
    }

    for(let i=0; i<enemyList.length; i++){
        enemyList[i].update();
    }

}


// 이미지 랜더링(그리기) 
function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY );
    ctx.fillText(`Score : ${score}`,20, 40);
    ctx.fillStyle ="white";
    ctx.font= "20px Arial";
    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
        }
    }

    for(let i=0; i<enemyList.length; i++){
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
    }

}

function main(){
     if(!gameOver){
        update(); //좌표값을 업데이트하고
        render(); //그려주고
        requestAnimationFrame(main); //배경 계속 호출
     }else{
        ctx.drawImage(gameOverImage,10,100,380,380);
    }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();

