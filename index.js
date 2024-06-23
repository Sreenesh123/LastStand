const canvas=document.querySelector("canvas");
const c=canvas.getContext('2d');
const backgroundMusic = new Audio('media/soundtrack.mp3');
const deathsound=new Audio('media/death.mp3');

backgroundMusic.loop = true;
canvas.width=1024;
canvas.height=576;
const totalcanvaswidth=10000;
const totalcanvasheight=576;
let scrolloffset=0;
let stackCount = 0;
const minGap = 300;
const maxGap = 900;
let lastBoxX = 400;
let boxX,bg,timeout;
let viewportx=0;
let bulletdamage=20;
let viewporty=0;
const gravity=0.8;
let onground =true;
let onfloor=false;
let bulletdimension={width:10,height:10};
let currentgunimage=createimage("media/gun.png");
let bulletform=createimage("media/bullet1.png")
let ammo=50;
let currentbox;
let recoil=5;
let reloadammo=50;
let gunAngle = 0;
let y;
let gamescore=0;
let time=60;
let animationframe;
let boxes = [];
let dragimages=[];
let traps=[];
let isReloading=false;
let onBox = false;
let dragimage;
const keys={
    right:{
        pressed:false
    },
    left:{
        pressed:false
    }
}
const pause=document.getElementById("pause");
const resume=document.getElementById("resume");
const gameon=document.getElementById("gameon");
const gamecanvas=document.getElementById("gamecanvas");
const toolbox=document.getElementById("toolbox");
const playbox=document.getElementById("playbox");
const switchguns=document.getElementById("dropbtn");
const dropdown=document.getElementById("dropdown")
const box1=document.getElementById("box1");
const submit = document.getElementById("submit");
submit.addEventListener('click',submitaction);
const playbutton=document.getElementById("play");
playbutton.disable=false;
playbutton.addEventListener("click",activateplay)
const dragitems=toolbox.children;
const leaderboardelement=document.getElementById("leaderboard");
const buttoncontainer=document.getElementById("button-container");
const reloadingCircle = document.getElementById("reloadingCircle");
let bulletVelocityx,bulletVelocityy;

const boxImage = createimage("./media/wooden.jpg");
const trapimage=createimage("./media/trap.png");

let zombiehealth=100;
let zombiemaxhealth=100;
let mousex;
let timer;
let mousey;
const body=document.querySelector("body");
const sidebar=document.getElementById("sidebar");
let objects=[];
let zombies = [];
let leaderboarddetails=[];
let paused=true;
let gameover=false;
let bulletSpriteSheet=createimage("media/bullet.png");
const trapbar=document.getElementById("box3");
let restart=true;
let immune = false;
let immuneDuration = 5000;
let immuneStartTime = 0;
const platformimage=createimage("./media/stone.png");


const platforms = [];
const platformCount = 100;
const platformY = 450;
const immuneButton = document.getElementById("immune");
const ammobutton = document.getElementById('ammobutton');

const scrollspeed = 20;
function playBackgroundMusic() {
  backgroundMusic
    .play()
    .then(() => {
      console.log("Background music started playing successfully.");
    })
    .catch((error) => {
      console.log(
        "Error occurred while trying to play background music:",
        error
      );
    });
}

document.addEventListener("click", playBackgroundMusic);
document.addEventListener("keydown", playBackgroundMusic);
document.addEventListener("mousemove", playBackgroundMusic);
document.addEventListener("touchstart", playBackgroundMusic);


backgroundMusic.addEventListener("play", () => {
  document.removeEventListener("click", playBackgroundMusic);
  document.removeEventListener("keydown", playBackgroundMusic);
  document.removeEventListener("mousemove", playBackgroundMusic);
  document.removeEventListener("touchstart", playBackgroundMusic);
});
const scrollbg= (e) => {
    switch(e.key) {
        case 'ArrowLeft':
            keys.left.pressed=true;
            keys.right.pressed=false;
            break;
        case 'ArrowRight':
            keys.right.pressed=true;
            keys.left.pressed=false;
            break;
    }
    if(keys.right.pressed)
        {
            scrolloffset+=5;
            platforms.forEach(platform => {
                platform.position.x-=5;
            });
            boxes.forEach(box => {
                box.position.x-=5;
            });
            obstacles.forEach(obstacle => {
                obstacle.position.x-=5;
            });}
            else if(keys.left.pressed && scrolloffset>0)
                {   
                    scrolloffset-=5;
                    platforms.forEach(platform => {
                        platform.position.x+=5;
                    });
                    boxes.forEach(box => {
                        box.position.x+=5;
                    });
                    obstacles.forEach(obstacle => {
                        obstacle.position.x+=5;
                    });
                }
    drawBoxes();
};



let draggableItems = Array.from(dragitems);
let offsetX,offsetY;

let isPreparationPhase = false;
        
        let draggedItem = null;
let buttonCooldownTime = 60000;
let isdragging=false;
let dragstartx,dragstarty;

const handleDragStart = (e) => {
    const rect = e.target.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    if (!isPreparationPhase) return;
    draggedItem = e.target;
};

