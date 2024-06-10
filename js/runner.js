//Reinicio del juego//

var time = new Date();
var deltaTime = 0;

if(document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(Init,1);
}else{
    document.addEventListener("DOMContentLoaded",Init);
}

function Init() {
    time = new Date();
    Start();
    Loop();
}

function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update()
    requestAnimationFrame(Loop);
}

//El juego se genera aca//

var sueloY = 22;
var velY = 0;
var impulso = 900;
var gravedad = 2500;

var animalPosX = 42;
var animalPosY = sueloY;

var sueloX = 0;
var velEscenario = 1280 / 3;
var gameVel = 1;
var score = 0;

var parado = false;
var saltando = false;

var tiempoObstaculo = 2;
var tiempoObstaculoMin = 0.7;
var tiempoObstaculoMax = 1.8;
var obstaculoPosY = 16;
var obstaculos = [];

var tiempoHastaNube = 0.5;
var tiempoNubeMin = 0.7;
var tiempoNubeMax = 2.7;
var maxNubeY = 270;
var minNubeY = 100;
var nubes = [];
var velNube = 0.5;

var contenedor;
var animal;
var textoScore;
var suelo;
var gameOver;

var deltaTime = 0;
var lastUpdateTime = Date.now();

function Start() {
    gameOver = document.querySelector(".game-over");
    suelo = document.querySelector(".suelo");
    contenedor = document.querySelector(".contenedor");
    textoScore = document.querySelector(".score");
    animal = document.querySelector(".animal");
    document.addEventListener("keydown", HandleKeyDown);
    contenedor.addEventListener("click", HandleContainerClick); // Manejar clics dentro del contenedor
    contenedor.addEventListener("touchstart", HandleContainerTouchStart); // Manejar toques dentro del contenedor

    requestAnimationFrame(GameLoop);
}

function HandleKeyDown(ev) {
    if (ev.keyCode == 32) { 
        ev.preventDefault(); 
        if (parado) {
            RestartGame();
        } else {
            Saltar();
        }
    }
}

function HandleContainerTouchStart(ev) { 
    ev.preventDefault(); 
    var touch = ev.touches[0];
    var touchX = touch.clientX;
    var touchY = touch.clientY;
    var contenedorRect = contenedor.getBoundingClientRect();

    if (touchX >= contenedorRect.left && touchX <= contenedorRect.right &&
        touchY >= contenedorRect.top && touchY <= contenedorRect.bottom) {
        if (parado) {
            RestartGame();
        } else {
            Saltar();
        }
    }
}

function HandleContainerClick(ev) {
    ev.preventDefault();
    var clickX = ev.clientX;
    var clickY = ev.clientY;
    var contenedorRect = contenedor.getBoundingClientRect();

    if (clickX >= contenedorRect.left && clickX <= contenedorRect.right &&
        clickY >= contenedorRect.top && clickY <= contenedorRect.bottom) {
        if (parado) {
            RestartGame();
        } else {
            Saltar();
        }
    }
}

function Saltar() {
    if (animalPosY === sueloY) {
        saltando = true;
        velY = impulso;
        animal.classList.remove("animal-corriendo"); 
    }
}

function Update() {
    var currentTime = Date.now();
    deltaTime = (currentTime - lastUpdateTime) / 1000; // Convertir a segundos
    lastUpdateTime = currentTime;

    if (parado) return;

    MoverSuelo();
    MoverAnimal();
    DecidirCrearObstaculos();
    DecidirCrearNubes();
    MoverObstaculos();
    MoverNubes();
    DetectarColision();

    velY -= gravedad * deltaTime;
}

function MoverSuelo() {
    sueloX += CalcularDesplazamiento();
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
}

function CalcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel;
}

function MoverAnimal() {
    animalPosY += velY * deltaTime;
    if (animalPosY < sueloY) {
        TocarSuelo();
    }
    animal.style.bottom = animalPosY + "px";
}

function TocarSuelo() {
    animalPosY = sueloY;
    velY = 0;
    if (saltando) {
        animal.classList.add("animal-corriendo");
    }
    saltando = false;
}

