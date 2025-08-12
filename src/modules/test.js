// test.js
// ゲームシステムのテストスクリプト
import { RumorSystem } from './rumorSystem.js';
import { CustomerSystem } from './customerSystem.js';
import { GameEngine } from './gameEngine.js';

class GameTester {
  constructor() {
    this.testResults = [];
    this.rumorSystem = new RumorSystem();
    this.customerSystem = new CustomerSystem();
    this.gameEngine = new GameEngine();
  }

  // テスト実行
  runAllTests() {
    console.log('🧪 Starting Game System Tests...\n');
    
    this.testRumorSystem();
    this.testCustomerSystem();
    this.testGameEngine();
    this.testIntegration();
    
    this.printTestResults();
  }

  // 噂システムのテスト
  testRumorSystem() {
    console.log('📊 Testing Rumor System...');
    
    // テスト1: 基本的なカクテル作成
    this.runTest('Basic Cocktail Creation', () => {
      const cocktail = this.rumorSystem.combineCocktail('mayors_cat', 'joy');
      return cocktail && cocktail.satisfaction > 0;
    });

    // テスト2: 特殊レシピの検出
    this.runTest('Special Recipe Detection', () => {
      const cocktail = this.rumorSystem.combineCocktail('mayors_cat', 'joy', 'witness_testimony');
      return cocktail && cocktail.specialRecipe && cocktail.specialRecipe.name === 'Mayor\'s Time Cat';
    });

    // テスト3: 感情マッチング
    this.runTest('Emotion Matching', () => {
      const cocktail = this.rumorSystem.combineCocktail('mayors_cat', 'joy', null, 'joy');
      const satisfaction = cocktail.satisfaction;
      
      const mismatchCocktail = this.rumorSystem.combineCocktail('mayors_cat', 'joy', null, 'anger');
      const mismatchSatisfaction = mismatchCocktail.satisfaction;
      
      return satisfaction > mismatchSatisfaction;
    });

    // テスト4: ランダム噂生成
    this.runTest('Random Rumor Generation', () => {
      const rumor = this.rumorSystem.generateRandomRumor('bases');
      return rumor && rumor.id && rumor.name && rumor.effect !== undefined;
    });

    // テスト5: データ取得メソッド
    this.runTest('Data Retrieval Methods', () => {
      const base = this.rumorSystem.getBase('mayors_cat');
      const flavor = this.rumorSystem.getFlavor('joy');
      const garnish = this.rumorSystem.getGarnish('witness_testimony');
      
      return base && flavor && garnish;
    });
  }

  // 顧客システムのテスト
  testCustomerSystem() {
    console.log('👥 Testing Customer System...');
    
    // テスト1: 顧客生成
    this.runTest('Customer Generation', () => {
      const customer = this.customerSystem.generateCustomer(50);
      return customer && customer.name && customer.type && customer.mood;
    });

    // テスト2: 評判による顧客タイプ変化
    this.runTest('Reputation-based Customer Types', () => {
      const highRepCustomers = [];
      const lowRepCustomers = [];
      
      // 高評判と低評判で顧客を100人ずつ生成
      for (let i = 0; i < 100; i++) {
        highRepCustomers.push(this.customerSystem.generateCustomer(90));
        lowRepCustomers.push(this.customerSystem.generateCustomer(10));
      }
      
      const highRepVIPs = highRepCustomers.filter(c => c.type === 'vip').length;
      const lowRepVIPs = lowRepCustomers.filter(c => c.type === 'vip').length;
      const lowRepTrouble = lowRepCustomers.filter(c => c.type === 'troublemaker').length;
      
      return highRepVIPs > lowRepVIPs && lowRepTrouble > 10;
    });

    // テスト3: カクテル提供
    this.runTest('Cocktail Service', () => {
      const customer = this.customerSystem.generateCustomer(50);
      const cocktail = this.rumorSystem.combineCocktail('mayors_cat', 'joy');
      const result = this.customerSystem.serveCocktail(customer, cocktail);
      
      return result && result.success && result.satisfaction !== undefined;
    });

    // テスト4: 夜の顧客生成
    this.runTest('Night Customer Generation', () => {
      const customers = this.customerSystem.generateNightCustomers(50);
      return customers && customers.length === 4 && customers.every(c => c.name && c.type);
    });
  }

