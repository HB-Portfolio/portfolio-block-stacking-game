const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");
context.font = "bold 30px sans-serif";
let scrollCounter, cameraY, current, mode, xSpeed;
const ySpeed = 5;
const height = 40;
const boxes = [
  {
    x: 150,
    y: 250,
    width: 100,
  },
];
let debris = {
  x: 0,
  width: 0,
};

const newBox = () => {
  boxes[current] = {
    x: 0,
    y: (current + 10) * height,
    width: boxes[current - 1].width,
  };
};

const gameOver = () => {
  mode = "gameOver";
  const messageElement = document.getElementById("message");
  messageElement.innerHTML =
    "GAME OVER! <br> CLICK, TAP OR PRESS SPACE TO RESTART!";
  messageElement.classList.remove("hidden");
};

const animate = () => {
  if (mode !== "gameOver") {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillText(`Score: ${current - 1}`, 140, 40);

    boxes.forEach((box, n) => {
      context.fillStyle = `rgb(${n * 16}, ${n * 16}, ${n * 16})`;
      context.fillRect(box.x, 600 - box.y + cameraY, box.width, height);
    });

    context.fillStyle = "green";
    context.fillRect(debris.x, 600 - debris.y + cameraY, debris.width, height);

    if (mode === "bounce") {
      boxes[current].x += xSpeed;
      if (xSpeed > 0 && boxes[current].x + boxes[current].width > canvas.width)
        xSpeed = -xSpeed;
      if (xSpeed < 0 && boxes[current].x < 0) xSpeed = -xSpeed;
    }

    if (mode === "fall") {
      boxes[current].y -= ySpeed;
      if (boxes[current].y === boxes[current - 1].y + height) {
        mode = "bounce";
        const difference = boxes[current].x - boxes[current - 1].x;
        if (Math.abs(difference) >= boxes[current].width) {
          gameOver();
        }
        debris = {
          y: boxes[current].y,
          width: difference,
        };
        if (boxes[current].x > boxes[current - 1].x) {
          boxes[current].width -= difference;
          debris.x = boxes[current].x + boxes[current].width;
        } else {
          debris.x = boxes[current].x - difference;
          boxes[current].width += difference;
          boxes[current].x = boxes[current - 1].x;
        }
        xSpeed = xSpeed > 0 ? xSpeed + 1 : xSpeed - 1;
        current++;
        scrollCounter = height;
        newBox();
      }
    }
    debris.y -= ySpeed;
    if (scrollCounter) {
      cameraY++;
      scrollCounter--;
    }
  }
  window.requestAnimationFrame(animate);
};

const restart = () => {
  boxes.splice(1, boxes.length - 1);
  mode = "bounce";
  cameraY = 0;
  scrollCounter = 0;
  xSpeed = 2;
  current = 1;
  newBox();
  debris.y = 0;
  const messageElement = document.getElementById("message");
  messageElement.innerHTML = "";
  messageElement.classList.add("hidden");
};

const handleClickOrSpacebar = () => {
  if (mode === "gameOver") {
    restart();
  } else if (mode === "bounce") {
    mode = "fall";
  }
};

canvas.onpointerdown = handleClickOrSpacebar;

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    handleClickOrSpacebar();
  }
});

restart();
animate();
