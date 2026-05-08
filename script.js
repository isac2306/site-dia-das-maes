const audio = document.querySelector("#tributeAudio");
const musicStatus = document.querySelector("#musicStatus");
const musicCover = document.querySelector("#musicCover");
const letterButton = document.querySelector("#openLetter");
const letterText = document.querySelector("#letterText");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const closeLightbox = document.querySelector("#closeLightbox");
const surpriseScreen = document.querySelector("#surpresa");
const enterSite = document.querySelector("#enterSite");
const dragYes = document.querySelector("#dragYes");
const hiddenNo = document.querySelector("#hiddenNo");
const runawayYes = document.querySelector("#runawayYes");
const loveGame = document.querySelector("#loveGame");
const gameBoard = document.querySelector("#gameBoard");
const gameMessage = document.querySelector("#gameMessage");
const siteCelebration = document.querySelector("#siteCelebration");
const trashZone = document.querySelector("#trashZone");

document.body.classList.add("has-surprise");

enterSite.addEventListener("click", async () => {
  surpriseScreen.classList.add("is-hidden");
  document.body.classList.remove("has-surprise");
  document.querySelector("#musica").scrollIntoView({ behavior: "smooth" });
  await startTributeMusic("Tocando a musica da surpresa");
});

audio.addEventListener("ended", () => {
  musicCover.classList.remove("is-spinning");
  musicStatus.textContent = "Musica finalizada";
});

async function startTributeMusic(successMessage) {
  try {
    await audio.play();
    musicCover.classList.add("is-spinning");
    musicStatus.textContent = successMessage;
  } catch {
    musicStatus.textContent =
      "Coloque o MP3 em assets/musica/nao-quero-dinheiro.mp3 para tocar automaticamente.";
  }
}

document.querySelectorAll(".photo-card").forEach((card) => {
  const image = card.querySelector("img");

  image.addEventListener("error", () => {
    card.classList.add("is-empty");
    image.hidden = true;
  });

  card.addEventListener("click", () => {
    if (card.classList.contains("is-empty")) return;
    lightboxImage.src = card.dataset.full;
    lightbox.hidden = false;
  });
});

closeLightbox.addEventListener("click", () => {
  lightbox.hidden = true;
  lightboxImage.removeAttribute("src");
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.hidden = true;
    lightboxImage.removeAttribute("src");
  }
});

document.querySelectorAll(".dedication-card").forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("is-open");
  });
});

const dragState = {
  active: null,
  pointerId: null,
  startClientX: 0,
  startClientY: 0,
  startLeft: 0,
  startTop: 0,
};

dragYes.addEventListener("pointerdown", (event) => {
  startPaperDrag(event, dragYes);
});

runawayYes.addEventListener("pointerenter", explodeRunawayYes);
runawayYes.addEventListener("pointerdown", explodeRunawayYes);
runawayYes.addEventListener("click", explodeRunawayYes);

gameBoard.addEventListener("pointerleave", () => {
  if (!dragState.active) trashZone.classList.remove("is-ready");
});

document.addEventListener("pointermove", (event) => {
  if (!dragState.active || event.pointerId !== dragState.pointerId) return;

  movePaperBall(event);
  trashZone.classList.toggle("is-ready", isOverTrash(event.clientX, event.clientY));
});

document.addEventListener("pointerup", (event) => {
  if (!dragState.active || event.pointerId !== dragState.pointerId) return;

  if (isOverTrash(event.clientX, event.clientY)) {
    trashPaper(dragState.active);
  } else {
    gameMessage.textContent = "Quase. Leve a bolinha ate a lata de lixo.";
  }

  trashZone.classList.remove("is-ready");
  dragState.active = null;
  dragState.pointerId = null;
});

hiddenNo.addEventListener("click", () => {
  gameMessage.textContent = "Resposta certa: nao, nunca vai deixar de amar.";
  celebrateLove();
  celebrateWholeSite();
});

function startPaperDrag(event, button) {
  if (button.classList.contains("is-trashed")) return;
  event.preventDefault();

  const buttonBox = button.getBoundingClientRect();
  const boardBox = gameBoard.getBoundingClientRect();

  dragState.active = button;
  dragState.pointerId = event.pointerId;
  dragState.startClientX = event.clientX;
  dragState.startClientY = event.clientY;
  dragState.startLeft = buttonBox.left - boardBox.left;
  dragState.startTop = buttonBox.top - boardBox.top;

  moveIntoBoard(button);
  button.classList.add("is-paper");
  button.style.position = "absolute";
  button.style.left = `${dragState.startLeft}px`;
  button.style.top = `${dragState.startTop}px`;
  button.style.transform = "none";
  button.setPointerCapture(event.pointerId);

  gameMessage.textContent = "Boa. Agora jogue essa bolinha de papel na lata de lixo.";
}

function movePaperBall(event) {
  const button = dragState.active;
  const nextLeft = dragState.startLeft + event.clientX - dragState.startClientX;
  const nextTop = dragState.startTop + event.clientY - dragState.startClientY;
  const clamped = clampToBoard(nextLeft, nextTop, button);

  button.style.left = `${clamped.left}px`;
  button.style.top = `${clamped.top}px`;
}

