let dots = [];
var size = 750;

var V = [],
  E = [];

var obj = 0;

var angle = 0;

var c, a;

var rotating = false;

function setup() {
  createCanvas(size, size);
 
  drawx = createButton('Pyramid');
  drawx.size(width / 3, 50);
  drawx.mousePressed(pyramid);

  rotatex = createButton('Rotate');
  rotatex.size(width / 3, 50);
  rotatex.mousePressed(rotatee);

  resetx = createButton('Reset');
  resetx.size(width / 3, 50);
  resetx.mousePressed(reset);
}

function reset() {
  V = [];
  E = [];
  background(255);
}

function rotatee() {
  rotating = !rotating;
}

function verticies() {
  let minX = 0,
    minY = 0;
  let maxX = 0,
    maxY = 0;
  for (let v of V) {
    if (v[0] < minX) {
      minX = v[0];
    }
    if (v[1] < minY) {
      minY = v[1];
    }
    if (v[0] > maxX) {
      maxX = v[0];
    }
    if (v[1] > maxY) {
      maxY = v[1];
    }
  }

  // примерное центрирование (я запутался)
  let dX = maxX - minX;
  let dY = maxY - minY;
  let Gap = max(dX, dY);
  let k = size / Gap;

  for (let v of V) {
    // смещение к (0; 0)
    v[0] += -minX;
    v[1] += -minY;

    // заполнение 90% по макс оси
    v[0] *= ceil(k * 0.8);
    v[1] *= ceil(k * 0.8);

    v[0] += size * obj;
    v[1] += (size - dY * k) / 2;
  }

  for (let v of V) {
    v[0] += random(-20, 20);
    v[1] += random(-20, 20);
    
    v[1] = size - v[1] - 100;
  }

  r = random(100, 170);
  g = random(100, 170);
  b = random(100, 170);

  angle = 0;
  draw();
}

let dark = [10.0, 20.0, 30.0, 0.0, 1, 1, 1, 1, 0.13];

function draw() {
  background(255);

  if (rotating) {
    angle += 0.03;
    dark[8] = 25 / 100;
    for (let i = 0; i < dark.length - 5; i++) {
      dark[i] += dark[i + 4] * dark[8];
      if (dark[i] > 35.0 || dark[i] < 0.0) {
        dark[i + 4] *= -1;
      }
    }
  }

  let index = 0;
  for (let e of E) {
    for (let i = 0; i < e.length; i++) {
      dots.push([V[e[i] - 1][0], V[e[i] - 1][1]]);
    }

    fillPoly(index);
    index += 1;
    dots = [];

    strokeWeight(2);
    stroke(0, 0, 0);
    for (let i = 0; i < e.length - 1; i++) {
      line(V[e[i] - 1][0], V[e[i] - 1][1], V[e[i + 1] - 1][0], V[e[i + 1] - 1][1]);
    }
    line(V[e[0] - 1][0], V[e[0] - 1][1], V[e[e.length - 1] - 1][0], V[e[e.length - 1] - 1][1]);
  }

}


function fillPoly(i) {
  let aa = cos(angle);
  stroke(r - dark[i] * 4, g - dark[i] * 4, b - dark[i] * 4);

  let Y = [];
  for (let dot of dots) {
    Y.push(dot[1]);
  }
  yMin = min(Y);
  yMax = max(Y);

  for (let y = yMin + 1; y < yMax - 1; y++) {
    let inter = [];
    for (let i = 0; i < dots.length; i++) {
      let p3 = dots[i];
      let p4;
      if (i == dots.length - 1) {
        p4 = dots[0];
      } else {
        p4 = dots[i + 1];
      }

      if (p4[0] < p3[0]) {
        tmp = p3;
        p3 = p4;
        p4 = tmp;
      }

      let temp = check(p3, p4, [0, y], [size, y]);
      if (temp) {
        inter.push(temp[0]); // x пересечения
      }
    }

    inter.sort(function(a, b) {
      return a - b;
    });


    if (inter.length % 2 == 0 && inter.length > 0) {
      for (let i = 0; i < inter.length; i += 2) {

        strokeWeight(3)
        line(inter[i], y, inter[i + 1], y);
      }
    }
  }
}

function check(p1, p2, p3, p4) {
  // конец первого отрезка находится левее начала правого отрезка
  if (p2[0] < p3[0]) {
    return false;
  }

  //если оба отрезка вертикальные
  if ((p1[0] - p2[0] == 0) && (p3[0] - p4[0] == 0)) {

    //если они лежат на одном X
    if (p1[0] == p3[0]) {

      //они НЕ пересекаются
      if (((max(p1[1], p2[1]) < min(p3[1], p4[1])) || (min(p1[1], p2[1]) > max(p3[1], p4[1])))) {
        return false;
      }
    }
  }

  //если первый отрезок вертикальный
  if (p1[0] - p2[0] == 0) {

    //найдём Xa, Ya - точки пересечения двух прямых
    Xa = p1[0];
    A2 = (p3[1] - p4[1]) / (p3[0] - p4[0]);
    b2 = p3[1] - A2 * p3[0];
    Ya = A2 * Xa + b2;

    if (p3[0] <= Xa && p4[0] >= Xa && min(p1[1], p2[1]) <= Ya && max(p1[1], p2[1]) >= Ya) {
      return [Xa, Ya];
    }

    return false;
  }

  //если второй отрезок вертикальный
  if (p3[0] - p4[0] == 0) {

    //найдём Xa, Ya - точки пересечения двух прямых
    Xa = p3[0];
    A1 = (p1[1] - p2[1]) / (p1[0] - p2[0]);
    b1 = p1[1] - A1 * p1[0];
    Ya = A1 * Xa + b1;

    if (p1[0] <= Xa && p2[0] >= Xa && min(p3[1], p4[1]) <= Ya && max(p3[1], p4[1]) >= Ya) {
      return [Xa, Ya];
    }

    return false;
  }

  //оба отрезка невертикальные
  A1 = (p1[1] - p2[1]) / (p1[0] - p2[0]);
  A2 = (p3[1] - p4[1]) / (p3[0] - p4[0]);
  b1 = p1[1] - A1 * p1[0];
  b2 = p3[1] - A2 * p3[0];

  if (A1 == A2) {
    return false; //отрезки параллельны
  }

  //Xa - абсцисса точки пересечения двух прямых
  Xa = (b2 - b1) / (A1 - A2);
  Ya = A1 * Xa + b1;

  if ((Xa < max(p1[0], p3[0])) || (Xa > min(p2[0], p4[0]))) {
    //точка Xa находится вне пересечения проекций отрезков на ось X 
    return false;
  } else {
    return [Xa, Ya];
  }
  return false;
}