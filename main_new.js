import GameEngine from './src/modules/gameEngine.js';

window.addEventListener('load', function() {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) {
      console.error('Canvas element not found!');
      return;
  }
  const ctx = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 600;

  const game = new GameEngine(canvas.width, canvas.height);
  
  let lastTime = 0;
  function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    
    requestAnimationFrame(gameLoop);
  }
  
  gameLoop(0);
});