  // ゲームエンジンのテスト
  testGameEngine() {
    console.log('⚙️ Testing Game Engine...');
    
    // テスト1: 初期状態
    this.runTest('Initial Game State', () => {
      return this.gameEngine.gameState.actionPoints === 6 && 
             this.gameEngine.gameState.reputation === 50 &&
             this.gameEngine.gameState.currentDay === 1;
    });

    // テスト2: アクションポイント消費
    this.runTest('Action Point Consumption', () => {
      const initialAP = this.gameEngine.gameState.actionPoints;
      const consumed = this.gameEngine.consumeActionPoints(3);
      const finalAP = this.gameEngine.gameState.actionPoints;
      
      return consumed && finalAP === initialAP - 3;
    });

    // テスト3: 評判変更
    this.runTest('Reputation Change', () => {
      const initialRep = this.gameEngine.gameState.reputation;
      this.gameEngine.changeReputation(10);
      const finalRep = this.gameEngine.gameState.reputation;
      
      return finalRep === initialRep + 10;
    });

    // テスト4: インベントリ管理
    this.runTest('Inventory Management', () => {
      const testRumor = { id: 'test_rumor', name: 'Test Rumor', effect: 10, duration: 3 };
      this.gameEngine.addToInventory('bases', testRumor);
      
      return this.gameEngine.gameState.inventory.bases.length > 0;
    });

    // テスト5: フェーズ切り替え
    this.runTest('Phase Switching', () => {
      const initialPhase = this.gameEngine.gameState.currentPhase;
      this.gameEngine.switchPhase();
      const newPhase = this.gameEngine.gameState.currentPhase;
      
      return initialPhase !== newPhase;
    });
  }

  // 統合テスト
  testIntegration() {
    console.log('🔗 Testing System Integration...');
    
    // テスト1: 完全なゲームフロー
    this.runTest('Complete Game Flow Simulation', () => {
      try {
        // 昼フェーズ: 噂収集
        this.gameEngine.gameState.currentPhase = 'day';
        const rumor = this.rumorSystem.generateRandomRumor('bases');
        this.gameEngine.addToInventory('bases', rumor);
        
        // 夜フェーズ: 顧客対応
        this.gameEngine.gameState.currentPhase = 'night';
        const customers = this.customerSystem.generateNightCustomers(this.gameEngine.gameState.reputation);
        const customer = customers[0];
        
        // カクテル作成・提供
        const cocktail = this.rumorSystem.combineCocktail(rumor.id, 'joy', null, customer.mood);
        const result = this.customerSystem.serveCocktail(customer, cocktail);
        
        return result.success && result.satisfaction !== undefined;
      } catch (error) {
        console.error('Integration test error:', error);
        return false;
      }
    });

    // テスト2: データ整合性
    this.runTest('Data Consistency', () => {
      const allBases = this.rumorSystem.getAllBases();
      const allFlavors = this.rumorSystem.getAllFlavors();
      const allGarnishes = this.rumorSystem.getAllGarnishes();
      const allRecipes = this.rumorSystem.getAllSpecialRecipes();
      
      // すべてのデータが存在し、必要なプロパティを持っているかチェック
      const basesValid = allBases.every(b => b.id && b.name && b.effect !== undefined);
      const flavorsValid = allFlavors.every(f => f.id && f.name && f.matchBonus !== undefined);
      const garnishesValid = allGarnishes.every(g => g.id && g.name && g.effect);
      const recipesValid = allRecipes.every(r => r.name && r.baseId && r.flavorId);
      
      return basesValid && flavorsValid && garnishesValid && recipesValid;
    });

    // テスト3: 特殊レシピの検証
    this.runTest('Special Recipes Validation', () => {
      const recipes = this.rumorSystem.getAllSpecialRecipes();
      
      return recipes.every(recipe => {
        const base = this.rumorSystem.getBase(recipe.baseId);
        const flavor = this.rumorSystem.getFlavor(recipe.flavorId);
        const garnish = recipe.garnishId ? this.rumorSystem.getGarnish(recipe.garnishId) : true;
        
        return base && flavor && garnish;
      });
    });
  }

