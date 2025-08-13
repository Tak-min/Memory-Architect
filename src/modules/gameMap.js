import { GameObject } from './gameObject.js';

export class GameMap {
  constructor(mapData, ctx) {
    this.mapData = mapData;
    this.ctx = ctx;
    this.tileSize = this.mapData.tileSize;
    this.width = this.mapData.width;
    this.height = this.mapData.height;
    this.layout = this.mapData.layout;
  }

  async loadAssets() {
    return Promise.resolve();
  }

  draw() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tile = this.layout[y * this.width + x];
        if (tile === 1) { // Wall
          this.ctx.fillStyle = 'blue';
          this.ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
        }
      }
    }
  }

  isColliding(x, y) {
    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);
    if (tileX < 0 || tileX >= this.width || tileY < 0 || tileY >= this.height) {
        return true; // Out of bounds
    }
    return this.layout[tileY * this.width + tileX] === 1;
  }

  getStartPosition() {
    // Find the first empty space to place the player
    for (let i = 0; i < this.layout.length; i++) {
        if (this.layout[i] === 0) {
            const x = (i % this.width) * this.tileSize + this.tileSize / 2;
            const y = Math.floor(i / this.width) * this.tileSize + this.tileSize / 2;
            return { x, y };
        }
    }
    return { x: 100, y: 100 }; // Fallback
  }
}