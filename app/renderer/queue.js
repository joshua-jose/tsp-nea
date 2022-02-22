var Queue = /** @class */ (function () {
    function Queue() {
    }
    Queue.prototype.enqueue = function (element) {
        this.elements.push(element);
    };
    Queue.prototype.dequeue = function () {
        return this.elements.shift();
    };
    Queue.prototype.isEmpty = function () {
        return this.elements.length == 0;
    };
    Queue.prototype.length = function () {
        return this.elements.length;
    };
    return Queue;
}());
