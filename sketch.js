let jugador;
let paredes = [];
let meta;
let partida = "comenzar";
let keys = {};
let mostrarCreditos = false;
let botonCreditos;
let video; // Variable para almacenar el video

function setup() {
  createCanvas(600, 600);
  jugador = new Jugador();
  laberinto();
  meta = new Meta(170, 400, 195, 425);

  // Cargar el video de fondo
  video = createVideo("fire.mp4");
  video.hide(); // Ocultar los controles predeterminados del video
  video.loop(); // Reproducir el video en bucle
  video.volume(0); // Eliminar el sonido del video, si es necesario

  // Botón de Créditos
  botonCreditos = createButton("Créditos");
  botonCreditos.position(width / 2 - 30, height / 2 + 260);
  botonCreditos.mousePressed(() => {
    mostrarCreditos = true;
    partida = "creditos";
  });
}

function draw() {
  // Mostrar el video como fondo
  image(video, 0, 0, width, height);

  if (partida === "comenzar") {
    botonCreditos.show(); // Mostrar botón en la pantalla de inicio
    pantallaInicio();
  } else {
    botonCreditos.hide(); // Ocultar botón durante el juego y otras pantallas
    if (partida === "jugando") {
      // Dibuja el área central negra translúcida para el laberinto
      fill(0, 0, 0, 220); // Color negro con opacidad del 150 sobre 255
      noStroke();
      rect(50, 50, 500, 500); // Ajusta el tamaño del rectángulo negro según el tamaño de tu laberinto
      actualizarJuego();
    } else if (partida === "perdida") {
      pantallaPerdida();
    } else if (partida === "victoria") {
      pantallaVictoria();
    } else if (partida === "creditos") {
      pantallaCreditos();
    }
  }
}

function keyPressed() {
  keys[keyCode] = true;
  if (partida === "comenzar" || partida === "perdida") {
    if (keyCode === ENTER) {
      partida = "jugando";
      jugador.reset();
    }
  } else if (partida === "victoria" || partida === "creditos") {
    if (keyCode === ENTER) {
      partida = "comenzar";
      mostrarCreditos = false;
    }
  }
}

function keyReleased() {
  keys[keyCode] = false;
}

function pantallaInicio() {
  textAlign(CENTER, CENTER);
  textSize(60);
  fill(200);
  text("LABERINTO", width / 2, height / 2 - 20);
  push();
  fill(255, 0, 0);
  textSize(30);
  text("No se pueden tocar las paredes", width / 2, height / 2 + 60);
  pop();
  textSize(20);
  text("(Controles: Flechas)", width / 2, height / 2 + 100);
  textSize(16);
  text("Presiona ENTER para comenzar", width / 2, height / 2 + 200);
}

function pantallaCreditos() {
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255);
  text("Desarrollado por:", width / 2, height / 2 - 50);
  textSize(24);
  push();
  fill(255, 0, 0);
  text("Emanuel Carregal", width / 2, height / 2);
  pop();
  textSize(16);
  text("Presiona ENTER para volver", width / 2, height / 2 + 100);
}

function actualizarJuego() {
  jugador.update();
  jugador.show();

  for (let pared of paredes) {
    pared.show();

    if (jugador.toquePared(pared)) {
      partida = "perdida";
    }
  }

  meta.show();
  if (jugador.metaLlegada(meta)) {
    partida = "victoria";
  }

  if (keys[UP_ARROW]) {
    jugador.move(0, -1);
  }
  if (keys[DOWN_ARROW]) {
    jugador.move(0, 1);
  }
  if (keys[LEFT_ARROW]) {
    jugador.move(-1, 0);
  }
  if (keys[RIGHT_ARROW]) {
    jugador.move(1, 0);
  }
}

function pantallaPerdida() {
  textAlign(CENTER, CENTER);
  textSize(32);
  noStroke();
  fill(255, 0, 0);
  text("¡Perdiste!", width / 2, height / 2 - 20);
  textSize(16);
  text("Presiona ENTER para reiniciar", width / 2, height / 2 + 20);
}

function pantallaVictoria() {
  textAlign(CENTER, CENTER);
  textSize(32);
  noStroke();
  fill(0, 255, 0);
  text("¡Ganaste!", width / 2, height / 2 - 20);
  textSize(16);
  text("Presiona ENTER para regresar al inicio", width / 2, height / 2 + 50);
}

function laberinto() {
  paredes = [
    // Bordes del laberinto
    new Pared(50, 50, 550, 50),
    new Pared(50, 50, 50, 550),
    new Pared(50, 550, 550, 550),
    new Pared(550, 50, 550, 550),

    // Camino principal
    new Pared(140, 50, 140, 460),
    new Pared(140, 460, 460, 460),
    new Pared(460, 460, 460, 90),
    new Pared(460, 90, 170, 90),
    new Pared(170, 90, 170, 425),
    new Pared(170, 425, 435, 425),
    new Pared(435, 425, 435, 115),
    new Pared(435, 115, 195, 115),
    new Pared(195, 115, 195, 425),
  ];
}

class Jugador {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = 75; // Posición inicial en X
    this.y = 75; // Posición inicial en Y
    this.size = 20; // Tamaño del jugador
    this.speed = 3; // Velocidad del jugador
  }

  move(xdir, ydir) {
    this.x += xdir * this.speed;
    this.y += ydir * this.speed;
  }

  update() {
    this.x = constrain(this.x, 0, width - this.size);
    this.y = constrain(this.y, 0, height - this.size);
  }

  show() {
    // Jugador color y tamaño
    noStroke();
    fill(255, 0, 0);
    rect(this.x, this.y, this.size, this.size);
  }

  toquePared(pared) {
    let px = this.x + this.size / 2;
    let py = this.y + this.size / 2;

    // Calculo de la distancia desde el punto (px, py) al segmento de línea (pared.x1, pared.y1) a (pared.x2, pared.y2)
    let dist = distJugadorPared(px, py, pared.x1, pared.y1, pared.x2, pared.y2);

    // Si la distancia es menor o igual al radio del jugador, hay colisión
    return dist <= this.size / 2;
  }

  metaLlegada(meta) {
    // Verificación si el jugador alcanza la meta
    return (
      this.x >= meta.x1 &&
      this.x + this.size <= meta.x2 &&
      this.y >= meta.y1 &&
      this.y + this.size <= meta.y2
    );
  }
}

class Pared {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1; // Coordenada X inicial de la pared
    this.y1 = y1; // Coordenada Y inicial de la pared
    this.x2 = x2; // Coordenada X final de la pared
    this.y2 = y2; // Coordenada Y final de la pared
  }

  show() {
    // Paredes color y tamaño
    stroke(200);
    strokeWeight(2);
    line(this.x1, this.y1, this.x2, this.y2);
  }
}

class Meta {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  show() {
    fill(200);
    rect(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);
  }
}

function distJugadorPared(px, py, x1, y1, x2, y2) {
  // Calculo la distancia más corta desde el punto (px, py) al segmento de línea (x1, y1) a (x2, y2)
  let dx = x2 - x1;
  let dy = y2 - y1;
  let t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);

  if (t < 0) {
    // El punto proyectado está fuera del segmento, cerca de (x1, y1)
    return dist(px, py, x1, y1);
  }
  if (t > 1) {
    // El punto proyectado está fuera del segmento, cerca de (x2, y2)
    return dist(px, py, x2, y2);
  }

  // El punto proyectado está dentro del segmento, encontrar la distancia perpendicular
  let projX = x1 + t * dx;
  let projY = y1 + t * dy;
  return dist(px, py, projX, projY);
}
