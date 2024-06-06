let lastTime = 0;

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

function createMatriz(width, height) {
    const matriz = [];

    while(height--) {
        matriz.push(new Array(width).fill(0))
    }

    console.table(matriz);

    return matriz;
}

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

function  draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatriz(grid, {x: 0,y: 0});
    drawMatriz(player.matriz,player.pos);
}

function  update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    draw();
    requestAnimationFrame(update); 
}

update();