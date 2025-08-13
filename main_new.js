import { GameEngine } from './src/modules/gameEngine.js';
import { UIController } from './src/modules/uiController.js';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) {
    console.error('FATAL: Canvas element not found!');
    return;
  }

  // Initialize UI Controller
  const uiController = new UIController();
  
  // Initialize Game Engine
  const gameEngine = new GameEngine(canvas, uiController);

  // --- Main Game Loop ---
  let lastTime = 0;
  function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    gameEngine.update(deltaTime);
    gameEngine.draw();
    
    // Update UI with latest game state
    uiController.update(gameEngine.gameState);

    requestAnimationFrame(gameLoop);
  }

  // Start the game
  uiController.showLoadingScreen(true);
  gameEngine.init().then(() => {
    uiController.showLoadingScreen(false);
    gameLoop(0);
  });
});

