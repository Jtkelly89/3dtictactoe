const LAYER_OFFSETS = ["34vmin", "0vmin", "-34vmin"]; // top, middle, bottom
const SIZE = 3;

const state = LAYER_OFFSETS.map(() =>
  Array.from({ length: SIZE }, () => Array(SIZE).fill(""))
);

const stackEl = document.getElementById("stack");

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
