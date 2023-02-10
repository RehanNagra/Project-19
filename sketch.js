var PLAY = 1
var END = 0
var gameState = PLAY

var char, char_running, char_collided
var forest, invisibleGround, forestImage



var gameOverImg, restartImg
var jumpSound, checkpointSound, dieSound

var gameOver, restart

var obstaclesGroup, obstacle1, obstacle2, obstacle3

var score=0



function preload(){
  char_running = loadAnimation("boy1.png","boy2.png","boy3.png","boy4.png")

  char_collided = loadAnimation("boy1.png")
  forestImage = loadImage("forest.jpg")

  obstacle1 = loadImage("lion.png")
  obstacle2 = loadImage("snake.png")
  obstacle3 = loadImage("monkey.png")

  gameOverImg = loadImage("game_over.png")
  restartImg = loadImage("restart.png")

  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
}

function setup() {
  createCanvas(400,200)
  
  char = createSprite(25,170,20,50)
  char.addAnimation("running", char_running)
  char.scale = 0.15  
  char.setCollider("circle",0,0,120)
  char.addAnimation("collided",char_collided)
  char.debug = true
  forest = createSprite(300,100)
  forest.addImage("forest",forestImage)
  forest.scale = 0.1
  
  invisibleGround = createSprite(150,190,300,5)
  invisibleGround.visible = false

  gameOver = createSprite(200,100)
  gameOver.addImage(gameOverImg)

  restart = createSprite(200,140)
  restart.addImage(restartImg)

  gameOver.scale = 0.1
  restart.scale = 0.06

  obstaclesGroup = createGroup()
  
  obstaclesGroup = new Group()

  score = 0
}

function draw() {
  background(180)

  
 
  
  forest.velocityX = -1
  if(forest.x < 0){
    forest.x = 300
  }
  char.depth = forest.depth
  char.depth += 1
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    score = score + Math.round(getFrameRate()/60)

    if(keyDown("space") && char.y >= 150){
      jumpSound.play()
      char.velocityY = -16
      
    }
    char.velocityY = char.velocityY + 0.9

    char.collide(invisibleGround)

    if(obstaclesGroup.isTouching(char)){
      gameState = END
      dieSound.play()
    }
    
    
  }
  else if(gameState === END){
    gameOver.visible = true
    restart.visible = true

    char.changeAnimation("collided",char_collided)

    if(mousePressedOver(restart)){
      reset()
    }
    
    
    char.velocityY  = 0
    forest.velocityX = 0

    obstaclesGroup.setLifetimeEach(0)

    obstaclesGroup.setVelocityXEach(0)

    char.collide(invisibleGround)
  }
  
  
  
  
  
  
  
  spawnObstacles()
  drawSprites()
  stroke("gold")
  fill("green")
  text("Score: "+ score, 330,20)
}

function spawnObstacles(){
  if(frameCount % 80 === 0){
    var obstacle = createSprite(400,170,10,40)
    obstacle.velocityX = -4
    
    var rand = Math.round(random(1,3))
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
    }

    obstacle.scale = 0.09
    obstacle.lifetime = 150
    obstaclesGroup.add(obstacle)

  obstaclesGroup.depth = char.depth
  char.depth += 1
  }
}

function reset(){
  gameState = PLAY
  gameOver.visible = false
  restart.visible = false
  obstaclesGroup.destroyEach()
  char.changeAnimation("running",char_running)
  score = 0
}