function trashPaper(button) {
  const trashBox = trashZone.getBoundingClientRect();
  const boardBox = gameBoard.getBoundingClientRect();
  const targetLeft = trashBox.left - boardBox.left + trashBox.width / 2 - button.offsetWidth / 2;
  const targetTop = trashBox.top - boardBox.top + 76;

  button.style.left = `${targetLeft}px`;
  button.style.top = `${targetTop}px`;
  button.classList.add("is-paper", "is-trashed");
  trashZone.classList.add("is-eating");

  if (button === dragYes) {
    gameMessage.textContent = "A lata engoliu o sim falso. Agora o nao ficou livre.";
  } else {
    gameMessage.textContent = "Pegou o sim fujao e jogou no lixo. Muito melhor assim.";
  }

  window.setTimeout(() => {
    button.style.display = "none";
    trashZone.classList.remove("is-eating", "is-ready");
  }, 320);
}

function moveIntoBoard(button) {
  if (button.parentElement === gameBoard) return;
  gameBoard.appendChild(button);
}

function explodeRunawayYes(event) {
  if (runawayYes.classList.contains("is-exploded")) return;
  event.preventDefault();

  const buttonBox = runawayYes.getBoundingClientRect();
  const boardBox = gameBoard.getBoundingClientRect();
  const originX = buttonBox.left - boardBox.left + buttonBox.width / 2;
  const originY = buttonBox.top - boardBox.top + buttonBox.height / 2;

  runawayYes.classList.add("is-exploded");
  runawayYes.style.pointerEvents = "none";
  gameMessage.textContent = "Esse sim nao aguentou a verdade e explodiu.";

  for (let index = 0; index < 24; index += 1) {
    const shard = document.createElement("span");
    const angle = (Math.PI * 2 * index) / 24;
    const distance = 46 + Math.random() * 104;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    shard.className = "yes-shard";
    shard.textContent = index % 6 === 0 ? "Sim" : "";
    shard.style.left = `${originX}px`;
    shard.style.top = `${originY}px`;
    shard.style.setProperty("--x", `${x}px`);
    shard.style.setProperty("--y", `${y}px`);
    shard.style.setProperty("--r", `${Math.floor(Math.random() * 460 - 230)}deg`);
    shard.style.setProperty("--delay", `${Math.random() * 90}ms`);
    gameBoard.appendChild(shard);

    window.setTimeout(() => shard.remove(), 900);
  }
}

function clampToBoard(left, top, button) {
  const padding = 16;
  const maxLeft = gameBoard.clientWidth - button.offsetWidth - padding;
  const maxTop = gameBoard.clientHeight - button.offsetHeight - padding;

  return {
    left: Math.max(padding, Math.min(maxLeft, left)),
    top: Math.max(padding, Math.min(maxTop, top)),
  };
}

function isOverTrash(clientX, clientY) {
  const trashBox = trashZone.getBoundingClientRect();

  return (
    clientX >= trashBox.left &&
    clientX <= trashBox.right &&
    clientY >= trashBox.top &&
    clientY <= trashBox.bottom
  );
}

function celebrateLove() {
  loveGame.classList.add("is-celebrating");

  for (let index = 0; index < 26; index += 1) {
    const piece = document.createElement("span");
    const angle = (Math.PI * 2 * index) / 26;
    const distance = 70 + Math.random() * 140;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    piece.className = "celebration-piece";
    piece.textContent = index % 3 === 0 ? "\u2665" : "\u2022";
    piece.style.setProperty("--x", `${x}px`);
    piece.style.setProperty("--y", `${y}px`);
    piece.style.setProperty("--r", `${Math.floor(Math.random() * 220 - 110)}deg`);
    piece.style.color = index % 2 === 0 ? "var(--rose)" : "var(--gold)";
    loveGame.appendChild(piece);

    window.setTimeout(() => piece.remove(), 950);
  }

  window.setTimeout(() => loveGame.classList.remove("is-celebrating"), 1000);
}

function celebrateWholeSite() {
  const colors = ["#c94f6f", "#efb85a", "#ffffff", "#2f725b", "#f7a6b8"];

  siteCelebration.hidden = false;
  siteCelebration.querySelectorAll(".firework, .falling-heart").forEach((item) => item.remove());

  for (let index = 0; index < 10; index += 1) {
    const firework = document.createElement("span");
    firework.className = "firework";
    firework.style.setProperty("--left", `${10 + Math.random() * 80}%`);
    firework.style.setProperty("--top", `${10 + Math.random() * 52}%`);
    firework.style.setProperty("--delay", `${index * 120}ms`);
    firework.style.setProperty("--color", colors[index % colors.length]);
    siteCelebration.appendChild(firework);
  }

  for (let index = 0; index < 34; index += 1) {
    const heart = document.createElement("span");
    heart.className = "falling-heart";
    heart.textContent = index % 4 === 0 ? "\u2726" : "\u2665";
    heart.style.setProperty("--left", `${Math.random() * 100}%`);
    heart.style.setProperty("--delay", `${Math.random() * 900}ms`);
    heart.style.setProperty("--size", `${18 + Math.random() * 26}px`);
    heart.style.setProperty("--color", colors[index % colors.length]);
    siteCelebration.appendChild(heart);
  }

  window.setTimeout(() => {
    siteCelebration.hidden = true;
    siteCelebration.querySelectorAll(".firework, .falling-heart").forEach((item) => item.remove());
  }, 3900);
}

letterButton.addEventListener("click", () => {
  const isHidden = letterText.hidden;
  letterText.hidden = !isHidden;
  letterButton.textContent = isHidden ? "Fechar carta" : "Abrir carta";
});
