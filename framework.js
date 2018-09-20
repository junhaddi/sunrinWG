var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var LTime = Date.now();
var RTime = 0;

var deltaTime = 0.016;
var imageList = {};
var Lkeys = {};
var keys = {};
var keyDownFunc = function(e) {
    Lkeys[e.code] = 1;
    if (!keys.hasOwnProperty(e.code))
        keys[e.code] = 0;
}
var keyUpFunc = function(e) {
    Lkeys[e.code] = -1;
}
var updatekeys = function() {
    for (code in keys) {
        if (Lkeys[code] == 1 && keys[code] == 0) {
            keys[code] = 1;
        }
        else if (Lkeys[code] == 1 && keys[code] == 1) {
            keys[code] = 2;
        }
        else if (Lkeys[code] == -1 && keys[code] == -1) {
            keys[code] = 0;
            Lkeys[code] = 0;
        }
        else if (Lkeys[code] == -1) {
            keys[code] = -1; 
        }
    }
}

document.addEventListener("keydown", keyDownFunc, false);
document.addEventListener("keyup", keyUpFunc, false);

var preloadImage = function(path) {
    _image = new Image();
    _image.src = path;
    imageList[path] = {image : _image, isLoaded : false};
    _image.addEventListener("load", function() {
    imageList[path].isLoaded = true;
    }, false);
}

class GameImage {
    constructor(path) {
        this.path = path;
        this.pos = {x:0, y:0};
        this.scale = {x:1, y:1};
        this.rot = 0;
        this.z=0;
        this.anchor = {x:0.5, y:0.5};

        if (imageList[path] == undefined) {
            this.image = new Image();
            this.image.src = path;
            imageList[path] = {image:this.image, isLoaded:false};

            this.image.addEventListener("load", function() {
                imageList[path].isLoaded = true;
            }, false);
        }
        else {
            this.image = imageList[path].image;
        }
    }
    render() {
        if (imageList[this.path].isLoaded) {
            let dx = this.image.width * this.anchor.x;
            let dy = this.image.height * this.anchor.y;

            ctx.resetTransform();
            ctx.translate(this.pos.x + dx, this.pos.y + dy);
            ctx.rotate(this.rot);
            ctx.transform(this.scale.x, 0, 0, this.scale.y,
                -dx * this.scale.x, -dy * this.scale.y);
            ctx.drawImage(this.image, 0, 0);
        } 
    }
    SetZ(newZ) {
        this.z = newZ;
        nowScene.sceneImageList.sort(function(a, b) {
            return b.z - a.z;
        });
    }
} 

var nowScene = undefined;

class Scene {
    constructor() {
        this.sceneImageList = [];
    }
    init() {

    }
    start() {
        nowScene = this;
        this.init();
    }
    update() {

    }
    addImage(image) {
        this.sceneImageList.push(image);
        return image;
    }
    render() {
        for(let i = 0; i < this.sceneImageList.length; i++) {
            this.sceneImageList[i].render();
        }
    }
}

var update = function() {
    nowScene.update();
}
var render = function() {
    nowScene.render();
}
var gameLoop = function() {
    RTime = Date.now();
    deltaTime = (RTime - LTime) / 1000;
    LTime = RTime;
    updatekeys();
    update();
    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    render();
}

setInterval(gameLoop, deltaTime * 1000);
