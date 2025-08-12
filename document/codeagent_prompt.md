# CodeAgent実装指示プロンプト

## プロジェクト概要
HTML5/CSS/JavaScriptで動作する2Dトップダウン経営シミュレーションゲーム「Midnight Metropolis Mix-up」を開発してください。

## 実装要件

### 1. 基本アーキテクチャ
```javascript
// ES Modulesを使用したモジュール構成で実装
// MVC パターンに従い、以下のファイル構成で作成

/src/modules/
  - gameEngine.js       // メインゲームループとフェーズ管理
  - rumorSystem.js      // 噂の管理・組み合わせシステム  
  - customerSystem.js   // 顧客の生成・行動・満足度管理
  - reputationSystem.js // 評判計算・イベント発生管理
  - uiController.js     // UI制御・ユーザー入力処理

/src/data/
  - gameData.js         // 全ゲームデータ（JSON形式）

/assets/
  - index.html          // メインHTMLファイル
  - style.css           // スタイルシート
  - main.js            // エントリーポイント
```

### 2. ゲームデータ定義

#### 噂データ構造
```javascript
const rumorData = {
  bases: [
    {
      id: "mayors_cat",
      name: "Mayor's Cat", 
      effect: 20,
      rarity: "common",
      description: "The mayor's cat is listening to secret plans"
    }
    // 計6種類のBaseを定義
  ],
  flavors: [
    {
      id: "joy",
      name: "Joy",
      matchBonus: 15,
      mismatchPenalty: -8,
      specialEffect: "nextVisitBonus"
    }
    // Joy, Anger, Sorrow, Surpriseの4種類を定義
  ],
  garnishes: [
    {
      id: "witness_testimony", 
      name: "Witness Testimony",
      effect: "durationPlus1",
      bonus: 0
    }
    // 計4種類のGarnishを定義
  ]
};
```

#### 特殊レシピ定義
```javascript
const specialRecipes = [
  {
    name: "Mayor's Time Cat",
    baseId: "mayors_cat", 
    flavorId: "joy",
    garnishId: "witness_testimony",
    satisfactionBonus: 45,
    reputationBonus: 15,
    specialEffect: "vipBoost"
  }
  // 計5種類の隠しレシピを定義
];
```

### 3. コアシステム実装

#### GameEngine.js
```javascript
export class GameEngine {
  constructor() {
    this.gameState = {
      currentPhase: 'day', // 'day' or 'night'
      actionPoints: 6,
      reputation: 50,
      inventory: [],
      currentDay: 1
    };
  }
  
  // デイフェーズのメインループ
  startDayPhase() {
    this.gameState.actionPoints = 6;
    // UI更新、プレイヤー行動待機
  }
  
  // ナイトフェーズのメインループ  
  startNightPhase() {
    // 顧客生成、カクテル作成・提供処理
  }
  
  // フェーズ切り替え
  switchPhase() {
    this.gameState.currentPhase = 
      this.gameState.currentPhase === 'day' ? 'night' : 'day';
  }
}
```

#### RumorSystem.js
```javascript
export class RumorSystem {
  // 噂の組み合わせ処理
  combineCocktail(baseId, flavorId, garnishId = null) {
    const base = this.getBase(baseId);
    const flavor = this.getFlavor(flavorId); 
    const garnish = garnishId ? this.getGarnish(garnishId) : null;
    
    // 特殊レシピチェック
    const specialRecipe = this.checkSpecialRecipe(baseId, flavorId, garnishId);
    
    return {
      satisfaction: this.calculateSatisfaction(base, flavor, garnish, specialRecipe),
      reputation: this.calculateReputation(base, flavor, garnish, specialRecipe),
      specialEffects: this.getSpecialEffects(specialRecipe)
    };
  }
  
  calculateSatisfaction(base, flavor, garnish, specialRecipe) {
    // 満足度計算ロジック実装
    // 基礎効果 + 感情効果 + 装飾効果 + 特殊レシピボーナス
  }
}
```

#### CustomerSystem.js
```javascript
export class CustomerSystem {
  generateCustomer(reputation) {
    // 評判に基づく顧客タイプ決定
    const customerType = this.determineCustomerType(reputation);
    
    return {
      type: customerType,
      mood: this.randomMood(),
      requestBase: this.randomBase(),
      requestFlavor: this.randomFlavor(),
      satisfaction: this.getInitialSatisfaction(customerType)
    };
  }
  
  // VIP出現確率計算
  determineCustomerType(reputation) {
    if (reputation >= 80) {
      return Math.random() < 0.15 ? 'vip' : 'regular';
    } else if (reputation <= 20) {
      return Math.random() < 0.25 ? 'troublemaker' : 'regular';
    }
    return 'regular';
  }
}
```

### 4. UI実装要件

