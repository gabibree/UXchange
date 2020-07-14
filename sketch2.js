var backgroundSplash;
var logo;

function setup() {
    createCanvas(windowWidth, windowHeight);
    backgroundSplash = loadImage('Assets/Background.png');
    logo = loadImage('Assets/logo.png');
  }
  
  function draw() {
    image (backgroundSplash,0,0, width,height);
    image (logo, width-500, 100);
    textSize(100);
    text('ABOUT',0,400)
    rectMode(CENTER);
    textAlign(LEFT);
    fill(255);
  textSize(50);
  text ("The interaction design masters students at IED bring to you an easy to use currency converter app, generated by machine learning. The product was coded by students to read, analyse and learn as they put it to work. Machine learning uses access to data to use and learn for themselves. Using Javascript and machine learning we have put up together an application to enable currency recognition and conversion", width/2,height/2, width-300, 1000);

  
  }
  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }