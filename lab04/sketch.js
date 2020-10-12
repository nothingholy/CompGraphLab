let img;
let temp = [];
let reset;
let blackwhite;
let invert;

function preload() {
  img = loadImage('https://bootyass.github.io/Files/Photos/8C3BBA4C-5756-4ED4-9D62-C4E9D0691E6E.jpeg');
}

function drawImg() {
  image(img, 50, 50);
}



function setup() {
  createCanvas(500, 500);

  background(255);

  img.resize(width - 100, height - 100);

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

  sobel = createButton('Sobel')
  sobel.size(width / 3, 50);
  sobel.mousePressed(Sobel);
  
  reset.position(0, 500);
  blackwhite.position(width / 3, 500);
  invert.position((width / 3) * 2, 500);
  sobel.position(width / 3, 550);
}

function Reset() {
  clear();
  background(255);

  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      img.set(i, j, temp[i][j]);
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
      img.set(i, j, color(255 - temp[i][j][0], 255 - temp[i][j][1], 255 - temp[i][j][2]));
    }
  }

  img.updatePixels();
  drawImg();
}

Gx = [
  [-1, -2, -1],
  [0, 0, 0],
  [1, 2, 1]
];

Gy = [
  [-1, 0, 1],
  [-2, 0, 2],
  [-1, 0, 1]
];

function Sobel() {
  //clear();
  //background(255);

  for (let x = 1; x < img.width - 1; x++) {
    for (let y = 1; y < img.height - 1; y++) {
      X = 0;
      Y = 0;

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          xtem = x + i - 1;
          ytem = y + j - 1;
          graycolor = (temp[xtem][ytem][0] + temp[xtem][ytem][1] + temp[xtem][ytem][2]) / 3;
          X += graycolor * Gx[i][j];
          Y += graycolor * Gy[i][j];
        }
      }

      G = sqrt(sq(X) + sq(Y));
      img.set(x, y, color(G, G, G));
    }
  }
  img.updatePixels();
  drawImg();
}