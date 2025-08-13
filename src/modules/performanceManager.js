// src/modules/performanceManager.js
export class PerformanceManager {
    constructor() {
        this.fps = 0;
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
    }

    update() {
        const now = performance.now();
        const delta = now - this.lastFrameTime;
        this.lastFrameTime = now;
        this.fps = 1000 / delta;
        this.frameCount++;
    }

    getFPS() {
        return this.fps.toFixed(2);
    }
}
