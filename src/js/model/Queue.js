export default class Queue {
    constructor() {
        this.elements = [];
    }

    // add element to queue
    enqueue(element) {
        this.elements.push(element);
    }

    // remove an element from font of the queue
    dequeue() {
        this.elements.shift();
    }

    // check empty of queue
    isEmpty() {
        return this.elements.length == 0;
    }

    // get element at the font of the queue
    peek() {
        return !this.isEmpty() ? this.elements[0] : undefined;
    }

    length() {
        return this.elements.length;
    }

    checkExistElement(value) {
        return this.elements.indexOf(value) > -1;
    }
}