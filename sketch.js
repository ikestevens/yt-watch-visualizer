let watchData;
let dates = [];
let counts = [];
let maxCount;

let isHovering = false; // Track whether user has hovered

function preload() {
  watchData = loadJSON("condensed_watch_data.json");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  dates = Object.keys(watchData).sort((a, b) => new Date(a) - new Date(b));
  counts = dates.map(date => watchData[date]);
  maxCount = max(counts);
}

function draw() {
  background(255);
  drawLine();

  if (isHovering && mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    drawHover();
  }
}

function mouseMoved() {
  isHovering = true;
}

function drawLine() {
  let repetitions = 30;
  let spacing = 50;
  let waveSpeed = 0.01;
  let waveAmplitude = 35;

  stroke(0);
  strokeWeight(2);
  noFill();

  for (let r = -floor(repetitions / 2); r <= floor(repetitions / 2); r++) {
    let offset = r * spacing + sin(frameCount * waveSpeed + r) * waveAmplitude;

    beginShape();
    for (let i = 0; i < counts.length; i++) {
      let x = map(i, 0, counts.length - 1, 0, width);
      let baseY = map(counts[i], 0, maxCount, height - height / 4, height / 8);
      let y = baseY + offset;
      vertex(x, y);
    }
    endShape();
  }
}

function drawHover() {
  let index = int(map(mouseX, 0, width, 0, dates.length - 1));
  index = constrain(index, 0, dates.length - 1);

  let x = map(index, 0, counts.length - 1, 0, width);
  let y = map(counts[index], 0, maxCount, height - height / 4, height / 8);

  // Line and dot
  stroke(180, 0, 0);
  line(x, 0, x, height);
  noStroke();
  fill(180, 0, 0);
  ellipse(x, y, 6);

  // Text box
  let dateText = `Date: ${dates[index]}`;
  let countText = `Videos: ${counts[index]}`;
  textSize(12);
  let textW = max(textWidth(dateText), textWidth(countText)) + 10;
  let textH = 32;
  let labelYAbove = y - textH > 0;

  let boxX = x + 10;
  if (boxX + textW > width) {
    boxX = x - textW - 10;
  }
  let boxY = labelYAbove ? y - textH - 5 : y + 10;

  fill(255, 255, 255, 240);
  stroke(200);
  rect(boxX - 5, boxY - 5, textW, textH, 4);

  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  text(dateText, boxX, boxY);
  text(countText, boxX, boxY + 15);
}