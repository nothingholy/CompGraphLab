let size = 600,
  offset = -5;

let pX, pY, start;

let flag = false;


function setup() {
  createCanvas(size, size);
  background(255);
  let s = '"S" to switch modes "R" to reset';
  text(s, 10, 10, 110, 80);
}


function mousePressed() {
  if (!flag) {
    background(255);
  }
}

function mouseReleased() {
  if (!flag) {
    start = pX = pY = null;
  }
}

function draw() {
  if (mouseIsPressed && !flag) {
    stroke(0, 0, 0);
    strokeWeight(3);
    if (pX && pY) {
      line(pX, pY, mouseX + offset, mouseY + offset);
    }

    pX = mouseX + offset;
    pY = mouseY + offset;
    if (!start) {
      start = [pX, pY];
    }
  }

}


function compareFirst(temp) {
  let res = true;
  if (temp[0] != 255 || temp[1] != 0 || temp[2] != 0) {
    res = false;
  }

  return res;
}

function compareSecond(temp) {
  let res = true;
  if (temp[0] != 0 || temp[1] != 0 || temp[2] != 0) {
    res = false;
  }

  return res;
}

function filling(begin) {
  let stack = new Stack();
  stack.push(begin);

  while (!stack.empty()) {
    P = stack.pop();

    x = P[0];
    y = P[1];

    xMin = x;
    while (!compareSecond(get(xMin - 1, y))) {
      xMin--;
    }
    xMax = x;
    while (!compareSecond(get(xMax + 1, y))) {
      xMax++;
    }

    fill(255, 0, 0);
    noStroke();
    for (let i = xMin; i <= xMax; i++) {
      rect(i, y, 1, 1);
    }

    let flag = true;
    for (i = xMin; i < xMax; i++) {
      let temp = get(i, y - 1);
      if (!compareSecond(temp) && !compareFirst(temp)) {
        if (flag) {
          stack.push([i, y - 1]);
          flag = false;
        }
      } else {
        flag = true;
      }
    }

    flag = true;
    for (let i = xMin; i < xMax; i++) {
      let temp = get(i, y + 1);
      if (!compareSecond(temp) && !compareFirst(temp)) {
        if (flag) {
          stack.push([i, y + 1]);
          flag = false;
        }
      } else {
        flag = true;
      }
    }
  }
}


function mouseClicked() {
  if (flag) {
    begin = [floor(mouseX + offset), floor(mouseY + offset)];
    filling(begin);
  }
}


function keyPressed() {
  if (key === 'r' || key === 'к') {
    background(255);
    fig = true;
  }
  if (key === 's' || key === 'ы') {
    flag = !flag;
  }
}