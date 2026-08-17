const LAYER_OFFSETS = ["22vmin", "0vmin", "-22vmin"]; // top, middle, bottom - evenly spaced either side of center
const SIZE = 3;

const state = LAYER_OFFSETS.map(() =>
  Array.from({ length: SIZE }, () => Array(SIZE).fill(""))
);

const LINES = generateLines(SIZE);
let winsVisible = false;

const stackEl = document.getElementById("stack");
const revealBtn = document.getElementById("revealBtn");

function generateLines(n) {
  const lines = [];
  const deltas = [-1, 0, 1];
  for (const dx of deltas) {
    for (const dy of deltas) {
      for (const dz of deltas) {
        if (dx === 0 && dy === 0 && dz === 0) continue;
        // Only take one direction per axis of symmetry, so each line is counted once.
        const firstNonZero = dx !== 0 ? dx : dy !== 0 ? dy : dz;
        if (firstNonZero < 0) continue;

        for (let x = 0; x < n; x++) {
          for (let y = 0; y < n; y++) {
            for (let z = 0; z < n; z++) {
              const endX = x + dx * (n - 1);
              const endY = y + dy * (n - 1);
              const endZ = z + dz * (n - 1);
              if (endX < 0 || endX >= n || endY < 0 || endY >= n || endZ < 0 || endZ >= n) {
                continue;
              }
              const line = [];
              for (let k = 0; k < n; k++) {
                line.push([x + dx * k, y + dy * k, z + dz * k]);
              }
              lines.push(line);
            }
          }
        }
      }
    }
  }
  return lines;
}

function findWinningCells() {
  const winners = new Set();
  for (const line of LINES) {
    const values = line.map(([l, r, c]) => state[l][r][c]);
    if (values[0] && values.every((v) => v === values[0])) {
      line.forEach(([l, r, c]) => winners.add(`${l}-${r}-${c}`));
    }
  }
  return winners;
}

function applyWinHighlights() {
  const winners = winsVisible ? findWinningCells() : new Set();
  document.querySelectorAll(".cell").forEach((cell) => {
    const key = `${cell.dataset.layer}-${cell.dataset.row}-${cell.dataset.col}`;
    cell.classList.toggle("win", winners.has(key));
  });
  revealBtn.textContent = winsVisible ? "Hide winning lines" : "Show winning lines";
  revealBtn.classList.toggle("active", winsVisible);
}

revealBtn.addEventListener("click", () => {
  winsVisible = !winsVisible;
  applyWinHighlights();
});

LAYER_OFFSETS.forEach((offset, layerIndex) => {
  const layer = document.createElement("div");
  layer.className = "layer";
  layer.style.transform = `translateZ(${offset})`;
  layer.style.zIndex = String(LAYER_OFFSETS.length - layerIndex);

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.layer = layerIndex;
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", onCellClick);
      layer.appendChild(cell);
    }
  }

  stackEl.appendChild(layer);
});

function onCellClick(e) {
  const { layer, row, col } = e.currentTarget.dataset;
  const l = Number(layer), r = Number(row), c = Number(col);
  const current = state[l][r][c];
  const next = current === "" ? "X" : current === "X" ? "O" : "";
  state[l][r][c] = next;
  render(l, r, c);
  if (winsVisible) {
    winsVisible = false;
    applyWinHighlights();
  }
}

function render(l, r, c) {
  const cell = document.querySelector(
    `.cell[data-layer="${l}"][data-row="${r}"][data-col="${c}"]`
  );
  const value = state[l][r][c];
  cell.innerHTML = "";
  if (value) {
    const mark = document.createElement("span");
    mark.className = `mark mark-${value}`;
    mark.textContent = value;
    cell.appendChild(mark);
  }
}
