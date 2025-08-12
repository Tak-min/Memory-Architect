// saveSystem.js
// セーブ/ロードシステム
export class SaveSystem {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
  }

  save() {
    const saveData = {
      reputation: this.gameEngine.gameState.reputation,
      inventory: this.gameEngine.gameState.inventory,
      currentDay: this.gameEngine.gameState.currentDay,
      unlockedRecipes: this.gameEngine.unlockedRecipes,
      timestamp: Date.now()
    };

    localStorage.setItem('midnight_metropolis_save', JSON.stringify(saveData));
    this.showSaveConfirmation();
  }

  load() {
    const saveData = localStorage.getItem('midnight_metropolis_save');
    if (saveData) {
      const data = JSON.parse(saveData);
      this.gameEngine.loadState(data);
      return true;
    }
    return false;
  }

  showSaveConfirmation() {
    console.log('Game saved successfully!');
  }
}
