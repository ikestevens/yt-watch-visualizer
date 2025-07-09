let watchData;
let dates = [];
let counts = [];
let maxCount;

let isHovering = false;
let isMobile = false;
let tapX = 0;
let tapY = 0;

function preload() {
  watchData = loadJSON("condensed_watch_data.json");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  isMobile = /iPhone|iPad|Android|Mobile/.test(navigator.userAgent);

  dates = Object.keys(watchData).sort((a, b) => new Date(a) - new Date(b));
  counts = dates.map(date => watchData[date]);
  maxCount = max(counts);
}

function draw() {
  background(255);
  drawLine();

  if (isHovering) {
    drawHover(isMobile ? tapX : mouseX);
  }
}

function mouseMoved() {
  if (!isMobile) isHovering = true;
}

function touchStarted() {
    if (isMobile) {
      tapX = mouseX;
      isHovering = true;
    }
    return false;
  }
  
  function touchMoved() {
    if (isMobile) {
      tapX = mouseX;
    }
    return false;
  }

function drawLine() {
  let repetitions = isMobile ? 25 : 30;
  let spacing = isMobile ? 175 : 50;
  let waveSpeed = isMobile ? 0.0075 : 0.01;
  let waveAmplitude = isMobile ? 200 : 35;

  stroke(0);
  strokeWeight(isMobile ? 3 : 2);
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

function drawHover(xPos) {
    if (counts.length === 0 || xPos < 0 || xPos > width) return;
  
    let index = int(map(xPos, 0, width, 0, dates.length - 1));
    index = constrain(index, 0, dates.length - 1);
  
    let x = map(index, 0, counts.length - 1, 0, width);
    let y = map(counts[index], 0, maxCount, height - height / 4, height / 8);
  
    // Line and dot
    stroke(180, 0, 0);
    line(x, 0, x, height);
    noStroke();
    fill(180, 0, 0);
    ellipse(x, y, isMobile ? 14 : 6);
  
    // Text box
    let dateText = `Date: ${dates[index]}`;
    let countText = `Videos: ${counts[index]}`;
  
    let fontSize = isMobile ? 40 : 12;
    textSize(fontSize);
  
    let textW = max(textWidth(dateText), textWidth(countText)) + 20;
    let textH = isMobile ? fontSize * 2.8 : 32;
    let labelYAbove = y - textH > 0;
  
    let boxX = x + 10;
    if (boxX + textW > width) {
      boxX = x - textW - 10;
    }
    let boxY = labelYAbove ? y - textH - 5 : y + 10;
  
    fill(255, 255, 255, 240);
    stroke(200);
    rect(boxX - 5, boxY - 5, textW, textH, 6);
  
    fill(0);
    noStroke();
    textAlign(LEFT, TOP);
    text(dateText, boxX, boxY);
    text(countText, boxX, boxY + fontSize + 2);
  }