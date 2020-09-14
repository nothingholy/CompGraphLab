let img;
let temp = [];
let reset;
let blackwhite;
let invert;

function preload() {
  img = loadImage('https://bootyass.github.io/Files/Photos/Papug.jpeg');
}

function drawImg() {
  image(img, 50, 50);
}



function setup() {
  createCanvas(500, 500);

  background(255);

  img.resize(width - 100, height - 100)

  drawImg();

  for (let i = 0; i < img.width; i++) {
    temp[i] = [];
    for (let j = 0; j < img.height; j++) {
      temp[i][j] = img.get(i, j);
    }
  }


  reset = createButton('Reset');
  reset.size(width / 3, 50);
  reset.mousePressed(Reset);

  blackwhite = createButton('Black&White');
  blackwhite.size(width / 3, 50);
  blackwhite.mousePressed(BlackWhite);

  invert = createButton('Invert');
  invert.size(width / 3, 50);
  invert.mousePressed(Invert);

}

function Reset() {
  clear();
  background(255);
  
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      img.set(i, j, temp[i][j] );
    }
  }

  img.updatePixels();
  drawImg();
}


function BlackWhite() {
  clear();
  background(255);

  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      img.set(i, j, (temp[i][j][0] + temp[i][j][1] + temp[i][j][2]) / 3);
    }
  }

  img.updatePixels();
  drawImg();
}


function Invert() {
  clear();
  background(0);

  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      img.set(i, j, color(255-temp[i][j][0] , 255-temp[i][j][1] , 255-temp[i][j][2]) );
    }
  }

  img.updatePixels();
  drawImg();
}