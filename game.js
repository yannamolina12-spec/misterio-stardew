// ================================================================
// EL MISTERIO DE LA MANSIÓN VALDEZ
// Juego interactivo de misterio — pixel art estilo Stardew Valley
// Versión móvil con controles táctiles
// ================================================================

// ---------- ELEMENTOS DEL DOM ----------
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const startScreen   = document.getElementById('start-screen');
const startBtn      = document.getElementById('start-btn');
const muteBtn       = document.getElementById('mute-btn');
const dialogBox     = document.getElementById('dialog-box');
const dialogText    = document.getElementById('dialog-text');
const puzzleOverlay = document.getElementById('puzzle-overlay');
const puzzleContent = document.getElementById('puzzle-content');
const locationEl    = document.getElementById('location');
const inventoryEl   = document.getElementById('inventory');
const endScreen     = document.getElementById('end-screen');
const endText       = document.getElementById('end-text');
const touchControls = document.getElementById('touch-controls');
const actionBtn     = document.getElementById('action-btn');

// ---------- ESTADO ----------
const game = {
  state: 'menu',            // menu | playing | dialog | puzzle | end
  currentRoom: 'entrada',
  inventory: [],
  flags: {
    notaLeida: false,
    llaveEncontrada: false,
    bibliotecaAbierta: false,
    librosLeidos: 0,
    relojMirado: false,
    estudioAbierto: false,
    cuadroMirado: false,
    escritorioMirado: false,
    culpableDescubierto: false
  }
};

const player = {
  x: 320, y: 380,
  w: 24, h: 32,
  speed: 2.2,
  dir: 'up',
  frame: 0,
  frameTimer: 0,
  moving: false
};

// Dirección activa (tanto teclado como táctil)
const input = {
  up: false, down: false, left: false, right: false
};

// ---------- HABITACIONES ----------
const rooms = {
  entrada: {
    name: 'Entrada de la Mansión',
    floor: '#8B5A2B',
    wall: '#4a2f1a',
    objects: [
      { id: 'mesa',      x: 260, y: 110, w: 80, h: 46, label: 'Mesa con nota',        draw: drawTable,  action: 'readNote' },
      { id: 'alfombra',  x: 420, y: 340, w: 90, h: 60, label: 'Alfombra persa',       draw: drawRug,    action: 'searchRug' },
      { id: 'maceta',    x: 70,  y: 110, w: 40, h: 60, label: 'Maceta',               draw: drawPot,    action: 'lookPot' },
      { id: 'puertaBib', x: 580, y: 190, w: 40, h: 80, label: 'Puerta a biblioteca',  draw: drawDoor,   action: 'goLibrary' }
    ],
    playerStart: { x: 320, y: 380, dir: 'up' }
  },
  biblioteca: {
    name: 'Biblioteca',
    floor: '#5a3a1a',
    wall: '#3a1f0a',
    objects: [
      { id: 'libro1',    x: 100, y: 110, w: 46, h: 70, label: 'Libro rojo',           draw: drawBook,   action: 'readBook1' },
      { id: 'libro2',    x: 200, y: 110, w: 46, h: 70, label: 'Libro azul',           draw: drawBook,   action: 'readBook2' },
      { id: 'libro3',    x: 300, y: 110, w: 46, h: 70, label: 'Libro verde',          draw: drawBook,   action: 'readBook3' },
      { id: 'reloj',     x: 440, y: 100, w: 70, h: 90, label: 'Reloj antiguo',        draw: drawClock,  action: 'lookClock' },
      { id: 'puertaEst', x: 580, y: 190, w: 40, h: 80, label: 'Puerta al estudio',    draw: drawDoor,   action: 'goStudy' },
      { id: 'puertaEnt', x: 20,  y: 190, w: 40, h: 80, label: 'Volver a la entrada',  draw: drawDoor,   action: 'goEntrance' }
    ],
    playerStart: { x: 80, y: 280, dir: 'right' }
  },
  estudio: {
    name: 'Estudio del Sr. Valdez',
    floor: '#3a2a1a',
    wall: '#2a1a0a',
    objects: [
      { id: 'cuadro',    x: 220, y: 90,  w: 90, h: 70, label: 'Cuadro antiguo',       draw: drawPainting, action: 'lookPainting' },
      { id: 'cajafuerte',x: 400, y: 120, w: 80, h: 70, label: 'Caja fuerte',          draw: drawSafe,   action: 'openSafe' },
      { id: 'escritorio',x: 140, y: 310, w: 120, h: 70,label: 'Escritorio',           draw: drawDesk,   action: 'searchDesk' },
      { id: 'puertaBib2',x: 20,  y: 190, w: 40, h: 80, label: 'Volver a biblioteca',  draw: drawDoor,   action: 'goLibrary' }
    ],
    playerStart: { x: 80, y: 280, dir: 'right' }
  }
};