const handleDragOver = (e) => {
    if (!isPreparationPhase) return;
    e.preventDefault();
};
let obstacles=[];
let floors=[];
const handleDrop = (e) => {
    if (!isPreparationPhase) return;

    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;

    let y = 375;
    boxes.forEach((box) => {
        if (x < box.position.x + box.width && x + 75 > box.position.x) {
            y = box.position.y - 75;
        }
    });

    if (draggedItem.classList.contains("woodenbox")) {
        const newBox = new Objects({ x: x, y: y, image: boxImage, width: 75, height: 75 });
        boxes.push(newBox);
        newBox.draw();
    } else if (draggedItem.classList.contains("trap")) {
        const newTrap = new Trap(x, 405, 216, 3);
        traps.push(newTrap);
        obstacles.push(newTrap);
        newTrap.draw();
    } else if (draggedItem.classList.contains("trap2")) {
        const newTrap2 = new Objects({ x:x, y: 420, image: createimage("media/trap2.png"), width: 75, height: 40 });
        objects.push(newTrap2);
        obstacles.push(newTrap2);
        newTrap2.draw();
    }
    else if (draggedItem.classList.contains("floor1")) {
        const newfloor = new Objects({ x:x, y: e.clientY-rect.top, image: createimage("media/floor1.png"), width: 175, height: 70});
        objects.push(newfloor);
        floors.push(newfloor);
        obstacles.push(newfloor);
        newfloor.draw();
    }
    draggedItem = null;
};

const dragaction = () => {
    draggableItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
    });
    canvas.addEventListener('dragover', handleDragOver);
    canvas.addEventListener('drop', handleDrop);
};

const removedragaction = () => {
    draggableItems.forEach(item => {
        item.removeEventListener('dragstart', handleDragStart);
    });
    canvas.removeEventListener('dragover', handleDragOver);
    canvas.removeEventListener('drop', handleDrop);
};

function drawBoxes() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    bg.draw();
    platforms.forEach(platform => {
        platform.draw();
    });
    boxes.forEach(box => {
        box.draw();
    });
    traps.forEach((trap,index)=>
        {   if(index!==0){
            trap.draw();
        }
        })
       objects.forEach(object=>
        {
            object.draw();
        })
    

}


function timerupdate() {
      const minutes = Math.floor(time / 60);
      let seconds = time % 60;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      timer.innerHTML = `${minutes}:${seconds}`;
      if (time === 0) {
        timer.innerHTML="Time's Up!!"  
        clearInterval(timeinterval);
        
      }
      time = time < 0 ? 0 : time - 1;
    }
  

ammobutton.addEventListener('click',
    increaseFireRate
);

function immunityactivation() {
    immune = true;
    immuneStartTime = Date.now();
    window.alert("Immunity lasts for 5 seconds: cooldown time - 1 min");
    setTimeout(() => {
        immune = false;
    }, immuneDuration);
    disableimmuneButton();

}
immuneButton.addEventListener("click", immunityactivation);
function disableimmuneButton() {
    
    immuneButton.disabled = true;

    setTimeout(() => {
        immuneButton.disabled = false;
    }, buttonCooldownTime);
}

const restartButton = document.getElementById("restartButton");


