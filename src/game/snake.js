function constructLevel(mainTurtle, settings) {
    // --- Define main entities and moving objects:
    const star = function () {
        const star = new Shape(mainTurtle);
        star.myTurtle.penWidth = 1;

        star.draw = function () {
            const t = star.myTurtle;
            t.square = function (a) {
                this.rect(a, a)
                return this;
            };

            t.penStyle = settings.starOutline;
            for (let i = 0; i < 6; i++) t.square(60).left(10).square(50).left(10).square(40).left(30).square(30).left(10);
            t.penStyle = settings.starCenter;
            t.circle(3);
        }

        star.move = function () {
            star.moveBy(0, -0.5);
        }

        return star;
    }();

    const ball = function () {
        const ball = new Shape(mainTurtle, 10, settings.ballColor);
        ball.isDeadly = true;
        ball.myTurtle.right(180).forward(120).right(90);

        ball.move = function () {
            ball.moveBy(2, 1)
        }
        return ball;
    }();

    const snake = function () {
        const self = new Snake(mainTurtle, settings);

        self.getHitBoxes = function () {
            return self.tail;
        }

        self.followUp = function (cursor) {
            self.navigate = function () {
                return calculateTurn(this.myTurtle.position, cursor);
            }
        }

        self.splash = function () {
            this.tail.forEach((part) => {
                part.moveBy(getRandomInt(50) - 24, getRandomInt(50) - 24);
                part.draw();
            })
        }

        self.dead = function () {
            self.alive = false;
            while (self.tail.length > 0) {
                self.tail.dequeue();
            }
        }

        self.reset = function () {
            self.alive = true;
            self.tailSize = 10;
        }

        self.eatFood = function () {
            self.tailSize += 10;
        }

        self.win = function () {
            // score or something...
        }

        return self
    }();

    //-- Game: level construction
    let level = new Level(mainTurtle, settings);
    level.addObjects([star, ball, snake]);

    //-- Define Food particles
    let food = level.seedObjects(settings.food, Food);

    //-- Define other particles
    level.seedObjects(settings.dust, Dust);
    return {
        level,
        snake,
        ball,
        food
    };
}

function GameOfSnake(canvas) {

    const self = this;
    const mainTurtle = new TinyTurtle(canvas);
    const settings = {
        spaceBgColor: "rgb(0 0 0 / 5%)", // Black 5%
        starOutline: "rgb(148 0 211 / 20%)", // DarkViolet 20%
        starCenter: "Black",
        ballColor: "Salmon",
        snakeColor: "WhiteSmoke",
        gameOverTextColor: "OrangeRed",
        gameOverText: "Game Over!",
        completeTextColor: "DarkTurquoise",
        completeText: "Mission Complete!",
        food: {
            color: "Aquamarine",
            size: 5,
            count: 4,
            distance: 100
        },
        dust: {
            color: "Azure",
            size: 3,
            count: 8,
            distance: 40
        },
        stageAlpha: 0.8,
    };

    let {level, snake, ball, food} = constructLevel(mainTurtle, settings);

    //-- Define Game play with player:snake and level objects
    let game = new GamePlay(snake, level);
    // Non playing objects - entities, that interact with the player in the game
    game.npcs = [ball].concat(food);

    //---- Add Interaction
    let interaction = new Interaction(canvas);
    snake.followUp(interaction.cursor);
    interaction.addKeyHandler('p', () => game.switchPause());
    interaction.addKeyHandler('n', () => game.restart());

    //-- start up the game engine loop
    self.start = function () {
        console.log("Started...");
        hello.name = "Snake";
        console.log(hello.greet());

        //--- Start the game!
        new Engine(game).start();
    }

    return self;
}
