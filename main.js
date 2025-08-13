import { GameEngine } from './src/modules/gameEngine.js';
import { RumorSystem } from './src/modules/rumorSystem.js';
import { CustomerSystem } from './src/modules/customerSystem.js';
import { ReputationSystem } from './src/modules/reputationSystem.js';
import { UIController } from './src/modules/uiController.js';
import { SaveSystem } from './src/modules/saveSystem.js';
import { PerformanceManager } from './src/modules/performanceManager.js';
import { AnimationEffects } from './src/modules/animationEffects.js';

// main.js - ゲームのエントリーポイント
document.addEventListener('DOMContentLoaded', () => {
  console.log("Welcome to Midnight Metropolis Mix-up!");

  const gameEngine = new GameEngine();
  const rumorSystem = new RumorSystem();
  const customerSystem = new CustomerSystem();
  const reputationSystem = new ReputationSystem(gameEngine);
  const animationEffects = new AnimationEffects();
  const uiController = new UIController(gameEngine, rumorSystem, customerSystem, animationEffects);
  const saveSystem = new SaveSystem(gameEngine);
  const performanceManager = new PerformanceManager();

  // Make instances available for debugging
  window.game = {
    engine: gameEngine,
    rumors: rumorSystem,
    customers: customerSystem,
    reputation: reputationSystem,
    ui: uiController,
    save: saveSystem,
    performance: performanceManager,
    animations: animationEffects
  };

  uiController.initialize();
  gameEngine.startDayPhase();
  uiController.updateUI();

  console.log("Game systems initialized.");
});
