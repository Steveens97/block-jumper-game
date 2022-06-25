//Definimos el ancho de nuestro lienzo
var canvasWidth = 1375;
//Definimos la altura de nuestro lienzo
var canvasHeight = 400;

//Creamos una variable para poder llamar al jugador
var player;
//Creamos la variable para definir donde va a aparecer el jugador
var playerYPosition = 300;

//creamos una variable para el espacio de caida
var fallSpeed = 0;
//creamos un nuevo intervalo
var interval = setInterval(updateCanvas, 20);

//creamos el salto que sera tipo booleano
var isJumping = false;
//creamos una variable de salto, inicia desde 0
var jumpSpeed = 0;

//creamos una nueva variable de bloque
var block;


// Create a score of 0 to start with
var score = 0;
// Create a variable to hold our scoreLabel
var scoreLabel;

//funcion del juego
function startGame() {
    gameCanvas.start();
    //creamos un jugador usando la funcion
    player = new createPlayer(30, 30, 10);
    // asignamos el bloque a una variable 
    block = new createBlock();
    // Assign your scoreLabel variable a value from scoreLabel()
    scoreLabel = new createScoreLabel(10, 30);
}

var gameCanvas = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
}
// creamos la funcion para poder llamar al crear un jugador
function createPlayer(width, height, x) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = playerYPosition;

    //creamos una funcion para dibujar
    this.draw = function () {
        ctx = gameCanvas.context;
        ctx.fillStyle = "white";

        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    //creamos la funcion para hacer caer
    this.makeFall = function () {
        if (!isJumping) {
            this.y += fallSpeed;
            fallSpeed += 0.1;
            this.stopPlayer();
        }
    }
    //creamos la funcion para detener
    this.stopPlayer = function () {
        var ground = canvasHeight - this.height;
        if (this.y > ground) {
            this.y = ground;
        }
    }
    //creamos la funcion para saltar
    this.jump = function () {
        if (isJumping) {
            this.y -= jumpSpeed;
            jumpSpeed += 0.3;
        }
    }
}

//creamos los bloques de forma aleatoria para que vayan apareciendo
function createBlock() {
    var width = randomNumber(10, 50);
    var height = randomNumber(10, 200);
    var speed = randomNumber(2, 6);

    this.x = canvasWidth;
    this.y = canvasHeight - height;

    //asignamos el diseño de nuestros bloques
    this.draw = function () {
        ctx = gameCanvas.context;
        ctx.fillStyle = "gray";
        ctx.fillRect(this.x, this.y, width, height);
    }
    // asignamos la velocidad en la que se va a mover los blqoues
    this.attackPlayer = function () {
        this.x -= speed;
        //llamamos la funcion returnToAttackPosition
        this.returnToAttackPosition();
    }
    //creamos un retorno de la posicion cuando los bloques se muevan y creamos nuevos valores aleatorios
    this.returnToAttackPosition = function () {
        if (this.x < 0) {
            width = randomNumber(10, 50);
            height = randomNumber(50, 200);
            speed = randomNumber(4, 6);
            this.y = canvasHeight - height;
            this.x = canvasWidth;
            // Increase your score if your block made it to the edge
            score++;
        }
    }
}

//creamos la funcion detectCollision
function detectCollision() {
    var playerLeft = player.x
    var playerRight = player.x + player.width;
    var blockLeft = block.x;
    var blockRight = block.x + block.width;

    var playerBottom = player.y + player.height;
    var blockTop = block.y;

    if (playerRight > blockLeft &&
        playerLeft < blockLeft &&
        playerBottom > blockTop) {

        gameCanvas.stop();
    }
}
//asginamos el diseño de nuestro contador de score
function createScoreLabel(x, y) {
    this.score = 0;
    this.x = x;
    this.y = y;
    this.draw = function () {
        ctx = gameCanvas.context;
        ctx.font = "25px Marker Felt";
        ctx.fillStyle = "white";
        ctx.fillText(this.text, this.x, this.y);
    }
}
//creamos una funcion en nuestro canvas para actualizar y volver a dibujar al jugador y poderlo hacer caer
function updateCanvas() {
    //revisamos todo el tiempo la colision del lienzo
    detectCollision();

    ctx = gameCanvas.context;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    player.makeFall();
    player.draw();
    player.jump();

    block.draw();
    block.attackPlayer();

    // Redraw your score and update the value
    scoreLabel.text = "SCORE: " + score;
    scoreLabel.draw();
}
//funcion para generar numeros aleatorios
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

//funcion que restablece el salto del bloque
function resetJump() {
    jumpSpeed = 0;
    isJumping = false;
}

document.body.onkeyup = function (e) {
    if (e.keyCode == 32) {
        isJumping = true;
        setTimeout(function () { resetJump(); }, 1000);
    }
}