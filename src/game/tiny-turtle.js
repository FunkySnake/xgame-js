// tiny-turtle.js
// 2013-10-11
// Public Domain.
// For more information, see http://github.com/toolness/tiny-turtle.

function TinyTurtle(canvas, turtle) {
    canvas = canvas || document.querySelector('canvas');

    var self = this;
    var rotation = turtle?.rotation || 90;
    var position = turtle?.position || {
        // See http://diveintohtml5.info/canvas.html#pixel-madness for
        // details on why we're offsetting by 0.5.
        x: canvas.width / 2 + 0.5,
        y: canvas.height / 2 + 0.5
    };
    var isPenDown = true;
    var radians = function (r) {
        return 2 * Math.PI * (r / 360)
    };
    var triangle = function (ctx, base, height) {
        ctx.beginPath();
        ctx.moveTo(0, -base / 2);
        ctx.lineTo(height, 0);
        ctx.lineTo(0, base / 2);
        ctx.closePath();
    };
    var rotate = function (deg) {
        rotation = (rotation + deg) % 360;
        if (rotation < 0) rotation += 360;
    };

    self.penStyle = 'black';
    self.penWidth = 1;
    self.penUp = function () {
        isPenDown = false;
        return self;
    };
    self.penDown = function () {
        isPenDown = true;
        return self;
    };
    self.forward = self.fd = function (distance) {
        var origX = position.x, origY = position.y;
        position.x += Math.cos(radians(rotation)) * distance;
        position.y -= Math.sin(radians(rotation)) * distance;
        if (!isPenDown) return;
        var ctx = canvas.getContext('2d');
        ctx.strokeStyle = self.penStyle;
        ctx.lineWidth = self.penWidth;
        ctx.beginPath();
        ctx.moveTo(origX, origY);
        ctx.lineTo(position.x, position.y);
        ctx.stroke();
        return self;
    };
    self.stamp = function (size) {
        var ctx = canvas.getContext('2d');
        ctx.save();
        ctx.strokeStyle = ctx.fillStyle = self.penStyle;
        ctx.lineWidth = self.penWidth;
        ctx.translate(position.x, position.y);
        ctx.rotate(-radians(rotation));
        triangle(ctx, size || 10, (size || 10) * 1.5);
        isPenDown ? ctx.fill() : ctx.stroke();
        ctx.restore();
        return self;
    };
    self.left = self.lt = function (deg) {
        rotate(deg);
        return self;
    };
    self.right = self.rt = function (deg) {
        rotate(-deg);
        return self;
    };

    self.clone = function (turtle) {
        this.canvas = turtle.canvas;
        this.position = turtle.position;
        this.rotation = turtle.rotation;
    }

    self.circle = function (radius) {
        let ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = ctx.fillStyle = self.penStyle;
        isPenDown ? ctx.fill() : ctx.stroke();
        ctx.closePath();
        ctx.restore()
        return self;
    }

    self.rect = function (width, height) {
        this.forward(width).right(90).forward(height).right(90).forward(width).right(90).forward(height).right(90);
        return self;
    };

    self.fillAll = function () {
        let ctx = canvas.getContext('2d');
        ctx.strokeStyle = ctx.fillStyle = self.penStyle;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    self.text = function (text, x, y) {
        let ctx = canvas.getContext('2d');
        ctx.strokeStyle = ctx.fillStyle = self.penStyle;
        ctx.fillText(text, x, y);
    }

    self.image = function (img, x = 0, y = 0, w = canvas.width, h = canvas.height) {
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, x, y, w, h);
    }

    Object.defineProperties(self, {
        canvas: {
            get: function () {
                return canvas;
            }
        },
        rotation: {
            get: function () {
                return rotation;
            }
        },
        position: {
            get: function () {
                return {x: position.x, y: position.y};
            }
        },
        pen: {
            get: function () {
                return isPenDown ? 'down' : 'up';
            }
        }
    });

    return self;
}

module.exports = TinyTurtle;
