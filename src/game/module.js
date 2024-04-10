// Just a basic demo module
const hello = (function () {
    var module = {};
    module.name = "World";
    module.greet = function () {
        return "Hello " + this.name + "!";
    }
    return module;
}());
