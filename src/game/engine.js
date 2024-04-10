//------ Calculation utils:
function calculateTurn(position, target) {
    let dx = target.x - position.x;
    let dy = target.y - position.y;
    let dist = Math.hypot(dx, dy);
    let rad = Math.asin(-dy / dist);
    let deg = Math.floor(rad * 180 / Math.PI);
    if (dx < 0) deg = 180 - deg;
    return deg;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function CollisionDetector(parts) {
    function CollisionDetector(part, area) {
        const distX = part.getBounds().w + area.w + 1;
        const distY = part.getBounds().h + area.h + 1;
        return Math.abs(part.getBounds().x - area.x) <= distX &&
            Math.abs(part.getBounds().y - area.y) <= distY;
    }

    return function (area) {
        return (parts.find((part) => { // Collision test!
            return CollisionDetector(part, area);
        }) !== null);
    }
}

//--- Engine - redraw, move & collision event loop
function Engine(game) {
    const self = {};

    function testPlayerIntersect(activeShape) {
        return CollisionDetector(activeShape.getHitBoxes());
    }

    //-- Collision detection
    function collisionTest(activeShape, allShapes) {
        let testIntersect = testPlayerIntersect(activeShape);
        allShapes.forEach((shape) => {
            if (testIntersect(shape.getBounds())) {
                game.onCollision(shape);
            }
        });
    }

    //--- Test player against other non-playing characters
    function collisionTestIt() {
        if (game.isPaused) return;

        collisionTest(game.player, game.npcs);
    }

    //-- Move & redraw game level objects
    function redraw(shape) {
        if (shape.move) shape.move()
        shape.draw();
    }

    function redrawSet(shapes) {
        for (let element of shapes) {
            redraw(element);
        }
    }

    function redrawAll() {
        if (game.isPaused) return;

        game.level.clearBackground();

        redrawSet(game.level.objects);
    }

    // This will create indefinite loop (while the browser is on our page)
    // It will call back every 10 - 20 milliseconds
    self.start = function () {
        setInterval(redrawAll, 10);
        setInterval(collisionTestIt, 20);
    }

    return self;
}
