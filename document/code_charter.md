# Midnight Metropolis Mix-up - コード憲章

## 1. 基本原則

### 1.1 可読性優先
- **明確な命名**: 変数・関数・クラス名は一目で役割がわかるよう命名する
- **適切なコメント**: 複雑なロジックには必ず説明を追加する
- **一貫したフォーマット**: prettier等のフォーマッターを使用し、統一されたコードスタイルを維持する

### 1.2 保守性確保
- **モジュール化**: 機能ごとに独立したモジュールに分割する
- **疎結合**: モジュール間の依存関係を最小限に抑える
- **テスタビリティ**: 単体テストが容易に書ける構造にする

## 2. 命名規則

### 2.1 JavaScript

#### 変数・関数名
```javascript
// ✅ 良い例
const currentCustomer = getActiveCustomer();
const satisfactionScore = calculateSatisfaction();
const isValidCombination = (base, flavor) => { /* */ };

// ❌ 悪い例  
const c = getAC();
const ss = calc();
const check = (b, f) => { /* */ };
```

#### クラス名
```javascript
// ✅ 良い例
class CustomerSystem { }
class ReputationManager { }
class RumorCombinator { }

// ❌ 悪い例
class customer { }
class RepMgr { }
class RC { }
```

#### 定数名
```javascript
// ✅ 良い例
const MAX_ACTION_POINTS = 6;
const REPUTATION_THRESHOLD_HIGH = 80;
const CUSTOMER_TYPES = {
  REGULAR: 'regular',
  VIP: 'vip',
  TROUBLEMAKER: 'troublemaker'
};

// ❌ 悪い例
const maxAP = 6;
const repHigh = 80;
const types = { r: 'regular', v: 'vip', t: 'troublemaker' };
```

### 2.2 CSS

#### クラス名（BEM記法準拠）
```css
/* ✅ 良い例 */
.rumor-board { }
.rumor-board__slot { }
.rumor-board__slot--active { }
.customer-queue { }
.customer-queue__item { }
.customer-queue__item--vip { }

/* ❌ 悪い例 */
.rb { }
.slot { }
.active { }
.cq { }
.item { }
.vip { }
```

#### ID名
```css
/* ✅ 良い例 */
#game-container { }
#reputation-display { }
#action-points-counter { }

/* ❌ 悪い例 */
#gc { }
#rep { }
#ap { }
```

## 3. ファイル・ディレクトリ構造

### 3.1 推奨構造
```
midnight-metropolis/
├── index.html
├── README.md
├── package.json
├── src/
│   ├── main.js
│   ├── modules/
│   │   ├── gameEngine.js
│   │   ├── rumorSystem.js
│   │   ├── customerSystem.js
│   │   ├── reputationSystem.js
│   │   └── uiController.js
│   ├── data/
│   │   └── gameData.js
│   └── utils/
│       ├── animations.js
│       ├── saveSystem.js
│       └── constants.js
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   ├── components.css
│   │   └── animations.css
│   ├── images/
│   │   ├── ui/
│   │   ├── backgrounds/
│   │   └── icons/
│   └── sounds/
│       ├── effects/
│       └── music/
└── tests/
    ├── unit/
    └── integration/
```

## 4. コーディング規約

### 4.1 JavaScript

#### 関数定義
```javascript
// ✅ 良い例: アロー関数（短い処理）
const calculateBonus = (base, multiplier) => base * multiplier;

// ✅ 良い例: function宣言（複雑な処理）
function generateCustomerQueue(reputation, dayTime) {
  // 顧客生成ロジック
  const baseCustomerCount = Math.floor(reputation / 10);
  const timeMultiplier = dayTime === 'night' ? 1.5 : 1.0;
  
  return Math.min(baseCustomerCount * timeMultiplier, MAX_CUSTOMERS);
}

// ❌ 悪い例: 一貫性なし
const calc = function(b, m) { return b * m; };
var genCust = (rep, time) => { /* 複雑なロジック */ };
```