function scoredisplay()
{
    c.fillStyle="white";
    c.font="24px  Georgia, 'Times New Roman', Times, serif";
    c.fillText('Score: ' + gamescore, 900, 30)
}
function showModal() {
    document.getElementById('nameModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('nameModal').style.display = 'none';
}

function collision (bullet,box){
    return( bullet.position.x < box.position.x + box.width &&
    bullet.position.x + bullet.width >box.position.x &&
    bullet.position.y < box.position.y + box.height &&
    bullet.position.y + bullet.height >box.position.y)
}

function createimage(imagesrc)
{
    const image=new Image();
    image.src=imagesrc;
    image.onload = () => console.log(`Loaded: ${imagesrc}`);
        image.onerror = () => console.error(`Failed to load: ${imagesrc}`);
    return image;

}

function recoiling()
{
    ammo=reloadammo;
}
function displayammo() {
    c.fillStyle = 'white';
    c.font = '20px  Georgia, "Times New Roman", Times, serif';;
    if (isReloading) {
        c.fillText(`Reloading...`, 900, 70);
    } else {
        c.fillText(`Ammo: ${player.ammo}`, 900, 70);
    }
}
let immuneimage=createimage("media/immunity.png")
let lastSpawnTime = 0;
const spawnInterval = 5000;


function spawnZombie() {
    let attempts = 0;
    const maxAttempts = 10;
    const width = 100;
    const height = 100;
    let x, y;
    do {
        x = Math.random() > 0.5 ? 0 : canvas.width - 50;
        y = 350;
        attempts++;
    } while (!isPositionValid(x, y, width, height) && attempts < maxAttempts);

    if (attempts < maxAttempts) {
        zombies.push(new Zombie(x, y, sprites));
    }
}

function getDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

function activateplay()
{
    if(isPreparationPhase)
        {
            clearTimeout(timeout);
            keys.right.pressed=false;
            keys.left.pressed=false;
            gameon.style.display="inline";
            sidebar.style.display="flex";
            toolbox.classList.remove("container");
            trapbar.classList.remove("trapbar");
            isPreparationPhase=false;
            c.clearRect(0, 0, canvas.width, canvas.height);
            platforms.forEach(platform => {
                platform.position.x += scrolloffset;
            });
    
            boxes.forEach(box => {
                box.position.x += scrolloffset;
            });
            obstacles.forEach((obstacle)=>
            {
                obstacle.position.x +=scrolloffset
            })
            scrolloffset=0;
        
    pause.style.display="inline";
    dropdown.style.display="inline";
    switchguns.style.display="inline";
    resume.style.display="inline";
    restartButton.style.display="inline";
    immuneButton.style.display="inline";
    ammobutton.style.display="inline";
    body.style.justifyContent = "space-evenly";
    gameon.innerHTML="GAME ON 🧟"
    sidebar.classList.add("sidebar")
    gameon.classList.add("gameon");
    leaderboardelement.classList.add("leaderboard");
    buttoncontainer.classList.add("button-container");
    playbutton.disabled=true;
    clearInterval(timeinterval);
    toolbox.classList.remove('toolbox');
    for (let i = 0; i < dragitems.length; i++) {
        dragitems[i].classList.remove('draggable');
    }
    dragimages.forEach((dragimage)=>
    {
        dragimage.remove();
    })
   
    timer.remove();
    playbutton.style.display="none";    
    canvas.addEventListener('click',Bulletshoot );
    document.removeEventListener('keydown',scrollbg);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    animate() 
}
}

function updateZombies() {
    const currentTime = Date.now();
    if (currentTime - lastSpawnTime > spawnInterval) {
        spawnZombie();
        lastSpawnTime = currentTime;
    }

 for (let i = 0; i < zombies.length; i++) {
        for (let j = i + 1; j < zombies.length; j++) {
            const z1 = zombies[i];
            const z2 = zombies[j];
            if (collision(z1, z2) && !(z1.isattacking)&& !(z2.isattacking) && !(z1.colliding) && !(z2.colliding)) {
                separateZombies(z1, z2);
            }
        }
    }

    zombies.forEach(zombie => {
        zombie.update();
        zombie.draw();
    });

}

function separateZombies(z1, z2) {
    const overlapX = Math.min(z1.position.x + z1.width - z2.position.x, z2.position.x + z2.width - z1.position.x);
    const overlapY = Math.min(z1.position.y + z1.height - z2.position.y, z2.position.y + z2.height - z1.position.y);

    if (overlapX < overlapY) {
        if (z1.position.x < z2.position.x) {
            z1.position.x -= overlapX / 2;
            z2.position.x += overlapX / 2;
        } else {
            z1.position.x += overlapX / 2;
            z2.position.x -= overlapX / 2;
        }
    }
}

let i = 0;
function isPositionValid(x, y, width, height) {
    for (const box of boxes) {
        if (
            x < box.position.x + box.width &&
            x + width > box.position.x &&
            y < box.position.y + box.height &&
            y + height > box.position.y
        ) {
            return false;
        }
    }
    return true;
}

function displayleaderboard(leaderboard)
{
   
   leaderboardelement.innerHTML = "<h2>Leaderboard</h2>";
   leaderboard.forEach((entry, index) => {
       const entryElement = document.createElement("div");
       entryElement.classList.add("entryelement");
       entryElement.textContent = `${index + 1}. ${entry.playerName} - ${entry.score}`;
       leaderboardelement.appendChild(entryElement);
   })

}

function getStackingLevel(boxes, box) {
    let stackingLevel = 1;
    boxes.forEach((otherBox) => {
        if (
            otherBox.position.x === box.position.x &&
            otherBox.position.y < box.position.y
        ) {
            stackingLevel++;
        }
    });
    return stackingLevel;
}

class Trap {
    constructor(x, y,cropwidth,framecount) {
        this.position = { x, y };
        this.width = 50;
        this.height = 50;
        this.sprite=createimage("./media/trap1.png");
        this.cropwidth= cropwidth;
        this.frameCount =framecount;
        this.frame = 0;
        this.frameSpeed = 10;
        this.frameTimer = 0;
        this.activated=false;
    }

    update() {
       if(!this.activated) return;
        this.frameTimer++;
        if (this.frameTimer % this.frameSpeed === 0) {
            this.frame = (this.frame + 1) % this.frameCount;
        }
        this.draw();
    }

    draw() {
        c.save();
        c.drawImage(
            this.sprite,
            this.cropwidth * this.frame,
            0,
            this.cropwidth,
            122,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
        c.restore();
       
    }
}

function animate()
{ 
    
    if(!paused){
        
       animationframe= requestAnimationFrame(animate);
    c.fillStyle='black';
    c.fillRect(0,0,canvas.width,canvas.height);
    bg.draw();   
    scoredisplay();
    displayammo();
    boxes.forEach(box => {
        box.draw();
    });
    traps.forEach((trap,index)=>
    {   if(index!==0){
        trap.draw();
    }
    })
   objects.forEach(object=>
    {
        object.draw();
    }
   )
    platforms.forEach(platform => {
        platform.draw(); 
    });   
    
    player.update(); 
    updateZombies();
    


    bullets.forEach((bullet, index) => {
        bullet.update();
        bullet.draw(c);
        
        if (bullet.position.y > canvas.height || bullet.position.x > canvas.width ||bullet.position.y+bullet.height >450 ) {
            bullets.splice(index, 1);
        }
        else
        {
            boxes.forEach((box,boxindex)=>
            {
                if(collision(bullet,box))
                    {
                        bullets.splice(index, 1);
                    }
            })
            zombies.forEach((zombie,zombieindex)=>
            {
                if(collision(bullet,zombie))
                    {   zombie.health-=bulletdamage;
                        if(zombie.health<0)
                            {
                                zombie.health=0;
                            }

                        if(zombie.health===0)
                            {
                        zombies.splice(zombieindex,1);
                        gamescore+=1;
                        deathsound.play();
                    zombie.isdead=true;}
                        bullets.splice(index, 1);
                        
                        
                        
                    }
            })
            

        }
        
    });

    if (keys.right.pressed && player.position.x<400)
        { player.velocity.x=5}
    else if((keys.left.pressed && player.position.x>100) || (keys.left.pressed && scrolloffset===0 && player.position.x>0))
        {player.velocity.x= -5;}
    else
        {player.velocity.x=0;

         if(keys.right.pressed)
            {
                scrolloffset+=5;
                platforms.forEach(platform => {
                    platform.position.x-=5;
                });
                boxes.forEach(box => {
                    box.position.x-=5;
                });
                zombies.forEach(zombie=>
                    {
                        zombie.position.x-=5
                    }
                )
                obstacles.forEach(obstacle => {
                    obstacle.position.x-=5;
                });
                bullets.forEach((bullet, index) => {
                    bullet.position.x-=5;
                })
                
            } 
        else if(keys.left.pressed && scrolloffset>0)
            {   
                scrolloffset-=5;

                platforms.forEach(platform => {
                    platform.position.x+=5;
                });
                boxes.forEach(box => {
                    box.position.x+=5;
                });
                obstacles.forEach(obstacle => {
                    obstacle.position.x+=5;
                });
                zombies.forEach(zombie=>
                    {
                        zombie.position.x+=5
                    }
                )
                bullets.forEach((bullet, index) => {
                  bullet.position.x +=5;
                });
                
            }
        }

        boxes.forEach(box => {
            if (collision(player, box)) {
                if (player.position.y + player.height <= box.position.y + player.velocity.y) {
                    player.velocity.y = 0;
                    onfloor=true;
                    player.position.y = box.position.y - player.height;
                } else if (player.position.x + player.width > box.position.x && player.position.x < box.position.x + box.width) {
                    player.velocity.x = 0;
                    if (player.position.x < box.position.x) {
                        player.position.x = box.position.x - player.width;
                    } else {
                        player.position.x = box.position.x + box.width;
                    }
                }
            }
        });
       
        floors.forEach(floor => {
            
            if (collision(player, floor)) {
                
                if (player.position.y + player.height < floor.position.y + player.velocity.y) {
                    onfloor=true;
                    player.topcollision=true;
                    player.velocity.y = 0;
                    player.position.y = floor.position.y - player.height;
                } 
                else if ((player.position.y + player.velocity.y < floor.position.y + floor.height||
                    player.position.y < floor.position.y + floor.height )&& player.velocity.y<0) {
                    player.bottomcollision=true;
                    player.velocity.y+=2;
                }
                if ((player.position.x + player.width > floor.position.x && player.position.x < floor.position.x + floor.width) && onground) {
                    player.velocity.x = 0;
                    if (player.position.x < floor.position.x) {
                        player.position.x = floor.position.x - player.width;
                    } else {
                        player.position.x = floor.position.x + floor.width;
                    }
                }
            }
        });

       
      zombies.forEach((zombie) => {
          let isColliding = false;

          // Combine both boxes and floors into a single array for collision detection
          const combinedObjects = [...boxes, ...floors];

          combinedObjects.some((obj) => {
            if (collision(zombie, obj)) {
              let stackingLevel = getStackingLevel(combinedObjects, obj);
              let adjustedPositionY = stackingLevel * obj.position.y;

              if (
                zombie.position.x + zombie.width >= obj.position.x &&
                zombie.position.x <= obj.position.x + obj.width
              ) {
                zombie.colliding = true;
                isColliding = true;

                if (
                  (zombie.facingRight && zombie.position.x <= obj.position.x) ||
                  (!zombie.facingRight &&
                    zombie.position.x <= obj.position.x + obj.width)
                ) {
                  zombie.increasespeed = false;
                  zombie.position.y -= 2;
                }

                if (zombie.position.y + zombie.height <= adjustedPositionY) {
                  zombie.velocity.y = 0;
                  zombie.increasespeed = true;
                  zombie.onBox = true;
                }
              }

              return true; // Exit the 'some' loop once a collision is found
            } else {
              zombie.onBox = false;
            }

            return false;
          });

          if (!isColliding && zombie.position.y < 348 && !zombie.onBox) {
            zombie.position.y += 2;
            zombie.colliding = false;
          }
        });

        zombies.forEach((zombie, zombieIndex) => {
            let zombieDead = false;
        
            traps.forEach((trap, index) => {
                if (zombieDead) return;
        
                if (collision(zombie, trap) && index !== 0) {
                    trap.activated = true;
                    zombie.health -= 0.1;
                    if (zombie.health <= 0) {
                        zombie.health = 0;
                    }
                    if (zombie.health === 0) {
                        zombies.splice(zombieIndex, 1);
                        deathsound.play();
                        gamescore += 1;
                        zombie.isdead = true;
                        zombieDead = true;
                    }
                    trap.update();
                    if (zombieDead) {
                        trap.activated = false;
                        return;
                    }
                }
            });
            if (zombieDead) {
                traps.forEach((trap, index) => {
                    if (index !== 0) {
                        trap.activated = false;
                    }
                });
            }
        });
        
        


for (let i = 0; i < zombies.length; i++) {
    let zombie = zombies[i];
    for (let j = 0; j < objects.length; j++) {
        let object = objects[j];
        if (collision(zombie, object)) {
            zombie.health -= 0.1;
            if (zombie.health <= 0) {
                zombie.health = 0;
            }
            if (zombie.health === 0) {
                zombies.splice(i, 1);
                gamescore += 1;
                deathsound.play();
                zombie.isdead = true;
                break;
            }
        }
    }

}



    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0;
            onground=true;
            onfloor=false;
            player.topcollision=false;
            player.bottomcollision=false;
        }
    });}
   
}

