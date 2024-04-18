// Just a basic demo module
const hello = (function () {
    const module = {};
    module.name = "World";
    module.greet = function () {
        return "Hello, " + this.name + "!";
    }
    return module;
}());

module.exports = hello;
