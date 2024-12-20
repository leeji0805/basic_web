//클래스
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
    clear() {
        this.listeners = {};
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
        this.isInvincible = false; // 무적 상태 여부
    }
    fire() {
        gameObjects.push(new Laser(this.x + 45, this.y - 10));
        this.cooldown = 500;

        let id = setInterval(() => {
            if (this.cooldown > 0) {
                this.cooldown -= 100;
                if (this.cooldown === 0) {
                    helperfire(id);
                }
            }
        }, 200);
    }
    canFire() {
        return this.cooldown === 0;
    }
    decrementLife() {
        if (!this.isInvincible) { // 무적 상태가 아닐 때만 생명 감소
            this.life--;
            this.activateInvincibility(); // 무적 상태 활성화
            if (this.life === 0) {
                this.dead = true;
            }
        }
    }

    activateInvincibility() {
        this.isInvincible = true; // 무적 상태 활성화
        setTimeout(() => {
            this.isInvincible = false; // 일정 시간 후 무적 해제
        }, 3000); // 무적 상태 지속 시간: 3초
    }

    draw(ctx) {
        if (this.isInvincible) {
            ctx.globalAlpha = 0.5; // 무적 상태일 때 반투명 효과
            super.draw(ctx);
            ctx.globalAlpha = 1.0; // 원래 투명도로 복원
        } else {
            super.draw(ctx);
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

    }

    fire() {
        this.cooldown = 200;
        // 이전 인터벌 제거
        if (this.fireIntervalId) {
            clearInterval(this.fireIntervalId);
        }
        this.fireIntervalId = setInterval(() => {
            if (this.cooldown > 0) {
                this.cooldown -= 100;
                if (this.cooldown === 0) {
                    this.cooldown = 200;
                    gameObjects.push(new Laser(this.x + 17, this.y - 10));
                }
            }
        }, 200);
    }

    destroy() {
        if (this.fireIntervalId) {
            clearInterval(this.fireIntervalId);
        }
        this.dead = true;
    }

    decrementLife() {
        this.life--;
        if (this.life === 0) {
            this.dead = true;

        }

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


// 콜백 함수
window.onload = async () => {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    lifeImg = await loadTexture("assets/life.png");
    heroImg = await loadTexture("assets/player.png");
    enemyImg = await loadTexture("assets/enemyShip.png");
    laserImg = await loadTexture("assets/laserRed.png");
    bgImg = await loadTexture('assets/starBackground.png');
    helperImg = await loadTexture('assets/helper.png');
    laserGreenShot = await loadTexture('assets/laserGreenShot.png');

    pattern = ctx.createPattern(bgImg, 'repeat');
    initGame();
    gameLoopId = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        drawGameObjects(ctx);
        drawPoints();
        drawLife();
        updateHeroMovement();
        updateGameObjects(); // 충돌 감지
    }, 100)
};


//함수
function loadTexture(path) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            resolve(img);
        };
    })
}

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
        canvas.width / 2 - 90,
        canvas.height - (canvas.height / 4)

    );
    helper1.img = helperImg;

    helper2 = new Helper(
        canvas.width / 2 + 45,
        canvas.height - (canvas.height / 4)
    );
    helper2.img = helperImg;

    gameObjects.push(helper1);
    gameObjects.push(helper2);
    helper1.fire();
    helper2.fire();


}

function isHeroDead() {
    return hero.life <= 0;
}
function isEnemiesDead() {
    const enemies = gameObjects.filter((go) => go.type === "Enemy" &&
        !go.dead);
    return enemies.length === 0;
}



function drawLife() {
    const START_POS = canvas.width - 180;
    for (let i = 0; i < hero.life; i++) {
        ctx.drawImage(
            lifeImg,
            START_POS + (45 * (i + 1)),
            canvas.height - 37);
    }
}
function drawPoints() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "left";
    drawText("Points: " + hero.points, 10, canvas.height - 20);
}
function drawText(message, x, y) {
    ctx.fillText(message, x, y);
}
function displayMessage(message, color = "red") {
    ctx.font = "30px Arial";
    ctx.fillStyle = color;
    ctx.textAlign = "center";

    // \n 기준으로 메시지를 나눔
    const lines = message.split("\n");
    const lineHeight = 40; // 각 줄 간격

    // 화면 중앙부터 위아래로 줄바꿈 처리
    let startY = canvas.height / 2 - (lines.length - 1) * lineHeight / 2;

    lines.forEach((line, index) => {
        ctx.fillText(line.trim(), canvas.width / 2, startY + index * lineHeight);
    });
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
    enemies.forEach(enemy => {
        const heroRect = hero.rectFromGameObject();
        if (intersectRect(heroRect, enemy.rectFromGameObject())) {
            eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy });
        }
    })
    // 죽은 객체 제거
    gameObjects = gameObjects.filter(go => !go.dead);
}
function endGame(win) {
    helper1.destroy();
    helper2.destroy();
    clearInterval(gameLoopId);
    // 게임 화면이 겹칠 수 있으니, 200ms 지연

    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (win) {
            displayMessage(
                `Victory!!! 
                 \n 너는 가졌다 ${hero.points}point
                 \n Pew Pew... - Press [Enter] to start a new game Captain Pew Pew`,
                "green"
            );
        } else {
            displayMessage(
                "You died !!! Press [Enter] to start a new game Captain Pew Pew"
            );
        }
    }, 200)
}

