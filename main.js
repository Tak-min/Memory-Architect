// main.js - ゲームのエントリーポイント
import { GameEngine } from './src/modules/gameEngine.js';
import { RumorSystem } from './src/modules/rumorSystem.js';
import { CustomerSystem } from './src/modules/customerSystem.js';
import { ReputationSystem } from './src/modules/reputationSystem.js';
import { SaveSystem } from './src/modules/saveSystem.js';
import { UIController } from './src/modules/uiController.js';
import { PerformanceManager } from './src/modules/performanceManager.js';
import { AnimationEffects } from './src/modules/animationEffects.js';

class MidnightMetropolisMixup {
  constructor() {
    this.gameEngine = null;
    this.rumorSystem = null;
    this.customerSystem = null;
    this.reputationSystem = null;
    this.saveSystem = null;
    this.uiController = null;
    this.performanceManager = null;
    this.animationEffects = null;
    this.isInitialized = false;
  }

  // ゲームの初期化
  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('Initializing Midnight Metropolis Mix-up...');

      // コアシステムの初期化
      this.gameEngine = new GameEngine();
      this.rumorSystem = new RumorSystem();
      this.customerSystem = new CustomerSystem();
      this.reputationSystem = new ReputationSystem(this.gameEngine);
      this.saveSystem = new SaveSystem(this.gameEngine);
      this.performanceManager = new PerformanceManager();
      this.animationEffects = new AnimationEffects();

      // システム間の連携設定（UI初期化前に実行）
      this.setupSystemIntegration();

      // UI コントローラーの初期化（他のシステムへの参照が必要）
      this.uiController = new UIController(
        this.gameEngine, 
        this.rumorSystem, 
        this.customerSystem
      );

      // ゲームエンジンにセーブシステムの参照を設定
      this.gameEngine.saveSystem = this.saveSystem;

      // パフォーマンス監視開始
      this.performanceManager.startMonitoring();

      // UI の初期化（エラーハンドリングを追加）
      try {
        this.uiController.initialize();
      } catch (error) {
        console.error('UI初期化でエラーが発生しました:', error);
        // 基本的なUIフォールバック
        this.initializeFallbackUI();
      }

      // セーブシステムの初期化
      this.saveSystem.initialize();

      // 初期ゲーム状態の設定
      this.setupInitialGameState();

      this.isInitialized = true;
      console.log('Game initialization completed successfully!');

