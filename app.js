let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let isPaused = true;

let Snake = function() {
    this.x = 10;
    this.y = 10;
    this.direction = 'right';
    this.length = 14;
    this.body = [];
    this.moveTimer = 10;
    this.moveDelta = 10;

    for (let i = this.length; i >= 0; i--) {
        this.body.push({x: this.x - i, y: this.y})
    }

    this.headIndex = this.body.length - 1
}

Snake.prototype.step = function() {
    this.moveTimer -= 1;
    if (this.moveTimer <= 0) {
        this.move();
        this.moveTimer = this.moveDelta;
    }
}

Snake.prototype.move = function() {
    directionDict = {
        'left': {x: -1, y: 0},
        'right': {x: 1, y: 0},
        'up': {x: 0, y: -1},
        'down': {x: 0, y: 1}
    }
    if (this.body[this.headIndex].x < 0 ||
        this.body[this.headIndex].x >= canvas.width / 10 ||
        this.body[this.headIndex].y < 0 ||
        this.body[this.headIndex].y >= canvas.height / 10) {
        clearInterval(loop);
        showMessage("Game Over", "red");
        return;
    }
    if (!(this.body[this.headIndex].x + directionDict[this.direction].x == food.x && this.body[this.headIndex].y + directionDict[this.direction].y == food.y)) {
        oldHeadValue = this.body[this.headIndex]
        this.headIndex = (this.headIndex + 1) % this.body.length
        oldTailValue = this.body[this.headIndex]
        this.body[this.headIndex] = {
            x: oldHeadValue.x + directionDict[this.direction].x,
            y: oldHeadValue.y + directionDict[this.direction].y
        }
        this.draw(oldTailValue)
    }
    if (this.body[this.headIndex].x + directionDict[this.direction].x == food.x && this.body[this.headIndex].y + directionDict[this.direction].y == food.y) {
        this.body.splice(this.headIndex + 1, 0, {x: food.x, y: food.y});
        this.headIndex = this.headIndex + 1
        this.draw();
        generateFood();
    }
    let bodyLocationTupleSet = new Set(this.body.slice(0, this.headIndex).concat(this.body.slice(this.headIndex + 1)).map(dict => `${dict.x},${dict.y}`));
    let currentHeadTuple = `${this.body[this.headIndex].x},${this.body[this.headIndex].y}`;
    if (bodyLocationTupleSet.has(currentHeadTuple)) {
        clearInterval(loop);
        showMessage("Game Over", "red");
        return;
    }
    if (this.body.length >= 20) {
        clearInterval(loop);
        showMessage("You Won!", "green");
        return;
    }
};

Snake.prototype.draw = function(positionToErase) {
    ctx.fillStyle = "black";
    for (let i = 0; i < this.body.length; i++) {
        ctx.fillRect(this.body[i].x * 10, this.body[i].y * 10, 8, 8);
    }
    if(positionToErase){
        ctx.clearRect(positionToErase.x * 10, positionToErase.y * 10, 8, 8);
    }
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * 10, food.y * 10, 8, 8);
};

const newSnake = new Snake()

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / 10)),
        y: Math.floor(Math.random() * (canvas.height / 10))
    }
}

generateFood();

function togglePause() {
    isPaused = !isPaused;
    const pauseButton = document.getElementById('pause-button');
    if (isPaused) {
        clearInterval(loop);
        pauseButton.textContent = 'Start Game!';
    } else {
        loop = setInterval(() => {
            newSnake.step()
        }, 1000 / 60);
        pauseButton.textContent = 'Pause Game';
    }
}

function showMessage(gameMessage, color) {
    const messageElement = document.createElement('div');
    messageElement.id = 'game-message';
    messageElement.style.color = color;
    messageElement.textContent = gameMessage;
    document.body.appendChild(messageElement);
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}

document.addEventListener('keydown', (event) => {
    switch(event.code){
        case 'ArrowLeft':
            newSnake.direction = 'left';
        break;
        case 'ArrowUp':
            newSnake.direction = 'up';
        break;
        case 'ArrowRight':
            newSnake.direction = 'right';
        break;
        case 'ArrowDown':
            newSnake.direction = 'down';
        break;
    }
})

document.getElementById('pause-button').addEventListener('click', function(){
    togglePause();
})

