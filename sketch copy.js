var totalImg = 40;
var imgs = [];
var index;
var im;
var ind =0;
function setup() {
  createCanvas(400, 400);

   for ( var i = 0 ; i < totalImg; i ++){
      index = i+13;
      imgs [i] = loadImage ("/logo/logo-a_000"+index+".png");
  }
  console.log (imgs.length);
}

function draw() {
  background(0);
  image (imgs[ind],0,0);
}


setInterval(function(){
  if(ind<39){
    ind++;
  }
},100)
