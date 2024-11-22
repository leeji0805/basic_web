
function loadTexture(path) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            resolve(img);
        };
    })
}
window.onload = async () => {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    const heroImg = await loadTexture('assets/player.png')
    const enemyImg = await loadTexture('assets/enemyShip.png')
    const bgImg = await loadTexture('assets/starBackground.png');
    const pattern = ctx.createPattern(bgImg, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(heroImg, canvas.width / 2 - 45, canvas.height - (canvas.height / 4));
    const helperImg = await loadTexture('assets/player.png');
    const helperWidth = heroImg.width / 2;
    const helperHeight = heroImg.height / 2;
    ctx.drawImage(helperImg, canvas.width / 2 - 45 - helperWidth - 10, canvas.height - (canvas.height / 4), helperWidth, helperHeight);
    ctx.drawImage(helperImg, canvas.width / 2 + 45 + 10, canvas.height - (canvas.height / 4), helperWidth, helperHeight);

    createEnemies2(ctx, canvas, enemyImg);

};

function createEnemies(ctx, canvas, enemyImg) {
    const MONSTER_TOTAL = 5;
    const MONSTER_WIDTH = MONSTER_TOTAL * enemyImg.width;
    const START_X = (canvas.width - MONSTER_WIDTH) / 2;
    const STOP_X = START_X + MONSTER_WIDTH;
    for (let x = START_X; x < STOP_X; x += enemyImg.width) {
        for (let y = 0; y < enemyImg.height * 5; y += enemyImg.height) {
            ctx.drawImage(enemyImg, x, y);
        }
    }
}

function createEnemies2(ctx, canvas, enemyImg) {
    const MONSTER_TOTAL = 5;
    const MONSTER_WIDTH = MONSTER_TOTAL * enemyImg.width;
    let START_X = (canvas.width - MONSTER_WIDTH) / 2;
    let z = MONSTER_TOTAL;
    for (let y = 0; y < enemyImg.height * 5; y += enemyImg.height) {
        for (let x = START_X; x < START_X + z * enemyImg.width; x += enemyImg.width) {
            ctx.drawImage(enemyImg, x, y);
        }
        START_X= START_X + enemyImg.width/2;
        z--;
    }

}










