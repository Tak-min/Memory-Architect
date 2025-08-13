// performanceManager.js
// パフォーマンス最適化とフレームレート管理
export class PerformanceManager {
  constructor() {
    this.frameTime = 16.67; // 60FPS = 16.67ms/frame
    this.maxTaskTime = 10; // 1フレームあたりの最大処理時間（ms）
    this.frameCount = 0;
    this.lastFrameTime = 0;
    this.fps = 60;
    this.isMonitoring = false;
  }

  // パフォーマンス監視開始
  startMonitoring() {
    this.isMonitoring = true;
    this.lastFrameTime = performance.now();
    this.monitorFrame();
  }

  // パフォーマンス監視停止
  stopMonitoring() {
    this.isMonitoring = false;
  }

  // フレーム監視
  monitorFrame() {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;
    
    this.frameCount++;
    this.fps = 1000 / deltaTime;
    this.lastFrameTime = currentTime;

    // FPS警告（初期化時は無効化）
    if (this.fps < 15 && this.frameCount > 120) {
      console.warn(`Low FPS detected: ${this.fps.toFixed(1)}`);
    }

    requestAnimationFrame(() => this.monitorFrame());
  }

  // バッチ処理実行（大量の処理を分割実行）
  executeBatched(tasks, callback, batchSize = 10) {
    const startTime = performance.now();
    let taskIndex = 0;

    const processBatch = () => {
      const batchStartTime = performance.now();
      let processedInBatch = 0;

      while (taskIndex < tasks.length && 
             processedInBatch < batchSize &&
             (performance.now() - batchStartTime) < this.maxTaskTime) {
        
        try {
          tasks[taskIndex]();
        } catch (error) {
          console.error(`Task ${taskIndex} failed:`, error);
        }
        
        taskIndex++;
        processedInBatch++;
      }

      if (taskIndex < tasks.length) {
        // まだ処理するタスクがある場合は次のフレームで継続
        requestAnimationFrame(processBatch);
      } else {
        // すべてのタスクが完了
        const totalTime = performance.now() - startTime;
        console.log(`Batched execution completed in ${totalTime.toFixed(2)}ms`);
        if (callback) callback();
      }
    };

    processBatch();
  }

  // 遅延実行（次のフレームで実行）
  defer(fn) {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        try {
          const result = fn();
          resolve(result);
        } catch (error) {
          console.error('Deferred task failed:', error);
          resolve(null);
        }
      });
    });
  }

  // メモリ使用量監視
  getMemoryUsage() {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
      };
    }
    return null;
  }

  // スムーズな値変更アニメーション
  animateValue(fromValue, toValue, duration, callback, easing = 'easeInOut') {
    const startTime = performance.now();
    const delta = toValue - fromValue;

    const easingFunctions = {
      linear: t => t,
      easeIn: t => t * t,
      easeOut: t => t * (2 - t),
      easeInOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    };

    const easingFn = easingFunctions[easing] || easingFunctions.easeInOut;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFn(progress);
      
      const currentValue = fromValue + (delta * easedProgress);
      callback(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  // パフォーマンス統計取得
  getPerformanceStats() {
    const memory = this.getMemoryUsage();
    
    return {
      fps: Math.round(this.fps),
      frameCount: this.frameCount,
      memory: memory,
      isMonitoring: this.isMonitoring,
      frameTime: this.frameTime
    };
  }

  // デバッグ情報表示
  showDebugInfo() {
    if (document.getElementById('debug-info')) return;

    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-info';
    debugPanel.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 12px;
      z-index: 9999;
    `;

    document.body.appendChild(debugPanel);

    const updateDebugInfo = () => {
      const stats = this.getPerformanceStats();
      debugPanel.innerHTML = `
        <div>FPS: ${stats.fps}</div>
        <div>Frames: ${stats.frameCount}</div>
        ${stats.memory ? `
          <div>Memory: ${stats.memory.used}MB / ${stats.memory.total}MB</div>
          <div>Limit: ${stats.memory.limit}MB</div>
        ` : ''}
        <div>Monitoring: ${stats.isMonitoring ? 'ON' : 'OFF'}</div>
      `;

      if (this.isMonitoring) {
        requestAnimationFrame(updateDebugInfo);
      }
    };

    updateDebugInfo();
  }

  // デバッグパネルを隠す
  hideDebugInfo() {
    const debugPanel = document.getElementById('debug-info');
    if (debugPanel) {
      debugPanel.remove();
    }
  }
}
