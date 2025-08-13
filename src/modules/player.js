import GameObject from './gameObject.js';

class Player extends GameObject {
  constructor(game, x, y) {
    super(game, x, y, 32, 48); // Example size
    this.speed = 0;
    this.maxSpeed = 4;
    this.color = 'red'; // Placeholder
  }

  update(inputKeys, deltaTime) {
    // Movement
    let dx = 0;
    let dy = 0;

    if (inputKeys.includes('ArrowLeft')) dx = -1;
    if (inputKeys.includes('ArrowRight')) dx = 1;
    if (inputKeys.includes('ArrowUp')) dy = -1;
    if (inputKeys.includes('ArrowDown')) dy = 1;

    // Normalize diagonal movement
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length > 0) {
        dx /= length;
        dy /= length;
    }

    const newX = this.x + dx * this.maxSpeed;
    const newY = this.y + dy * this.maxSpeed;

    // Collision detection with map boundaries
    if (!this.game.map.isWall(newX, this.y, this.width, this.height)) {
        this.x = newX;
    }
    if (!this.game.map.isWall(this.x, newY, this.width, this.height)) {
        this.y = newY;
    }
  }

  draw(context) {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

export default Player;
