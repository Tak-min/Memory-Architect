export class UIController {
  constructor() {
    // DOM Elements
    this.currentDayEl = document.getElementById('current-day');
    this.currentPhaseEl = document.getElementById('current-phase');
    this.actionPointsEl = document.getElementById('action-points-display');
    this.reputationEl = document.getElementById('reputation-display');
    this.earningsEl = document.getElementById('earnings-display');
    this.phaseSwitchBtn = document.getElementById('phase-switch-btn');
    this.saveGameBtn = document.getElementById('save-game-btn');
    this.loadGameBtn = document.getElementById('load-game-btn');
    this.loadingScreen = document.getElementById('loading-screen');
    this.fpsCounter = document.getElementById('fps-counter');
    this.frameTimeCounter = document.getElementById('frame-time');

    console.log("UI Controller Initialized");
  }

  update(gameState) {
    this.currentDayEl.textContent = gameState.currentDay;
    this.currentPhaseEl.textContent = `${gameState.currentPhase} Phase`;
    this.actionPointsEl.textContent = gameState.actionPoints;
    this.reputationEl.textContent = gameState.reputation;
    this.earningsEl.textContent = gameState.earnings;
    this.phaseSwitchBtn.textContent = `Switch to ${gameState.currentPhase === 'day' ? 'Night' : 'Day'}`;
  }

  bindPhaseSwitch(handler) {
    this.phaseSwitchBtn.addEventListener('click', handler);
  }

  bindSaveGame(handler) {
    this.saveGameBtn.addEventListener('click', handler);
  }

  bindLoadGame(handler) {
    this.loadGameBtn.addEventListener('click', handler);
  }

  showLoadingScreen(show) {
    this.loadingScreen.style.display = show ? 'flex' : 'none';
  }

  updatePerformance(stats) {
    if (this.fpsCounter) this.fpsCounter.textContent = stats.fps;
    if (this.frameTimeCounter) this.frameTimeCounter.textContent = `${stats.frameTime.toFixed(2)}ms`;
  }

  showModal(title, message) {
    // Implementation for showing a modal dialog
    console.log(`Modal: ${title} - ${message}`);
    alert(`${title}\n\n${message}`);
  }
}