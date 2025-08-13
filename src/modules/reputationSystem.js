// src/modules/reputationSystem.js
export class ReputationSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        // Listen for events that affect reputation
        // e.g., this.gameEngine.addEventListener('cocktailServed', (data) => this.onCocktailServed(data));
    }

    update(deltaTime) {
        // 評判関連のロジックを更新
    }

    changeReputation(amount) {
        // 評判を変更
    }

    onCocktailServed(data) {
        const reputationChange = data.reputation;
        this.gameEngine.gameState.reputation += reputationChange;
        this.gameEngine.dispatchEvent('reputationChanged', { change: reputationChange, newReputation: this.gameEngine.gameState.reputation });
        this.checkReputationEvents();
    }

    checkReputationEvents() {
        const reputation = this.gameEngine.gameState.reputation;
        if (reputation >= 80) {
            // trigger high reputation event
        } else if (reputation <= 20) {
            // trigger low reputation event
        }
    }
}