function GameLoop() {
    if (!parado) {
        Update();
        requestAnimationFrame(GameLoop);
    }
}

function DecidirCrearObstaculos() {
    tiempoObstaculo -= deltaTime;
    if (tiempoObstaculo <= 0) {
        CrearObstaculos();
    }
}

function CrearObstaculos() {
    var obstaculo = document.createElement("div");
    contenedor.appendChild(obstaculo);
    obstaculo.classList.add("cactus");
    if (Math.random() > 0.5) obstaculo.classList.add("cactus2");
    obstaculo.posX = contenedor.clientWidth;
    obstaculo.style.left = contenedor.clientWidth + "px";

    obstaculos.push(obstaculo);
    tiempoObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax - tiempoObstaculoMin) / gameVel;
}

function MoverObstaculos() {
    for (var i = obstaculos.length - 1; i >= 0; i--) {
        if (obstaculos[i].posX < -obstaculos[i].clientWidth) {
            obstaculos[i].parentNode.removeChild(obstaculos[i]);
            obstaculos.splice(i, 1);
            GanarPuntos();
        } else {
            obstaculos[i].posX -= CalcularDesplazamiento();
            obstaculos[i].style.left = obstaculos[i].posX + "px";
        }
    }
}

function GanarPuntos() {
    score++;
    textoScore.innerText = score;
    if (score == 5) {
        gameVel = 1.2;
        contenedor.classList.add("mediodia");
    } else if (score == 5) {
        gameVel = 1.25;
        contenedor.classList.add("tarde");
    } else if (score == 10) {
        gameVel = 1.7;
        contenedor.classList.add("noche");
    }
    suelo.style.animationDuration = (3 / gameVel) + "s";
}

function DetectarColision() {
    for (var i = 0; i < obstaculos.length; i++) {
        if (obstaculos[i].posX > animalPosX + animal.clientWidth) {
            break;
        } else {
            if (IsCollision(animal, obstaculos[i], 0, 0, 0, 0)) {
                GameOver();
            }
        }
    }
}

function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}

function DecidirCrearNubes() {
    tiempoHastaNube -= deltaTime;
    if (tiempoHastaNube <= 0) {
        CrearNube();
    }
}

function CrearNube() {
    var nube = document.createElement("div");
    contenedor.appendChild(nube);
    nube.classList.add("nube");
    nube.posX = contenedor.clientWidth;
    nube.style.left = contenedor.clientWidth + "px";
    nube.style.bottom = minNubeY + Math.random() * (maxNubeY - minNubeY) + "px";

    nubes.push(nube);
    tiempoHastaNube = tiempoNubeMin + Math.random() * (tiempoNubeMax - tiempoNubeMin) / gameVel;
}

function MoverNubes() {
    for (var i = nubes.length - 1; i >= 0; i--) {
        if (nubes[i].posX < -nubes[i].clientWidth) {
            nubes[i].parentNode.removeChild(nubes[i]);
            nubes.splice(i, 1);
        } else {
            nubes[i].posX -= CalcularDesplazamiento() * velNube;
            nubes[i].style.left = nubes[i].posX + "px";
        }
    }
}

function GameOver() {
    Estrellarse();
    gameOver.style.display = "block";
    parado = true; // Para detener el GameLoop
}

function Estrellarse() {
    animal.classList.remove("animal-corriendo");
    animal.classList.add("animal-estrellado");
    parado = true;
}

function RestartGame() {
    parado = false;
    score = 0;
    gameVel = 1;
    sueloX = 0;
    obstaculos.forEach(obstaculo => obstaculo.parentNode.removeChild(obstaculo));
    obstaculos = [];
    nubes.forEach(nube => nube.parentNode.removeChild(nube));
    nubes = [];
    gameOver.style.display = "none";
    animal.classList.add("animal-corriendo");
    animal.classList.remove("animal-estrellado");
    textoScore.innerText = score;
    Start();
}

Start();
