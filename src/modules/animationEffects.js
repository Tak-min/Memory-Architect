// animationEffects.js
// アニメーション・エフェクト
export function animateSatisfaction(oldValue, newValue, element) {
  const duration = 1000;
  const startTime = performance.now();

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const currentValue = oldValue + (newValue - oldValue) * progress;
    element.textContent = Math.floor(currentValue);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
}

export function showReputationChange(change) {
  const indicator = document.createElement('div');
  indicator.className = change > 0 ? 'reputation-up' : 'reputation-down';
  indicator.textContent = (change > 0 ? '+' : '') + change;

  document.body.appendChild(indicator);
  setTimeout(() => indicator.remove(), 2000);
}
