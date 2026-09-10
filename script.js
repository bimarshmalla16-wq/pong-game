// Canvas and context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 400;

// Game objects
const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 8;
const ballSpeed = 5;

// Player paddle
const player = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 6
};

// Computer paddle
const computer = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 4
};

// Ball object
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballSize,
    dx: ballSpeed,
    dy: ballSpeed,
    speed: ballSpeed
};

// Score
let playerScore = 0;
let computerScore = 0;

// Keyboard input
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Mouse input
let mouseY = canvas.height / 2;
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Update player paddle position
function updatePlayer() {
    // Mouse control
    if (mouseY - paddleHeight / 2 > 0 && mouseY - paddleHeight / 2 < canvas.height - paddleHeight) {
        player.y = mouseY - paddleHeight / 2;
    }

    // Arrow key control
    if (keys['ArrowUp'] && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys['ArrowDown'] && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }
}

// Update computer paddle position (AI)
function updateComputer() {
    const computerCenter = computer.y + computer.height / 2;
    const ballCenter = ball.y;

    // Simple AI: follow the ball with some delay
    if (computerCenter < ballCenter - 35) {
        if (computer.y < canvas.height - computer.height) {
            computer.y += computer.speed;
        }
    } else if (computerCenter > ballCenter + 35) {
        if (computer.y > 0) {
            computer.y -= computer.speed;
        }
    }
}

// Update ball position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top and bottom wall collision
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = ball.y - ball.radius < 0 ? ball.radius : canvas.height - ball.radius;
    }

    // Player paddle collision
    if (
        ball.x - ball.radius < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height
    ) {
        ball.dx = -ball.dx;
        ball.x = player.x + player.width + ball.radius;
        // Add spin based on paddle position
        let deltaY = ball.y - (player.y + player.height / 2);
        ball.dy = deltaY * 0.1;
    }

    // Computer paddle collision
    if (
        ball.x + ball.radius > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height
    ) {
        ball.dx = -ball.dx;
        ball.x = computer.x - ball.radius;
        // Add spin based on paddle position
        let deltaY = ball.y - (computer.y + computer.height / 2);
        ball.dy = deltaY * 0.1;
    }

    // Scoring
    if (ball.x - ball.radius < 0) {
        computerScore++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        resetBall();
    }

    // Update score display
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() - 0.5) * ball.speed;
}

// Draw functions
function drawPaddle(paddle) {
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.shadowColor = 'rgba(74, 222, 128, 0.8)';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.shadowColor = 'rgba(74, 222, 128, 0.8)';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
}

function drawCenterLine() {
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.3)';
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    drawCenterLine();

    // Update game state
    updatePlayer();
    updateComputer();
    updateBall();

    // Draw game objects
    drawPaddle(player);
    drawPaddle(computer);
    drawBall();

    // Continue loop
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();