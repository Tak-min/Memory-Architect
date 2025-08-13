// This file will contain the map data exported from Tiled (JSON format)
// For now, it's a placeholder. A real implementation would load a JSON file.

export const mapData = {
  width: 50,
  height: 40,
  tileSize: 16,
  tileset: {
    image: 'assets/tilesets/city_tileset.png', // Path to your tileset image
    columns: 8, // Number of columns in your tileset
  },
  layers: [
    {
      name: 'ground',
      type: 'tilelayer',
      width: 50,
      height: 40,
      data: Array(50 * 40).fill(1), // Example: fill with tile 1 (e.g., pavement)
    },
    {
      name: 'buildings',
      type: 'tilelayer',
      width: 50,
      height: 40,
      data: Array(50 * 40).fill(0), // Example: empty building layer
    },
    {
      name: 'collision',
      type: 'tilelayer',
      width: 50,
      height: 40,
      data: Array(50 * 40).fill(0), // 0 = passable, 1 (or other non-zero) = collision
    },
    {
      name: 'objects',
      type: 'objectgroup',
      objects: [
        {
          name: 'player_start',
          x: 25 * 16, // Start in the middle of the map
          y: 20 * 16,
          width: 16,
          height: 16,
          properties: []
        }
      ]
    }
  ]
};

// Example of how to add a wall for collision
// Top and bottom walls
for (let i = 0; i < mapData.width; i++) {
  mapData.layers.find(l => l.name === 'collision').data[i] = 1;
  mapData.layers.find(l => l.name === 'collision').data[(mapData.height - 1) * mapData.width + i] = 1;
  mapData.layers.find(l => l.name === 'buildings').data[i] = 9; // Example wall tile
  mapData.layers.find(l => l.name === 'buildings').data[(mapData.height - 1) * mapData.width + i] = 9;
}
// Left and right walls
for (let i = 0; i < mapData.height; i++) {
  mapData.layers.find(l => l.name === 'collision').data[i * mapData.width] = 1;
  mapData.layers.find(l => l.name === 'collision').data[i * mapData.width + (mapData.width - 1)] = 1;
  mapData.layers.find(l => l.name === 'buildings').data[i * mapData.width] = 9;
  mapData.layers.find(l => l.name === 'buildings').data[i * mapData.width + (mapData.width - 1)] = 9;
}