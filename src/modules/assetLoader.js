class AssetLoader {
  constructor() {
    this.assets = new Map();
    this.promises = [];
  }

  loadImage(key, src) {
    const img = new Image();
    img.src = src;
    const promise = new Promise((resolve, reject) => {
      img.onload = () => {
        this.assets.set(key, img);
        resolve(img);
      };
      img.onerror = (err) => {
        console.error(`Failed to load image: ${src}`);
        reject(err);
      };
    });
    this.promises.push(promise);
  }

  async loadAll() {
    await Promise.all(this.promises);
    console.log('All assets loaded successfully.');
    return this.assets;
  }

  get(key) {
    return this.assets.get(key);
  }
}

export default AssetLoader;