      // ゲーム開始
      this.startGame();

    } catch (error) {
      console.error('Game initialization failed:', error);
      this.showErrorMessage('Failed to initialize game. Please refresh the page.');
    }
  }

  // システム間の連携設定
  setupSystemIntegration() {
    // GameEngineに他のシステムへの参照を設定
    this.gameEngine.customerSystem = this.customerSystem;
    this.gameEngine.rumorSystem = this.rumorSystem;
    this.gameEngine.reputationSystem = this.reputationSystem;
    this.gameEngine.saveSystem = this.saveSystem;
    
    // 評判変化時のアニメーション
    this.gameEngine.addEventListener('reputationChanged', (data) => {
      this.animationEffects.showReputationChange(data.change);
      
      // 評判システムで特殊イベントをチェック
      this.reputationSystem.processReputationChange(data.change, 'customer_service');
    });

    // 特殊イベント発生時の処理
    this.gameEngine.addEventListener('specialEvent', (event) => {
      console.log('Special event triggered:', event);
      this.uiController.showMessage(event.data.title, 'special');
      
      // 特殊エフェクトの実行
      const rect = document.getElementById('reputation-display').getBoundingClientRect();
      this.animationEffects.createParticleEffect(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        { colors: ['#FFD700', '#FFA500', '#FF6347'], count: 20 }
      );
    });

    // カクテル作成成功時のエフェクト
    this.gameEngine.addEventListener('nextCustomer', () => {
      const cocktailArea = document.getElementById('rumor-board');
      if (cocktailArea) {
        this.animationEffects.createCocktailCreationEffect(cocktailArea);
      }
    });

    // フェーズ変更時の処理
    this.gameEngine.addEventListener('dayPhaseStarted', () => {
      // 一時的効果の処理
      this.reputationSystem.processTemporaryEffects();
    });

    // メッセージ表示のイベント
    this.gameEngine.addEventListener('showMessage', (data) => {
      this.uiController.showMessage(data.message, data.type);
    });
  }

  // 初期ゲーム状態の設定
  setupInitialGameState() {
    // 初期の噂をインベントリに追加
    this.gameEngine.addToInventory('bases', this.rumorSystem.getBase('mayors_cat'));
    this.gameEngine.addToInventory('flavors', this.rumorSystem.getFlavor('joy'));
    this.gameEngine.addToInventory('flavors', this.rumorSystem.getFlavor('anger'));
    this.gameEngine.addToInventory('garnishes', this.rumorSystem.getGarnish('witness_testimony'));

    // ゲーム開始時間を記録
    this.gameEngine.gameState.gameStartTime = Date.now();
  }

  // ゲーム開始
  // フォールバックUI初期化
  initializeFallbackUI() {
    console.log('基本UIを初期化します...');
    
    // 基本的な統計表示を更新
    const updateBasicUI = () => {
      const gameState = this.gameEngine.gameState;
      
      // APとレピュテーション表示
      const apDisplay = document.getElementById('action-points-display');
      const repDisplay = document.getElementById('reputation-display');
      const dayDisplay = document.getElementById('current-day');
      
      if (apDisplay) apDisplay.textContent = gameState.actionPoints;
      if (repDisplay) repDisplay.textContent = gameState.reputation;
      if (dayDisplay) dayDisplay.textContent = gameState.currentDay;
    };

    // 基本的なイベントリスナー
    const phaseBtn = document.getElementById('phase-switch-btn');
    if (phaseBtn) {
      phaseBtn.addEventListener('click', () => {
        this.gameEngine.switchPhase();
        updateBasicUI();
      });
    }

    updateBasicUI();
  }

  // ゲーム開始後の処理
  startGame() {
    console.log('Starting game...');
    
    // ゲームループ開始
    this.gameEngine.startGameLoop();
    
    // ウェルカムメッセージ
    setTimeout(() => {
      if (this.uiController.showMessage) {
        this.uiController.showMessage('Welcome to Midnight Metropolis Mix-up!', 'info');
        this.uiController.showMessage('Collect rumors during the day, serve customers at night!', 'info');
      }
    }, 1000);
  }

  // 既存セーブファイルのチェック
  checkForExistingSave() {
    const saveFiles = this.saveSystem.getSaveFiles();
    if (saveFiles.length > 0 && saveFiles[0].slot === 'main') {
      const shouldLoad = confirm('Found existing save file. Would you like to continue your game?');
      if (shouldLoad) {
        this.saveSystem.load('main');
      }
    }
  }

  // エラーメッセージの表示
  showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #ff0000;
      color: white;
      padding: 20px;
      border-radius: 10px;
      z-index: 10000;
      font-family: Arial, sans-serif;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
  }

  // デバッグ情報の取得
  getDebugInfo() {
    if (!this.isInitialized) {
      return { status: 'Not initialized' };
    }

    return {
      gameEngine: this.gameEngine.getDebugInfo(),
      performance: this.performanceManager.getPerformanceStats(),
      reputation: this.reputationSystem.getDebugInfo(),
      saveSystem: this.saveSystem.getDebugInfo(),
      isInitialized: this.isInitialized
    };
  }

  // デバッグパネルの表示/非表示
  toggleDebugPanel() {
    if (document.getElementById('debug-info')) {
      this.performanceManager.hideDebugInfo();
    } else {
      this.performanceManager.showDebugInfo();
    }
  }

  // ゲームのクリーンアップ
  cleanup() {
    if (this.performanceManager) {
      this.performanceManager.stopMonitoring();
      this.performanceManager.hideDebugInfo();
    }

    if (this.animationEffects) {
      this.animationEffects.cleanup();
    }

    if (this.saveSystem) {
      this.saveSystem.cleanup();
    }

    console.log('Game cleanup completed');
  }
}

// ゲームインスタンスの作成とグローバル参照
const game = new MidnightMetropolisMixup();

// グローバルオブジェクトとして公開（デバッグ用）
window.MidnightMetropolis = game;

// デバッグ用のグローバル関数
window.debugGame = () => console.log(game.getDebugInfo());
window.toggleDebug = () => game.toggleDebugPanel();

// ページ読み込み完了時にゲームを初期化
window.addEventListener('DOMContentLoaded', async () => {
  await game.initialize();
});

// ページ離脱時のクリーンアップ
window.addEventListener('beforeunload', () => {
  game.cleanup();
});

// エラーハンドリング
window.addEventListener('error', (event) => {
  console.error('Game error:', event.error);
  game.showErrorMessage('A game error occurred. Check the console for details.');
});

// 未処理のPromise拒否をキャッチ
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// モジュールのエクスポート（必要に応じて）
export default game;