// ================================================================
// DIBUJAR OBJETOS (pixel art)
// ================================================================
function drawTable(o) {
  ctx.fillStyle = '#4a2f1a'; ctx.fillRect(o.x, o.y, o.w, 12);
  ctx.fillStyle = '#7a4a20';
  ctx.fillRect(o.x + 6, o.y + 12, 6, o.h - 12);
  ctx.fillRect(o.x + o.w - 12, o.y + 12, 6, o.h - 12);
  ctx.fillStyle = '#f5f0dc'; ctx.fillRect(o.x + 30, o.y - 4, 30, 14);
  ctx.fillStyle = '#222';
  ctx.fillRect(o.x + 33, o.y - 1, 24, 2);
  ctx.fillRect(o.x + 33, o.y + 3, 18, 2);
  ctx.fillRect(o.x + 33, o.y + 7, 22, 2);
}

function drawRug(o) {
  ctx.fillStyle = '#8b2c2c'; ctx.fillRect(o.x, o.y, o.w, o.h);
  ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 2;
  ctx.strokeRect(o.x + 5, o.y + 5, o.w - 10, o.h - 10);
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(o.x + o.w / 2 - 5, o.y + o.h / 2 - 5, 10, 10);
  ctx.fillStyle = '#d4af37';
  for (let i = 0; i < o.w; i += 8) {
    ctx.fillRect(o.x + i, o.y - 3, 4, 3);
    ctx.fillRect(o.x + i, o.y + o.h, 4, 3);
  }
}

function drawDoor(o) {
  ctx.fillStyle = '#2a1500'; ctx.fillRect(o.x, o.y, o.w, o.h);
  ctx.fillStyle = '#5a3a1a'; ctx.fillRect(o.x + 4, o.y + 4, o.w - 8, o.h - 8);
  ctx.fillStyle = '#3a1f0a';
  ctx.fillRect(o.x + 8, o.y + 12, o.w - 16, 16);
  ctx.fillRect(o.x + 8, o.y + o.h - 28, o.w - 16, 16);
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(o.x + o.w - 12, o.y + o.h / 2, 5, 5);
}