#### HTML構造
```html
<!DOCTYPE html>
<html>
<head>
  <title>Midnight Metropolis Mix-up</title>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="game-container">
    <!-- デイフェーズUI -->
    <div id="day-phase" class="game-phase">
      <div id="city-map"></div>
      <div id="action-points-display"></div>
      <div id="rumor-inventory"></div>
    </div>
    
    <!-- ナイトフェーズUI -->
    <div id="night-phase" class="game-phase hidden">
      <div id="bar-view"></div>
      <div id="customer-queue"></div>
      <div id="rumor-board"></div>
      <div id="satisfaction-meters"></div>
    </div>
    
    <div id="reputation-display"></div>
  </div>
  <script type="module" src="main.js"></script>
</body>
</html>
```

#### CSS要件
```css
/* 2Dトップダウンビューのレイアウト */
#bar-view {
  width: 600px;
  height: 400px;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  position: relative;
  border: 2px solid #0f3460;
}

/* 噂ボード（ドラッグ&ドロップ対応） */
#rumor-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 20px;
  background: rgba(0,0,0,0.8);
}

.rumor-slot {
  min-height: 80px;
  border: 2px dashed #555;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.rumor-slot.droppable {
  border-color: #00ff88;
  background: rgba(0,255,136,0.1);
}

/* レスポンシブ対応 */
@media (max-width: 1024px) {
  #game-container {
    transform: scale(0.8);
  }
}
```

### 5. ドラッグ&ドロップシステム

#### JavaScript実装
```javascript
// uiController.js内に実装
export class UIController {
  setupDragAndDrop() {
    // 噂アイテムのドラッグ開始
    document.querySelectorAll('.rumor-item').forEach(item => {
      item.addEventListener('dragstart', this.handleDragStart.bind(this));
    });
    
    // 噂ボードスロットのドロップ処理
    document.querySelectorAll('.rumor-slot').forEach(slot => {
      slot.addEventListener('dragover', this.handleDragOver.bind(this));
      slot.addEventListener('drop', this.handleDrop.bind(this));
    });
  }
  
  handleDrop(event) {
    event.preventDefault();
    const rumorId = event.dataTransfer.getData('text/plain');
    const slotType = event.target.dataset.slotType; // 'base', 'flavor', 'garnish'
    
    // 適切な組み合わせかチェック
    if (this.isValidCombination(rumorId, slotType)) {
      this.placeCocktailIngredient(rumorId, slotType);
    }
  }
}
```

### 6. アニメーション・エフェクト要件

```javascript
// 満足度上昇アニメーション
animateSatisfaction(oldValue, newValue, element) {
  const duration = 1000;
  const startTime = performance.now();
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const currentValue = oldValue + (newValue - oldValue) * progress;
    element.textContent = Math.floor(currentValue);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
}

// 評判変動エフェクト
showReputationChange(change) {
  const indicator = document.createElement('div');
  indicator.className = change > 0 ? 'reputation-up' : 'reputation-down';
  indicator.textContent = (change > 0 ? '+' : '') + change;
  
  // 要素をDOM追加後、CSSアニメーション実行
  document.body.appendChild(indicator);
  setTimeout(() => indicator.remove(), 2000);
}
```

### 7. セーブ/ロードシステム

```javascript
// gameEngine.js内に実装
export class SaveSystem {
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
}
```

### 8. パフォーマンス最適化

```javascript
// 60FPSを維持するため、重い処理は分割実行
class PerformanceManager {
  constructor() {
    this.frameTime = 16.67; // 60FPS = 16.67ms/frame
  }
  
  executeBatched(tasks, callback) {
    const startTime = performance.now();
    let taskIndex = 0;
    
    const processBatch = () => {
      while (taskIndex < tasks.length && 
             (performance.now() - startTime) < this.frameTime) {
        tasks[taskIndex]();
        taskIndex++;
      }
      
      if (taskIndex < tasks.length) {
        requestAnimationFrame(processBatch);
      } else {
        callback();
      }
    };
    
    processBatch();
  }
}
```

### 9. 実装順序
1. **基本HTML/CSS構造** → UI レイアウト確認
2. **ゲームデータ定義** → 噂・顧客データ実装  
3. **コアクラス実装** → GameEngine, RumorSystem
4. **ドラッグ&ドロップ** → カクテル作成UI
5. **顧客システム** → 満足度・評判計算
6. **エフェクト・アニメーション** → ユーザー体験向上
7. **セーブシステム** → データ永続化
8. **バランス調整** → 数値微調整・テスト

### 10. テスト要件
- **ユニットテスト**: 各システムクラスの単体テスト実装
- **統合テスト**: フェーズ切り替え・データフロー確認
- **UIテスト**: ドラッグ&ドロップ・レスポンシブ動作確認
- **パフォーマンステスト**: 30FPS維持・メモリリーク検証

以上の指示に従い、完全に動作する「Midnight Metropolis Mix-up」を実装してください。実装中に不明点があれば随時質問し、仕様書の要件を100%満たすよう開発を進めてください。