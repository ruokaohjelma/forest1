const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

// Load images
const mountainImages = ["vuori1.png", "vuori2.png", "vuori3.png", "vuori4.png", "vuori5.png", "vuori6.png"].map(src => {
    let img = new Image();
    img.src = src;
    return img;
});

const treeTrunks = ["tr1.png", "tr2.png", "tr3.png", "tr4.png"].map(src => {
    let img = new Image();
    img.src = src;
    return img;
});

const treeLeaves = ["le1.png", "le2.png", "le3.png", "le4.png", "le5.png", "le6.png", "le7.png", "le8.png"].map(src => {
    let img = new Image();
    img.src = src;
    return img;
});

// Variables
let mountainFrequency = 0.1;
let treeFrequency = 0.1;
let scrollSpeed = 0.1;
let player1 = { x: canvas.width / 2, y: canvas.height - 100, img: new Image() };
let player2 = { x: canvas.width / 3, y: canvas.height - 100, img: new Image() };
player1.img.src = "g1.png";
player2.img.src = "g2.png";

let isPulling = false;

// Arrays to hold generated mountains and trees
let mountains = [];
let trees = [];

// Handle sliders
document.getElementById("mountainFrequency").addEventListener("input", function () {
    mountainFrequency = parseFloat(this.value);
});

document.getElementById("treeFrequency").addEventListener("input", function () {
    treeFrequency = parseFloat(this.value);
});

document.getElementById("scrollSpeed").addEventListener("input", function () {
    scrollSpeed = parseFloat(this.value);
});

// Generate a random position for mountains and trees
function generateMountains() {
    if (Math.random() < mountainFrequency) {
        let x = canvas.width;
        let y = Math.random() * canvas.height;
        let width = 100 + Math.random() * 200;
        let height = 100 + Math.random() * 150;
        let img = mountainImages[Math.floor(Math.random() * mountainImages.length)];
        mountains.push({ x, y, width, height, img });
    }
}

function generateTrees() {
    if (Math.random() < treeFrequency) {
        let x = canvas.width;
        let y = Math.random() * canvas.height;
        let trunk = treeTrunks[Math.floor(Math.random() * treeTrunks.length)];
        let leaves = treeLeaves[Math.floor(Math.random() * treeLeaves.length)];
        trees.push({ x, y, trunk, leaves });
    }
}

// Draw the scene
function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw mountains
    mountains.forEach(mountain => {
        ctx.drawImage(mountain.img, mountain.x, mountain.y, mountain.width, mountain.height);
    });

    // Draw trees
    trees.forEach(tree => {
        ctx.drawImage(tree.trunk, tree.x, tree.y, 30, 100);
        ctx.drawImage(tree.leaves, tree.x - 20, tree.y - 40, 70, 70);
    });

    // Draw players
    ctx.drawImage(player1.img, player1.x, player1.y, 50, 50);
    ctx.drawImage(player2.img, player2.x, player2.y, 50, 50);
}

// Update game state
function update() {
    // Move mountains and trees
    mountains.forEach(m => m.x -= scrollSpeed);
    trees.forEach(t => t.x -= scrollSpeed);

    // Remove mountains and trees that go off screen
    mountains = mountains.filter(m => m.x + m.width > 0);
    trees = trees.filter(t => t.x + 30 > 0);

    // Generate new mountains and trees
    generateMountains();
    generateTrees();

    // Apply the push/pull effect
    let p1Mode = isPulling ? -1 : 1;
    let p2Mode = -p1Mode;

    [...mountains, ...trees].forEach(obj => {
        let dx1 = player1.x - obj.x;
        let dy1 = player1.y - obj.y;
        let dx2 = player2.x - obj.x;
        let dy2 = player2.y - obj.y;

        if (Math.sqrt(dx1 * dx1 + dy1 * dy1) < 80) {
            obj.x += dx1 * 0.1 * p1Mode;
            obj.y += dy1 * 0.1 * p1Mode;
        }
        if (Math.sqrt(dx2 * dx2 + dy2 * dy2) < 80) {
            obj.x += dx2 * 0.1 * p2Mode;
            obj.y += dy2 * 0.1 * p2Mode;
        }
    });

    // Draw the scene
    drawScene();
}

// Game loop
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();

// Player 1 movement (WASD)
document.addEventListener("keydown", function (e) {
    if (e.key === "a") player1.x -= 10;
    if (e.key === "d") player1.x += 10;
    if (e.key === "w") player1.y -= 10;
    if (e.key === "s") player1.y += 10;

    // Wrap around screen
    if (player1.x < 0) player1.x = canvas.width;
    if (player1.x > canvas.width) player1.x = 0;
    if (player1.y < 0) player1.y = canvas.height;
    if (player1.y > canvas.height) player1.y = 0;
});

// Player 2 movement (Mouse)
canvas.addEventListener("mousemove", function (e) {
    player2.x = e.offsetX;
    player2.y = e.offsetY;
});

// Toggle Push/Pull behavior
document.getElementById("pushPullSwitch").addEventListener("change", function () {
    isPulling = this.checked;
});
