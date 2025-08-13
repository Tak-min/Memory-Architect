import { GameMap } from './gameMap.js';
import { Player } from './player.js';
import { InputHandler } from './inputHandler.js';
import { UIController } from './uiController.js';
import { RumorSystem } from './rumorSystem.js';
import { CustomerSystem } from './customerSystem.js';
import { ReputationSystem } from './reputationSystem.js';
import { SaveSystem } from './saveSystem.js';
import { PerformanceManager } from './performanceManager.js';
import { gameData } from '../data/gameData.js';
import { mapData } from '../data/mapData.js';

export class GameEngine {
  constructor(canvas, uiController) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.uiController = uiController;
    this.width = canvas.width;
    this.height = canvas.height;

    this.gameState = {
      currentPhase: 'day', // 'day' or 'night'
      actionPoints: 6,
      reputation: 50,
      inventory: [],
      currentDay: 1,
      earnings: 0,
    };

    this.inputHandler = new InputHandler();
    this.performanceManager = new PerformanceManager();
  }

  async init() {
    // Initialize systems
    this.rumorSystem = new RumorSystem(this);
    this.customerSystem = new CustomerSystem(this);
    this.reputationSystem = new ReputationSystem(this);
    this.saveSystem = new SaveSystem(this);

    // Load game assets and map
    this.gameMap = new GameMap(mapData, this.ctx);
    await this.gameMap.loadAssets();

    // Initialize player
    const startPos = this.gameMap.getStartPosition();
    this.player = new Player(startPos.x, startPos.y, this.gameMap);

    // Bind events
    this.uiController.bindPhaseSwitch(this.switchPhase.bind(this));
    this.uiController.bindSaveGame(this.saveSystem.saveGame.bind(this.saveSystem));
    this.uiController.bindLoadGame(this.saveSystem.loadGame.bind(this.saveSystem));

    console.log("Game Engine Initialized");
    this.startDayPhase();
  }

  update(deltaTime) {
    this.performanceManager.update();

    const playerMove = this.inputHandler.getMoveDirection();
    if (playerMove.x !== 0 || playerMove.y !== 0) {
      this.player.move(playerMove.x, playerMove.y, deltaTime);
    }

    this.gameMap.update(deltaTime);
    this.player.update(deltaTime);
    this.customerSystem.update(deltaTime);
    this.reputationSystem.update(deltaTime);

    this.uiController.update({
        ...this.gameState,
        fps: this.performanceManager.getFPS()
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.gameMap.draw(this.player.x, this.player.y);
    this.player.draw(this.ctx);
  }

  startDayPhase() {
    this.gameState.currentPhase = 'day';
    this.gameState.actionPoints = 6;
    console.log(`Day ${this.gameState.currentDay} has begun.`);
    this.uiController.update(this.gameState);
  }

  startNightPhase() {
    this.gameState.currentPhase = 'night';
    console.log("Night has fallen. Time to serve some customers.");
    this.customerSystem.generateCustomers();
    this.uiController.update(this.gameState);
  }

  switchPhase() {
    if (this.gameState.currentPhase === 'day') {
      this.startNightPhase();
    } else {
      this.gameState.currentDay++;
      this.startDayPhase();
    }
  }

  loadState(data) {
    this.gameState = data.gameState;
    this.player.x = data.player.x;
    this.player.y = data.player.y;
    console.log("Game state loaded.");
    this.uiController.update(this.gameState);
  }
}