function restartGame() {
    
    clearInterval(timeinterval);
    switchguns.style.display="none";
    sidebar.classList.remove("container");
    sidebar.style.display="none";
    gameon.style.display="none";
    submit.addEventListener('click',submitaction);
    removedragaction();
    c.clearRect(0, 0, canvas.width, canvas.height);
    drawcanvaselements();
    canvas.removeEventListener("click",Bulletshoot);
    if (animationframe) {
        cancelAnimationFrame(animationframe);
    }
    player = null;
    boxes = [];
    zombies = [];
    traps=[];
    objects=[];
    obstacles=[];
    floors=[];
    scrolloffset = 0;
    pause.style.display = "none";
    resume.style.display = "none";
    restartButton.style.display = "none";
    immuneButton.style.display = "none";
    ammobutton.style.display = "none";
    body.style.justifyContent = "space-evenly";
    sidebar.classList.remove("sidebar");
    gameon.classList.remove("gameon");
    leaderboardelement.classList.remove("leaderboard");
    buttoncontainer.classList.remove("button-container");
    playbutton.disabled = false;
    playbutton.style.display = "none";
    canvas.removeEventListener('click', Bulletshoot);
    document.removeEventListener('keydown', scrollbg);
    if (dragimage) dragimage.remove();
    if (timer) timer.remove();
    player=new Player();
    player.health = 100;
    gamescore = 0;
    gameover = false;
    paused = false;
    restart = true;
    playerNameInput.value = "";
    showModal();
}
restartButton.addEventListener("click", restartGame);