function resetGame() {
    if (gameLoopId) {
        clearInterval(gameLoopId); // 게임 루프 중지, 중복 실행 방지
        eventEmitter.clear(); // 모든 이벤트 리스너 제거, 이전 게임 세션 충돌 방지
        initGame(); // 게임 초기 상태 실행
        gameLoopId = setInterval(() => { // 100ms 간격으로 새로운 게임 루프 시작
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            updateHeroMovement();
            drawPoints();
            drawLife();
            updateGameObjects();
            drawGameObjects(ctx);
        }, 100);
    }
}

function loadNextStage() {
    gameObjects = gameObjects.filter(go => go.type === "Hero"); // Hero는 유지
    helper1.destroy(); // 도우미 제거
    helper2.destroy(); // 도우미 제거
    createEnemies(); // 새로운 적 생성
    // 영웅 위치 초기화 (점수와 생명은 유지)
    hero.x = canvas.width / 2 - 45;
    hero.y = canvas.height - canvas.height / 4;
    createHelper(); // 도우미 생성
}

// 이벤트 리슨 핸들러

const Messages = {
    KEY_EVENT_SPACE: 'KEY_EVENT_SPACE',
    COLLISION_ENEMY_LASER: 'COLLISION_ENEMY_LASER',
    COLLISION_ENEMY_HERO: 'COLLISION_ENEMY_HERO',
    GAME_END_LOSS: "GAME_END_LOSS",
    GAME_END_WIN: "GAME_END_WIN",
    KEY_EVENT_ENTER: "KEY_EVENT_ENTER",
};
let currentStage = 1;
const totalStages = 1;
let gameLoopId,
    heroImg,
    helperImg,
    enemyImg,
    laserImg,
    canvas, ctx,
    gameObjects = [],
    hero,
    helper1,
    helper2,
    lifeImg,
    laserGreenShot,
    eventEmitter = new EventEmitter();
const keyState = {}; // 키 상태 저장 객체

window.addEventListener('keydown', (e) => {
    keyState[e.key] = true; // 키가 눌렸음을 기록
    e.preventDefault(); // 기본 동작 방지
    handleImmediateMovement(e.key);
});

window.addEventListener('keyup', (e) => {
    keyState[e.key] = false; // 키가 떼졌음을 기록
    e.preventDefault(); // 기본 동작 방지
});

function handleImmediateMovement(key) {
    const speed = 5; // 이동 속도

    if (key === 'ArrowUp') {
        hero.y -= speed;
        helper1.y -= speed;
        helper2.y -= speed;
    } else if (key === 'ArrowDown') {
        hero.y += speed;
        helper1.y += speed;
        helper2.y += speed;
    } else if (key === 'ArrowLeft') {
        hero.x -= speed;
        helper1.x -= speed;
        helper2.x -= speed;
    } else if (key === 'ArrowRight') {
        hero.x += speed;
        helper1.x += speed;
        helper2.x += speed;
    }
}

let onKeyDown = function (e) {
    console.log(e.keyCode);
    switch (e.keyCode) {
        case 32: // 스페이스바
            e.preventDefault();
            break;
        default:
            break;
    }
};
window.addEventListener('keydown', onKeyDown);

window.addEventListener("keyup", (evt) => {
    if (evt.key === ' ' || evt.code === 'Space') {
        eventEmitter.emit(Messages.KEY_EVENT_SPACE);
    }
    else if (evt.code === "Enter") {
        eventEmitter.emit(Messages.KEY_EVENT_ENTER);
    }
}); 

function updateHeroMovement() {
    const speed = 5; // 이동 속도

    if (keyState['ArrowUp']) {
        hero.y -= speed;
        helper1.y -= speed;
        helper2.y -= speed;
    }
    if (keyState['ArrowDown']) {
        hero.y += speed;
        helper1.y += speed;
        helper2.y += speed;
    }
    if (keyState['ArrowLeft']) {
        hero.x -= speed;
        helper1.x -= speed;
        helper2.x -= speed;
    }
    if (keyState['ArrowRight']) {
        hero.x += speed;
        helper1.x += speed;
        helper2.x += speed;
    }
}




// 초기화 함수 
function initGame() {
    gameObjects = [];
    createEnemies();
    createHero();
    createHelper();

    eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
        first.dead = true;
        second.dead = true;
        hero.incrementPoints();
        if (isEnemiesDead()) {
            if (currentStage < totalStages) {
                currentStage++;
                loadNextStage();
            } else {
                eventEmitter.emit(Messages.GAME_END_WIN);
            }
        }
    })
    eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => {
        enemy.dead = true;
        hero.decrementLife();
        if (isHeroDead()) {
            eventEmitter.emit(Messages.GAME_END_LOSS);
            return; // loss before victory
        }
        if (isEnemiesDead()) {
            if (currentStage < totalStages) {
                currentStage++;
                loadNextStage();
            } else {
                eventEmitter.emit(Messages.GAME_END_WIN);
            }
        }
    });
    eventEmitter.on(Messages.GAME_END_WIN, () => {
        endGame(true);
    });
    eventEmitter.on(Messages.GAME_END_LOSS, () => {
        endGame(false);
    });
    

    eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => {
        enemy.dead = true;
        hero.decrementLife();
        if (isHeroDead()) {
            eventEmitter.emit(Messages.GAME_END_LOSS);
            return; // loss before victory
        }
        if (isEnemiesDead()) {
            if (currentStage < totalStages) {
                currentStage++;
                loadNextStage();
            } else {
                eventEmitter.emit(Messages.GAME_END_WIN);
            }
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
    eventEmitter.on(Messages.KEY_EVENT_ENTER, () => {
        resetGame();
    });

}