// src/modules/saveSystem.js
export class SaveSystem {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
  }

  save() {
    const saveData = {
      reputation: this.gameEngine.gameState.reputation,
      inventory: this.gameEngine.gameState.inventory,
      currentDay: this.gameEngine.gameState.currentDay,
      unlockedRecipes: this.gameEngine.gameState.unlockedRecipes,
      timestamp: Date.now()
    };
    
    localStorage.setItem('midnight_metropolis_save', JSON.stringify(saveData));
    this.showSaveConfirmation();
  }
  
  load() {
    const saveDataString = localStorage.getItem('midnight_metropolis_save');
    if (saveDataString) {
      const data = JSON.parse(saveDataString);
      this.gameEngine.loadState(data);
      return true;
    }
    return false;
  }

  showSaveConfirmation() {
    console.log("Game Saved!");
    // UIにフィードバックを表示する
  }
}
