// saveSystem.js
// セーブ/ロードシステム
export class SaveSystem {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.saveKey = 'midnight_metropolis_save';
    this.autoSaveInterval = null;
  }

  // メインセーブ機能
  save(slotName = 'main') {
    try {
      const saveData = this.createSaveData();
      const saveKey = `${this.saveKey}_${slotName}`;
      
      localStorage.setItem(saveKey, JSON.stringify(saveData));
      
      // 最後のセーブ時間を記録
      localStorage.setItem(`${this.saveKey}_last_save`, Date.now().toString());
      
      this.showSaveConfirmation(slotName);
      this.gameEngine.triggerEvent('gameSaved', { slot: slotName, data: saveData });
      
      return true;
    } catch (error) {
      console.error('Save failed:', error);
      this.showSaveError(error.message);
      return false;
    }
  }

  // セーブデータの作成
  createSaveData() {
    return {
      version: '1.0.0',
      gameState: {
        ...this.gameEngine.gameState,
        // 顧客情報は保存しない（セッション限定）
        customers: []
      },
      timestamp: Date.now(),
      saveDate: new Date().toISOString(),
      playTime: this.calculatePlayTime()
    };
  }

  // ロード機能
  load(slotName = 'main') {
    try {
      const saveKey = `${this.saveKey}_${slotName}`;
      const saveData = localStorage.getItem(saveKey);
      
      if (!saveData) {
        return false;
      }

      const data = JSON.parse(saveData);
      
      // バージョンチェック
      if (!this.isCompatibleVersion(data.version)) {
        console.warn('Save data version mismatch, attempting migration...');
        this.migrateSaveData(data);
      }

      this.gameEngine.loadState(data.gameState);
      this.gameEngine.triggerEvent('gameLoaded', { slot: slotName, data: data });
      
      return true;
    } catch (error) {
      console.error('Load failed:', error);
      this.showLoadError(error.message);
      return false;
    }
  }

  // 自動セーブの開始
  startAutoSave(intervalMinutes = 5) {
    this.stopAutoSave(); // 既存のインターバルをクリア
    
    this.autoSaveInterval = setInterval(() => {
      if (this.gameEngine.isRunning) {
        this.save('autosave');
      }
    }, intervalMinutes * 60 * 1000);
  }

  // 自動セーブの停止
  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  // セーブファイル一覧の取得
  getSaveFiles() {
    const saves = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.saveKey + '_') && !key.endsWith('_last_save')) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          const slotName = key.replace(this.saveKey + '_', '');
          
          saves.push({
            slot: slotName,
            saveDate: data.saveDate,
            currentDay: data.gameState.currentDay,
            reputation: data.gameState.reputation,
            playTime: data.playTime,
            version: data.version
          });
        } catch (error) {
          console.warn(`Corrupted save file: ${key}`);
        }
      }
    }
    
    return saves.sort((a, b) => new Date(b.saveDate) - new Date(a.saveDate));
  }

  // セーブファイルの削除
  deleteSave(slotName) {
    try {
      const saveKey = `${this.saveKey}_${slotName}`;
      localStorage.removeItem(saveKey);
      this.gameEngine.triggerEvent('saveDeleted', { slot: slotName });
      return true;
    } catch (error) {
      console.error('Delete save failed:', error);
      return false;
    }
  }

  // セーブファイルのエクスポート
  exportSave(slotName = 'main') {
    try {
      const saveKey = `${this.saveKey}_${slotName}`;
      const saveData = localStorage.getItem(saveKey);
      
      if (!saveData) {
        throw new Error('Save file not found');
      }

      // ファイルとしてダウンロード
      const blob = new Blob([saveData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `midnight_metropolis_${slotName}_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Export failed:', error);
      this.showExportError(error.message);
      return false;
    }
  }

  // セーブファイルのインポート
  importSave(file, slotName = 'imported') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const saveData = JSON.parse(e.target.result);
          
          // 基本的な検証
          if (!saveData.gameState || !saveData.version) {
            throw new Error('Invalid save file format');
          }

          const saveKey = `${this.saveKey}_${slotName}`;
          localStorage.setItem(saveKey, e.target.result);
          
          resolve(saveData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('File read error'));
      reader.readAsText(file);
    });
  }

  // プレイ時間の計算
  calculatePlayTime() {
    // 簡単な実装：ゲーム開始からの経過時間
    const gameStartTime = this.gameEngine.gameState.gameStartTime || Date.now();
    return Date.now() - gameStartTime;
  }

  // フォーマットされたプレイ時間
  formatPlayTime(playTime) {
    const hours = Math.floor(playTime / (1000 * 60 * 60));
    const minutes = Math.floor((playTime % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  // バージョン互換性チェック
  isCompatibleVersion(version) {
    // 現在は1.0.0のみサポート
    return version === '1.0.0';
  }

  // セーブデータマイグレーション
  migrateSaveData(data) {
    // 将来のバージョンアップ時にデータ移行処理を実装
    console.log('Migrating save data from version', data.version);
  }

  // ローカルストレージの容量チェック
  checkStorageSpace() {
    try {
      const testKey = 'storage_test';
      const testData = 'x'.repeat(1024 * 1024); // 1MB
      localStorage.setItem(testKey, testData);
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  // セーブ確認メッセージ
  showSaveConfirmation(slotName) {
    this.showMessage(`Game saved successfully to slot: ${slotName}`, 'success');
  }

  // セーブエラーメッセージ
  showSaveError(message) {
    this.showMessage(`Save failed: ${message}`, 'error');
  }

  // ロードエラーメッセージ
  showLoadError(message) {
    this.showMessage(`Load failed: ${message}`, 'error');
  }

  // エクスポートエラーメッセージ
  showExportError(message) {
    this.showMessage(`Export failed: ${message}`, 'error');
  }

  // メッセージ表示（UIControllerと連携）
  showMessage(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    this.gameEngine.triggerEvent('showMessage', { message, type });
  }

  // セーブシステムの初期化
  initialize() {
    // ゲーム開始時間を記録
    if (!this.gameEngine.gameState.gameStartTime) {
      this.gameEngine.gameState.gameStartTime = Date.now();
    }

    // 自動セーブの開始
    this.startAutoSave(5); // 5分間隔

    // ページ離脱時の自動セーブ
    window.addEventListener('beforeunload', () => {
      this.save('emergency');
    });
  }

  // クリーンアップ
  cleanup() {
    this.stopAutoSave();
  }

  // デバッグ情報
  getDebugInfo() {
    return {
      saveFiles: this.getSaveFiles(),
      autoSaveActive: !!this.autoSaveInterval,
      storageSpace: this.checkStorageSpace(),
      lastSave: localStorage.getItem(`${this.saveKey}_last_save`)
    };
  }
}
