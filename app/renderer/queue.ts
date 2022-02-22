
class Queue<T> {
    elements: Array<T>;

    enqueue(element: T) {
        this.elements.push(element);
    }

    dequeue(): T {
        return this.elements.shift();
    }

    isEmpty(): boolean {
        return this.elements.length == 0;
    }

    length(): number {
        return this.elements.length;
    }

}