let nameInput = document.getElementById("playerNameInput");
function submitaction() {
    
    // toolbox.classList.remove("container");
    sidebar.classList.remove("container");
    // sidebar.style.display="flex";
    gameon.style.display="none";
    canvas.removeEventListener('click', Bulletshoot);
    dragaction();
    document.addEventListener('keydown', scrollbg);
    playerName = nameInput.value.trim();
    setTimeout(() => {
            window.alert("press Arrowleft or Arrowright to scroll the platform ");
        
    }, 1000);
    if (playerName !== "") {
        closeModal();
        paused=false;
        isPreparationPhase = true;
        if(isPreparationPhase){
      timeout=setTimeout(() => {
        isPreparationPhase = true;
       activateplay();

      }, 120000); };
      
        toolbox.classList.add("toolbox");
        for (let i = 0; i < dragitems.length; i++) {
            dragitems[i].classList.add('draggable');
        }
        createelement("media/wooden.jpg","woodenbox",0);
        createelement("media/trap.png","trap",1);
        createelement("media/trap2.png",'trap2',2);
        createelement("media/floor1.png",'floor1',3);
        timer=document.createElement("div");
        timer.classList.add("timer");
        toolbox.insertBefore(timer,box1);
        
        timeinterval = setInterval(timerupdate, 1000);
        timer.innerhtml="2.00";
        time=120;
        timerupdate();
        playbutton.style.display="inline";
        submit.removeEventListener("click",submitaction);
        
    } else {
        alert("Please enter your name.");
    }
}
function createelement(src,addingclass,index)
{
    dragimage=document.createElement("img");
        dragimage.src=src;
        dragimage.classList.add("draggingitem",addingclass);
        dragimages.push(dragimage);

        dragitems[index].appendChild(dragimage);

}

submit.addEventListener("click", submitaction);
function drawcanvaselements()
{
    bg.draw();
    for (let i = 0; i < 100; i++) {
        platforms.push(new Platform({ x: i * platformimage.width, y: platformY, image: platformimage }));
    } 
    platforms.forEach(platform => {
        platform.draw(); 
    });
}

window.addEventListener("load", function() {
    c.fillStyle='black';
    c.fillRect(0,0,canvas.width,canvas.height);
    drawcanvaselements();
    
    showModal();
});

pause.addEventListener('click',function()
{
    paused=true;
    immuneButton.removeEventListener('click',immunityactivation);
    ammobutton.removeEventListener('click',increaseFireRate);
    
})
resume.addEventListener("click",function()
{  
    paused=false;
    if(!paused)
        {
            immuneButton.addEventListener('click',immunityactivation);
    ammobutton.addEventListener('click',increaseFireRate);
            animate();
        }
})



gamecanvas.addEventListener('mousemove', function(event) {
    const rect = gamecanvas.getBoundingClientRect();
     mousex = event.clientX - rect.left;
     mousey = event.clientY - rect.top;

});

class Platform
{
    constructor({x,y,image})
    {
        this.position={
            x:x,
            y:y
        }
        this.width=image.width;
        this.height=image.height;
        this.image=image;
    }
    draw()
    {   c.drawImage(this.image,this.position.x,this.position.y)
    }
    update()
    {}
}



for (let i = 0; i < 100; i++) {
    platforms.push(new Platform({ x: i * platformimage.width, y: platformY, image: platformimage }));
}

class Bullet {
    constructor(x, y, velocityX, velocityY, bulletform, bulletdimension) {
        this.position = { x, y };
        this.velocity = { x: velocityX, y: velocityY };
        this.image = bulletform;
        this.width = bulletdimension.width;
        this.height = bulletdimension.height;
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y += gravity / 10;
    }

    draw(context) {
        context.save();
        context.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
        let angle = Math.atan2(this.velocity.y, this.velocity.x);
        context.rotate(angle);
        context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        context.restore();
    }
}

const bullets = [];

