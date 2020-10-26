var size = 600;

function setup() {
  createCanvas(size, size);
}

var points = [];
let flag = false;

function draw() {
  if (!flag) {
    background(255);
  }

  stroke(0, 0, 0);
  strokeWeight(3);

  drawLines();
  drawLine();

}

function keyPressed(){
  if (key == 'c' || key == 'с') {
    background(255);
    if (points.length > 2) {
      drawLastLine();
      filling();
      flag = true;
      drawLines();
    }
  }

  if (key === 'r' || key === 'к') {
    background(255);
    points = [];
    flag = false;
  }
}

function drawLines() {
  for (let i = 0; i < points.length - 1; i++) {
    line(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1]);
  }
  if (flag) {
    drawLastLine();
  }
}

function drawLastLine() {
  if (points.length > 2) {
    let last = points[points.length - 1],
      first = points[0];
    line(first[0], first[1], last[0], last[1]);
  }
}

function drawLine() {
  if (points.length > 0 && !flag) {
    let last = points[points.length - 1];
    line(last[0], last[1], mouseX, mouseY);
  }
}


function mouseClicked() {
  if (mouseX < size && mouseX > 0 && mouseY < size && mouseY > 0 && !flag) {
    points.push([mouseX, mouseY]);
  }
}

function touchEnded() {
  if (mouseX < size && mouseX > 0 && mouseY < size && mouseY > 0 && !flag) {
    points.push([mouseX, mouseY]);
  }
}

function filling() {
  let Y = [];
  for (let point of points) {
    Y.push(point[1]);
  }
  yMin = min(Y);
  yMax = max(Y);

  for (let y = yMin + 1; y < yMax - 1; y++) {
    let ai = [];
    for (let i = 0; i < points.length; i++) {
      let p3 = points[i];
      let p4;
      if (i == points.length - 1) {
        p4 = points[0];
      } else {
        p4 = points[i + 1];
      }

      if (p4[0] < p3[0]) {
        tmp = p3;
        p3 = p4;
        p4 = tmp;
      }

      let temp = check(p3, p4, [0, y], [size, y]);
      if (temp) {
        ai.push(temp[0]);
      }
    }

    ai.sort(function(a, b) {
      return a - b;
    });


    if (ai.length % 2 == 0 && ai.length > 0) {
      for (let i = 0; i < ai.length; i += 2) {
        stroke(255, 0, 0);
        line(ai[i], y, ai[i + 1], y);
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