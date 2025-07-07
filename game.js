let gamebox = document.querySelector(".game_box");
let dinosaur = document.querySelector(".dinosaur");
let stopgame = false;
let restartBtn = document.querySelector(".restart-btn");
let score = document.querySelector(".score-display");
let scoreValue = 0;
let collisionSound = document.getElementById('collision-sound');
let jumpSound = document.getElementById('jump-sound');
let initialSpeed = 100;
let initalAdd = 2000;
let isJumping = false;
let keyPressed = false;

let soundEffectsEnabled = true;
let backgroundMusic = document.getElementById('background-music');
let musicToggle = document.getElementById('music-toggle');

function startGame() {
    const intro = document.getElementById('cinematic-intro');
    intro.classList.add('hidden');
}
document.addEventListener('DOMContentLoaded', function() {
    musicToggle.addEventListener('click', function() {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicToggle.textContent = "🔇 Stop Music";
            soundEffectsEnabled = false;
        } else {
            backgroundMusic.pause();
            musicToggle.textContent = "🎵 Play Music";
            soundEffectsEnabled = true;
        }
    });
});

function playJumpSound() {
    if (soundEffectsEnabled && jumpSound) {
        jumpSound.currentTime = 0;
        jumpSound.play().catch(e => console.log('Jump sound play failed:', e));
    }
}

function playCollisionSound() {
    if (soundEffectsEnabled && collisionSound) {
        collisionSound.currentTime = 0;
        collisionSound.play().catch(e => console.log('Collision sound play failed:', e));
    }
}

let scoreTimer = setInterval(() => {
    if (!stopgame) {
        scoreValue++;
        document.getElementById("score").textContent = scoreValue;
            gamebox.classList.remove("day-theme");

        // Theme change logic
        if (scoreValue % 100 >= 50 && scoreValue % 100 < 100) {
            gamebox.classList.add("night-theme");
            gamebox.classList.remove("day-theme");
        } else {
            gamebox.classList.add("day-theme");
            gamebox.classList.remove("night-theme");
        }
    }
}, 500);

function showRestartButton() {
  restartBtn.style.display = "block";
}

function restartGame(){
    stopgame = false;
    scoreValue = 0;
    document.getElementById("score").textContent = "0";
    restartBtn.style.display = "none";
    document.querySelectorAll(".obstacles").forEach(ob => ob.remove());
    dinosaur.style.transform = "translateY(0px)";
    addIntervalId = setInterval(addobstacle, 2000);
    initialSpeed = 100;
    initalAdd = 2000;
}

document.addEventListener('keydown',(event) =>{
  if ((event.key === "ArrowUp" || event.key === " ") && !keyPressed) {
    keyPressed = true;
    jump();
  }
});

document.addEventListener('keyup',(event) =>{
  if (event.key === "ArrowUp" || event.key === " ") {
    keyPressed = false;
  }
});

function jump(){
    if (isJumping) return;
    isJumping = true;
    dinosaur.style.transform = "translateY(-140px)";
    playJumpSound();
    setTimeout(()=>{
        dinosaur.style.transform = "translateY(0px)";
        isJumping = false;
    }, 400);
}


function addobstacle() {
    if (stopgame == true) return;
    let obstacle = document.createElement("div");
    obstacle.classList.add("obstacles");
    obstacle.style.position = "relative";
    obstacle.style.right = "0px";
    gamebox.appendChild(obstacle);
    initialSpeed --;
    initalAdd  -= 10;
    let position = 0;

    let move = setInterval(() => {
        
        position += 100;
        obstacle.style.right = position + "px";
        let dinoRect = dinosaur.getBoundingClientRect();
        let obsRect = obstacle.getBoundingClientRect();

        if (Math.abs(dinoRect.right - obsRect.left) < 100 &&  dinoRect.bottom >= obsRect.top) {
            console.log ("Game Ended");
            playCollisionSound();
            stopgame = true;
            showRestartButton();
             
        }
        if (position > gamebox.offsetWidth + 100) {
            clearInterval(move);
            gamebox.removeChild(obstacle);
        }
        if (stopgame == true){
            clearInterval(move);        
            clearInterval(addIntervalId);
        }
        
    }, initialSpeed);
    
}

let addIntervalId = setInterval(addobstacle, 2000); 