#### エラーハンドリング
```javascript
// ✅ 良い例
function combineCocktail(baseId, flavorId, garnishId) {
  try {
    if (!baseId || !flavorId) {
      throw new Error('Base and Flavor are required for cocktail creation');
    }
    
    const result = processRecipe(baseId, flavorId, garnishId);
    return result;
    
  } catch (error) {
    console.error('Cocktail creation failed:', error.message);
    return null;
  }
}

// ❌ 悪い例
function combineCocktail(baseId, flavorId, garnishId) {
  const result = processRecipe(baseId, flavorId, garnishId); // エラー処理なし
  return result;
}
```

#### 非同期処理
```javascript
// ✅ 良い例: async/await
async function loadGameData() {
  try {
    const rumorData = await fetch('./data/rumors.json');
    const customerData = await fetch('./data/customers.json');
    
    return {
      rumors: await rumorData.json(),
      customers: await customerData.json()
    };
  } catch (error) {
    console.error('Failed to load game data:', error);
    return null;
  }
}

// ❌ 悪い例: コールバック地獄
function loadGameData(callback) {
  fetch('./data/rumors.json', function(rumorData) {
    fetch('./data/customers.json', function(customerData) {
      callback({ rumors: rumorData, customers: customerData });
    });
  });
}
```

### 4.2 CSS

#### レスポンシブデザイン
```css
/* ✅ 良い例: モバイルファースト */
.rumor-board {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  padding: 10px;
}

@media (min-width: 768px) {
  .rumor-board {
    grid-template-columns: repeat(2, 1fr);
    padding: 15px;
  }
}

@media (min-width: 1024px) {
  .rumor-board {
    grid-template-columns: repeat(3, 1fr);
    padding: 20px;
  }
}

/* ❌ 悪い例: 固定サイズ */
.rumor-board {
  width: 800px;
  height: 600px;
}
```

#### CSS Custom Properties（変数）
```css
/* ✅ 良い例: カスタムプロパティ使用 */
:root {
  --color-primary: #0f3460;
  --color-secondary: #00ff88;
  --color-bg-dark: #1a1a2e;
  --spacing-small: 8px;
  --spacing-medium: 16px;
  --spacing-large: 24px;
}

.rumor-item {
  background-color: var(--color-bg-dark);
  border: 2px solid var(--color-primary);
  padding: var(--spacing-medium);
  margin: var(--spacing-small);
}

/* ❌ 悪い例: ハードコード */
.rumor-item {
  background-color: #1a1a2e;
  border: 2px solid #0f3460;
  padding: 16px;
  margin: 8px;
}
```

## 5. コメント規約

### 5.1 JSDoc形式
```javascript
/**
 * 噂を組み合わせてカクテルを作成する
 * @param {string} baseId - ベース噂のID
 * @param {string} flavorId - フレーバー噂のID  
 * @param {string|null} garnishId - ガーニッシュ噂のID（オプション）
 * @returns {Object} カクテルの効果情報
 * @throws {Error} 必須パラメータが不足している場合
 */
function createCocktail(baseId, flavorId, garnishId = null) {
  // 実装
}

/**
 * 顧客満足度を計算する
 * @param {Object} customer - 顧客オブジェクト
 * @param {Object} cocktail - 提供されたカクテル
 * @returns {number} 0-100の満足度スコア
 */
const calculateSatisfaction = (customer, cocktail) => {
  // 基本満足度計算
  let satisfaction = cocktail.baseEffect;
  
  // 感情マッチング判定
  if (customer.mood === cocktail.flavor) {
    satisfaction += cocktail.emotionBonus;
  } else {
    satisfaction += cocktail.emotionPenalty;
  }
  
  return Math.max(0, Math.min(100, satisfaction));
};
```

### 5.2 TODO・FIXME・HACK
```javascript
// TODO: VIP顧客の特殊要求システムを実装
// FIXME: 評判計算にバグがある可能性 - 負の値になることがある
// HACK: パフォーマンス向上のため一時的な実装、後でリファクタリング必要
```

## 6. パフォーマンス指針

