// animationEffects.js
// アニメーション・エフェクト・視覚効果
export class AnimationEffects {
  constructor() {
    this.activeAnimations = new Map();
    this.animationId = 0;
  }

  // 満足度上昇アニメーション
  animateSatisfaction(oldValue, newValue, element) {
    const duration = 1000;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentValue = oldValue + (newValue - oldValue) * progress;
      
      if (element) {
        element.textContent = Math.floor(currentValue);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  // 評判変動エフェクト
  showReputationChange(change) {
    const indicator = document.createElement('div');
    indicator.style.position = 'absolute';
    indicator.style.top = '50px';
    indicator.style.left = '50%';
    indicator.style.transform = 'translateX(-50%)';
    indicator.style.fontSize = '2em';
    indicator.style.pointerEvents = 'none';
    indicator.className = change > 0 ? 'reputation-up' : 'reputation-down';
    indicator.textContent = (change > 0 ? '+' : '') + change;
    
    // 要素をDOM追加後、CSSアニメーション実行
    document.body.appendChild(indicator);
    setTimeout(() => indicator.remove(), 2000);
  }
}

// レガシー関数のエクスポート（後方互換性）
export function animateSatisfaction(oldValue, newValue, element) {
  const effects = new AnimationEffects();
  effects.animateSatisfaction(oldValue, newValue, element);
}

export function showReputationChange(change) {
  const effects = new AnimationEffects();
  effects.showReputationChange(change);
}
