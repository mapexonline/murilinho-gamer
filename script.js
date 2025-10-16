const width = 10;
const height = 20;
const board = document.getElementById("board");
const scoreDisplay = document.getElementById("score");
let cells = [];
let timerId;
let score = 0;

// Criar o tabuleiro
for (let i = 0; i < width * height; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  board.appendChild(cell);
  cells.push(cell);
}

// Linha base invisível (colisão inferior)
for (let i = 0; i < width; i++) {
  const cell = document.createElement("div");
  cell.classList.add("taken");
  board.appendChild(cell);
  cells.push(cell);
}

// Tetrominos
const lTetromino = [
  [1, width + 1, width * 2 + 1, 2],
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2],
];

const zTetromino = [
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
];

const tTetromino = [
  [1, width, width + 1, width + 2],
  [1, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, width * 2 + 1],
  [1, width, width + 1, width * 2 + 1],
];

const oTetromino = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
];

const iTetromino = [
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
];

const colors = ["#ff4e50", "#ffcc00", "#4cd964", "#5ac8fa", "#ff2d55"];
const tetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

let currentPosition = 4;
let currentRotation = 0;
let random = Math.floor(Math.random() * tetrominos.length);
let current = tetrominos[random][currentRotation];
let color = colors[random];

// Desenhar e remover
function draw() {
  current.forEach(index => {
    cells[currentPosition + index].classList.add("filled");
    cells[currentPosition + index].style.backgroundColor = color;
  });
}

function undraw() {
  current.forEach(index => {
    cells[currentPosition + index].classList.remove("filled");
    cells[currentPosition + index].style.backgroundColor = "";
  });
}

// Movimentos
function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

function moveLeft() {
  undraw();
  const atLeftEdge = current.some(index => (currentPosition + index) % width === 0);
  if (!atLeftEdge) currentPosition -= 1;
  if (current.some(index => cells[currentPosition + index].classList.contains("taken"))) {
    currentPosition += 1;
  }
  draw();
}

function moveRight() {
  undraw();
  const atRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
  if (!atRightEdge) currentPosition += 1;
  if (current.some(index => cells[currentPosition + index].classList.contains("taken"))) {
    currentPosition -= 1;
  }
  draw();
}

function rotate() {
  undraw();
  currentRotation++;
  if (currentRotation === current.length) currentRotation = 0;
  current = tetrominos[random][currentRotation];
  draw();
}

function freeze() {
  if (current.some(index => cells[currentPosition + index + width].classList.contains("taken"))) {
    current.forEach(index => cells[currentPosition + index].classList.add("taken"));
    random = Math.floor(Math.random() * tetrominos.length);
    current = tetrominos[random][0];
    color = colors[random];
    currentPosition = 4;
    draw();
    addScore();
    gameOver();
  }
}

function drop() {
  moveDown();
}

function addScore() {
  for (let i = 0; i < 199; i += width) {
    const row = [...Array(width).keys()].map(x => i + x);
    if (row.every(index => cells[index].classList.contains("taken"))) {
      score += 10;
      scoreDisplay.innerText = "Pontuação: " + score;
      row.forEach(index => {
        cells[index].classList.remove("taken", "filled");
        cells[index].style.backgroundColor = "";
      });
      const removed = cells.splice(i, width);
      cells = removed.concat(cells);
      cells.forEach(cell => board.appendChild(cell));
    }
  }
}

function gameOver() {
  if (current.some(index => cells[currentPosition + index].classList.contains("taken"))) {
    scoreDisplay.innerHTML = "💀 Fim de jogo! Pontos: " + score;
    clearInterval(timerId);
  }
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") moveLeft();
  else if (e.key === "ArrowRight") moveRight();
  else if (e.key === "ArrowDown") moveDown();
  else if (e.key === "ArrowUp") rotate();
});

draw();
timerId = setInterval(moveDown, 700);
