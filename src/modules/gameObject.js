export class GameObject {
  constructor(x, y, width, height, spriteName = null) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.spriteName = spriteName;
  }

  update(deltaTime) {
    // To be implemented by child classes
  }

  draw(ctx, tileset, cameraX, cameraY) {
    if (!this.spriteName || !tileset) return;

    // This is a simplified draw method. A real implementation would
    // look up the sprite's coordinates in the tileset metadata.
    // For now, we assume a simple convention.
    const sx = 0; // Placeholder
    const sy = 0; // Placeholder
    const sWidth = this.width;
    const sHeight = this.height;
    const dx = this.x - cameraX;
    const dy = this.y - cameraY;

    ctx.drawImage(tileset, sx, sy, sWidth, sHeight, dx, dy, this.width, this.height);
  }
}