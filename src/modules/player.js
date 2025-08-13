import { GameObject } from './gameObject.js';

export class Player extends GameObject {
  constructor(x, y, gameMap) {
    super(x, y, 32, 48, 'player_sprite'); // Assuming a player sprite is defined
    this.gameMap = gameMap;
    this.speed = 200; // pixels per second
    this.spriteSheet = null;
    this.frameX = 0;
    this.frameY = 0; // 0: down, 1: left, 2: right, 3: up
    this.maxFrame = 3;
    this.frameTimer = 0;
    this.frameInterval = 150; // ms
  }

  async loadAssets() {
    this.spriteSheet = new Image();
    this.spriteSheet.src = 'assets/sprites/player.png'; // Path to player spritesheet
    await new Promise(resolve => this.spriteSheet.onload = resolve);
  }

  update(deltaTime) {
    // Animation
    this.frameTimer += deltaTime;
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      this.frameX = (this.frameX + 1) % this.maxFrame;
    }
  }

  move(dx, dy, deltaTime) {
    const moveSpeed = this.speed * (deltaTime / 1000);
    let newX = this.x + dx * moveSpeed;
    let newY = this.y + dy * moveSpeed;

    // Update animation direction
    if (dx < 0) this.frameY = 1;
    else if (dx > 0) this.frameY = 2;
    else if (dy < 0) this.frameY = 3;
    else if (dy > 0) this.frameY = 0;

    // Collision check
    if (!this.gameMap.isColliding(newX, this.y, this.width, this.height)) {
      this.x = newX;
    }
    if (!this.gameMap.isColliding(this.x, newY, this.width, this.height)) {
      this.y = newY;
    }
  }

  draw(ctx) {
    // The actual drawing will be relative to the camera in the GameMap class
    // This draw method is for drawing the player on the canvas
    const screenX = ctx.canvas.width / 2 - this.width / 2;
    const screenY = ctx.canvas.height / 2 - this.height / 2;
    
    if (this.spriteSheet) {
      ctx.drawImage(
        this.spriteSheet,
        this.frameX * this.width,
        this.frameY * this.height,
        this.width,
        this.height,
        screenX,
        screenY,
        this.width,
        this.height
      );
    } else {
      // Fallback drawing if sprite fails to load
      ctx.fillStyle = 'red';
      ctx.fillRect(screenX, screenY, this.width, this.height);
    }
  }
}