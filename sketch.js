let bgImg;
let orangeImg;

let cols = 4;
let rows = 3;

let orangeW = 170;
let orangeH = 170;

let oranges = [];

let gravity = 0.8;
let bounce = -0.6;
let groundY;

let firstClick = true; // 第一次点击标记

// =============================
// 预加载图片
// =============================
function preload() {
  bgImg = loadImage("assets/market_img.png");
  orangeImg = loadImage("assets/orange.png");
}

// =============================
// 初始化
// =============================
function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  groundY = height - orangeH / 2;

  createOrangeGrid();
}

// =============================
// 创建橘子网格（根据屏幕自适应）
// =============================
function createOrangeGrid() {
  oranges = [];

  let spacingX = width / (cols + 1);
  let spacingY = height / (rows + 1);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let x = spacingX * (c + 1);
      let y = spacingY * (r + 1);

      oranges.push({
        x: x,
        y: y,
        vy: 0,
        falling: false,
      });
    }
  }
}

// =============================
// 主循环
// =============================
function draw() {
  drawBackgroundCover(bgImg);

  for (let o of oranges) {
    // 物理运动
    if (o.falling) {
      o.vy += gravity;
      o.y += o.vy;

      if (o.y >= groundY) {
        o.y = groundY;
        o.vy *= bounce;

        // 小速度停止
        if (abs(o.vy) < 1) {
          o.vy = 0;
          o.falling = false;
        }
      }
    }

    image(orangeImg, o.x, o.y, orangeW, orangeH);
  }
}

// =============================
// 背景 cover 填满屏幕（保持比例）
// =============================
function drawBackgroundCover(img) {
  let imgRatio = img.width / img.height;
  let canvasRatio = width / height;

  let drawW, drawH;

  if (imgRatio > canvasRatio) {
    drawH = height;
    drawW = height * imgRatio;
  } else {
    drawW = width;
    drawH = width / imgRatio;
  }

  image(img, width / 2, height / 2, drawW, drawH);
}

// =============================
// 点击事件
// =============================
function mousePressed() {
  let clickedOnOrange = false;

  for (let o of oranges) {
    let d = dist(mouseX, mouseY, o.x, o.y);
    if (d < orangeW / 2) {
      o.falling = true;
      o.vy = 0;
      clickedOnOrange = true; // 点击到橘子
    }
  }

  // 如果没有点击到橘子，并且是触摸设备第一次点击 → 进入全屏
  if (!clickedOnOrange && firstClick && isTouchDevice()) {
    fullscreen(true);
    firstClick = false;
  }
}

// =============================
// 简单判断是否触摸设备
// =============================
function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

// =============================
// 屏幕尺寸变化（平板旋转）
// =============================
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  groundY = height - orangeH / 2;
  createOrangeGrid();
}
