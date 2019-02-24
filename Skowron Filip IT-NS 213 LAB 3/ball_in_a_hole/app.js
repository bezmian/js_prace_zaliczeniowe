const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let ballRadius = 8;
let blockWidth = 0;
let blockHeight = 0;

let ball;
let blocks = [];
let collectables = [];
let endGame;
let counter = 0;

let board = [
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 1, 1, 3, 1, 1, 1, 1, 0],
    [0, 1, 3, 0, 1, 0, 0, 3, 0, 0],
    [0, 1, 0, 0, 3, 0, 0, 1, 1, 1],
    [0, 0, 1, 1, 1, 0, 1, 0, 1, 3],
    [1, 0, 3, 0, 0, 0, 0, 3, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 3, 0, 0, 0, 0],
    [0, 3, 0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 2, 0, 0, 0, 0, 0, 0]
];

window.addEventListener('deviceorientation', moveBall);

(function () {
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 120;

        blockWidth = canvas.width / board.length;
        blockHeight = canvas.height / board[0].length;
        ballRadius = blockHeight / 4;
    }

    resizeCanvas();
})();

function configureBoard() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            switch (board[i][j]) {
                case 1:
                    blocks.push(new Block(j * blockWidth, i * blockHeight));
                    break;
                case 2:
                    endGame = new EndGame(j * blockWidth + blockWidth / 2, i * blockHeight + blockHeight / 2, ballRadius);
                    break;
                case 3:
                    collectables.push(new Collectable(j * blockWidth + blockWidth / 2, i * blockHeight + blockHeight / 2, ballRadius));
                    break;
            }
        }
    }
}

class Ball {
    constructor(x, y, radius) {
        this.x = (x === null) ? 0 : x;
        this.y = (y === null) ? 0 : y;
        this.radius = (radius === null) ? 0 : radius;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Block {
    constructor(x, y) {
        this.x = (x === null) ? 0 : x;
        this.y = (y === null) ? 0 : y;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, blockWidth, blockHeight);
        ctx.fill()
    }
}

class Collectable {
    constructor(x, y, radius) {
        this.x = (x === null) ? 0 : x;
        this.y = (y === null) ? 0 : y;
        this.radius = (radius === null) ? 0 : radius;
        this.collected = false;
    }

    draw(ctx) {
        if (!this.collected) {
            ctx.beginPath();
            ctx.fillStyle = "green";
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    collect() {
        this.collected = true;
    }
}

class EndGame {
    constructor(x, y, radius) {
        this.x = (x === null) ? 0 : x;
        this.y = (y === null) ? 0 : y;
        this.radius = (radius === null) ? 0 : radius;
        this.activated = false;
    }

    draw(ctx) {
        if (this.activated) {
            ctx.beginPath();
            ctx.fillStyle = "red";
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    activate() {
        this.activated = true;
    }
}

function moveBall(e) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let canMoveBottom = true;
    let canMoveTop = true;
    let canMoveLeft = true;
    let canMoveRight = true;

    blocks.forEach(block => {
        let dx = (ball.x + ballRadius / 2) - (block.x + blockWidth / 2);
        let dy = (ball.y + ballRadius / 2) - (block.y + blockHeight / 2);
        let width = (ballRadius + blockWidth) / 2;
        let height = (ballRadius + blockHeight) / 2;
        let crossWidth = width * dy;
        let crossHeight = height * dx;
        let collision = 'none';
        if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
            if (crossWidth > crossHeight) {
                collision = (crossWidth > (-crossHeight)) ? 'bottom' : 'left';
            } else {
                collision = (crossWidth > -(crossHeight)) ? 'right' : 'top';
            }
        }
        if (collision === 'bottom') {
            canMoveTop = false;
        } else if (collision === 'left') {
            canMoveRight = false;
        } else if (collision === 'right') {
            canMoveLeft = false;
        } else if (collision === 'top') {
            canMoveBottom = false;
        }
        return (collision);
    });

    collectables.forEach(collectable => {
        function isRightHit() {
            return ball.x + ball.radius > collectable.x
        }

        function isLeftHit() {
            return ball.x - ball.radius < collectable.x + blockWidth
        }

        function isBottomHit() {
            return ball.y + ball.radius > collectable.y
        }

        function isTopHit() {
            return ball.y - ball.radius < collectable.y + blockHeight
        }

        if (isRightHit()
            && isLeftHit()
            && isBottomHit()
            && isTopHit()) {
            collectable.collect();
            if (collectables.filter(value => !value.collected).length === 0) {
                endGame.activate();
            }
        }
    });

    if (endGame.activated) {
        function isRightHit() {
            return ball.x + ball.radius > endGame.x
        }

        function isLeftHit() {
            return ball.x - ball.radius < endGame.x + blockWidth
        }

        function isBottomHit() {
            return ball.y + ball.radius > endGame.y
        }

        function isTopHit() {
            return ball.y - ball.radius < endGame.y + blockHeight
        }

        if (isRightHit()
            && isLeftHit()
            && isBottomHit()
            && isTopHit()) {
            alert("You win after " + counter + " seconds!");
        }
    }

    console.log("beta" + e.beta);
    console.log("gamma" + e.gamma);

    if (e.beta < 0 && canMoveTop) {
        ball.y += e.beta;
    } else if (e.beta > 0 && canMoveBottom) {
        ball.y += e.beta;
    }

    if (e.gamma > 0 && canMoveRight) {
        ball.x += e.gamma;
    } else if (e.gamma < 0 && canMoveLeft) {
        ball.x += e.gamma;
    }

    if (ball.x - ball.radius < 0) {
        ball.x = ball.radius
    }
    if (ball.x + ball.radius > canvas.width) {
        ball.x = canvas.width - ball.radius
    }
    if (ball.y - ball.radius < 0) {
        ball.y = ball.radius
    }
    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius
    }

    ball.draw(ctx);
    blocks.forEach(block => block.draw(ctx));
    collectables.forEach(collectable => collectable.draw(ctx));
    endGame.draw(ctx);
}

ball = new Ball(10, 10, ballRadius);
configureBoard();

let x = setInterval(function () {
    counter += 1;
    document.getElementById("counter").innerHTML = counter
}, 1000);