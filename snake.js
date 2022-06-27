const myCanvas = document.getElementById('myCanvas');
const context = myCanvas.getContext('2d');


const SIZE = 20;

const head = { x:0, y:0 };
const body = [];

let food = null; //x: y:



let dx = 0;
let dy = 0;

let lastAxis; // verifica si el ultimo movimiento fue en el eje 'Y' o 'X'

setInterval(main,150);

function main() {
    update (); //Actualizar las variables del juego
    draw(); // Dibujar todos los objetos del juego
}

function update() {

   const collisionDetected = checkSnakeCollision () ;

   if (collisionDetected) {
    gameOver();
    return;
   }
    

    //salvar la posición previa del ultimo cuadrado del cuerpo de la serpiente
    let prevX, prevY;

    if(body.length >=1) {
        prevX = body[body.length-1].x;
        prevY = body[body.length-1].y;
    } else {

        prevX = head.x;
        prevY = head.y;

    }
    


    //el cuerpo de la serpiente siga a la cabeza de la serpiente
    for (let i=body.length-1; i>=1; --i) {
        body[i].x = body[i-1].x;  // elemento de posición 3 reciba el valor de posición 2, luego el elemento de posición 2 recibe el valor del elemento posición 1 ... 0 
        body[i].y = body[i-1].y;
    }
    if (body.length >=1) {

        body[0].x = head.x;
        body[0].y = head.y;

    }
   

    // se encarga de actualizar las coordenadas de la cabeza de la serpiente

    head.x += dx ;
    head.y += dy ;

    //determinamos en que eje ha ocurrido el ultimo movimiento
    if (dx !==0) {
        lastAxis='X';
    } else if (dy !==0) {
        lastAxis= 'Y';
    }


  

    // Detectar si la serpiente consumió el alimento  //si existe food && las coordenadas de la cabeza de la serpiente y las coordenadas de food coinciden, food = null

    if (food && head.x === food.x && head.y === food.y) {
        food = null;

        // aumentar el tamaño de la serpiente
        increaseSnakeSize(prevX, prevY);
        
    }

    // Generar alimento en caso que no exista
    if (!food){
        food= randomFoodPosition();
    }
}

function checkSnakeCollision() { 
    //verifica si las coordenadas de la cabeza son o no igual a las coordenadas de un elemento del cuerpo

    for (let i=0; i<body.length; ++i) {
        if(head.x===body[i].x && head.y=== body[i].y){
            return true;
            
        }

    }

    //verificar que la serpiente no salga de los limites permitidos
    const topCollision= (head.y < 0) ;  // x: ? , y: -0
    const bottomCollision= (head.y > 440); // x:? , y: +44
    const leftCollision = (head.x <0);  // x -0, y:?0
    const rightCollision = (head.x >380); // x +380, y: ?
    

    if(topCollision || bottomCollision  || rightCollision || leftCollision) {
        return true;
       
    }

    return false;


}

function gameOver (){

        alert ('Has perdido');
        head.x= 0;
        head.y= 0;
        dy = 0, dx =0;
        body.length= 0;
    

}



function increaseSnakeSize(prevX, prevY) {
    body.push ({
        x: prevX , y: prevY
    })
}

function randomFoodPosition(){
   let position;
   
   do {
        position = { x: getRandomX(), y:getRandomY() } ;
   } while ( checkFoodCollision(position));
   return position;
   
}

function checkFoodCollision (position) {
    //Comparar las coordenadas del alimento generado con el cuerpo de la serpiente
    for (let i=0; i<body.length; ++i) {
        if(position.x===body[i].x && position.y=== body[i].y){
            return true;
            
        }

    }

    //comparar las coordenadas del alimento generado con la cabeza de la serpiente
    if (position.x == head.x && position.y == head.y) {
        return true;
    }
    return false;

}

function getRandomX (){

    //0, 20, 40, ..., 380
    // 0, 1, 2, ..., 19    x20

    return 20 * (parseInt(Math.random()*20));

}


function getRandomY () {

    //0, 20, 40, ..., 440
    //0, 1, 2, ..., 22   x20

    return 20 * (parseInt(Math.random()*23));



}

function draw () {
    //definir un fondo
    context.fillStyle= 'black'
    context.fillRect(0, 0, myCanvas.width, myCanvas.height)

    // dibujar la cabeza
    drawObject (head, 'lime');

    //dibujar cuerpo
    body.forEach(
        elem => drawObject(elem, 'lime')
    );

    //dibujar alimento
    drawObject(food, 'white');
    
}

function drawObject(obj, color) {
    context.fillStyle = color;
    context.fillRect(obj.x, obj.y, SIZE,SIZE);
};





document.addEventListener('keydown', moveSnake);

function moveSnake (event) {
    //las condiciones restringen el movimiento sobre el mismo eje
    switch (event.key) {
        case 'ArrowUp':
            
            if(lastAxis !== 'Y') {
                dx = 0 ;
                dy = -SIZE ;
                console.log('Mover hacia arriba');
            }
            
            
        break;

        case 'ArrowDown':
            
            if (lastAxis !== 'Y') {
                dx = 0 ;
                dy = +SIZE ;
                console.log('Mover hacia abajo');
            }
            
            
        break;

        case 'ArrowRight':
            
            if (lastAxis !== 'X') {

                dx = +SIZE ;
                dy = 0 ;
                console.log('Mover hacia la derecha');
            }
            
            
        break;

        case 'ArrowLeft':
            
            if (lastAxis !=='X') {
                dx = -SIZE;
                dy = 0;
                console.log('Mover hacia la izquierda');
            }
            
        break;
    }
}