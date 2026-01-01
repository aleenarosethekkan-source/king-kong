const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const gravity = 0.5;
const jumpPower = -10;
const playerSpeed = 5;

// Player
const player = {
    x: 50,
    y: 550,
    width: 30,
    height: 30,
    color: 'blue',
    velocityX: 0,
    velocityY: 0,
    isJumping: false
};

// Kong
const kong = {
    x: 100,
    y: 50,
    width: 60,
    height: 60,
    color: 'brown'
};

// Princess
const princess = {
    x: 700,
    y: 50,
    width: 30,
    height: 30,
    color: 'pink'
};

// Platforms
const platforms = [
    { x: 0, y: 580, width: 800, height: 20 },
    { x: 200, y: 450, width: 600, height: 20 },
    { x: 0, y: 320, width: 600, height: 20 },
    { x: 200, y: 190, width: 600, height: 20 },
    { x: 0, y: 100, width: 200, height: 20 },
    { x: 650, y: 100, width: 200, height: 20 }
];

// Barrels
let barrels = [];
const barrelSpeed = 3;
const barrelSpawnRate = 150; // Every 150 frames
let frameCount = 0;

// Input
const keys = {
    right: false,
    left: false
};

function handleKeyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        keys.right = true;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        keys.left = true;
    } else if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') && !player.isJumping) {
        player.isJumping = true;
        player.velocityY = jumpPower;
    }
}

function handleKeyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        keys.right = false;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        keys.left = false;
    }
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function update() {
    // Player movement
    if (keys.right) {
        player.velocityX = playerSpeed;
    } else if (keys.left) {
        player.velocityX = -playerSpeed;
    } else {
        player.velocityX = 0;
    }

    // Apply physics
    player.x += player.velocityX;
    player.y += player.velocityY;
    player.velocityY += gravity;

    // Platform collision
    let onPlatform = false;
    platforms.forEach(platform => {
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height + player.velocityY
        ) {
            player.isJumping = false;
            player.y = platform.y - player.height;
            player.velocityY = 0;
            onPlatform = true;
        }
    });

    // Spawn barrels
    frameCount++;
    if (frameCount >= barrelSpawnRate) {
        barrels.push({ x: kong.x + kong.width / 2, y: kong.y + kong.height, width: 20, height: 20, color: 'red' });
        frameCount = 0;
    }

    // Update barrels
    barrels.forEach((barrel, index) => {
        barrel.y += barrelSpeed;
        if (barrel.y > canvas.height) {
            barrels.splice(index, 1);
        }

        // Barrel collision with player
        if (
            player.x < barrel.x + barrel.width &&
            player.x + player.width > barrel.x &&
            player.y < barrel.y + barrel.height &&
            player.y + player.height > barrel.y
        ) {
            alert('Game Over!');
            document.location.reload();
        }
    });

    // Win condition
    if (
        player.x < princess.x + princess.width &&
        player.x + player.width > princess.x &&
        player.y < princess.y + princess.height &&
        player.y + player.height > princess.y
    ) {
        alert('You Win!');
        document.location.reload();
    }
    
    // Boundary check
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw platforms
    ctx.fillStyle = 'orange';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw Kong
    ctx.fillStyle = kong.color;
    ctx.fillRect(kong.x, kong.y, kong.width, kong.height);

    // Draw Princess
    ctx.fillStyle = princess.color;
    ctx.fillRect(princess.x, princess.y, princess.width, princess.height);

    // Draw barrels
    barrels.forEach(barrel => {
        ctx.fillStyle = barrel.color;
        ctx.fillRect(barrel.x, barrel.y, barrel.width, barrel.height);
    });
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
