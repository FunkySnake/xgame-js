// Queue is list of elements, first in - first out
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
        for (let i = this.head; i < this.tail; i++) {
            fun(this.elements[i]);
        }
    }

    find(predicate) {
        for (let i = this.head; i < this.tail; i++) {
            if (predicate(this.elements[i])) {
                return this.elements[i];
            }
        }
        return null;
    }
}

// Shape is anything that can be drawn (using Turtle) and can move on the stage.
// Different types of shapes look and move differently
// Can have multiple objects of the same type
class Shape {
    myTurtle;
    angularV = 0;
    linearV = 0;
    size = 0;
    color = "Black";

    constructor(turtle, size, color) {
        this.myTurtle = new TinyTurtle(turtle.canvas, turtle);
        this.size = size || 0;
        this.color = color || "Black";
        this.myTurtle.penWidth = this.size;
        this.myTurtle.penStyle = this.color;
    }

    linearVelocity() {
        return this.linearV;
    }

    angularVelocity() {
        return this.angularV;
    }

    draw() {
        this.myTurtle.circle(this.size)
    }

    move() {
        this.moveBy(this.linearVelocity(), this.angularVelocity())
    }

    moveBy(dist, rot) {
        this.myTurtle.right(rot);
        this.myTurtle.forward(dist);
    }

    getBounds() {
        return {
            x: this.myTurtle.position.x - this.size / 2,
            y: this.myTurtle.position.y - this.size / 2,
            w: this.size,
            h: this.size
        }
    }
}

class Trace extends Shape {
    draw() {
    }
}

class Particle extends Shape {
    draw() {
        this.myTurtle.penDown();
        this.myTurtle.circle(this.size);
    }

    moveBy(dist, rot) {
        this.myTurtle.penWidth = 1;
        super.moveBy(dist, rot);
    }
}

class Food extends Trace {
    isFood = true;

    constructor(turtle, settings) {
        super(turtle, settings.foodSize || 5, settings.foodColor || "Aquamarine");
    }

    move() {
        if (this.isFood) {
            this.moveBy(getRandomInt(2), getRandomInt(5) - 2.5);
        }
    }
}

class Dust extends Trace {
    constructor(turtle, settings) {
        super(turtle, settings.dustSize || 3, settings.dustColor || "Azure");
        this.drift = getRandomInt(3) - 1;
    }

    move() {
        this.moveBy(getRandomInt(2), getRandomInt(10) - 5 + this.drift);
    }
}

// Snake is a composite shape - consists of multiple parts, which are also Shapes
class Snake extends Shape {
    tail;
    partSize;
    tailSize;
    alive = true;

    constructor(turtle, settings) {
        super(turtle, 0, settings.snakeColor)
        this.tail = new Queue();
        this.partSize = 3;
        this.tailSize = 10;
        this.alive = true;
        this.init();
    }

    draw() {
        if (!this.alive) return;

        this.tail.forEach((part) => {
            part.draw();
        });
    }

    move() {
        if (!this.alive) return;

        let deg = this.navigate();
        this.moveBy(1, -(deg - this.myTurtle.rotation));

        this.tail.enqueue(this.part())
        if (this.tail.length > this.tailSize) {
            this.tail.dequeue();
        }
    }

    navigate() {
        return 0;
    }

    init() {
        for (let i = 0; i < this.tailSize; i++) {
            this.tail.enqueue(this.part());
            this.myTurtle.forward(2);
        }
        return this;
    }

    part() {
        return new Particle(this.myTurtle, this.partSize, this.color);
    }

}
