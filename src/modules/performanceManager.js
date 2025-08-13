// src/modules/performanceManager.js
export class PerformanceManager {
    constructor() {
        this.frameTime = 16.67; // 60FPS = 16.67ms/frame
    }
    
    executeBatched(tasks, callback) {
        const startTime = performance.now();
        let taskIndex = 0;
        
        const processBatch = () => {
            while (taskIndex < tasks.length && 
                   (performance.now() - startTime) < this.frameTime) {
                tasks[taskIndex]();
                taskIndex++;
            }
            
            if (taskIndex < tasks.length) {
                requestAnimationFrame(processBatch);
            } else {
                if(callback) callback();
            }
        };
        
        requestAnimationFrame(processBatch);
    }
}