  // 個別テスト実行
  runTest(testName, testFunction) {
    try {
      const startTime = performance.now();
      const result = testFunction();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      this.testResults.push({
        name: testName,
        passed: result,
        duration: duration.toFixed(2),
        error: null
      });
      
      const status = result ? '✅' : '❌';
      console.log(`  ${status} ${testName} (${duration.toFixed(2)}ms)`);
      
    } catch (error) {
      this.testResults.push({
        name: testName,
        passed: false,
        duration: 0,
        error: error.message
      });
      
      console.log(`  ❌ ${testName} - Error: ${error.message}`);
    }
  }

  // テスト結果の表示
  printTestResults() {
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(t => t.passed).length;
    const failedTests = totalTests - passedTests;
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults
        .filter(t => !t.passed)
        .forEach(t => {
          console.log(`  - ${t.name}${t.error ? ` (${t.error})` : ''}`);
        });
    }
    
    const totalDuration = this.testResults.reduce((sum, t) => sum + parseFloat(t.duration), 0);
    console.log(`\nTotal Execution Time: ${totalDuration.toFixed(2)}ms`);
    
    // ブラウザのコンソールに結果を表示
    if (typeof window !== 'undefined') {
      window.testResults = this.testResults;
      console.log('📝 Detailed results available in window.testResults');
    }
  }

  // パフォーマンステスト
  runPerformanceTests() {
    console.log('\n⚡ Running Performance Tests...');
    
    // 大量顧客生成テスト
    const startTime = performance.now();
    for (let i = 0; i < 1000; i++) {
      this.customerSystem.generateCustomer(Math.random() * 100);
    }
    const customerGenTime = performance.now() - startTime;
    
    // 大量カクテル作成テスト
    const cocktailStartTime = performance.now();
    for (let i = 0; i < 1000; i++) {
      this.rumorSystem.combineCocktail('mayors_cat', 'joy', 'witness_testimony', 'joy');
    }
    const cocktailTime = performance.now() - cocktailStartTime;
    
    console.log(`Customer Generation (1000x): ${customerGenTime.toFixed(2)}ms`);
    console.log(`Cocktail Creation (1000x): ${cocktailTime.toFixed(2)}ms`);
    
    // メモリ使用量チェック
    if (performance.memory) {
      const memory = {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576),
        total: Math.round(performance.memory.totalJSHeapSize / 1048576),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
      };
      console.log(`Memory Usage: ${memory.used}MB / ${memory.total}MB (Limit: ${memory.limit}MB)`);
    }
  }

  // ゲームバランステスト
  runBalanceTests() {
    console.log('\n⚖️ Running Game Balance Tests...');
    
    // 満足度分布テスト
    const satisfactionResults = [];
    for (let i = 0; i < 100; i++) {
      const customer = this.customerSystem.generateCustomer(50);
      const cocktail = this.rumorSystem.combineCocktail('mayors_cat', customer.mood, null, customer.mood);
      satisfactionResults.push(cocktail.satisfaction);
    }
    
    const avgSatisfaction = satisfactionResults.reduce((sum, s) => sum + s, 0) / satisfactionResults.length;
    const minSatisfaction = Math.min(...satisfactionResults);
    const maxSatisfaction = Math.max(...satisfactionResults);
    
    console.log(`Average Satisfaction: ${avgSatisfaction.toFixed(1)}`);
    console.log(`Satisfaction Range: ${minSatisfaction} - ${maxSatisfaction}`);
    
    // 特殊レシピ効果テスト
    const normalCocktail = this.rumorSystem.combineCocktail('mayors_cat', 'joy');
    const specialCocktail = this.rumorSystem.combineCocktail('mayors_cat', 'joy', 'witness_testimony');
    
    console.log(`Normal Cocktail Satisfaction: ${normalCocktail.satisfaction}`);
    console.log(`Special Recipe Satisfaction: ${specialCocktail.satisfaction}`);
    console.log(`Special Recipe Bonus: +${specialCocktail.satisfaction - normalCocktail.satisfaction}`);
  }
}

// グローバル関数として公開
window.runGameTests = () => {
  const tester = new GameTester();
  tester.runAllTests();
  tester.runPerformanceTests();
  tester.runBalanceTests();
};

// 自動テスト実行（開発時）
if (typeof window !== 'undefined' && window.location.search.includes('test=true')) {
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      window.runGameTests();
    }, 2000);
  });
}

export { GameTester };
