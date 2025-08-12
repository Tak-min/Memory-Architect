// gameEngine.js
// メインゲームループとフェーズ管理
export class GameEngine {
  constructor() {
    this.gameState = {
      currentPhase: 'day',
      actionPoints: 6,
      reputation: 50,
      inventory: [],
      currentDay: 1
    };
  }

  startDayPhase() {
    this.gameState.actionPoints = 6;
    // UI更新、プレイヤー行動待機
  }

  startNightPhase() {
    // 顧客生成、カクテル作成・提供処理
  }

  switchPhase() {
    this.gameState.currentPhase =
      this.gameState.currentPhase === 'day' ? 'night' : 'day';
  }
}
