export function deep_copy(obj) {
    return JSON.parse(JSON.stringify(obj))
}

export class LoopQueue {
    constructor(queue) {
        this.queue = queue;
        this.current = this.queue[0];
        this.queue.shift()
    }
    next() {
        this.queue.push(this.current);
        this.current = this.queue[0];
        this.queue.shift()
    }
    prev() {
        this.queue.unshift(this.current);
        this.current = this.queue[this.queue.length - 1];
        this.queue.pop()
    }
}
