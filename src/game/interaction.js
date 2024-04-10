// User Interaction through Mouse & Keyboard Events
function Interaction(canvas) {
    const cursor = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
    };
    const keyHandlers = {};

    canvas.addEventListener("mousemove", (e) => {
        const target = e.target;
        // Get the bounding rectangle of target.
        const rect = target.getBoundingClientRect();
        cursor.x = e.clientX - rect.left;
        cursor.y = e.clientY - rect.top;
    });

    window.addEventListener("keydown", (e) => {
        if (e.isComposing || e.keyCode === 229) {
            return;
        }
        // do something
        console.log("key: ", e.key);
        if (e.key in keyHandlers) {
            keyHandlers[e.key].apply();
        }
    });

    const self = {};
    self.cursor = cursor;
    self.addKeyHandler = function (key, handler) {
        keyHandlers[key] = handler;
    }

    return self;
}