const sprites = {
    walk: {
        image: createimage("media/zombie1.png"), // Adjust image source as needed
        // cropWidths: [183, 229, 232, 191, 194],
        cropheight: 378, // Assuming all frames have the same height
        frameCount: 6
    },
    run: {
        image: createimage("media/zombierun1.png"), // Adjust image source as needed
        cropheight: 300, // Assuming all frames have the same height
        frameCount: 10
    },
    attack: {
        image: createimage("media/zombieattack1.png"), // Adjust image source as needed
        cropheight: 377, // Assuming all frames have the same height
        frameCount: 6
    },
    jump:
    {
        image:createimage("media/zombierun2.png"),
        cropheight:370,
        frameCount:7
    }

};


class Zombie {
    constructor(x, y, sprites) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.width = 100; 
        this.height = 100;
        this.frame = 0;
        this.health=zombiehealth;
        this.onBox=onBox;
        this.maxHealth=zombiemaxhealth;
        this.action = "walk";
        this.sprites = sprites;
        this.currentSprite = sprites[this.action].image;
        this.currentCropheight = sprites[this.action].cropheight;
        this.frameCount = sprites[this.action].frameCount;
        this.frameSpeed = 5;
        this.frameTimer = 0;
        this.colliding=false;
        this.isattacking=false;
        this.isdead=false;
        this.increasespeed=true;
        this.direction = x < canvas.width / 2 ? 1 : -1;
        this.facingRight = this.position.x < player.position.x;
    }

    drawLifebar() {
        const barWidth = 75;
        const barHeight = 10;
        let barX = this.position.x + (this.width - barWidth) / 2;
        const barY = this.position.y - 20;
        c.fillStyle="gray";
        c.fillRect(barX,barY,barWidth,barHeight);
        c.fillStyle = 'red';
        c.fillRect(barX, barY, barWidth * (this.health / this.maxHealth), barHeight);
    }
   
    update() {

        if(this.isdead) return;


        this.frameTimer++;
        if (this.frameTimer % this.frameSpeed === 0) {
            this.frame = (this.frame + 1) % this.frameCount;
        }
        if (this.position.x < player.position.x && this.increasespeed) {
            this.velocity.x = 0.5;
            this.facingRight=true;
        } else if (this.position.x > player.position.x && this.increasespeed) {
            this.velocity.x = -0.5;
            this.facingRight=false;
        } else {
            this.velocity.x = 0;
        }       
        this.position.x += this.velocity.x;
        

        if (collision(this, player)) {
            this.isattacking = true;
            this.velocity.x=0;
        } else {
            this.isattacking = false;
        }
        this.drawLifebar();        
       
    }

    draw() {
            this.currentSprite = this.isattacking ? this.sprites.attack.image : this.sprites.walk.image;
            this.currentCropheight = this.isattacking ? this.sprites.attack.cropheight : this.sprites.walk.cropheight;
            this.frameCount = this.isattacking ? this.sprites.attack.frameCount : this.sprites.walk.frameCount;
            c.save();
        if (this.facingRight) {
           
            c.drawImage(
                this.currentSprite,
                0,
                this.currentCropheight * this.frame,
                this.currentSprite.width,
                this.currentCropheight,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            );
        } else {
            c.translate(this.position.x + this.width, this.position.y);
            c.scale(-1, 1);
            c.drawImage(
                this.currentSprite,
                0,
                this.currentCropheight * this.frame,
                this.currentSprite.width,
                this.currentCropheight,
                0,
                0,
                this.width,
                this.height
            );
            c.setTransform(1, 0, 0, 1, 0, 0);
        }    
        c.restore();
    }
    
}
 let playerinitialx=100;
 let playerinitialy=100;
 let lastShotTime = 0;
        let cooldownTime = 600; 
        let increasedRateCooldownTime = 200; 
        let ammunitionRateDecrease = 10000; 
        let isIncreasedFireRateActive = false;     

class Player
{
    constructor()
    {
        this.gun=createimage("media/gun.png")
        this.gunDimensions = { width:this.gun.width, height: this.gun.height };
        this.bulletdimension=bulletdimension;
        this.velocity={
            x:0,
            y:1
        }
        this.width=125;
        this.height=125;
        this.position={
            x:playerinitialx,
            y:playerinitialy
        }
        this.gravity=gravity;
        this.frame=0;
        this.isflying=false;
        this.flypower=-3;
         this.health = 100; 
        this.maxHealth = 100; 
        this.ammo=ammo;
        this.recoil=recoil;
        this.isReloading=isReloading;
        this.fireImage = createimage("media/fire.png");
        this.fireDimensions = { width:20, height: 25 };
        
        this.sprites={
            idle:{
                right:createimage("media/standshoot.png"),
                cropwidth:569,
                framecount:1
            },
            run:{
                right:createimage("media/runshoot.png"),
                cropwidth:569,
                framecount:8
            },
            slide:
            {
                right:createimage("media/slide.png"),
                cropwidth:567,
                framecount:10
            }
           
        }
        this.currentsprite=this.sprites.idle.right;
        this.currentcropwidth=this.sprites.idle.cropwidth;
        
        
        this.frameCount = this.sprites.idle.framecount;
        this.frameSpeed = 5; 
        this.frameTimer = 0;
        this.facingRight = true;
    }  

    startFlying() {
        this.isflying = true;
        this.velocity.y = this.flypower;
        if(player.position.y<bg.position.y)
            {
                player.velocity.y=0;
            }
    }

