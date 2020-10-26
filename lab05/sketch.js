var size = 700

function setup() {
  createCanvas(size, size);
  background(220);
  
  let s = '"C" to set lines "R" to reset';
  text(s, 10, 10, 90, 80);
}

var Line = [];
var Obj = [];
let lines = false;

function Point(x, y) {
  this.x = x;
  this.y = y;
}

function mouseClicked() {
  noStroke();
  if (mouseX < size && mouseY < size) {
    if (lines) {
      if (Line.length == 0) {
        fill(0, 0, 0);
        rect(mouseX, mouseY, 2, 2);
        Line.push(new Point(mouseX, mouseY));
      } else {
        fill(255, 0, 0);
        rect(mouseX, mouseY, 2, 2);
        Line.push(new Point(mouseX, mouseY));
        drawLine(Line[0].x, Line[0].y, Line[1].x, Line[1].y, color(0, 0, 0));

        clipping();

        Line = [];
      }
    } else {
      fill(0, 0, 0);
      rect(mouseX, mouseY, 2, 2);
      Obj.push(new Point(mouseX, mouseY));
      if (Obj.length > 1) {
        prev = new Point(Obj[Obj.length - 2].x, Obj[Obj.length - 2].y);
        curr = new Point(Obj[Obj.length - 1].x, Obj[Obj.length - 1].y);
        drawLine(prev.x, prev.y, curr.x, curr.y, color(0, 0, 0));
      }
    }
  }
}

function keyPressed() {
  if (key == 'c' || key == 'с') {
    if (Obj.length > 2) {
      first = new Point(Obj[0].x, Obj[0].y);
      last = new Point(Obj[Obj.length - 1].x, Obj[Obj.length - 1].y);
      drawLine(first.x, first.y, last.x, last.y, color(0, 0, 0));

      lines = true;
    }
  }

  if (key === 'r' || key === 'к') {
    background(220);
    fill(0, 0, 0);
    let s = '"C" to set lines "R" to reset';
    text(s, 10, 10, 90, 80);
    lines = false;
    Line = [];
    Obj = [];
  }
}

function drawLine(x0, y0, x1, y1, c) {
  var dx = Math.abs(x1 - x0);
  var dy = Math.abs(y1 - y0);
  var sx = (x0 < x1) ? 1 : -1;
  var sy = (y0 < y1) ? 1 : -1;
  var err = dx - dy;

  while (true) {
    if (Math.abs(x0 - x1) < 0.0001 && Math.abs(y0 - y1) < 0.0001)
      break;
    var e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }

    fill(c);
    rect(x0, y0, 2, 2);
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
    return false; //точка Xa находится вне пересечения проекций отрезков на ось X 
  } else {
    return [Xa, Ya];
  }
  return false;
}

function clipping() {
  let p1 = [Line[0].x, Line[0].y];
  let p2 = [Line[1].x, Line[1].y];
  if (p2[0] < p1[0]) {
    tmp = p1;
    p1 = p2;
    p2 = tmp;
  }

  let p3, p4;
  let Coards = [];
  for (let i = 0; i < Obj.length; i++) {
    p3 = [Obj[i].x, Obj[i].y];

    let j = i + 1;
    if (j == Obj.length) {
      j = 0;
    }

    p4 = [Obj[j].x, Obj[j].y];

    if (p4[0] < p3[0]) {
      tmp = p3;
      p3 = p4;
      p4 = tmp;
    }

    res = check(p1, p2, p3, p4);
    if (res) {
      Coards.push(res);
    }
  }
  if (Coards.length == 2) {
    x0 = floor(Coards[0][0]);
    y0 = floor(Coards[0][1]);
    x1 = floor(Coards[1][0]);
    y1 = floor(Coards[1][1]);
    drawLine(x0, y0, x1, y1, color(255, 0, 0));
  }
}