function drawPot(o) {
  ctx.fillStyle = '#7a3a0a'; ctx.fillRect(o.x + 8, o.y + 30, o.w - 16, o.h - 30);
  ctx.fillStyle = '#5a2a0a'; ctx.fillRect(o.x + 8, o.y + 30, o.w - 16, 4);
  ctx.fillStyle = '#2a6a2a';
  ctx.beginPath(); ctx.arc(o.x + o.w / 2, o.y + 20, 18, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#4a8a4a';
  ctx.beginPath(); ctx.arc(o.x + o.w / 2 - 5, o.y + 15, 8, 0, Math.PI * 2); ctx.fill();
}

function drawBook(o) {
  const colors = { libro1: '#aa2222', libro2: '#2244aa', libro3: '#228844' };
  ctx.fillStyle = '#3a2f1a'; ctx.fillRect(o.x - 6, o.y + o.h - 8, o.w + 12, 10);
  ctx.fillStyle = colors[o.id] || '#aa2222'; ctx.fillRect(o.x, o.y, o.w, o.h);
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(o.x + 6, o.y + 10, o.w - 12, 3);
  ctx.fillRect(o.x + 6, o.y + o.h - 14, o.w - 12, 3);
  ctx.fillStyle = '#f5f0dc'; ctx.fillRect(o.x + o.w - 4, o.y + 4, 4, o.h - 8);
}

function drawClock(o) {
  ctx.fillStyle = '#8b4513'; ctx.fillRect(o.x, o.y, o.w, o.h);
  ctx.fillStyle = '#5a3a1a'; ctx.fillRect(o.x + 4, o.y + 4, o.w - 8, o.h - 8);
  ctx.fillStyle = '#f5f0dc';
  ctx.beginPath(); ctx.arc(o.x + o.w / 2, o.y + o.h / 2, 22, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#000'; ctx.font = 'bold 8px Courier New'; ctx.textAlign = 'center';
  ctx.fillText('12', o.x + o.w / 2, o.y + o.h / 2 - 12);
  ctx.fillText('3',  o.x + o.w / 2 + 15, o.y + o.h / 2 + 3);
  ctx.fillText('6',  o.x + o.w / 2, o.y + o.h / 2 + 18);
  ctx.fillText('9',  o.x + o.w / 2 - 15, o.y + o.h / 2 + 3);
  ctx.textAlign = 'left';
  ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(o.x + o.w / 2, o.y + o.h / 2);
  ctx.lineTo(o.x + o.w / 2 + 12, o.y + o.h / 2 + 2);
  ctx.moveTo(o.x + o.w / 2, o.y + o.h / 2);
  ctx.lineTo(o.x + o.w / 2 + 5, o.y + o.h / 2 - 18);
  ctx.stroke();
}

function drawPainting(o) {
  ctx.fillStyle = '#5a3a1a'; ctx.fillRect(o.x, o.y, o.w, o.h);
  ctx.fillStyle = '#3a1f0a'; ctx.fillRect(o.x + 4, o.y + 4, o.w - 8, o.h - 8);
  ctx.fillStyle = '#8aa0d0'; ctx.fillRect(o.x + 8, o.y + 8, o.w - 16, o.h - 16);
  ctx.fillStyle = '#3a3a3a'; ctx.fillRect(o.x + 24, o.y + 36, 42, 22);
  ctx.fillStyle = '#5a3a1a';
  ctx.beginPath();
  ctx.moveTo(o.x + 20, o.y + 36);
  ctx.lineTo(o.x + 45, o.y + 20);
  ctx.lineTo(o.x + 70, o.y + 36);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffd700'; ctx.fillRect(o.x + 40, o.y + 44, 6, 10);
  ctx.fillStyle = '#222'; ctx.font = 'bold 10px Courier New';
  ctx.fillText('1895', o.x + o.w - 34, o.y + o.h - 10);
}

function drawSafe(o) {
  ctx.fillStyle = '#2a2a2a'; ctx.fillRect(o.x, o.y, o.w, o.h);
  ctx.fillStyle = '#4a4a4a'; ctx.fillRect(o.x + 4, o.y + 4, o.w - 8, o.h - 8);
  ctx.fillStyle = '#6a6a6a'; ctx.fillRect(o.x + 8, o.y + 8, o.w - 16, o.h - 16);
  ctx.fillStyle = '#2a2a2a';
  ctx.beginPath(); ctx.arc(o.x + o.w / 2, o.y + o.h / 2, 12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffd700';
  ctx.beginPath(); ctx.arc(o.x + o.w / 2, o.y + o.h / 2, 9, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#000';
  ctx.fillRect(o.x + o.w / 2 - 1, o.y + o.h / 2 - 8, 2, 6);
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(o.x + o.w - 14, o.y + o.h / 2 - 2, 10, 4);
}

function drawDesk(o) {
  ctx.fillStyle = '#4a2f1a'; ctx.fillRect(o.x, o.y, o.w, 10);
  ctx.fillStyle = '#654321'; ctx.fillRect(o.x, o.y + 10, o.w, o.h - 10);
  ctx.fillStyle = '#4a2f1a';
  ctx.fillRect(o.x + 10, o.y + 20, 30, 30);
  ctx.fillRect(o.x + 10, o.y + 22, 30, 2);
  ctx.fillRect(o.x + 10, o.y + 36, 30, 2);
  ctx.fillStyle = '#f5f0dc';
  ctx.fillRect(o.x + o.w - 40, o.y + 12, 25, 15);
  ctx.fillRect(o.x + o.w - 60, o.y + 14, 18, 12);
  ctx.fillStyle = '#111'; ctx.fillRect(o.x + o.w - 18, o.y + 2, 8, 8);
}

// ================================================================
// JUGADOR (detective con sombrero)
// ================================================================
function drawPlayer() {
  const x = Math.floor(player.x - player.w / 2);
  const y = Math.floor(player.y - player.h);

  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath(); ctx.ellipse(player.x, y + player.h, 11, 4, 0, 0, Math.PI * 2); ctx.fill();

  const step = player.moving ? (player.frame % 2 === 0 ? 2 : -2) : 0;
  ctx.fillStyle = '#1a1a2a';
  ctx.fillRect(x + 6,  y + 26 + Math.max(0, step), 4, 6);
  ctx.fillRect(x + 14, y + 26 + Math.max(0, -step), 4, 6);

  ctx.fillStyle = '#3a3a5a'; ctx.fillRect(x + 4, y + 14, 16, 14);
  ctx.fillStyle = '#5a5a7a'; ctx.fillRect(x + 4, y + 14, 16, 2);
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(x + 11, y + 18, 2, 2);
  ctx.fillRect(x + 11, y + 23, 2, 2);

  ctx.fillStyle = '#3a3a5a';
  ctx.fillRect(x + 1, y + 16, 4, 10);
  ctx.fillRect(x + 19, y + 16, 4, 10);

  ctx.fillStyle = '#f4c99a'; ctx.fillRect(x + 6, y + 4, 12, 12);

  ctx.fillStyle = '#222';
  ctx.fillRect(x + 4, y, 16, 6);
  ctx.fillRect(x + 2, y + 5, 20, 2);
  ctx.fillStyle = '#8b0000'; ctx.fillRect(x + 4, y + 5, 16, 1);

  ctx.fillStyle = '#000';
  if (player.dir === 'down') {
    ctx.fillRect(x + 8,  y + 10, 2, 2);
    ctx.fillRect(x + 14, y + 10, 2, 2);
  } else if (player.dir === 'left') {
    ctx.fillRect(x + 7, y + 10, 2, 2);
  } else if (player.dir === 'right') {
    ctx.fillRect(x + 15, y + 10, 2, 2);
  }
}

// ================================================================
// LÓGICA DE JUEGO
// ================================================================
function update() {
  if (game.state !== 'playing') {
    player.moving = false;
    return;
  }

  let dx = 0, dy = 0;
  if (input.up)         { dy = -player.speed; player.dir = 'up'; }
  else if (input.down)  { dy = player.speed;  player.dir = 'down'; }
  else if (input.left)  { dx = -player.speed; player.dir = 'left'; }
  else if (input.right) { dx = player.speed;  player.dir = 'right'; }

  player.moving = dx !== 0 || dy !== 0;

  if (player.moving) {
    player.frameTimer++;
    if (player.frameTimer > 8) {
      player.frame++;
      player.frameTimer = 0;
    }
  } else {
    player.frame = 0;
  }

  const newX = player.x + dx;
  const newY = player.y + dy;
  if (newX > 50 && newX < 590) player.x = newX;
  if (newY > 100 && newY < 450) player.y = newY;
}

// ---------- INTERACCIÓN ----------
function interact() {
  if (game.state === 'dialog') { showNextDialog(); return; }
  if (game.state !== 'playing') return;

  const room = rooms[game.currentRoom];
  for (const obj of room.objects) {
    const cx = obj.x + obj.w / 2;
    const cy = obj.y + obj.h / 2;
    const dist = Math.hypot(player.x - cx, player.y - cy);
    if (dist < 55) {
      handleAction(obj.action, obj);
      return;
    }
  }
}

function handleAction(action, obj) {
  switch (action) {
    case 'readNote':
      showDialog([
        "Sobre la mesa hay una nota doblada. La abres...",
        "\"Si buscas la llave dorada, busca donde se esconde el polvo y nadie se atreve a mirar.\"",
        "Una pista. ¿Dónde se esconderá el polvo sin ser visto?"
      ]);
      game.flags.notaLeida = true;
      break;

    case 'searchRug':
      if (!game.flags.notaLeida) {
        showDialog(["Una alfombra persa muy antigua. Debería buscar alguna pista primero."]);
      } else if (!game.flags.llaveEncontrada) {
        showDialog([
          "Levantas la alfombra con cuidado...",
          "¡Debajo hay una LLAVE DORADA escondida! La guardas en tu bolsillo."
        ]);
        game.inventory.push('🔑 Llave dorada');
        game.flags.llaveEncontrada = true;
        updateHUD();
      } else {
        showDialog(["Ya no hay nada más debajo de la alfombra."]);
      }
      break;

    case 'lookPot':
      showDialog(["Una planta decorativa. Tiene polvo por encima pero nada oculto."]);
      break;

    case 'goLibrary':
      if (!game.flags.llaveEncontrada) {
        showDialog(["La puerta está cerrada con llave. Necesitas encontrar la llave dorada."]);
      } else {
        game.flags.bibliotecaAbierta = true;
        changeRoom('biblioteca');
      }
      break;

    case 'goEntrance':
      changeRoom('entrada');
      break;

    case 'readBook1':
      showDialog([
        "📕 Libro rojo — \"Crónicas del tiempo\":",
        "\"Para acceder al estudio, necesitas la hora exacta que marca el reloj.\""
      ]);
      game.flags.librosLeidos = Math.max(game.flags.librosLeidos, 1);
      break;

    case 'readBook2':
      showDialog([
        "📘 Libro azul — \"Secretos numéricos\":",
        "\"Escribe los 3 dígitos de la hora, sin puntos ni símbolos.\""
      ]);
      game.flags.librosLeidos = Math.max(game.flags.librosLeidos, 2);
      break;

    case 'readBook3':
      showDialog([
        "📗 Libro verde — \"Memorias de la familia Valdez\":",
        "\"A las 3:07 de la tarde, todo comenzó... y todo terminará.\""
      ]);
      game.flags.librosLeidos = Math.max(game.flags.librosLeidos, 3);
      break;

    case 'lookClock':
      showDialog([
        "Un reloj antiguo de pared.",
        "La hora marcada es: 3:07.",
        "Los libros mencionaban esta hora..."
      ]);
      game.flags.relojMirado = true;
      break;

    case 'goStudy':
      if (game.flags.estudioAbierto) {
        changeRoom('estudio');
      } else {
        showPuzzle({
          title: '🔐 Cerradura de la puerta',
          text: 'Un panel con números pide un código de 3 dígitos.',
          hint: 'Pista: los libros y el reloj hablaban de una hora específica.',
          answer: '307',
          inputType: 'number',
          onSolve: () => {
            game.flags.estudioAbierto = true;
            showDialog([
              "¡Clic! La cerradura se abre.",
              "Código correcto: 307 (la hora del reloj, 3:07)."
            ], () => changeRoom('estudio'));
          }
        });
      }
      break;

    case 'lookPainting':
      showDialog([
        "Un cuadro antiguo que retrata la mansión.",
        "En la esquina inferior derecha hay una fecha grabada: \"1895\"."
      ]);
      game.flags.cuadroMirado = true;
      break;

    case 'searchDesk':
      showDialog([
        "Revisas los cajones del escritorio...",
        "Encuentras una carta sin firmar que dice:",
        "\"La suma de los dígitos del año que está en el cuadro abrirá la caja fuerte. — El mayordomo\"",
        "¡Interesante! La carta menciona al mayordomo. Parece nuestro sospechoso principal."
      ]);
      game.flags.escritorioMirado = true;
      break;

    case 'openSafe':
      if (game.flags.culpableDescubierto) {
        showDialog(["La caja fuerte ya está abierta. El caso está resuelto."]);
      } else {
        showPuzzle({
          title: '🔐 Caja Fuerte',
          text: 'La caja fuerte pide un código. La carta dice: "suma los dígitos del año del cuadro".',
          hint: 'Pista: el cuadro mostraba el año 1895. ¿Cuánto suma 1 + 8 + 9 + 5?',
          answer: '23',
          inputType: 'number',
          onSolve: () => {
            game.flags.culpableDescubierto = true;
            endGame();
          }
        });
      }
      break;
  }
}

function changeRoom(roomId) {
  game.currentRoom = roomId;
  const r = rooms[roomId];
  player.x = r.playerStart.x;
  player.y = r.playerStart.y;
  player.dir = r.playerStart.dir;
  updateHUD();
}

// ---------- VISIBILIDAD DE CONTROLES TÁCTILES ----------
function updateTouchControls() {
  if (game.state === 'playing' || game.state === 'dialog') {
    touchControls.classList.remove('hidden');
  } else {
    touchControls.classList.add('hidden');
    input.up = input.down = input.left = input.right = false;
  }
}

// ---------- DIÁLOGO ----------
let dialogQueue = [];
let dialogCallback = null;

function showDialog(lines, callback = null) {
  dialogQueue = [...lines];
  dialogCallback = callback;
  game.state = 'dialog';
  updateTouchControls();
  showNextDialog();
}

function showNextDialog() {
  if (dialogQueue.length === 0) {
    dialogBox.classList.add('hidden');
    game.state = 'playing';
    updateTouchControls();
    if (dialogCallback) {
      const cb = dialogCallback;
      dialogCallback = null;
      cb();
    }
    return;
  }
  dialogText.textContent = dialogQueue.shift();
  dialogBox.classList.remove('hidden');
}

// ---------- PUZZLE ----------
function showPuzzle(puzzle) {
  game.state = 'puzzle';
  updateTouchControls();
  const inputMode = puzzle.inputType === 'number' ? 'numeric' : 'text';
  puzzleContent.innerHTML = `
    <h2>${puzzle.title}</h2>
    <p>${puzzle.text}</p>
    <p class="hint-text">${puzzle.hint}</p>
    <input type="text" id="puzzle-input" class="puzzle-input"
           placeholder="?" autocomplete="off"
           inputmode="${inputMode}" pattern="[0-9]*">
    <div>
      <button id="puzzle-submit">✓ Enviar</button>
      <button id="puzzle-cancel">✗ Cancelar</button>
    </div>
    <div id="puzzle-feedback" class="feedback"></div>
  `;
  puzzleOverlay.classList.remove('hidden');

  const inputEl = document.getElementById('puzzle-input');
  const feedback = document.getElementById('puzzle-feedback');
  setTimeout(() => inputEl.focus(), 80);

  const submit = () => {
    if (inputEl.value.trim() === puzzle.answer) {
      feedback.textContent = "✓ ¡Correcto!";
      feedback.className = "feedback success";
      setTimeout(() => {
        puzzleOverlay.classList.add('hidden');
        game.state = 'playing';
        updateTouchControls();
        puzzle.onSolve();
      }, 700);
    } else {
      feedback.textContent = "✗ Incorrecto. Intenta de nuevo.";
      feedback.className = "feedback";
      inputEl.value = '';
      inputEl.focus();
    }
  };

  document.getElementById('puzzle-submit').onclick = submit;
  document.getElementById('puzzle-cancel').onclick = () => {
    puzzleOverlay.classList.add('hidden');
    game.state = 'playing';
    updateTouchControls();
  };
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submit();
  });
}

// ---------- FIN ----------
function endGame() {
  game.state = 'end';
  updateTouchControls();
  endText.innerHTML = `
    ¡La caja fuerte se abre!<br><br>
    Dentro encuentras la joya robada y otra carta firmada:<br>
    <em>"Señor Valdez, si usted está leyendo esto, siento mucho haber tomado su joya..."</em><br><br>
    <strong style="color:#ffd700">Culpable: El mayordomo</strong><br><br>
    🎩 Has resuelto el misterio de la Mansión Valdez.
  `;
  endScreen.classList.remove('hidden');
}

// ---------- HUD ----------
function updateHUD() {
  locationEl.textContent = '📍 ' + rooms[game.currentRoom].name;
  inventoryEl.textContent = '🎒 ' + (game.inventory.length ? game.inventory.join(', ') : 'vacío');
}

// ================================================================
// RENDER
// ================================================================
function render() {
  const room = rooms[game.currentRoom];

  ctx.fillStyle = room.floor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  for (let y = 0; y < canvas.height; y += 32) {
    ctx.fillRect(0, y, canvas.width, 1);
    for (let x = (y % 64 === 0 ? 0 : 32); x < canvas.width; x += 64) {
      ctx.fillRect(x, y, 1, 32);
    }
  }

  ctx.fillStyle = room.wall;
  ctx.fillRect(0, 0, canvas.width, 90);
  ctx.fillRect(0, 0, 40, canvas.height);
  ctx.fillRect(canvas.width - 40, 0, 40, canvas.height);
  ctx.fillRect(0, canvas.height - 30, canvas.width, 30);

  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  for (let y = 0; y < 90; y += 22) {
    ctx.fillRect(0, y, canvas.width, 1);
    const offset = (y / 22) % 2 === 0 ? 0 : 22;
    for (let x = offset; x < canvas.width; x += 44) {
      ctx.fillRect(x, y, 1, 22);
    }
  }

  const drawables = [
    ...room.objects.map(o => ({ type: 'obj', obj: o, depth: o.y + o.h })),
    { type: 'player', depth: player.y }
  ];
  drawables.sort((a, b) => a.depth - b.depth);

  for (const d of drawables) {
    if (d.type === 'obj') {
      d.obj.draw(d.obj);
      const cx = d.obj.x + d.obj.w / 2;
      const cy = d.obj.y + d.obj.h / 2;
      const dist = Math.hypot(player.x - cx, player.y - cy);
      if (dist < 55 && game.state === 'playing') {
        ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 2;
        ctx.strokeRect(d.obj.x - 2, d.obj.y - 2, d.obj.w + 4, d.obj.h + 4);
        const label = '[E] ' + d.obj.label;
        ctx.font = 'bold 11px Courier New';
        const labelW = ctx.measureText(label).width + 12;
        ctx.fillStyle = 'rgba(0,0,0,0.78)';
        ctx.fillRect(cx - labelW / 2, d.obj.y - 22, labelW, 16);
        ctx.fillStyle = '#ffd700';
        ctx.textAlign = 'center';
        ctx.fillText(label, cx, d.obj.y - 10);
        ctx.textAlign = 'left';
      }
    } else {
      drawPlayer();
    }
  }

  const grad = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 150,
    canvas.width / 2, canvas.height / 2, 400
  );
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function loop() {
  update();
  render();
  requestAnimationFrame(loop);
}

// ================================================================
// MÚSICA (Web Audio API — chiptune procedural)
// ================================================================
let audioCtx = null;
let masterGain = null;
let musicEnabled = true;
let musicStarted = false;

function startMusic() {
  if (musicStarted) return;
  musicStarted = true;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.09;
  masterGain.connect(audioCtx.destination);

  const melody = [
    { f: 220.00, d: 0.4 }, { f: 246.94, d: 0.2 }, { f: 261.63, d: 0.4 },
    { f: 293.66, d: 0.2 }, { f: 261.63, d: 0.4 }, { f: 246.94, d: 0.4 },
    { f: 220.00, d: 0.8 },
    { f: 174.61, d: 0.4 }, { f: 196.00, d: 0.4 }, { f: 220.00, d: 0.8 },
    { f: 261.63, d: 0.4 }, { f: 220.00, d: 0.4 }, { f: 196.00, d: 0.8 }
  ];
  const bass = [
    { f: 110.00, d: 1.6 }, { f: 98.00, d: 1.6 },
    { f: 87.31,  d: 1.6 }, { f: 98.00, d: 1.6 }
  ];

  function playNote(freq, duration, type, gainVal, startTime) {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(gainVal, startTime + 0.02);
    g.gain.linearRampToValueAtTime(0, startTime + duration);
    osc.connect(g);
    g.connect(masterGain);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  function scheduleLoop() {
    if (!musicEnabled) { setTimeout(scheduleLoop, 500); return; }
    let t = audioCtx.currentTime + 0.05;
    const start = t;
    for (const n of melody) { playNote(n.f, n.d, 'square', 0.25, t); t += n.d; }
    const total = t - start;
    let bt = start;
    for (const n of bass) { playNote(n.f, n.d, 'triangle', 0.4, bt); bt += n.d; }
    setTimeout(scheduleLoop, total * 1000);
  }

  scheduleLoop();
}

// ================================================================
// INPUTS — TECLADO + TÁCTIL
// ================================================================

// ----- Teclado (para escritorio) -----
const keyMap = {
  'ArrowUp': 'up', 'w': 'up', 'W': 'up',
  'ArrowDown': 'down', 's': 'down', 'S': 'down',
  'ArrowLeft': 'left', 'a': 'left', 'A': 'left',
  'ArrowRight': 'right', 'd': 'right', 'D': 'right'
};

window.addEventListener('keydown', (e) => {
  if (keyMap[e.key]) {
    input[keyMap[e.key]] = true;
    e.preventDefault();
  }
  if (e.key === 'e' || e.key === 'E' || e.key === ' ') {
    e.preventDefault();
    interact();
  }
});
window.addEventListener('keyup', (e) => {
  if (keyMap[e.key]) {
    input[keyMap[e.key]] = false;
  }
});

// ----- Controles táctiles (D-pad) -----
function bindDpadButton(btn) {
  const dir = btn.dataset.dir;

  const press = (e) => {
    e.preventDefault();
    // Soltamos las otras direcciones para que no queden pegadas
    input.up = input.down = input.left = input.right = false;
    input[dir] = true;
    btn.classList.add('pressed');
  };
  const release = (e) => {
    if (e) e.preventDefault();
    input[dir] = false;
    btn.classList.remove('pressed');
  };

  btn.addEventListener('touchstart', press, { passive: false });
  btn.addEventListener('touchend', release, { passive: false });
  btn.addEventListener('touchcancel', release, { passive: false });
  // También soporta ratón (para probar en PC)
  btn.addEventListener('mousedown', press);
  btn.addEventListener('mouseup', release);
  btn.addEventListener('mouseleave', release);
}

document.querySelectorAll('.dpad-btn').forEach(bindDpadButton);

// Botón de acción (E)
const actionPress = (e) => {
  e.preventDefault();
  interact();
};
actionBtn.addEventListener('touchstart', actionPress, { passive: false });
actionBtn.addEventListener('click', (e) => {
  // En móviles touchstart ya disparó interact — en PC sí se usa click
  if (e.detail !== 0) { // evitamos doble disparo cuando viene de Enter
    // nada — touchstart ya lo maneja en móvil
  }
});
// Para escritorio sin touch:
actionBtn.addEventListener('mousedown', (e) => {
  if (!('ontouchstart' in window)) {
    e.preventDefault();
    interact();
  }
});

// Diálogo: tocar avanza
dialogBox.addEventListener('click', () => {
  if (game.state === 'dialog') showNextDialog();
});
dialogBox.addEventListener('touchstart', (e) => {
  if (game.state === 'dialog') { e.preventDefault(); showNextDialog(); }
}, { passive: false });

// Evita que el navegador haga zoom o scroll al tocar el canvas
canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

// ----- Botones principales -----
startBtn.addEventListener('click', () => {
  startScreen.classList.add('hidden');
  game.state = 'playing';
  updateHUD();
  updateTouchControls();
  try { startMusic(); } catch (e) { console.warn('Audio no disponible:', e); }
});

muteBtn.addEventListener('click', () => {
  musicEnabled = !musicEnabled;
  muteBtn.textContent = musicEnabled ? '🔊 Música: ON' : '🔇 Música: OFF';
  if (masterGain) masterGain.gain.value = musicEnabled ? 0.09 : 0;
});

// ================================================================
// INICIO
// ================================================================
updateHUD();
updateTouchControls();
loop();
