var balloon,balloonImage1,balloonImage2;
var database;
var height;

function preload(){
   bg =loadImage("assets/bg.png");
   balloonImage1=loadAnimation("assets/balloon1.png");
   balloonImage2=loadAnimation("assets/balloon1.png","assets/balloon1.png",
   "assets/balloon1.png","assets/balloon2.png","assets/balloon2.png",
   "assets/balloon2.png","assets/balloon3.png","assets/balloon3.png","assets/balloon3.png");
   obstacle1=loadImage("assets/obsTop1.png");
   obstacle2=loadImage("assets/obsTop2.png");
  }

//Function to set initial environment
function setup() {

   database=firebase.database();

  createCanvas(1500,700);

  ground=createSprite(20,700,3000,0.1);
  //ground.visible=false;

  balloon=createSprite(250,650,150,150);
  balloon.addAnimation("hotAirBalloon",balloonImage1);
  balloon.scale=0.5;

  balloon.setCollider("rectangle",0,0,balloon.width,balloon.height);
  balloon.debug = true

  var balloonHeight=database.ref('balloon/height');
  balloonHeight.on("value",readHeight, showError);

  obstaclesGroup = createGroup();

  textSize(20); 
}

// function to display UI

function draw() {
  background(bg);

  if(keyDown(LEFT_ARROW)){
    updateHeight(-10,0);
    balloon.addAnimation("hotAirBalloon",balloonImage2);
  }
  else if(keyDown(RIGHT_ARROW)){
    updateHeight(10,0);
    balloon.addAnimation("hotAirBalloon",balloonImage2);
  }
  else if(keyDown(UP_ARROW)){
    updateHeight(0,-10);
    balloon.addAnimation("hotAirBalloon",balloonImage2);
    balloon.scale=balloon.scale -0.005;
  }
  else if(keyDown(DOWN_ARROW)){
    updateHeight(0,+10);
    balloon.addAnimation("hotAirBalloon",balloonImage2);
    balloon.scale=balloon.scale+0.005;
  }

  
  spawnObstacles();
  balloon.collide(ground);

  drawSprites();
  fill(0);
  stroke("white");
  textSize(25);
  text("**Use arrow keys to move Hot Air Balloon!",40,40);

}

 function updateHeight(x,y){
   database.ref('balloon/height').set({
     'x': height.x + x ,
     'y': height.y + y
   })
 }


//CHOOSE THE CORRECT READHEIGHT FUNCTION
// function readHeight(data){
//   balloon.x = height.x;
//   balloon.y = height.y;
// }

 function readHeight(data){
   height = data.val();
   balloon.x = height.x;
   balloon.y = height.y;
 }

// function readHeight(data){
//   height = data.val();
// }

// function readHeight(){
//   height = val();
//   balloon.x = height.x;
//   balloon.y = height.y;
// }

function showError(){
  console.log("Error in writing to the database");
}

function spawnObstacles(){
  if (frameCount % 250 === 0){
    var obstacle = createSprite(1300,random(100,350),10,40);
    obstacle.velocityX = -6;
    
     //generate random obstacles
     var rand = Math.round(random(1,2));
     switch(rand) {
       case 1: obstacle.addImage(obstacle1);
               break;
       case 2: obstacle.addImage(obstacle2);
               break;
       default: break;
     }
    
     //assign scale and lifetime to the obstacle           
     obstacle.scale = 0.1;
     obstacle.lifetime = 300;
    
    //add each obstacle to the group
     obstaclesGroup.add(obstacle);
  }
 }