### 6.1 JavaScript最適化
```javascript
// ✅ 良い例: オブジェクトプールパターン
class CustomerPool {
  constructor() {
    this.pool = [];
    this.activeCustomers = [];
  }
  
  acquire() {
    return this.pool.length > 0 ? 
           this.pool.pop() : 
           new Customer();
  }
  
  release(customer) {
    customer.reset();
    this.pool.push(customer);
  }
}

// ❌ 悪い例: 毎回新規作成
function spawnCustomer() {
  return new Customer(); // ガベージコレクション負荷増大
}
```

### 6.2 DOM操作最適化
```javascript
// ✅ 良い例: バッチ処理
function updateCustomerUI(customers) {
  const fragment = document.createDocumentFragment();
  
  customers.forEach(customer => {
    const element = createCustomerElement(customer);
    fragment.appendChild(element);
  });
  
  document.getElementById('customer-queue').appendChild(fragment);
}

// ❌ 悪い例: 個別DOM操作
function updateCustomerUI(customers) {
  customers.forEach(customer => {
    const element = createCustomerElement(customer);
    document.getElementById('customer-queue').appendChild(element); // リフロー多発
  });
}
```

## 7. テスト要件

### 7.1 ユニットテスト
```javascript
// tests/unit/rumorSystem.test.js
describe('RumorSystem', () => {
  let rumorSystem;
  
  beforeEach(() => {
    rumorSystem = new RumorSystem();
  });
  
  test('should combine rumors correctly', () => {
    const result = rumorSystem.combineCocktail('mayors_cat', 'joy');
    
    expect(result).toHaveProperty('satisfaction');
    expect(result).toHaveProperty('reputation');
    expect(result.satisfaction).toBeGreaterThan(0);
  });
  
  test('should apply emotion match bonus', () => {
    const joyResult = rumorSystem.combineCocktail('mayors_cat', 'joy');
    const angerResult = rumorSystem.combineCocktail('mayors_cat', 'anger');
    
    // 感情効果の違いをテスト
    expect(joyResult.satisfaction).not.toEqual(angerResult.satisfaction);
  });
});
```

### 7.2 統合テスト
```javascript
// tests/integration/gameFlow.test.js  
describe('Game Flow Integration', () => {
  test('should complete day-night cycle', async () => {
    const game = new GameEngine();
    
    // 昼フェーズ開始
    game.startDayPhase();
    expect(game.gameState.currentPhase).toBe('day');
    expect(game.gameState.actionPoints).toBe(6);
    
    // アクション実行
    await game.performAction('move', 'central_park');
    expect(game.gameState.actionPoints).toBe(3);
    
    // 夜フェーズ移行
    game.switchPhase();
    expect(game.gameState.currentPhase).toBe('night');
  });
});
```

## 8. デプロイ・ビルド要件

### 8.1 本番ビルド設定
```javascript
// webpack.config.js (推奨設定)
const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  performance: {
    maxAssetSize: 500000, // 500KB制限
    maxEntrypointSize: 500000
  }
};
```

## 9. コードレビュー基準

### 9.1 レビューチェックリスト
- [ ] 命名規則に従っているか
- [ ] 適切なコメントが記述されているか  
- [ ] エラーハンドリングが実装されているか
- [ ] パフォーマンスを考慮した実装か
- [ ] セキュリティ上の問題がないか
- [ ] テストが書かれているか
- [ ] ブラウザ互換性が確保されているか

### 9.2 コードの複雑さ制限
- **関数の長さ**: 50行以内
- **クラスの長さ**: 300行以内
- **ネストの深さ**: 4階層まで
- **引数の数**: 5個まで

## 10. 継続的改善

### 10.1 コード品質メトリクス
- **テストカバレッジ**: 80%以上維持
- **ESLintエラー**: 0件
- **パフォーマンス**: Lighthouse Score 90以上
- **バンドルサイズ**: 1MB以下

### 10.2 定期メンテナンス
- 月次でのコード品質レビュー実施
- 依存関係の脆弱性チェック
- パフォーマンス監視とボトルネック特定
- ユーザーフィードバックに基づく改善

この憲章に従い、保守性・可読性・パフォーマンスを兼ね備えた高品質なコードの実装を心がけてください。