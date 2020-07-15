// UI Variables
var screen = "splash";
var tapX, tapY;
// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/Svk4a1iJp/';
var backgroundSplash;
var arrow;
var logo;
var carousel;

let state = "found";


// Video
let video;
let flippedVideo;
// To store the classification
let label = "";

// show conversion
var rate = "";
var currency = "euro";
var confidence = 0;
var threshold = 0.89;

// Load the model first

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  splashSetup();      
}

function draw() {

  tapX = mouseX;
  tapY = mouseY;
  if (screen == "splash") {
    //showme the screen splah
    splash();
  }
  if (screen == "main") {
    //showme the screen main
    main();
   
  }

}

function splashSetup() {
  backgroundSplash = loadImage('Assets/Background.png');
  arrow = loadImage('Assets/arrow-circle.png');
  logo = loadImage('Assets/logo.png'); 
}

///////// SCREENS //////////
function splash() {
  ///code for splash screen
  
  background(255);
  image (backgroundSplash,0,0, width,height);
  image (logo, width/2-75,height/4);
  //rect(0,0,width,height);
  noStroke();
  fill(255);
  //ellipse(width/2, height/2+150, 102, 102); 
  image (arrow,width/2-50,height/2+137);
  
  textFont('Ubuntu');
  textAlign(CENTER);
  textSize(18);
  text ("This app uses Machine Learning technology to help you convert currency live.", width/2-100,height/2-100,211,100);
}

function mainSetup() {
  // Create the video
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  flippedVideo = ml5.flipImage(video);
  // Start classifying
  classifyVideo();
  //radio buttons
  // radio = createRadio();
  // radio.option('euro');
  // radio.option('dollar');
  // radio.style('width', '60px');
  carousel = new Carousel();
  carousel.setup();
}

function main() {

  // Draw the video
  image(flippedVideo, 0, 0, width, height);

  // Draw the label
  noFill();
  textSize(16);
  textAlign(CENTER);
  text(rate, width / 2, height - 4);

  // currency = radio.value();
  fill(200);
  rect(0, 0, width, 50);

  //carousel draw
  carousel.display();
}

function touchStarted() {
  var distance = dist(width/2-50,height/2+137, mouseX,mouseY);

  if(screen == "splash"){
    if (distance <= 100) {
      mainSetup();
      screen = "main";
    }
  }
  if(screen== "main"){ 
    //back button click
    if (tapY <= 50) {
      screen = "splash";
    }
    //drag cards
    carousel.touchStarted();
  }
}

function touchEnded (){
  if(screen== "main"){ 
  carousel.touchEnded();
  }
}

function touchMoved (){
  if(screen== "main"){ 
  carousel.touchMoved();
  }
}

class Carousel {
  constructor(){ 
    this.cards = [] ;
    this.swipe = false;
    this.directions = [-1,1];
    this.direction;
    this.selected = 1;
    this.prevSelected;
    this.prevX;
    this.swiping = false;
    this.cardsNum = 4;
    this.cardWidth = width/3;
    this.cardHeight = this.cardWidth/2;
    this.cardMargin = this.cardWidth/3;
    this.step = this.cardWidth + this.cardMargin;
  }

  setup() {
    for(var i = 0; i < this.cardsNum; i++){
      this.cards.push(new Card(i, i * (this.cardWidth + this.cardMargin) - (this.cardWidth/2 - this.cardMargin/2), height - height/5, this.cardWidth, this.cardHeight, this.cardMargin));
    } 
  }

  display() {
    push();
    background(225,0,0);
    for(var i = 0; i < this.cardsNum; i++){
      this.cards[i].display();
    }
    // let dist;
    // if(this.swiping){
    //   console.log("swiping");
    //   dist = abs(this.prevX - mouseX)/10;
    //   if(dist > this.cardWidth + this.cardMargin/2){
    //     return;
    //   }
    //   for(var i = 0; i < this.cardsNum; i++){
    //     this.cards[i].move(this.direction,dist,true);
    //   }
    // }
    if(this.swipe){
      for(var i = 0; i < this.cardsNum; i++){
        this.cards[i].move(this.direction, this.step,false);
      }
    }
    pop();
  }

  touchStarted(){
    this.prevX = mouseX;

  }
  touchEnded(){
    this.swiping = false;
  }

