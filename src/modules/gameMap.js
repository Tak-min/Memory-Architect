const TILE_SIZE = 32;

class GameMap {
  constructor(layout) {
    this.layout = layout;
    this.width = layout[0].length * TILE_SIZE;
    this.height = layout.length * TILE_SIZE;
    this.wallColor = '#333'; // Placeholder
    this.floorColor = '#888'; // Placeholder
  }

  draw(context) {
    for (let row = 0; row < this.layout.length; row++) {
      for (let col = 0; col < this.layout[row].length; col++) {
        const tile = this.layout[row][col];
        const x = col * TILE_SIZE;
        const y = row * TILE_SIZE;

        if (tile === 1) { // Wall
          context.fillStyle = this.wallColor;
        } else { // Floor
          context.fillStyle = this.floorColor;
        }
        context.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  isWall(x, y, width, height) {
    // Simple AABB collision check with wall tiles
    const leftTile = Math.floor(x / TILE_SIZE);
    const rightTile = Math.floor((x + width) / TILE_SIZE);
    const topTile = Math.floor(y / TILE_SIZE);
    const bottomTile = Math.floor((y + height) / TILE_SIZE);

    for (let row = topTile; row <= bottomTile; row++) {
        for (let col = leftTile; col <= rightTile; col++) {
            if (row < 0 || row >= this.layout.length || col < 0 || col >= this.layout[0].length || this.layout[row][col] === 1) {
                return true; // Collision with wall or out of bounds
            }
        }
    }
    return false;
  }
}

export default GameMap;
