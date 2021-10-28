var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;
var trex, trex_correndo, trexColidindo;
var solo, soloInvisivel, imagemSolo;
var nuvem, imagemNuvem, grupoNuvens;
var somMorte, somCheck, somJump;

var obstaculos, grupoObstaculos;
var obstaculos1, obstaculos2, obstaculos3, obstaculos4, obstaculos5, obstaculos6; 

var pontuacao;

var fimDeJogo, imgFimDeJogo;
var reiniciar, imgReiniciar;


function preload(){

  trex_correndo =  loadAnimation("trex1.png","trex3.png","trex4.png");
  imagemSolo = loadImage("ground2.png");
  imagemNuvem = loadImage("cloud.png");
  trexColidindo = loadImage ("trex_collided.png")
  
  obstaculos1 = loadImage("obstacle1.png");
  obstaculos2 = loadImage("obstacle2.png");
  obstaculos3 = loadImage("obstacle3.png");
  obstaculos4 = loadImage("obstacle4.png");
  obstaculos5 = loadImage("obstacle5.png");
  obstaculos6 = loadImage("obstacle6.png");
  
  imgFimDeJogo = loadImage("gameOver.png");
  imgReiniciar = loadImage("restart.png");
  
  somMorte = loadSound("die.mp3");
  somCheck = loadSound("checkPoint.mp3");
  somJump = loadSound("jump.mp3");
}

function setup() {
  
 createCanvas(windowWidth, windowHeight);

  //criar um sprite do trex
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("colide", trexColidindo);
  trex.scale = 0.5;

  //criar um sprite do solo
  solo = createSprite(width/2,height/2,400,20);
  solo.addImage(imagemSolo);
  solo.x = solo.width /2;
    
  //solo invisível
  soloInvisivel = createSprite(200,height/2+10,650,20)
  soloInvisivel.visible = false
  
  //criar grupos
  grupoNuvens = createGroup();
  grupoObstaculos = createGroup();
  
  fimDeJogo = createSprite (width/2,height/2-100);
  fimDeJogo.addImage(imgFimDeJogo);
  
  reiniciar = createSprite (width/2,height/2-60);
  reiniciar.addImage(imgReiniciar);
  reiniciar.scale = 0.6
    
  trex.setCollider("circle",0,0,40);
  trex.debug = false;
  
  pontuacao = 0;
}

function draw() {
  background("plum");
  
  text("Pontuação: " + pontuacao,width-100,30);
  
  if (estadoJogo === JOGAR){
    solo.velocityX = -(4 + pontuacao /100);
    
    fimDeJogo.visible = false;
    reiniciar.visible = false;
    
    pontuacao = pontuacao + Math.round(getFrameRate()/60);
    
    if (pontuacao % 600 == 0 && pontuacao > 0){
      somCheck.play();
    }
    
    if (solo.x<0){
      solo.x = solo.width/2;
    }

    //o trex pula quando a tecla espaço é acionada 
    if(touches.length > 0 ||  keyDown("space") && trex.y >= height/2-70) {
      trex.velocityY = -10;
      somJump.play();
      touches = [];
    }
  
    //gravidade
    trex.velocityY = trex.velocityY + 0.8

    if (grupoObstaculos.isTouching(trex)){
      //trex.velocityY = -10;
      //somJump.play();
      estadoJogo = ENCERRAR;
      somMorte.play();
      trex.changeAnimation("colide", trexColidindo);
    }
    
    //funções
    gerarNuvens();
  
    gerarObstaculos();
    
  }
    else if (estadoJogo === ENCERRAR){
      
      //parar os objetos
      solo.velocityX = 0;
      grupoObstaculos.setVelocityXEach(0);
      grupoNuvens.setVelocityXEach(0);
      trex.velocityY = 0;
      
      //impedir que os objetos desapareçam
      grupoObstaculos.setLifetimeEach(-1);
      grupoNuvens.setLifetimeEach(-1);
      
      //mudar a animação
      
      fimDeJogo.visible = true;
      reiniciar.visible = true;
      
    if (touches.length > 0 || mousePressedOver(reiniciar)){
      reset();
      touches = [];
    }
      
    }
   
  //impedir o trex de cair 
  trex.collide(soloInvisivel);
    
  drawSprites();
}

function reset(){
  estadoJogo = JOGAR;
  grupoObstaculos.destroyEach();
  grupoNuvens.destroyEach();
  trex.changeAnimation("running", trex_correndo);
  pontuacao = 0;
}

function gerarObstaculos(){
  if(frameCount % 60 === 0){
    obstaculos = createSprite(width,height/2-10,10,40);
    obstaculos.velocityX = -(4 + pontuacao /100);
    obstaculos.lifetime = 600;
    obstaculos.scale = 0.5;

    var aleatorio = Math.round(random(1,6));
    switch(aleatorio) {
      case 1: obstaculos.addImage(obstaculos1);
            break;
      case 2: obstaculos.addImage(obstaculos2);
            break;
      case 3: obstaculos.addImage(obstaculos3);
            break;
      case 4: obstaculos.addImage(obstaculos4);
            break;
      case 5: obstaculos.addImage(obstaculos5);
            break;
      case 6: obstaculos.addImage(obstaculos6);
            break;
        default: break;
    }
    
    //adicionar os obstaculos ao grupo de obstaculos
    grupoObstaculos.add(obstaculos);
  }
}

function gerarNuvens(){    
  if (frameCount % 60 === 0){
    nuvem = createSprite(width,100,40,10);
    nuvem.addImage(imagemNuvem);
    nuvem.velocityX = -(2 + pontuacao /1000);
    nuvem.y = Math.round(random(10,height/4));
    nuvem.lifetime = 600;
    
    //profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionar as nuvens ao grupo de nuvens
    grupoNuvens.add(nuvem);
       
  }
}
