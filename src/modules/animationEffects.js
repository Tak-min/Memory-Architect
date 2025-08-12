// animationEffects.js
// アニメーション・エフェクト・視覚効果
export class AnimationEffects {
  constructor() {
    this.activeAnimations = new Map();
    this.animationId = 0;
  }

  // 満足度変化アニメーション
  animateSatisfaction(oldValue, newValue, element) {
    const duration = 1000;
    const startTime = performance.now();
    const animId = ++this.animationId;

    // 既存のアニメーションをキャンセル
    if (this.activeAnimations.has(element)) {
      const existingAnimId = this.activeAnimations.get(element);
      cancelAnimationFrame(existingAnimId);
    }

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // イージング関数適用
      const easedProgress = this.easeInOutCubic(progress);
      const currentValue = oldValue + (newValue - oldValue) * easedProgress;
      
      if (element) {
        element.textContent = Math.floor(currentValue);
        
        // 値の変化に応じて色を変更
        if (newValue > oldValue) {
          element.style.color = '#00ff00';
        } else if (newValue < oldValue) {
          element.style.color = '#ff0000';
        }
      }

      if (progress < 1) {
        const frameId = requestAnimationFrame(animate);
        this.activeAnimations.set(element, frameId);
      } else {
        this.activeAnimations.delete(element);
        // アニメーション完了後に色をリセット
        if (element) {
          setTimeout(() => {
            element.style.color = '';
          }, 500);
        }
      }
    };

