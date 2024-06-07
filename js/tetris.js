let lastTime = 0;
let dropInterval = 1000;
let dropCounter = 0;

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const grid = createMatriz(10,20);
const player = {
    pos: {x: 0,y: 0},
    matriz: [
        [0,0,0],
        [1,1,1],
        [0,1,0]
    ]
};

context.scale(20,20)

'Funcion que sirve para crear la matriz'
function createMatriz(width, height) {
    const matriz = [];

    while(height--) {
        matriz.push(new Array(width).fill(0))
    }

    console.table(matriz);

    return matriz;
}

'Funcion que sirve para dibujar la matriz (y ubicar la forma)'
function drawMatriz(matriz, offset) {
    matriz.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value!==0) {
                context.fillStyle = 'red';
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        })
    })

}

'Funcion que sirve para crear el cuadro donde se hara el juego (tambien donde se encuentra posicionado el jugador)'
function  draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatriz(grid, {x: 0,y: 0});
    drawMatriz(player.matriz,player.pos);
}

'Funcion que sirve para mover la forma hacia abajo refrescando por segundo'
function  update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter+= deltaTime;

    if (dropCounter>dropInterval){
        player.pos.y++;
        dropCounter = 0;
    }

    draw();
    requestAnimationFrame(update); 
}

'Se crea la opcion de mover para abajo la forma'
document.addEventListener('keydown', event => {   
    if (event.key===40) {
        player.pos.y++;
        dropCounter = 0;        
    }
});

update();