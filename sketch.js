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

// Load the model first

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
  bkarrow=loadImage('assets/back_arrow.png');
}


function setup() {
  createCanvas(windowWidth, windowHeight);
 
  // Create the video
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  flippedVideo = ml5.flipImage(video);
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
  learnmore = createA("about.html","learn more", "blank");
  learnmore.position(width/2-40,height/2);       
  learnmore.style ("font-family", "Ubuntu")
  learnmore.style ("color", "#ADD8E6")
  learnmore.style ("text-decoration", "none")


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


///////// SCREENS //////////
function splash() {
  ///code for splash screen
  learnmore.show();
  background(255);
  image (backgroundSplash,0,0, width,height);
 image (logo, width/2-75,height/4);
 
  //rect(0,0,width,height);
  noStroke();
  fill(255);
  //ellipse(width/2, height/2+150, 102, 102); 
  image (arrow,width/2-50,height/2+137);
  

  textAlign(CENTER);
  textSize(18);
  text ("This app uses Machine Learning technology to help you convert currency live.", width/2-100,height/2-100,211,100);

  


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
 
  image(bkarrow,20,20);
  image(logo,width/2-55,20);
  fill(0)
  rect(width/2-150,height/5,300,60,10);

}

function touchStarted() {

  var distance = dist(width/2-50,height/2+137, mouseX,mouseY);

  console.log(distance);
  if (distance <= 100 && screen == "splash") {
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