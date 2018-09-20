var testScene = new Scene();

class Enemy {
    constructor(_x, _y) {
        this.gImage = nowScene.addImage(new GameImage("enemy.png"));
        this.gImage.pos = {x:_x, y:_y}
        this.dir = 1;
        this.eTime = Math.random(2) + 1;
        this.speed = 100;
        this.hp = 10;
    }
    move() {
        this.gImage.pos.y += this.speed * this.dir * deltaTime;
    }
}

testScene.init = function() {
    preloadImage("player.png");
    preloadImage("bullet.png");
    preloadImage("enemy.png");
    this.chr = this.addImage(new GameImage("player.png"));
    this.bullets = [];
    this.bulletETime = 0;
    this.enemy = new Enemy(300, 70);
}

testScene.checkCollision = function() {
    for (let i = 0; i < this.bullets.length; i++) {
        let b = this.bullets[i];
        let e = this.enemy.gImage;
        if (e.pos.x <= b.pos.x + b.image.width &&
            e.pos.x + e.image.width >= b.pos.x &&
            e.pos.y <= b.pos.y + b.image.height &&
            e.pos.y + e.image.height >= b.pos.y)
        {
            this.bullets.splice(i, 1);
            this.enemy.hp--;
            console.log(this.enemy.hp);
        }
    }
}

testScene.update = function() {
    this.bulletETime += deltaTime;
    //  Move
    if (keys["KeyA"] > 0) {
        this.chr.pos.x -= 200 * deltaTime;
    }
    if (keys["KeyD"] > 0) {
        this.chr.pos.x += 200 * deltaTime;
    }
    if (keys["KeyS"] > 0) {
        this.chr.pos.y += 200 * deltaTime;
    }
    if (keys["KeyW"] > 0) {
        this.chr.pos.y -= 200 * deltaTime;
    }

    //  Attack
    if (keys["Space"] > 0) {
        if (this.bulletETime >= 0.5) {
            let b = this.addImage(new GameImage("bullet.png"));
            b.pos = {x:this.chr.pos.x + 25, y:this.chr.pos.y + 10 - b.image.height / 2};
            b.SetZ(1);
            this.bullets.push(b);
            let b2 = this.addImage(new GameImage("bullet.png"));
            b2.pos = {x:this.chr.pos.x + 25, y:this.chr.pos.y + 40 - b2.image.height / 2};
            this.bullets.push(b2);
            this.bulletETime = 0;
            b2.SetZ(1);
        }
    }

    //  Bullet
    for (let i = 0; i < this.bullets.length; i++) {
        if (this.bullets[i].pos.x >= canvas.width) {
            this.bullets.splice(i, 1);
            continue;
        }
        this.bullets[i].pos.x += 500 * deltaTime;
    }

    //  Enemy
    this.enemy.eTime -= deltaTime;
    if (this.enemy.eTime <= 0 || this.enemy.gImage.pos.y <= 0 || this.enemy.gImage.pos.y + this.enemy.gImage.image.height >= canvas.height) {
        this.enemy.dir *= -1;
        this.enemy.eTime = Math.random(2) + 1;
    }
    this.enemy.move();

    testScene.checkCollision();
}
testScene.start();