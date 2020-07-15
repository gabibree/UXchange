// UI Variables
var screen = "main";
var tapX, tapY;
// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/Svk4a1iJp/';
var backgroundSplash;
var arrow;
var logo;
var logoheader;


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
var d = 0;

//splash vars
var learnmore;
//main vars
var bkarrow;
var frame;

// Load the model first

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
  bkarrow=loadImage('assets/back_arrow.png');
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1)
  // Create the video
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();
  push();
  flippedVideo = ml5.flipImage(video);
  pop();
  // Start classifying
  classifyVideo();
  //radio buttons
  radio = createRadio();
  radio.option('euro');
  radio.option('dollar');
  radio.style('width', '60px');
  
  backgroundSplash = loadImage('Assets/Background.png');
  arrow = loadImage('Assets/arrow-circle.png');
  logo = loadImage('Assets/logo.png');
  logoheader = loadImage('Assets/logo-header.png');
  frame = loadImage('Assets/frame_marks.png');
  learnmore = createA("about.html","learn more", "blank");
  learnmore.position(width/2-width/10,height/2);       
  learnmore.style ("font-family", "Ubuntu")
  learnmore.style ("color", "#D8AC3D")
  learnmore.style ("font-size", "45px")
  learnmore.style ("text-decoration", "none")
  learnmore.hide();



}

function draw() {

  tapX = mouseX;
  tapY = mouseY;
  if (screen == "loader") {
    //showme the screen splah
    loader();
    setTimeout (function(){
      screen='splash';
    }, 3000)
  }
  if (screen == "splash") {
    //showme the screen splah
    splash();
  }

  if (screen == "main") {
    //showme the screen main
    main();
   
  }

}


///////// SCREENS //////////
function splash() {
  ///code for splash screen
  learnmore.show();
  background(255);
  image (backgroundSplash,0,0, width,height);
  image (logo, width/2-width/5,height/6);
 
  //rect(0,0,width,height);
  noStroke();
  fill(255);
  //ellipse(width/2, height/2+150, 102, 102); 
  image (arrow,width/2-width/10,height/2+height/4);
  

  textAlign(CENTER);
  textSize(45);
  text ("This app uses Machine Learning technology to help you convert currency live.", width/2-width/3.5,height/2-height/10,600,500);

  


}

function main() {
  /// code for splash screen
  learnmore.hide();

  // Draw the video
  image(flippedVideo, 0, 0, width, height);

  // Draw the label
  noFill();
  textSize(16);
  textAlign(CENTER);
  text(rate, width / 2, height - 4);

  currency = radio.value();
 
  image(bkarrow,40,100,75,75);
  image(logoheader,width/2-width/6,100,310,64);
  
  fill(0)
  rect(width/2-width/2.5,height/8,width/2+width/3.25,125,10);
  fill(255);
  textSize(40);
  text ("Show me the money", width/2-width/2.5,height/8+40,500,500);
  image (frame, 30, height/2-200,width-30,450);
  

}
function loader() {
  console.log('im loading')
  image (backgroundSplash,0,0,width,height);
  text ("lalalala",width/2,height/2);
}
function touchStarted() {

  var distance = dist(width/2-width/10,height/2+height/4, mouseX,mouseY);

  console.log(distance);
  if (distance <= 200 && screen == "splash") {
    screen = "main";
  }

  if (mouseX < 50 && mouseY<= 50 && screen == "main") {
    screen = "splash";
  }

}
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}