    stopFlying() {
        this.isflying = false;
        this.velocity.y=0;
    }
   
    
    switchWeapon(gunId) {      
        switch (gunId) {
          case 'gun1':
            this.gun=createimage("media/gun.png")
            this.gunDimensions={width:this.gun.width,height:this.gun.height};
            bulletform=createimage("media/bullet1.png");
            bulletdimension={width:10,height:10};
            bulletdamage=20;
            this.ammo=50;
            reloadammo=50;
            break;
          case 'gun2':
            this.gun=createimage("media/gun2.png");
            this.gunDimensions={width:60,height:30};    
            bulletdamage=25;   
            this.ammo=35;
            reloadammo=35;
            break;
          case 'gun3':
            this.gun=createimage("media/gun3.png");
            this.gunDimensions={width:60,height:30};
            bulletform=createimage("media/bullet3.png");
            bulletdimension={width:25,height:5}
            bulletdamage=50;
            reloadammo=25;
            this.ammo=25;
            break;
        case 'gun4':
                this.gun=createimage("media/gun4.png");
                this.gunDimensions={width:60,height:30};
                bulletform=createimage("media/bullet4.png");
                bulletdimension={width:15,height:15};
                bulletdamage=100;
                reloadammo=15;
                this.ammo=15;
                break;  
    
      }
    }
    draw() {
        c.save(); 
        if (immune) {
            c.drawImage(immuneimage, this.position.x - (this.width / 2), this.position.y - (this.height / 2), this.width * 2, this.height * 2);
        }
        if(restart==true){this.position.x=playerinitialx ;
            this.position.y=playerinitialy;
            restart=false;
        }else{this.position.x=this.position.x;
            this.position.y=this.position.y;
        }
        let pivotx = this.position.x + (this.facingRight ? 95:29);
        let pivoty=this.position.y+68;
        if(this.currentsprite===this.sprites.slide.right)
            {
                 pivotx = this.position.x + (this.facingRight ? 70:29);
                 pivoty=this.position.y+90;
            }
        let angle = Math.atan2(mousey - pivoty, mousex - pivotx);
        angle = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, angle));
        c.translate(pivotx, pivoty);
        
        if (this.facingRight) {
            c.rotate(angle);
            c.drawImage(this.gun, 0, -this.gunDimensions.height/ 2,this.gunDimensions.width,this.gunDimensions.height);
        } else {
            angle = -Math.atan2(mousey - pivoty, mousex - pivotx); 
            c.scale(-1, 1);
            c.rotate(angle);
            
            c.drawImage(this.gun, 0, -this.gunDimensions.height/ 2,this.gunDimensions.width,this.gunDimensions.height);
        }
       
        c.setTransform(1, 0, 0, 1, 0, 0); 
        if (this.facingRight) {
           
            c.drawImage(
                this.currentsprite,
                this.currentcropwidth * this.frame,
                0,
                this.currentcropwidth,
                520,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            );
        } else {
            c.translate(this.position.x + this.width, this.position.y);
            c.scale(-1, 1);
            c.drawImage(
                this.currentsprite,
                this.currentcropwidth * this.frame,
                0,
                this.currentcropwidth,
                520,
                0,
                0,
                this.width,
                this.height
            );
            c.setTransform(1, 0, 0, 1, 0, 0);
        }
        if (this.isflying) {
            const leftLegX = this.position.x + (this.facingRight ? 30 : 38);
            const rightLegX = this.position.x + (this.facingRight ? 70 : 78);
            const legY = this.position.y + 125;

            c.drawImage(this.fireImage, leftLegX, legY, this.fireDimensions.width, this.fireDimensions.height);
            c.drawImage(this.fireImage, rightLegX, legY, this.fireDimensions.width, this.fireDimensions.height);
        }
        
        
        c.restore();
    }

    drawLifebar() {
        const barWidth = 75;
        const barHeight = 10;
        const barX = this.position.x + (this.width - barWidth) / 2;
        const barY = this.position.y - 20;
        c.fillStyle="gray";
        c.fillRect(barX,barY,barWidth,barHeight);
        c.fillStyle = 'orange';
        c.fillRect(barX, barY, barWidth * (this.health / this.maxHealth), barHeight);
    }

    update()
    {   
        this.frameTimer++;
        if (this.frameTimer % this.frameSpeed === 0) {
            this.frame++;
            if (this.frame >= this.frameCount) this.frame = 0;
        }
        this.draw();
        zombies.forEach((zombie)=>{
            if(!gameover){
            if(collision(zombie,player))
                {
                    if(!immune){
                    player.health-=0.05;}
                    if(player.health<0)
                        {
                            player.health=0;
                        }
                    if(player.health===0)
                        {
                          gameon.innerHTML = "GAME OVER💀";
                          leaderboarddetails.push({playerName:playerName,score:gamescore})
                          localStorage.setItem("leaderboarddetails",JSON.stringify(leaderboarddetails));
                          let leaderboard = JSON.parse(localStorage.getItem("leaderboarddetails")) || [];
                          leaderboard.sort((a, b) => b.score - a.score);
                          leaderboard = leaderboard.slice(0, 10);
                          displayleaderboard(leaderboard);
                          paused=true;
                          gameover=true;
                          immuneButton.removeEventListener("click",immunityactivation);
                          ammobutton.removeEventListener("click",increaseFireRate);
                          
                        }
                }
     } })
        this.drawLifebar();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
        if(this.position.y + this.height+this.velocity.y<=canvas.height)
        {this.velocity.y+=this.gravity;}
        else{this.velocity.y=0;}
        
    }
}



let player= new Player(); 


