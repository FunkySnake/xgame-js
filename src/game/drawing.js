class Queue {
    constructor() {
        this.elements = {};
        this.head = 0;
        this.tail = 0;
    }

    enqueue(element) {
        this.elements[this.tail] = element;
        this.tail++;
    }

    dequeue() {
        const item = this.elements[this.head];
        delete this.elements[this.head];
        this.head++;
        return item;
    }

    peek() {
        return this.elements[this.head];
    }

    get length() {
        return this.tail - this.head;
    }

    get isEmpty() {
        return this.length === 0;
    }

    forEach(fun) {
        for (var i = this.head; i < this.tail; i++) {
            fun(this.elements[i]);
        }
    }

    find(predicate) {
        for (var i = this.head; i < this.tail; i++) {
            if (predicate(this.elements[i])) {
                return this.elements[i];
            }
        }
        return null;
    }
}

function GameDraw(turtle) {
    let t = turtle;
    let self = this;

    const fgColor = 'purple';
    const bgColor = 'white';

    t.box = function (length) {
        for (var i = 0; i < 4; i++) this.forward(length).right(90);
        return this;
    };

    let shapeRect = {
        draw: function (color) {
            t.penStyle = 'purple';
            for (var i = 0; i < 6; i++) t.box(60).left(10).box(50).left(10).box(40).left(30).box(30).left(10);
            t.stamp();
        },

        change: function () {
            t.left(0.5);
        }
    };

    var shapeCirc = function () {
        var self = {};
        self.turt = new TinyTurtle();
        self.turt.right(180).forward(120).right(90);
        self.turt.penStyle = "salmon";
        self.size = 10;


        self.draw = function (color) {
            self.turt.circle(self.size);
        };

        self.change = function () {
            self.turt.forward(2);
            self.turt.right(1);
        };

        self.getBounds = function () {
            return {
                x: self.turt.position.x,
                y: self.turt.position.y,
                w: self.size,
                h: self.size,
            };
        };

        return self;
    }();

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function calculateTurn(position, target) {
        var dx = target.x - position.x;
        var dy = target.y - position.y;
        var dist = Math.hypot(dx, dy);
        var rad = Math.asin(-dy / dist);
        var deg = Math.floor(rad * 180 / Math.PI);
        if (dx < 0) deg = 180 - deg;
        return deg;
    }

    var snake = {
        myTurtle: new TinyTurtle(),
        tail: new Queue(),
        color: 'WhiteSmoke',
        partSize: 3,
        size: 10,
        alive: true,
        draw: function (self) {
            if (!self.alive) return;
            self.myTurtle.penStyle = self.color;
            self.tail.forEach((part) => {
                part.paint();
            });
        },

        change: function (self) {
            if (!self.alive) return;

            var deg = calculateTurn(self.myTurtle.position, cursor);
            self.myTurtle.left(deg - self.myTurtle.rotation);
            self.myTurtle.forward(1);

            self.tail.enqueue(new Particle(self.myTurtle, self.partSize, self.color))
            if (self.tail.length > self.size)
                self.tail.dequeue();
        },

        init: function (self) {

            for (var i = 0; i < 20; i++) {
                self.tail.enqueue(new Particle(self.myTurtle, self.partSize, self.color));
                self.myTurtle.forward(2);
            }
        },

        testIntersect: function (self, shape) {
            let position = self.myTurtle.position;
            let distX = self.partSize + shape.w + 1;
            let distY = self.partSize + shape.h + 1;
            return (this.tail.find((part) => { // Collision test!
                return Math.abs(part.getBounds().x - shape.x) <= distX &&
                    Math.abs(part.getBounds().y - shape.y) <= distY;
            }) !== null);
        },

        collide: function (shape) {
            if (shape === shapeCirc) {
                this.tail.forEach((p) => {
                    p.moveBy(getRandomInt(50) - 24, getRandomInt(50) - 24);
                    p.paint();
                })
                this.alive = false;
                setTimeout(this.dead, 1000, this);
            } else if (shape.food) {
                shape.food = false;
                console.log("Eaten food.");
                this.size += 10;
            }
        },

        dead: function (self) {
            console.log("Dead!");
            self.alive = false;
            while (self.tail.length > 0) {
                self.tail.dequeue();
            }
            self.myTurtle.canvas.getContext('2d').fillText("Game Over", 10, 10);
            paused = true;
        }
    }
    snake.init(snake);

    function Particle(lt, particleTrailWidth, strokeColor) {
        this.myt = new TinyTurtle();
        this.myt.jumpTo(lt);
        this.particleTrailWidth = particleTrailWidth;
        this.strokeColor = strokeColor;

        this.ls = {
            x: this.myt.position.x,
            y: this.myt.position.y,
        };

        this.paint = () => {
            this.myt.penStyle = this.strokeColor;
            this.myt.circle(this.particleTrailWidth);
        };

        this.draw = () => {
            context.beginPath();
            context.lineWidth = this.particleTrailWidth;
            context.strokeStyle = this.strokeColor;
            context.moveTo(this.ls.x, this.ls.y);
            context.lineTo(this.myt.position.x, this.myt.position.y);
            context.stroke();
        };

        this.getBounds = () => {
            return {
                x: this.ls.x,
                y: this.ls.y,
                w: this.particleTrailWidth,
                h: this.particleTrailWidth
            }
        }

        this.moveBy = function (dist, rot) {
            this.ls = this.myt.position;
            this.myt.right(rot);
            this.myt.forward(dist);
        }

        this.change = () => {
        };
    }

    // ----------------------------
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    const cursor = {
        x: innerWidth / 2,
        y: innerHeight / 2,
    };

    canvas.addEventListener("mousemove", (e) => {
        const target = e.target;
        // Get the bounding rectangle of target.
        const rect = target.getBoundingClientRect();
        cursor.x = e.clientX - rect.left;
        cursor.y = e.clientY - rect.top;
    });

    addEventListener("keydown", (e) => {
        if (e.isComposing || e.keyCode === 229) {
            return;
        }
        // do something
        console.log("key: ", e.key);
        if (e.key == 'p') {
            paused = !paused;
        }
        if (e.key == 'n' && !snake.alive) {
            paused = false;
            snake.alive = true;
            snake.size = 10;
            particle.forEach(p => p.food = true);
        }
    });

    paused = false;

    function collisionTest(activeShape, allShapes) {
        if (paused) return;

        allShapes.forEach((shape) => {
            if (activeShape.testIntersect(activeShape, shape.getBounds())) {
                activeShape.collide(shape);
            }
        });
    }

    function collisionTestIt() {
        collisionTest(snake, [shapeCirc]);
        collisionTest(snake, particle);
    }

    // --------------------

    function redraw(shape, change) {
        if (change) change(shape);
        shape.draw(shape);
    }

    let particle = [];
    for (var i = 0; i < 4; i++) {

        particle[i] = new Particle(
            t,
            5,
            "Aquamarine"
        );
        particle[i].moveBy(100, i * 90);
        particle[i].food = true;
    }

    function redrawAll() {
        if (paused) return;
//        context.clearRect(0, 0, 300, 300);
        context.fillStyle = "rgb(0 0 0 / 5%)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        redraw(shapeRect, shapeRect.change);
        redraw(shapeCirc, shapeCirc.change);
        redraw(snake, snake.change);

        //----

        for (const element of particle) {
            if (element.food) {
                element.moveBy(getRandomInt(2), getRandomInt(5) - 2.5);
                element.draw();
            }
        }

        //----
//        redraw(particle, (shape) => {
//            console.log(".");
//            shape.myt.forward(3);
//            if (getRandomInt(20) > 17) shape.myt.right(30);
//        });
    }

    self.start = function () {
        console.log("Started...");
        const interval = setInterval(redrawAll, 10);
        const test = setInterval(collisionTestIt, 20);
    }

    return self;
}
