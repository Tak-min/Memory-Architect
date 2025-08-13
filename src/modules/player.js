import { GameObject } from './gameObject.js';

export class Player {
  constructor(x, y, gameMap) {
    this.x = x;
    this.y = y;
    this.gameMap = gameMap;
    this.size = 20; // Player size
    this.speed = 150; // pixels per second
  }

  update(deltaTime) {
    // Player-specific logic can go here
  }

  move(dx, dy, deltaTime) {
    const moveSpeed = this.speed * (deltaTime / 1000);
    let newX = this.x + dx * moveSpeed;
    let newY = this.y + dy * moveSpeed;

    // Simple collision detection
    if (!this.gameMap.isColliding(newX, newY)) {
      this.x = newX;
      this.y = newY;
    }
  }

  draw(ctx) {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }
}