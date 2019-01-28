
const minX = 1;
const maxX = 400;
const minY = -4;
const maxY = 420;
const crashDistance = 65;
const yPositions = [60, 145, 230]
const enemySpeeds = [100, 200, 300, 350]
let allEnemies = []
window.allEnemies = allEnemies

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}
// Enemies our player must avoid
var Enemy = function (id, speed = 100, yPosition = 230) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    this.y = yPosition;
    this.speed = speed;
    this.id = id;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    const newPos = this.x + this.speed * dt;
    if (newPos >= maxX + 100) {
        // Clear this enemy
        allEnemies = allEnemies.filter(it => it.id !== this.id)

    } else {
        this.x = newPos
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// The player
var Player = function () {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
    this.homeX = 200;
    this.homeY = 420;
    this.x = 200;
    this.y = 420;
    this.speed = 85;
};

Player.prototype.update = function () {
    const centerPadX = 42;
    const centerPadY = 42;
    // Check if we have hit any of the enemies
    // use the distance between points 
    // https://www.mathwarehouse.com/algebra/distance_formula/index.php
    allEnemies.some(enemy => {
        const diffX = this.x - enemy.x;
        const diffY = this.y - enemy.y;
        const xSqaures = Math.pow(diffX, 2)
        const ySqaures = Math.pow(diffY, 2)
        const distance = Math.sqrt((xSqaures + ySqaures))
        if (distance < crashDistance) {
            this.x = this.homeX;
            this.y = this.homeY;
        }
    })
    if (this.y < minY) {
        this.x = this.homeX;
        this.y = this.homeY;

        // Do celebration
        const body = document.querySelector("body");
        body.classList.add("blink")
        setTimeout(() => {
            body.classList.remove("blink")
        }, 2000)
    }
};

Player.prototype.move = function (direction, value) {
    this[direction] = this[direction] + value;
};

// Draw the player on the screen
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


Player.prototype.handleInput = function (input) {
    if (!input) {
        // Noting to do
        return;
    }

    switch (input) {
        case 'left':
            if (this.x > minX) {
                this.move("x", -this.speed);
            }
            break;
        case 'right':
            if (this.x <= maxX) {
                this.move("x", this.speed);
            }
            break;
        case 'up':
            if (this.y > minY) {
                this.move("y", -this.speed);
            }
            break;
        case 'down':
            if (this.y < maxY) {
                this.move("y", this.speed);
            }
            break;
    }
    console.log("x,y", { x: this.x, y: this.y })
};

function getId(min = 0, max = 100000) {
    return Math.random() * (max - min) + min;
}

setInterval(() => {
    allEnemies.push(new Enemy(getId(), enemySpeeds.random(), yPositions.random()))
}, 2000)
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
