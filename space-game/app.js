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

class Helper extends GameObject {
    constructor(x, y) {
        super(x, y);
        (this.width = 44.5), (this.height = 41.29);
        this.type = 'Helper';
        this.speed = { x: 0, y: 0 };
        this.cooldown = 0;
        this.life = 1;
        this.points = 0;

        setInterval(() => {
            if (this.cooldown === 0) {
                this.fire();
            }
        }, 100);
    }

    fire() {
        gameObjects.push(new Laser(this.x + 17, this.y - 10));
        this.cooldown = 100;

        let id = setInterval(() => {
            if (this.cooldown > 0) {
                this.cooldown -= 100;
                if (this.cooldown === 0) {
                    clearInterval(id);
                }
            }
        }, 200);
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

class Laser extends GameObject {
    constructor(x, y) {
        super(x, y);
        (this.width = 9), (this.height = 33);
        this.type = 'Laser';
        this.img = laserImg;
        let id = setInterval(() => {
            if (this.y > 0) {
                this.y -= 15;
            } else {
                this.dead = true;
                clearInterval(id);
            }
        }, 100);
    }
}

class pop extends GameObject {
	constructor(x, y, img) {
		super(x, y);
		this.img = img;
		this.type = 'pop';
		(this.width = 56 * 2), (this.height = 54 * 2);
		setTimeout(() => {
			this.dead = true;
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
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    heroImg = await loadTexture("assets/player.png");
    enemyImg = await loadTexture("assets/enemyShip.png");
    laserImg = await loadTexture("assets/laserRed.png");
    bgImg = await loadTexture('assets/starBackground.png');
    helperImg = await loadTexture('assets/helper.png');
    laserGreenShot = await loadTexture('assets/laserGreenShot.png');

    pattern = ctx.createPattern(bgImg, 'repeat');
    initGame();
    let gameLoopId = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGameObjects(ctx);
        updateGameObjects(); // 충돌 감지
    }, 100)
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
function createHelper() {
    helper1 = new Helper(
        canvas.width / 2 - 90 ,
        canvas.height - (canvas.height / 4)

    );
    helper1.img = helperImg;

    helper2 = new Helper(
        canvas.width / 2 + 45 , 
        canvas.height - (canvas.height / 4)
    );
    helper2.img = helperImg;

    gameObjects.push(helper1);
    gameObjects.push(helper2);
    

}


function drawGameObjects(ctx) {
    gameObjects.forEach(go => go.draw(ctx));
}

function intersectRect(r1, r2) {
    return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
}

function updateGameObjects() {
    const enemies = gameObjects.filter(go => go.type === 'Enemy');
    const lasers = gameObjects.filter((go) => go.type === "Laser");
    lasers.forEach((l) => {
        enemies.forEach((m) => {
            if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
                eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
                    first: l,
                    second: m,
                    
                });
                

            }
        });
    });
    // 죽은 객체 제거
    gameObjects = gameObjects.filter(go => !go.dead);
}

const Messages = {
    KEY_EVENT_UP: 'KEY_EVENT_UP',
    KEY_EVENT_DOWN: 'KEY_EVENT_DOWN',
    KEY_EVENT_LEFT: 'KEY_EVENT_LEFT',
    KEY_EVENT_RIGHT: 'KEY_EVENT_RIGHT',
    KEY_EVENT_SPACE: 'KEY_EVENT_SPACE',
    COLLISION_ENEMY_LASER: 'COLLISION_ENEMY_LASER',
    COLLISION_ENEMY_HERO: 'COLLISION_ENEMY_HERO',
};

let heroImg,
    helperImg,
    enemyImg,
    laserImg,
    canvas, ctx,
    gameObjects = [],
    hero,
    helper1,
    helper2,
    laserGreenShot,
    eventEmitter = new EventEmitter();

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
    } else if (evt.key === ' ' || evt.code === 'Space') {
        eventEmitter.emit(Messages.KEY_EVENT_SPACE);
    }
});




function initGame() {
    gameObjects = [];
    createEnemies();
    createHero();
    createHelper();
    eventEmitter.on(Messages.KEY_EVENT_UP, () => {
        hero.y -= 5;
        helper1.y -= 5;
        helper2.y -= 5;
    })
    eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
        hero.y += 5;
        helper1.y += 5;
        helper2.y += 5;
    });
    eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
        hero.x -= 5;
        helper1.x -= 5;
        helper2.x -= 5;
    });
    eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
        hero.x += 5;
        helper1.x += 5;
        helper2.x += 5;
    });


    eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => {
        enemy.dead = true;
        hero.decrementLife();
        if (isHeroDead()) {
            eventEmitter.emit(Messages.GAME_END_LOSS);
            return; // loss before victory
        }
        if (isEnemiesDead()) {
            eventEmitter.emit(Messages.GAME_END_WIN);
        }
    });

    eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
        if (hero.canFire()) {
            hero.fire();
        }
    });

    eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
        
        first.dead = true; // 레이저 제거
        second.dead = true; // 적 제거

        gameObjects.push(new pop(second.x, second.y, laserGreenShot));
        
    });

}