//declare all the variables
var harry, harryImg, harryleftImg, harryrightImg;
var snitch, snitch_flying;
var ground, groundImg, sky, skyImg;
var gryffindor, gryffindorImg, slytherin, slytherinImg;
var hufflepuff, hufflepuffImg, ravenclaw, ravenclawImg;
var broom, broomImg;
var bludger, bludgerImg;
var snitchGroup, bludgerGroup, broomGroup;
var score, restart, restartImg, gameOver, gameOverImg;
var snitchSound, bludgerSound,quidditchSound;
var PLAY = 1;
var END = 0;
var gameState = PLAY;

function preload(){
  //load all images, sounds and animations here
  
  harryImg = loadImage("harry.png");
  harryleftImg = loadImage("harryleft.png");
  harryrightImg = loadImage("harryright.png");
  
  snitch_flying = loadAnimation("snitch1.png","snitch2.png","snitch3.png","snitch4.png");
  
  groundImg = loadImage("ground.png");
  skyImg = loadImage("sky.png");
  
  gameOverImg = loadImage("gameover.png");
  restartImg = loadImage("restart.png");
  
  gryffindorImg = loadImage("gryffindortower.png");
  slytherinImg = loadImage("slytherintower.png");
  hufflepuffImg = loadImage("hufflepufftower.png");
  ravenclawImg = loadImage("ravenclawtower.png");

  broomImg = loadImage("broom.png");
  bludgerImg = loadImage("bludger.png");
  
  snitchSound = loadSound("Snitch_collect.mp3");
  bludgerSound = loadSound("Bludger_touch.mp3");
  quidditchSound = loadSound("Quidditch_match.m4a");
}

function setup() {
  
  createCanvas(windowWidth,windowHeight);
  
  //create sky and assign velocity to it
  sky = createSprite(windowWidth/2,windowHeight/2,windowWidth,windowHeight);
  sky.addImage(skyImg);
  sky.scale = 3.5;
  sky.velocityY = 2;
  
  //create the towers for all four houses
  gryffindor = createSprite(300,windowHeight-290,100,600);
  gryffindor.addImage(gryffindorImg);
  gryffindor.scale = 1.5;
  //gryffindor.velocityY = 2;
  //gryffindor.lifetime = 250;
  
  slytherin = createSprite(windowWidth-300,windowHeight-290,100,600);
  slytherin.addImage(slytherinImg);
  slytherin.scale = 1.5;
  //slytherin.velocityY = 2;
  //slytherin.lifetime = 250;  
  
  hufflepuff = createSprite(windowWidth-600,windowHeight-270,100,600);
  hufflepuff.addImage(hufflepuffImg);
  hufflepuff.scale = 1.5;
  //hufflepuff.velocityY = 2;
  //hufflepuff.lifetime = 250;
  
  ravenclaw = createSprite(600,windowHeight-290,100,600);
  ravenclaw.addImage(ravenclawImg);
  ravenclaw.scale = 1.5;
  //ravenclaw.velocityY = 2;
  //ravenclaw.lifetime = 250;
  
  //create the character Harry
  harry = createSprite(windowWidth/2,windowHeight-135,40,100);
  harry.addImage(harryImg);
  harry.scale = 0.25;
  
  //create a ground
  ground = createSprite(windowWidth/2,windowHeight-150,windowWidth,10);
  ground.addImage(groundImg);
  ground.scale = 1.35;
  //ground.velocityY = 2;
  //ground.lifetime = 200;

  //create an invisible ground
  invisibleGround = createSprite(windowWidth/2,windowHeight-65,windowWidth,10);
  invisibleGround.visible = false;
  //invisibleGround.velocityY = 2;
  //invisibleGround.lifetime = 200;
  
  //create a restart button
  restart = createSprite(windowWidth/2,windowHeight/2,40,40);
  restart.addImage(restartImg);
  restart.scale = 0.1;
  restart.visible = false;
  //restart.debug = true;
  restart.setCollider("circle",0,0,250);
  
  //show game over via a sprite
  gameOver = createSprite(windowWidth/2,(windowHeight/2)-60,100,50);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;

  //create groups
  broomGroup = new Group();
  snitchGroup = new Group();
  bludgerGroup = new Group();
  
  //initialize score to 0
  score = 0;  
  
}