  touchMoved(){
    this.swiping = true;
    var thres = abs(this.prevX - mouseX);

    if(thres > width/6){
      if(this.prevX-mouseX>0){
        this.direction = -1;
      }else{
        this.direction = 1;
      }
      this.selected -= this.direction;
      if(this.selected <0 || this.selected > this.cardsNum - 1){
        this.selected = this.prevSelected
      }else{
        this.swipe = true;
        this.prevSelected = this.selected;
        this.prevX = mouseX;
      }
      console.log( this.cards[this.selected].id);
    }
  }
} 

class Card {

  constructor(id,posX, posY,width,height,margin) {
    this.id = id;
    this.x = posX;
    this.y = posY;
    this.w = width;
    this.h = height;
    this.m = margin;
    this.rounded = 25;
    this.fontSize = 50;
    this.conv = 1000;
    this.currency = "$$$"
    switch(id){
      case 0:
        this.currency = "USD";
        break;
      case 1:
        this.currency = "EUR";
         break;
      case 2:
        this.currency = "YEN";
         break;
      case 3:
        this.currency = "PESOS";
         break;
    }  
  }
  
  display(){
    push();
    noStroke();
    textStyle(BOLD);
    textAlign(CENTER);
    if(carousel.selected == this.id && carousel.swiping == false){
      // draw mode: selected found card

      if(state == "found"){
        // currency
        fill(255,120);
        rect(this.x - this.m/2,this.y - this.m/4 + this.h/4,this.w + this.m,this.h + this.m/2,this.rounded);
        fill(20);
        textSize(this.fontSize + 10);
        text(this.currency,this.x+this.w/2,this.y+this.h*1.1);
        // shadow
        fill(0,15);
        rect(this.x - this.m/2,this.y-this.h/1.2,this.w + this.m,this.h*1.5,this.rounded);
        //rate
        fill(255);
        rect(this.x - this.m/2,this.y-this.h/1.1,this.w + this.m,this.h*1.5,this.rounded);
        fill(0);
        textSize(this.fontSize * 2);
        text(this.conv,this.x+this.w/2,this.y + this.fontSize/10);
      } else {
        // draw mode: selected default card
        fill(255,120);
        rect(this.x - this.m/2,this.y - this.m/4 ,this.w + this.m,this.h + this.m/2,this.rounded);
        fill(20);
        textAlign(CENTER);
        textSize(this.fontSize + 10);
        text(this.currency,this.x+this.w/2,this.y+this.h/1.6);
      }

    } else {
      // draw mode: default card
      fill(255,120);
      rect(this.x,this.y,this.w,this.h,this.rounded);

      fill(20);
      textAlign(CENTER);
      textSize(this.fontSize);
      text(this.currency,this.x+this.w/2,this.y+this.h/1.6);
    }
    pop(); 
  }

  move(dir, step){
    // if(swiping = true && dir>this.w + this.m){
    //   dir = 0;
    // }
    this.x += dir * step;
    carousel.swipe = false;
  }
}


/////// ML5 //////

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
  flippedVideo.remove();

}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
  confidence = results[0].confidence;

  if (confidence > threshold) {
    if (label == 'Argentina' && currency == "euro") {
      rate = argToEuro(20);
    }
    if (label == 'Argentina' && currency == "dollar") {
      rate = argToDollar(20);
    }
    if (label == 'Indonesia' && currency == "euro") {
      rate = rupiahToEuro(50000);
    }
    if (label == 'Indonesia' && currency == "dollar") {
      rate = rupiahToDollar(50000);
    }
    if (label == 'Canada' && currency == "euro") {
      rate = canadaToEuro(20);
    }
    if (label == 'Canada' && currency == "dollar") {
      rate = canadaToDollar(20);
    }

  } else {
    rate = "I'm not sure... 😔";
  }

  // Classifiy again!
  classifyVideo();
}







function rupiahToEuro(amount) {
  var value = amount * 0.000062;
  console.log(value + " €");
  return value;
}

function rupiahToDollar(amount) {
  var value = amount * 0.000070;
  console.log(value + " $");
  return value;
}

function argToEuro(amount) {
  var value = amount * 0.013;
  //console.log(value +" €");
  return value + " €";
}

function argToDollar(amount) {
  var value = amount * 0.014;
  //console.log(value +" $");
  return value + " $";
}

function canadaToEuro(amount) {
  var value = amount * 0.66;
  //console.log(value +" €");
  return value + " €";
}

function canadaToDollar(amount) {
  var value = amount * 0.74;
  //console.log(value +" $");
  return value + " $";
}