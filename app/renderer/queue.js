"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
var Queue = (function () {
    function Queue() {
        this.elements = [];
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
exports.Queue = Queue;