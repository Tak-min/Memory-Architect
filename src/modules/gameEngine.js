import Player from './player.js';
import InputHandler from './inputHandler.js';
import GameMap from './gameMap.js';
import { dayMapLayout, nightMapLayout } from '../data/mapData.js';
import { rumorData, specialRecipes } from './gameData.js';

class GameEngine {
  constructor(width, height, assets) {
    this.width = width;
    this.height = height;
    this.assets = assets;
    this.input = new InputHandler();
    
    // For now, let's start with the night map (the bar)
    this.map = new GameMap(this, nightMapLayout); 
    
    // Place player in an initial position
    this.player = new Player(this, 400, 300); 

    this.gameState = {
      currentPhase: 'day',
      actionPoints: 6,
      reputation: 50,
      inventory: {
        bases: [],
        flavors: [],
        garnishes: []
      },
      currentDay: 1,
      unlockedRecipes: []
    };
    this.eventListeners = {};
  }

  update(deltaTime) {
    this.player.update(this.input.keys, deltaTime);
  }

  draw(context) {
    this.map.draw(context);
    this.player.draw(context);
  }

  addEventListener(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  dispatchEvent(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(data));
    }
  }
  
  // デイフェーズのメインループ
  startDayPhase() {
    this.gameState.actionPoints = 6;
    this.dispatchEvent('dayPhaseStarted', { day: this.gameState.currentDay });
    this.dispatchEvent('gameStateChanged', this.gameState);
    console.log(`Day ${this.gameState.currentDay} has started. You have ${this.gameState.actionPoints} action points.`);
  }
  
  // ナイトフェーズのメインループ  
  startNightPhase() {
    this.dispatchEvent('nightPhaseStarted', { day: this.gameState.currentDay });
    this.dispatchEvent('gameStateChanged', this.gameState);
    console.log("The night has begun. Customers are arriving.");
    // ここに顧客生成やカクテル作成のロジックを呼び出す処理を追加
  }
  
  // フェーズ切り替え
  switchPhase() {
    if (this.gameState.currentPhase === 'day') {
        this.gameState.currentPhase = 'night';
        this.startNightPhase();
    } else {
        this.gameState.currentPhase = 'day';
        this.gameState.currentDay++;
        this.startDayPhase();
    }
  }

  loadState(data) {
    this.gameState = { ...this.gameState, ...data };
    this.dispatchEvent('gameStateChanged', this.gameState);
    console.log("Game state loaded.");
  }

  addToInventory(type, item) {
    if (this.gameState.inventory[type]) {
        this.gameState.inventory[type].push(item);
        this.dispatchEvent('gameStateChanged', this.gameState);
    }
  }
}

export default GameEngine;