function Bulletshoot() {
    
    const currenttime=Date.now();
    const pivotx = player.position.x + (player.facingRight ? 75 : 25);
    const pivoty = player.position.y + 58;
     let angle = Math.atan2(mousey - pivoty, mousex - pivotx);
    angle = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, angle));

    const bulletx = pivotx + Math.cos(angle) * (player.facingRight ? player.gunDimensions.width : -player.gunDimensions.width);
    const bullety = pivoty + Math.sin(angle) * (player.facingRight ? player.gunDimensions.width : -player.gunDimensions.width);
    bulletVelocityx = Math.cos(angle) * (player.facingRight ? 7 : -10);
    bulletVelocityy = Math.sin(angle) * (player.facingRight ? 7 : -10);
    if(player.ammo>0 && !this.isReloading && currenttime-lastShotTime>=cooldownTime){
    bullets.push(new Bullet(bulletx, bullety, bulletVelocityx, bulletVelocityy,bulletform,bulletdimension));
    player.ammo-=1;
    recoileffect();
    lastShotTime=currenttime;
if(player.ammo===0)
{
    reload();
}}
}
function increaseFireRate() {
    if(isIncreasedFireRateActive) return;
    increasedammunitionrate=true;
    cooldownTime=increasedRateCooldownTime;
    setTimeout(resetFireRate, ammunitionRateDecrease);
    disableAmmoButton();
}
function resetFireRate() {
    cooldownTime = 1000;
    isIncreasedFireRateActive= false;
}
function disableAmmoButton() {
    ammobutton.disabled = true;
    reloadingCircle.style.display = "inline";

    setTimeout(() => {
        ammobutton.disabled = false;
        reloadingCircle.style.display = "none";
    }, buttonCooldownTime);
}
function reload()
{
    isReloading = true;
    setTimeout(() => {
        player.ammo = reloadammo;
        isReloading = false;
    }, 2000);
}
function recoileffect()
{ if(player.facingRight){
    player.position.x-=recoil;}
    else{
        player.position.x+=recoil;
    }
}


function handleKeyDown(event) {
    switch(event.key) {
        case ' ':
            player.currentsprite = player.sprites.idle.right;
                player.currentcropwidth = player.sprites.idle.cropwidth;
                player.frameCount = player.sprites.idle.framecount;
                player.startFlying();  
                player.isflying=true;                  
                break;

        case 'ArrowUp':
            if ((player.position.y > canvas.offsetTop) && (onground || onfloor)) {
                player.velocity.y -= 20;
                onground=false;
            }
            break;
        case 'ArrowDown':
            player.currentsprite = player.sprites.slide.right;
            player.currentcropwidth = player.sprites.slide.cropwidth;
            player.frameCount = player.sprites.slide.framecount;
            break;
        case 'ArrowLeft':
            keys.left.pressed = true;
            keys.right.pressed=false;
            player.facingRight = false;
            if (!keys.right.pressed && !player.isflying) {
                player.currentsprite = player.sprites.run.right;
                player.currentcropwidth = player.sprites.run.cropwidth;
                player.frameCount = player.sprites.run.framecount;
            }else if(player.isflying){
                    player.startFlying();
            }
            break;
        case 'ArrowRight':
            keys.right.pressed = true;
            keys.left.pressed=false;
            player.facingRight = true;
            if (!keys.left.pressed && !player.isflying) {
                player.currentsprite = player.sprites.run.right;
                player.currentcropwidth = player.sprites.run.cropwidth;
                player.frameCount = player.sprites.run.framecount;
            }
            else if(player.isflying){
                player.startFlying();
        }
            break;
       
    }
}

function handleKeyUp(event) {
    switch(event.key) {
        case ' ':
            if (keys.left.pressed || keys.right.pressed) {
                player.currentsprite = player.sprites.run.right;
                player.currentcropwidth = player.sprites.run.cropwidth;
                player.frameCount = player.sprites.run.framecount;
                

            } else {
                player.currentsprite = player.sprites.idle.right;
                player.currentcropwidth = player.sprites.idle.cropwidth;
                player.frameCount = player.sprites.idle.framecount;
            }
            player.isflying=false;
            player.stopFlying();
            break;
        
        case 'ArrowUp':
            break;
        case 'ArrowDown':
            if (keys.left.pressed || keys.right.pressed) {
                player.currentsprite = player.sprites.run.right;
                player.currentcropwidth = player.sprites.run.cropwidth;
                player.frameCount = player.sprites.run.framecount;
            } else {
                player.currentsprite = player.sprites.idle.right;
                player.currentcropwidth = player.sprites.idle.cropwidth;
                player.frameCount = player.sprites.idle.framecount;
            }
            break;
        case 'ArrowLeft':
            keys.left.pressed = false;
            if (!keys.right.pressed) {
                player.currentsprite = player.sprites.idle.right;
                player.currentcropwidth = player.sprites.idle.cropwidth;
                player.frameCount = player.sprites.idle.framecount;
            }
            break;
        case 'ArrowRight':
            keys.right.pressed = false;
            if (!keys.left.pressed) {
                player.currentsprite = player.sprites.idle.right;
                player.currentcropwidth = player.sprites.idle.cropwidth;
                player.frameCount = player.sprites.idle.framecount;
            }
            break;
       
    }
}





class Objects
{ 
    constructor({x,y,image,width,height})
    {
        this.position={
            x:x,
            y:y
        }
        this.width=width;
        this.height=height;
        this.image=image;
    }
    draw()
    {  
         c.drawImage(this.image,this.position.x,this.position.y,this.width,this.height);
        }
         
    update()
    {}
}
 bg=new Objects({x:0,y:23,image:createimage("media/bg5.png"),width:1024,height:512});


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const startingpos=platforms[0].position.x;

