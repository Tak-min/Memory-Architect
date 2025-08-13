import { GameObject } from './gameObject.js';

export class GameMap {
  constructor(mapData, ctx) {
    this.mapData = mapData;
    this.ctx = ctx;
    this.tileSize = this.mapData.tileSize;
    this.width = this.mapData.width * this.tileSize;
    this.height = this.mapData.height * this.tileSize;
    this.layers = this.mapData.layers;
    this.collisionMap = this.createCollisionMap();
    this.gameObjects = [];
    this.tileset = null;
  }

  async loadAssets() {
    this.tileset = new Image();
    this.tileset.src = this.mapData.tileset.image;
    await new Promise(resolve => this.tileset.onload = resolve);
    this.createGameObjects();
  }

  createCollisionMap() {
    const collisionLayer = this.layers.find(layer => layer.name === 'collision');
    if (!collisionLayer) return [];
    return collisionLayer.data;
  }

  createGameObjects() {
    const objectLayer = this.layers.find(layer => layer.name === 'objects');
    if (!objectLayer) return;

    objectLayer.objects.forEach(obj => {
      this.gameObjects.push(new GameObject(
        obj.x,
        obj.y,
        obj.width,
        obj.height,
        obj.properties.find(p => p.name === 'sprite')?.value
      ));
    });
  }

  draw(playerX, playerY) {
    const cameraX = Math.max(0, Math.min(playerX - this.ctx.canvas.width / 2, this.width - this.ctx.canvas.width));
    const cameraY = Math.max(0, Math.min(playerY - this.ctx.canvas.height / 2, this.height - this.ctx.canvas.height));

    this.layers.forEach(layer => {
      if (layer.type === 'tilelayer' && layer.name !== 'collision') {
        this.drawTileLayer(layer, cameraX, cameraY);
      }
    });

    this.gameObjects.forEach(obj => obj.draw(this.ctx, this.tileset, cameraX, cameraY));
  }

  drawTileLayer(layer, cameraX, cameraY) {
    const startCol = Math.floor(cameraX / this.tileSize);
    const endCol = startCol + (this.ctx.canvas.width / this.tileSize) + 1;
    const startRow = Math.floor(cameraY / this.tileSize);
    const endRow = startRow + (this.ctx.canvas.height / this.tileSize) + 1;

    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        if (row < 0 || row >= layer.height || col < 0 || col >= layer.width) continue;
        
        const tileId = layer.data[row * layer.width + col];
        if (tileId === 0) continue;

        const sx = ((tileId - 1) % this.mapData.tileset.columns) * this.tileSize;
        const sy = Math.floor((tileId - 1) / this.mapData.tileset.columns) * this.tileSize;
        const dx = Math.floor(col * this.tileSize - cameraX);
        const dy = Math.floor(row * this.tileSize - cameraY);

        this.ctx.drawImage(this.tileset, sx, sy, this.tileSize, this.tileSize, dx, dy, this.tileSize, this.tileSize);
      }
    }
  }

  isColliding(x, y, width, height) {
    const left = Math.floor(x / this.tileSize);
    const right = Math.floor((x + width) / this.tileSize);
    const top = Math.floor(y / this.tileSize);
    const bottom = Math.floor((y + height) / this.tileSize);

    for (let row = top; row <= bottom; row++) {
      for (let col = left; col <= right; col++) {
        if (row < 0 || row >= this.mapData.height || col < 0 || col >= this.mapData.width) return true;
        const tileIndex = row * this.mapData.width + col;
        if (this.collisionMap[tileIndex] !== 0) {
          return true;
        }
      }
    }
    return false;
  }

  getStartPosition() {
    const startObject = this.layers.find(l => l.name === 'objects').objects.find(o => o.name === 'player_start');
    return startObject ? { x: startObject.x, y: startObject.y } : { x: 100, y: 100 };
  }
}