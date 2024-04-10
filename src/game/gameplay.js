function seedObjects(count, distance, constructShape) {
    let objs = [];
    for (let n = 0; n < count; n++) {
        objs[n] = constructShape();
    }
    spread(objs, distance);
    return objs;
}

function spread(shapes, distance = getRandomInt(50)) {
    for (let x = 0; x < shapes.length; x++) {
        shapes[x].moveBy(distance, x * 360 / shapes.length)
    }
}

// Level are the stage and the objects on it.
class Level {
    objects = [];

    constructor(turtle, settings) {
        this.myTurtle = turtle;
        this.settings = settings;
        this.myTurtle.canvas.getContext("2d").globalAlpha = settings.stageAlpha;
    }

    seedObjects(settings, Shape) {
        let construct = () => {
            return new Shape(this.myTurtle, settings);
        }
        let it = seedObjects(settings.count, settings.distance, construct);

        this.addObjects(it);
        return it;
    }

    addObjects(objects) {
        this.objects = this.objects.concat(objects);
    }

    clearBackground() {
        this.myTurtle.penStyle = this.settings.spaceBgColor;
        this.myTurtle.fillAll();
    }

    gameOver() {
        this.myTurtle.penStyle = this.settings.gameOverTextColor;
        this.myTurtle.text(this.settings.gameOverText, 10, 10);
    }

    complete() {
        this.myTurtle.penStyle = this.settings.completeTextColor;
        console.log(this.settings.completeText);
        this.myTurtle.text(this.settings.completeText, 10, 10);
    }
}

// GamePlay defines the logic and events of the game (rules)
function GamePlay(player, level) {
    const self = {};
    self.isPaused = false;
    self.npcs = [];
    self.player = player;
    self.level = level;

    self.playerDead = function () {
        if (!self.isPaused) {
            console.log("Dead!");
            self.isPaused = true;
            player.dead();
            level.gameOver();
        }
    }

    self.playerWin = function () {
        if (!self.isPaused) {
            console.log("Mission complete!")
            self.isPaused = true;
            player.win();
            level.complete();
        }
    }

    self.checkLevelComplete = function () {
        if (player.alive) {
            for (let piece of self.npcs) {
                if (piece.isFood) return; // Food is left uncaught
            }
            // All food is collected and still alive: mission complete!
            self.playerWin();
        }
    }

    self.onCollision = function (shape) {
        if (shape.isDeadly) { // Hit by a deadly object!
            player.splash();
            player.alive = false;
            // In 0.5 seconds, display game over.
            setTimeout(self.playerDead, 500);
        } else if (shape.isFood) { // Found food!
            console.log("Eaten food.")
            shape.isFood = false;
            player.eatFood();
            // In 10 seconds: check for mission complete!
            setTimeout(self.checkLevelComplete, 10000);
        }
    }

    self.switchPause = function () {
        self.isPaused = !self.isPaused;
    }

    self.restart = function () {
        self.isPaused = false;
        player.reset();
        self.npcs.forEach(p => {
            if (!p.isDeadly) p.isFood = true
        });
    }

    return self;
}
