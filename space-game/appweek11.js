class EventEmitter {
    constructor() {
        this.listeners = {};
    }

    on(message, listener) {
        if (!this.listeners[message]) {
            this.listeners[message] = [];
        }
        this.listeners[message].push(listener);
    }

    emit(message, payload = null) {
        if (this.listeners[message]) {
            this.listeners[message].forEach((l) => l(message, payload));
        }
    }
}

class GameObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dead = false;
        this.type = '';
        this.width = 0;
        this.height = 0;
        this.img = undefined;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    rectFromGameObject() {
        return {
            top: this.y,
            left: this.x,
            bottom: this.y + this.height,
            right: this.x + this.width,
        };
    }
}

class Hero extends GameObject {
    constructor(x, y) {
        super(x, y);
        (this.width = 99), (this.height = 75);
        this.type = 'Hero';
        this.speed = { x: 0, y: 0 };
        this.cooldown = 0;
        this.life = 3;
        this.points = 0;
    }
    fire() {
        gameObjects.push(new Laser(this.x + 45, this.y - 10));
        this.cooldown = 500;

        let id = setInterval(() => {
            if (this.cooldown > 0) {
                this.cooldown -= 100;
                if (this.cooldown === 0) {
                    clearInterval(id);
                }
            }
        }, 200);
    }
    canFire() {
        return this.cooldown === 0;
    }
    decrementLife() {
        this.life--;
        if (this.life === 0) {
            this.dead = true;
        }
    }
    incrementPoints() {
        this.points += 100;
    }
}

class Enemy extends GameObject {
    constructor(x, y) {
        super(x, y);
        (this.width = 98), (this.height = 50);
        this.type = 'Enemy';
        let id = setInterval(() => {
            if (this.y < canvas.height - this.height) {
                this.y += 5;
            } else {
                console.log('Stopped at', this.y);
                clearInterval(id);
            }
        }, 300);
    }
}


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

    initGame();

    let gameLoopId = setInterval(() => {
        // 화면 초기화
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // 게임 객체 그리기
    }, 200); // 200ms마다 실행


};
function createEnemies() {
    const MONSTER_TOTAL = 5;
    const MONSTER_WIDTH = MONSTER_TOTAL * 98;
    const START_X = (canvas.width - MONSTER_WIDTH) / 2;
    const STOP_X = START_X + MONSTER_WIDTH;
    for (let x = START_X; x < STOP_X; x += 98) {
        for (let y = 0; y < 50 * 5; y += 50) {
            const enemy = new Enemy(x, y);
            enemy.img = enemyImg;
            gameObjects.push(enemy);
        }
    }
}

function createHero() {
    hero = new Hero(
        canvas.width / 2 - 45,
        canvas.height - canvas.height / 4
    );
    hero.img = heroImg;
    gameObjects.push(hero);
}


// function createEnemies(ctx, canvas, enemyImg) {
//     const MONSTER_TOTAL = 5;
//     const MONSTER_WIDTH = MONSTER_TOTAL * enemyImg.width;
//     const START_X = (canvas.width - MONSTER_WIDTH) / 2;
//     const STOP_X = START_X + MONSTER_WIDTH;
//     for (let x = START_X; x < STOP_X; x += enemyImg.width) {
//         for (let y = 0; y < enemyImg.height * 5; y += enemyImg.height) {
//             ctx.drawImage(enemyImg, x, y);
//         }
//     }
// }

// function createEnemies2(ctx, canvas, enemyImg) {
//     const MONSTER_TOTAL = 5;
//     const MONSTER_WIDTH = MONSTER_TOTAL * enemyImg.width;
//     let START_X = (canvas.width - MONSTER_WIDTH) / 2;
//     let z = MONSTER_TOTAL;
//     for (let y = 0; y < enemyImg.height * 5; y += enemyImg.height) {
//         for (let x = START_X; x < START_X + z * enemyImg.width; x += enemyImg.width) {
//             ctx.drawImage(enemyImg, x, y);
//         }
//         START_X = START_X + enemyImg.width / 2;
//         z--;
//     }

// }

const Messages = {
    KEY_EVENT_UP: 'KEY_EVENT_UP',
    KEY_EVENT_DOWN: 'KEY_EVENT_DOWN',
    KEY_EVENT_LEFT: 'KEY_EVENT_LEFT',
    KEY_EVENT_RIGHT: 'KEY_EVENT_RIGHT'
};

let heroImg,
    enemyImg,
    laserImg,
    canvas, ctx,
    gameObjects = [],
    hero,
    eventEmitter = new EventEmitter();

// EVENTS
let onKeyDown = function (e) {
    console.log(e.keyCode);
    switch (e.keyCode) {
        case 37: // 왼쪽 화살표
        case 39: // 오른쪽 화살표
        case 38: // 위쪽 화살표
        case 40: // 아래쪽 화살표
        case 32: // 스페이스바
            e.preventDefault();
            break;
        default:
            break;
    }
};
window.addEventListener('keydown', onKeyDown);

window.addEventListener("keyup", (evt) => {
    if (evt.key === "ArrowUp") {
        eventEmitter.emit(Messages.KEY_EVENT_UP);
    } else if (evt.key === "ArrowDown") {
        eventEmitter.emit(Messages.KEY_EVENT_DOWN);
    } else if (evt.key === "ArrowLeft") {
        eventEmitter.emit(Messages.KEY_EVENT_LEFT);
    } else if (evt.key === "ArrowRight") {
        eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
    }
});




function initGame() {
    gameObjects = [];
    createEnemies();
    createHero();
    eventEmitter.on(Messages.KEY_EVENT_UP, () => {
        hero.y -= 5;
    })
    eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
        hero.y += 5;
    });
    eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
        hero.x -= 5;
    });
    eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
        hero.x += 5;
    });
}