function draw() {

  background(255);
  
  if(gameState === PLAY){   
    
    //play quidditch sound throughout play gameState
    if(!quidditchSound.isPlaying()){
    quidditchSound.play();
    quidditchSound.setVolume(0.5);
    quidditchSound.loop();
    }
    
    //assign velocity to the towers and grounds
    gryffindor.velocityY = 2;
    //gryffindor.lifetime = 250;
    slytherin.velocityY = 2;
    //slytherin.lifetime = 250;
    hufflepuff.velocityY = 2;
    //hufflepuff.lifetime = 250;
    ravenclaw.velocityY = 2;
    //ravenclaw.lifetime = 250;
    ground.velocityY = 2;
    //ground.lifetime = 200;
    invisibleGround.velocityY = 2;
    //invisibleGround.lifetime = 200;
    
    //infinitely scrolling sky
    if(sky.y>windowHeight){
      sky.y = sky.height/2;
    }
  
    //harry jumps when up key pressed
    if(keyDown("UP_ARROW")){
      harry.velocityY = -10;
    }
    
  //add gravity
  harry.velocityY =  harry.velocityY + 0.6;
    
    //harry moves to left when left key pressed  
    if(keyDown("LEFT_ARROW")){
      harry.velocityX = -5;
      harry.addImage(harryleftImg);
    }
    else{
      harry.velocityX = 0; 
      harry.addImage(harryImg);
    }
  
    //harry moves to right when right key pressed
    if(keyDown("RIGHT_ARROW")){
      harry.velocityX = 5;
      harry.addImage(harryrightImg);
    }
  
    //if harry collects the golden snitch, increase score and play sound
    if(snitchGroup.isTouching(harry)){
      snitchGroup.destroyEach();
      score = score + 50;
      snitchSound.play();
    }

    //if harry touches a bludger or falls out of the canvas, game's over and play sound 
    if(bludgerGroup.isTouching(harry) || harry.y>windowHeight){
      harry.visible = false;
      gameState = END;
      bludgerSound.play();
    }
  
    //functions to spawn broom, snitch and bludger
    spawnBroom();
    spawnSnitch();
    spawnBludger();
  
    //harry should collide with the brooms and the invisible ground
    harry.collide(broomGroup);
    harry.collide(invisibleGround);
    
    }
  
  else if(gameState === END){
    
    //stop the quidditch sound
    quidditchSound.stop();
    
    //sky stops moving
    sky.velocityY = 0;
    
    //all the groups stop spawning
    snitchGroup.destroyEach();
    broomGroup.destroyEach();
    bludgerGroup.destroyEach();
    
    //all the towers disappear
    gryffindor.visible = false;
    slytherin.visible = false;
    hufflepuff.visible = false;
    ravenclaw.visible = false;
    
    //ground.visible = false;
    
    //gameOver and restart button appear
    gameOver.visible = true;
    restart.visible = true;
  }
  
  //reset function called when mouse pressed over restart button
  if(mousePressedOver(restart) && gameState===END){
    reset();
  }
  
  createEdgeSprites();
  
 drawSprites();
  
  //display score
  fill(0);
  stroke(0);
  textSize(24);
  text("Score: "+score,windowWidth-120,40);
}

function spawnBroom(){
  if(frameCount%100===0){
    x = Math.round(random(50,windowWidth-50))
    var broom = createSprite(x,10,50,10);
    broom.addImage(broomImg);
    broom.scale = 0.25;
    broom.velocityY = 2;
    broom.lifetime = 350;
    //broom.debug = true;
    broom.setCollider("rectangle",0,0,1100,40);
    broom.depth = harry.depth
    harry.depth += 1;
    broomGroup.add(broom);
  }
}

function spawnSnitch(){
  if(frameCount%250===0){
    a = Math.round(random(50,windowWidth-50))
    var snitch = createSprite(a,10,20,20);
    snitch.addAnimation("flying",snitch_flying);
    snitch.scale = 0.1;
    snitch.velocityY = Math.round(random(-1,4));
    snitch.velocityX = Math.round(random(-4,4));
    snitch.lifetime = 500;
    //snitch.debug = true;
    snitch.setCollider("rectangle",0,0,800,120);
    snitchGroup.add(snitch);
  }
}

function spawnBludger(){
  if(frameCount%200===0){
    b= Math.round(random(50,windowWidth-50))
    var bludger = createSprite(b,10,40,40);
    bludger.addImage(bludgerImg);
    bludger.scale = 0.25;
    bludger.velocityX = Math.round(random(-4,4));
    bludger.velocityY = Math.round(random(-1,4));
    bludger.lifetime = 350;
    bludgerGroup.add(bludger);
    //bludger.debug = true;
    bludger.setCollider("circle",0,0,100);
    bludgerGroup.add(bludger);
  }
}

function reset(){
  gameState = PLAY; 
  
  score = 0;
  
  gameOver.visible = false;
  restart.visible = false;
  
  sky.velocityY = 2;
  
  gryffindor.x = 300;
  gryffindor.y = windowHeight-290;
  gryffindor.visible = true;
  
  slytherin.x = windowWidth-300;
  slytherin.y = windowHeight-290;
  slytherin.visible = true;
  
  hufflepuff.x = windowWidth-600;
  hufflepuff.y = windowHeight-270;
  hufflepuff.visible = true;  
  
  ravenclaw.x = 600;
  ravenclaw.y = windowHeight-290;
  ravenclaw.visible = true;
  
  harry.visible = true;
  harry.x = windowWidth/2;
  harry.y = windowHeight-135;
  
  ground.x = windowWidth/2;
  ground.y = windowHeight-150;
  ground.visible = true;
  
  invisibleGround.x = windowWidth/2;
  invisibleGround.y = windowHeight-65;
 
} 