    const frameId = requestAnimationFrame(animate);
    this.activeAnimations.set(element, frameId);
  }

  // 評判変化エフェクト
  showReputationChange(change, container = document.body) {
    const indicator = document.createElement('div');
    indicator.className = `reputation-change ${change > 0 ? 'reputation-up' : 'reputation-down'}`;
    indicator.textContent = (change > 0 ? '+' : '') + change;
    
    // スタイル設定
    indicator.style.cssText = `
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      font-size: 24px;
      font-weight: bold;
      z-index: 1000;
      pointer-events: none;
      color: ${change > 0 ? '#00ff00' : '#ff0000'};
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    `;

    container.appendChild(indicator);

    // アニメーション実行
    this.animateFloatingText(indicator, {
      duration: 2000,
      yOffset: -100,
      fadeOut: true
    }).then(() => {
      if (indicator.parentNode) {
        indicator.remove();
      }
    });
  }

  // 浮遊テキストアニメーション
  animateFloatingText(element, options = {}) {
    return new Promise(resolve => {
      const {
        duration = 2000,
        yOffset = -50,
        xOffset = 0,
        fadeOut = true,
        scale = 1.2
      } = options;

      const startTime = performance.now();
      const startY = element.offsetTop;
      const startX = element.offsetLeft;

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = this.easeOutCubic(progress);

        // 位置の変更
        const currentY = startY + (yOffset * easedProgress);
        const currentX = startX + (xOffset * easedProgress);
        
        element.style.top = `${currentY}px`;
        element.style.left = `${currentX}px`;

        // スケール変更
        const currentScale = 1 + (scale - 1) * (1 - easedProgress);
        element.style.transform = `translateX(-50%) scale(${currentScale})`;

        // フェードアウト
        if (fadeOut) {
          element.style.opacity = 1 - progress;
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }

  // パーティクルエフェクト（成功時など）
  createParticleEffect(x, y, options = {}) {
    const {
      count = 10,
      colors = ['#ffff00', '#ff8800', '#ff0000'],
      duration = 1000,
      spread = 100
    } = options;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      const angle = (Math.PI * 2 * i) / count;
      const velocity = Math.random() * spread;
      
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: ${color};
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        z-index: 1000;
        pointer-events: none;
      `;

      document.body.appendChild(particle);

      this.animateParticle(particle, angle, velocity, duration);
    }
  }

  // 個別パーティクルアニメーション
  animateParticle(particle, angle, velocity, duration) {
    const startTime = performance.now();
    const startX = parseFloat(particle.style.left);
    const startY = parseFloat(particle.style.top);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = this.easeOutQuad(progress);

      const distance = velocity * easedProgress;
      const x = startX + Math.cos(angle) * distance;
      const y = startY + Math.sin(angle) * distance + (progress * progress * 50); // 重力効果

      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.opacity = 1 - progress;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        particle.remove();
      }
    };

    requestAnimationFrame(animate);
  }

  // カクテル作成エフェクト
  createCocktailCreationEffect(targetElement) {
    if (!targetElement) return;

    const rect = targetElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 輝きエフェクト
    this.createSparkleEffect(centerX, centerY);
    
    // パーティクルエフェクト
    this.createParticleEffect(centerX, centerY, {
      colors: ['#00ffff', '#0088ff', '#ff8800'],
      count: 15,
      spread: 80
    });

    // 要素の強調アニメーション
    this.pulseElement(targetElement, 3, 300);
  }

  // 輝きエフェクト
  createSparkleEffect(x, y) {
    for (let i = 0; i < 8; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      
      sparkle.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: #ffffff;
        border-radius: 50%;
        left: ${x + (Math.random() - 0.5) * 40}px;
        top: ${y + (Math.random() - 0.5) * 40}px;
        z-index: 1001;
        pointer-events: none;
        box-shadow: 0 0 10px #ffffff;
      `;

      document.body.appendChild(sparkle);

      // ちらつきアニメーション
      this.animateSparkle(sparkle, 800 + Math.random() * 400);
    }
  }

  // 輝きアニメーション
  animateSparkle(sparkle, duration) {
    const startTime = performance.now();
    const initialScale = Math.random() * 0.5 + 0.5;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const flicker = Math.sin(elapsed * 0.01) * 0.5 + 0.5;
      const scale = initialScale * (1 - progress) * flicker;
      
      sparkle.style.transform = `scale(${scale})`;
      sparkle.style.opacity = (1 - progress) * flicker;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        sparkle.remove();
      }
    };

    requestAnimationFrame(animate);
  }

  // 要素の脈動アニメーション
  pulseElement(element, pulses = 1, duration = 600) {
    if (!element) return;

    const startTime = performance.now();
    const totalDuration = duration * pulses;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = (elapsed % duration) / duration;
      const scale = 1 + Math.sin(progress * Math.PI) * 0.1;
      
      element.style.transform = `scale(${scale})`;

      if (elapsed < totalDuration) {
        requestAnimationFrame(animate);
      } else {
        element.style.transform = '';
      }
    };

    requestAnimationFrame(animate);
  }

  // 顧客入場アニメーション
  animateCustomerEntrance(customerElement) {
    if (!customerElement) return;

    customerElement.style.opacity = '0';
    customerElement.style.transform = 'translateX(-100px)';

    const startTime = performance.now();
    const duration = 800;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = this.easeOutBounce(progress);

      customerElement.style.opacity = progress;
      customerElement.style.transform = `translateX(${-100 + (100 * easedProgress)}px)`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  // 顧客退場アニメーション
  animateCustomerExit(customerElement) {
    if (!customerElement) return Promise.resolve();

    return new Promise(resolve => {
      const startTime = performance.now();
      const duration = 600;

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = this.easeInCubic(progress);

        customerElement.style.opacity = 1 - progress;
        customerElement.style.transform = `translateX(${100 * easedProgress}px)`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }

  // UI要素のシェイクエフェクト
  shakeElement(element, intensity = 5, duration = 500) {
    if (!element) return;

    const startTime = performance.now();
    const originalTransform = element.style.transform;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = elapsed / duration;
      
      if (progress < 1) {
        const shake = intensity * (1 - progress);
        const x = (Math.random() - 0.5) * shake;
        const y = (Math.random() - 0.5) * shake;
        
        element.style.transform = `${originalTransform} translate(${x}px, ${y}px)`;
        requestAnimationFrame(animate);
      } else {
        element.style.transform = originalTransform;
      }
    };

    requestAnimationFrame(animate);
  }

  // イージング関数
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  easeInCubic(t) {
    return t * t * t;
  }

  easeOutQuad(t) {
    return 1 - (1 - t) * (1 - t);
  }

  easeOutBounce(t) {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  }

  // アクティブなアニメーションをすべてキャンセル
  cancelAllAnimations() {
    this.activeAnimations.forEach((animId, element) => {
      cancelAnimationFrame(animId);
    });
    this.activeAnimations.clear();
  }

  // クリーンアップ
  cleanup() {
    this.cancelAllAnimations();
    
    // パーティクルやエフェクト要素を削除
    document.querySelectorAll('.particle, .sparkle, .reputation-change').forEach(el => {
      el.remove();
    });
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
