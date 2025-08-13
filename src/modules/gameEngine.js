// gameEngine.js
// メインゲームループとフェーズ管理
import { gameConfig } from '../data/gameData.js';

export class GameEngine {
  constructor() {
    this.gameState = {
      currentPhase: 'day', // 'day' or 'night'
      actionPoints: gameConfig.initialActionPoints,
      reputation: gameConfig.initialReputation,
      inventory: {
        bases: [],
        flavors: [],
        garnishes: []
      },
      currentDay: 1,
      cash: 100,
      unlockedRecipes: [],
      customers: [],
      currentCustomerIndex: 0
    };
    
    this.gameEvents = [];
    this.isRunning = false;
    this.saveSystem = null; // セーブシステムへの参照
  }

  // ゲーム開始
  startGame() {
    this.isRunning = true;
    this.startDayPhase();
    this.triggerEvent('gameStarted');
  }

  // ゲームループ開始
  startGameLoop() {
    console.log('Starting game loop...');
    this.isRunning = true;
    this.startDayPhase();
    
    // メインゲームループ（30FPSで動作）
    const gameLoop = () => {
      if (this.isRunning) {
        this.update();
        setTimeout(() => requestAnimationFrame(gameLoop), 1000 / 30);
      }
    };
    
    requestAnimationFrame(gameLoop);
  }

  // ゲーム状態更新
  update() {
    // ゲーム状態の更新処理
    // イベント処理、UI更新など
    this.triggerEvent('gameUpdate', { gameState: this.gameState });
  }

  // デイフェーズの開始
  startDayPhase() {
    this.gameState.currentPhase = 'day';
    this.gameState.actionPoints = gameConfig.initialActionPoints;
    this.updateUI();
    this.triggerEvent('dayPhaseStarted', {
      day: this.gameState.currentDay,
      actionPoints: this.gameState.actionPoints
    });
  }

  // ナイトフェーズの開始  
  startNightPhase() {
    this.gameState.currentPhase = 'night';
    this.gameState.currentCustomerIndex = 0;
    
    // 顧客システムが利用可能な場合、顧客を生成
    if (this.customerSystem) {
      this.gameState.customers = this.customerSystem.generateNightCustomers(this.gameState.reputation);
    } else {
      console.warn('Customer system not available, generating mock customers');
      this.gameState.customers = [
        { name: 'Test Customer', type: 'regular', mood: 'joy', patience: 10 }
      ];
    }
    
    this.updateUI();
    this.triggerEvent('nightPhaseStarted', {
      day: this.gameState.currentDay,
      customers: this.gameState.customers
    });
  }

  // フェーズ切り替え
  switchPhase() {
    if (this.gameState.currentPhase === 'day') {
      this.startNightPhase();
    } else {
      this.nextDay();
    }
  }

  // 次の日へ進む
  nextDay() {
    this.gameState.currentDay++;
    this.expireInventoryItems();
    this.startDayPhase();
    this.triggerEvent('newDay', { day: this.gameState.currentDay });
  }

  // アクションポイント消費
  consumeActionPoints(amount) {
    if (this.gameState.actionPoints >= amount) {
      this.gameState.actionPoints -= amount;
      this.updateUI();
      
      // APが0になったら自動的にナイトフェーズへ
      if (this.gameState.actionPoints <= 0) {
        setTimeout(() => this.switchPhase(), 1000);
      }
      
      return true;
    }
    return false;
  }

  // 評判の変更
  changeReputation(amount) {
    const oldReputation = this.gameState.reputation;
    this.gameState.reputation = Math.max(
      gameConfig.minReputation, 
      Math.min(gameConfig.maxReputation, this.gameState.reputation + amount)
    );
    
    this.updateUI();
    this.triggerEvent('reputationChanged', {
      old: oldReputation,
      new: this.gameState.reputation,
      change: amount
    });
  }

  // インベントリにアイテム追加
  addToInventory(type, item) {
    if (this.gameState.inventory[type]) {
      // 期限切れアイテムを削除
      this.gameState.inventory[type] = this.gameState.inventory[type].filter(
        inventoryItem => inventoryItem.expireDay >= this.gameState.currentDay
      );
      
      // 新しいアイテムを追加（期限付き）
      const inventoryItem = {
        ...item,
        acquiredDay: this.gameState.currentDay,
        expireDay: this.gameState.currentDay + (item.duration || 3)
      };
      
      this.gameState.inventory[type].push(inventoryItem);
      this.updateUI();
      this.triggerEvent('itemAdded', { type, item: inventoryItem });
    }
  }

  // インベントリアイテムの期限切れ処理
  expireInventoryItems() {
    Object.keys(this.gameState.inventory).forEach(type => {
      const beforeCount = this.gameState.inventory[type].length;
      this.gameState.inventory[type] = this.gameState.inventory[type].filter(
        item => item.expireDay >= this.gameState.currentDay
      );
      const afterCount = this.gameState.inventory[type].length;
      
      if (beforeCount > afterCount) {
        this.triggerEvent('itemsExpired', { 
          type, 
          count: beforeCount - afterCount 
        });
      }
    });
  }

  // 顧客の設定
  setCustomers(customers) {
    this.gameState.customers = customers;
    this.gameState.currentCustomerIndex = 0;
  }

  // 次の顧客へ
  nextCustomer() {
    this.gameState.currentCustomerIndex++;
    
    if (this.gameState.currentCustomerIndex >= this.gameState.customers.length) {
      // すべての顧客にサービス完了
      this.switchPhase();
    } else {
      this.triggerEvent('nextCustomer', {
        customer: this.gameState.customers[this.gameState.currentCustomerIndex],
        index: this.gameState.currentCustomerIndex
      });
    }
  }

  // 現在の顧客を取得
  getCurrentCustomer() {
    return this.gameState.customers[this.gameState.currentCustomerIndex] || null;
  }

  // 特殊レシピの解放
  unlockRecipe(recipe) {
    if (!this.gameState.unlockedRecipes.find(r => r.name === recipe.name)) {
      this.gameState.unlockedRecipes.push(recipe);
      this.triggerEvent('recipeUnlocked', { recipe });
    }
  }

  // 現金の変更
  changeCash(amount) {
    this.gameState.cash = Math.max(0, this.gameState.cash + amount);
    this.updateUI();
    this.triggerEvent('cashChanged', { 
      change: amount, 
      total: this.gameState.cash 
    });
  }

  // ゲーム状態のロード
  loadState(saveData) {
    Object.assign(this.gameState, saveData);
    this.updateUI();
    this.triggerEvent('gameLoaded', saveData);
  }

  // UI更新要求
  updateUI() {
    this.triggerEvent('uiUpdate', this.gameState);
  }

  // イベントシステム
  addEventListener(eventType, callback) {
    if (!this.gameEvents[eventType]) {
      this.gameEvents[eventType] = [];
    }
    this.gameEvents[eventType].push(callback);
  }

  removeEventListener(eventType, callback) {
    if (this.gameEvents[eventType]) {
      this.gameEvents[eventType] = this.gameEvents[eventType].filter(
        cb => cb !== callback
      );
    }
  }

  triggerEvent(eventType, data = null) {
    if (this.gameEvents[eventType]) {
      this.gameEvents[eventType].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Event callback error for ${eventType}:`, error);
        }
      });
    }
  }

  // デバッグ用メソッド
  getDebugInfo() {
    return {
      gameState: this.gameState,
      eventListeners: Object.keys(this.gameEvents).map(type => ({
        type,
        count: this.gameEvents[type]?.length || 0
      }))
    };
  }
}
