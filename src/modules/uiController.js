// uiController.js
// UI制御・ユーザー入力処理
import { cityDistricts } from '../data/gameData.js';

export class UIController {
  constructor(gameEngine, rumorSystem, customerSystem) {
    this.gameEngine = gameEngine;
    this.rumorSystem = rumorSystem;
    this.customerSystem = customerSystem;
    this.currentCocktail = {
      base: null,
      flavor: null,
      garnish: null
    };
    this.isInitialized = false;
  }

  // UIの初期化
  initialize() {
    if (this.isInitialized) return;
    
    this.createUIElements();
    this.setupEventListeners();
    this.setupDragAndDrop();
    this.bindGameEvents();
    this.updateUI();
    
    this.isInitialized = true;
  }

  // UI要素の作成
  createUIElements() {
    // フェーズ切り替えボタンの追加
    this.addPhaseControls();
    
    // 昼フェーズのUI要素を拡張
    this.enhanceDayPhaseUI();
    
    // 夜フェーズのUI要素を拡張
    this.enhanceNightPhaseUI();
    
    // 共通UI要素
    this.addCommonUI();
  }

  // フェーズ制御の追加
  addPhaseControls() {
    const gameContainer = document.getElementById('game-container');
    
    const phaseControls = document.createElement('div');
    phaseControls.id = 'phase-controls';
    phaseControls.innerHTML = `
      <button id="switch-phase-btn" class="phase-btn">End Day Phase</button>
      <button id="save-game-btn" class="control-btn">Save Game</button>
      <button id="load-game-btn" class="control-btn">Load Game</button>
    `;
    
    gameContainer.appendChild(phaseControls);
  }

  // 昼フェーズUIの拡張
  enhanceDayPhaseUI() {
    const dayPhase = document.getElementById('day-phase');
    
    // シティマップの更新
    const cityMap = document.getElementById('city-map');
    cityMap.innerHTML = this.createCityMapHTML();
    
    // アクションポイント表示の拡張
    const apDisplay = document.getElementById('action-points-display');
    apDisplay.innerHTML = `
      <div class="ap-container">
        <h3>Action Points</h3>
        <div id="ap-value" class="ap-value">6</div>
        <div class="ap-max">/6</div>
      </div>
    `;
    
    // 噂インベントリの拡張
    const rumorInventory = document.getElementById('rumor-inventory');
    rumorInventory.innerHTML = `
      <div class="inventory-container">
        <h3>Rumor Inventory</h3>
        <div id="bases-inventory" class="inventory-section">
          <h4>Bases</h4>
          <div class="inventory-items" data-type="bases"></div>
        </div>
        <div id="flavors-inventory" class="inventory-section">
          <h4>Flavors</h4>
          <div class="inventory-items" data-type="flavors"></div>
        </div>
        <div id="garnishes-inventory" class="inventory-section">
          <h4>Garnishes</h4>
          <div class="inventory-items" data-type="garnishes"></div>
        </div>
      </div>
    `;
  }

  // 夜フェーズUIの拡張
  enhanceNightPhaseUI() {
    const nightPhase = document.getElementById('night-phase');
    
    // バービューの更新
    const barView = document.getElementById('bar-view');
    barView.innerHTML = this.createBarViewHTML();
    
    // 顧客キューの更新
    const customerQueue = document.getElementById('customer-queue');
    customerQueue.innerHTML = `
      <div class="customer-queue-container">
        <h3>Customer Queue</h3>
        <div id="customers-list" class="customers-list"></div>
        <div id="current-customer" class="current-customer-display"></div>
      </div>
    `;
    
    // 噂ボードの更新
    const rumorBoard = document.getElementById('rumor-board');
    rumorBoard.innerHTML = `
      <div class="rumor-board-container">
        <h3>Cocktail Creation</h3>
        <div class="cocktail-slots">
          <div class="slot-container">
            <label>Base Rumor</label>
            <div class="rumor-slot" data-slot-type="base" id="base-slot">
              Drop base rumor here
            </div>
          </div>
          <div class="slot-container">
            <label>Flavor (Emotion)</label>
            <div class="rumor-slot" data-slot-type="flavor" id="flavor-slot">
              Drop flavor here
            </div>
          </div>
          <div class="slot-container">
            <label>Garnish (Optional)</label>
            <div class="rumor-slot" data-slot-type="garnish" id="garnish-slot">
              Drop garnish here
            </div>
          </div>
        </div>
        <button id="create-cocktail-btn" class="btn btn-primary" disabled>🍸 カクテル作成</button>
        <button id="clear-slots-btn" class="btn btn-secondary">🗑️ クリア</button>
      </div>
    `;
    
    // 満足度メーターを夜フェーズに動的に追加
    const nightPhaseContent = document.querySelector('#night-phase .phase-content');
    if (!document.getElementById('satisfaction-meters')) {
      const satisfactionMetersDiv = document.createElement('div');
      satisfactionMetersDiv.id = 'satisfaction-meters';
      satisfactionMetersDiv.className = 'satisfaction-meters';
      satisfactionMetersDiv.innerHTML = `
        <h2 class="section-title">📊 Satisfaction Prediction</h2>
        <div class="satisfaction-container">
          <div id="current-satisfaction" class="satisfaction-meter">
            <h4>Predicted Satisfaction</h4>
            <div class="meter-bar">
              <div class="meter-fill" id="satisfaction-fill"></div>
            </div>
            <div id="satisfaction-value">0</div>
          </div>
          <div id="customer-mood-display" class="mood-display">
            <h4>Customer Mood</h4>
            <div id="mood-indicator">😐</div>
          </div>
        </div>
      `;
      nightPhaseContent.appendChild(satisfactionMetersDiv);
    }
  }

  // 共通UI要素の追加
  addCommonUI() {
    const gameContainer = document.getElementById('game-container');
    
    // メッセージ表示エリア
    const messageArea = document.createElement('div');
    messageArea.id = 'message-area';
    messageArea.className = 'message-area';
    gameContainer.appendChild(messageArea);
    
    // 評判表示の拡張
    const reputationDisplay = document.getElementById('reputation-display');
    reputationDisplay.innerHTML = `
      <div class="reputation-container">
        <h3>Reputation</h3>
        <div class="reputation-meter">
          <div class="reputation-fill" id="reputation-fill"></div>
        </div>
        <div id="reputation-value">50</div>
        <div id="reputation-level">Medium</div>
      </div>
    `;
  }

  // シティマップのHTML作成
  createCityMapHTML() {
    return `
      <div class="city-map-grid">
        ${cityDistricts.map(district => `
          <div class="district-card" data-district-id="${district.id}">
            <h4>${district.name}</h4>
            <p class="ap-cost">AP Cost: ${district.apCost}</p>
            <p class="district-desc">${district.description}</p>
            <button class="visit-btn" data-district-id="${district.id}">
              Visit (${district.apCost} AP)
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }

  // バービューのHTML作成
  createBarViewHTML() {
    return `
      <div class="bar-interior">
        <div class="bar-counter"></div>
        <div class="customer-seat" id="customer-seat">
          <div class="customer-avatar" id="customer-avatar">👤</div>
        </div>
        <div class="cocktail-preparation" id="cocktail-prep">
          <div class="prep-area">Cocktail Preparation Area</div>
        </div>
      </div>
    `;
  }

  // イベントリスナーの設定
  setupEventListeners() {
    // フェーズ切り替え
    document.getElementById('phase-switch-btn')?.addEventListener('click', () => {
      this.gameEngine.switchPhase();
    });

    // セーブ/ロード
    document.getElementById('save-game-btn')?.addEventListener('click', () => {
      this.gameEngine.saveSystem?.save();
    });

    document.getElementById('load-game-btn')?.addEventListener('click', () => {
      this.gameEngine.saveSystem?.load();
    });

    // 地区訪問
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('visit-btn')) {
        const districtId = e.target.dataset.districtId;
        this.visitDistrict(districtId);
      }
    });

    // カクテル作成
    document.getElementById('create-cocktail-btn')?.addEventListener('click', () => {
      this.createCocktail();
    });

    // カクテルクリア
    document.getElementById('clear-slots-btn')?.addEventListener('click', () => {
      this.clearCocktail();
    });
  }

  // ドラッグ&ドロップの設定
  setupDragAndDrop() {
    // インベントリアイテムのドラッグ開始
    document.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('rumor-item')) {
        e.dataTransfer.setData('text/plain', e.target.dataset.rumorId);
        e.dataTransfer.setData('rumor-type', e.target.dataset.rumorType);
        e.target.classList.add('dragging');
      }
    });

    document.addEventListener('dragend', (e) => {
      if (e.target.classList.contains('rumor-item')) {
        e.target.classList.remove('dragging');
      }
    });

    // スロットのドロップ処理
    document.addEventListener('dragover', (e) => {
      if (e.target.classList.contains('rumor-slot')) {
        e.preventDefault();
        e.target.classList.add('droppable');
      }
    });

    document.addEventListener('dragleave', (e) => {
      if (e.target.classList.contains('rumor-slot')) {
        e.target.classList.remove('droppable');
      }
    });

    document.addEventListener('drop', (e) => {
      if (e.target.classList.contains('rumor-slot')) {
        this.handleDrop(e);
      }
    });
  }

  // ドロップ処理
  handleDrop(event) {
    event.preventDefault();
    const rumorId = event.dataTransfer.getData('text/plain');
    const rumorType = event.dataTransfer.getData('rumor-type');
    const slotType = event.target.dataset.slotType;

    event.target.classList.remove('droppable');

    if (this.isValidCombination(rumorType, slotType)) {
      this.placeCocktailIngredient(rumorId, rumorType, slotType);
    }
  }

  // 有効な組み合わせかチェック
  isValidCombination(rumorType, slotType) {
    const validCombinations = {
      'base': ['bases'],
      'flavor': ['flavors'],
      'garnish': ['garnishes']
    };

    return validCombinations[slotType]?.includes(rumorType);
  }

  // カクテル材料の配置
  placeCocktailIngredient(rumorId, rumorType, slotType) {
    this.currentCocktail[slotType] = rumorId;
    
    // スロットの表示更新
    const slot = document.querySelector(`[data-slot-type="${slotType}"]`);
    const rumor = this.getRumorData(rumorId, rumorType);
    
    if (rumor && slot) {
      slot.innerHTML = `
        <div class="placed-rumor">
          <div class="rumor-name">${rumor.name}</div>
          <button class="remove-btn" data-slot-type="${slotType}">×</button>
        </div>
      `;
      
      // 削除ボタンのイベント
      slot.querySelector('.remove-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeIngredient(slotType);
      });
    }

    this.updateCocktailPreview();
    this.updateCreateButton();
  }

  // 材料の削除
  removeIngredient(slotType) {
    this.currentCocktail[slotType] = null;
    
    const slot = document.querySelector(`[data-slot-type="${slotType}"]`);
    if (slot) {
      const defaultTexts = {
        'base': 'Drop base rumor here',
        'flavor': 'Drop flavor here',
        'garnish': 'Drop garnish here'
      };
      slot.innerHTML = defaultTexts[slotType];
    }

    this.updateCocktailPreview();
    this.updateCreateButton();
  }

  // カクテルプレビューの更新
  updateCocktailPreview() {
    if (this.currentCocktail.base && this.currentCocktail.flavor) {
      const customer = this.gameEngine.getCurrentCustomer();
      const cocktail = this.rumorSystem.combineCocktail(
        this.currentCocktail.base,
        this.currentCocktail.flavor,
        this.currentCocktail.garnish,
        customer?.mood
      );

      if (cocktail) {
        this.updateSatisfactionMeter(cocktail.satisfaction);
      }
    } else {
      this.updateSatisfactionMeter(0);
    }
  }

  // 満足度メーターの更新
  updateSatisfactionMeter(satisfaction) {
    const fill = document.getElementById('satisfaction-fill');
    const value = document.getElementById('satisfaction-value');
    
    if (fill && value) {
      const percentage = Math.min(100, (satisfaction / 100) * 100);
      fill.style.width = `${percentage}%`;
      value.textContent = satisfaction;
      
      // 色の変更
      if (satisfaction >= 70) {
        fill.className = 'meter-fill excellent';
      } else if (satisfaction >= 50) {
        fill.className = 'meter-fill good';
      } else if (satisfaction >= 30) {
        fill.className = 'meter-fill average';
      } else {
        fill.className = 'meter-fill poor';
      }
    }
  }

  // 作成ボタンの状態更新
  updateCreateButton() {
    const createBtn = document.getElementById('create-cocktail-btn');
    if (createBtn) {
      createBtn.disabled = !(this.currentCocktail.base && this.currentCocktail.flavor);
    }
  }

  // 地区訪問処理
  visitDistrict(districtId) {
    const district = cityDistricts.find(d => d.id === districtId);
    if (!district) return;

    if (this.gameEngine.consumeActionPoints(district.apCost)) {
      // 噂獲得処理
      const rumorType = Math.random() < 0.7 ? 'bases' : (Math.random() < 0.5 ? 'flavors' : 'garnishes');
      const rumor = this.rumorSystem.generateRandomRumor(rumorType, district);
      
      if (rumor) {
        this.gameEngine.addToInventory(rumorType, rumor);
        this.showMessage(`Found rumor: ${rumor.name}`, 'success');
      }
    } else {
      this.showMessage('Not enough Action Points!', 'error');
    }
  }

  // カクテル作成処理
  createCocktail() {
    if (!this.currentCocktail.base || !this.currentCocktail.flavor) {
      this.showMessage('Need at least base and flavor!', 'error');
      return;
    }

    const customer = this.gameEngine.getCurrentCustomer();
    if (!customer) {
      this.showMessage('No customer to serve!', 'error');
      return;
    }

    const cocktail = this.rumorSystem.combineCocktail(
      this.currentCocktail.base,
      this.currentCocktail.flavor,
      this.currentCocktail.garnish,
      customer.mood
    );

    const result = this.customerSystem.serveCocktail(customer, cocktail);
    
    if (result.success) {
      this.displayCustomerReaction(result);
      this.gameEngine.changeReputation(result.reputationChange);
      this.gameEngine.changeCash(result.cashEarned);
      
      setTimeout(() => {
        this.gameEngine.nextCustomer();
        this.clearCocktail();
      }, 3000);
    }
  }

  // カクテルのクリア
  clearCocktail() {
    this.currentCocktail = { base: null, flavor: null, garnish: null };
    
    ['base', 'flavor', 'garnish'].forEach(slotType => {
      this.removeIngredient(slotType);
    });
  }

  // 顧客の反応表示
  displayCustomerReaction(result) {
    const customerSeat = document.getElementById('customer-seat');
    if (customerSeat) {
      const reaction = document.createElement('div');
      reaction.className = 'customer-reaction';
      reaction.innerHTML = `
        <div class="reaction-bubble">
          <p>"${result.reaction}"</p>
          <div class="reaction-stats">
            <div>Satisfaction: ${result.satisfaction}</div>
            <div>Reputation: ${result.reputationChange > 0 ? '+' : ''}${result.reputationChange}</div>
            <div>Cash: +$${result.cashEarned}</div>
          </div>
        </div>
      `;
      
      customerSeat.appendChild(reaction);
      
      setTimeout(() => {
        reaction.remove();
      }, 3000);
    }
  }

  // ゲームイベントのバインド
  bindGameEvents() {
    this.gameEngine.addEventListener('uiUpdate', () => {
      this.updateUI();
    });

    this.gameEngine.addEventListener('dayPhaseStarted', () => {
      this.showDayPhase();
    });

    this.gameEngine.addEventListener('nightPhaseStarted', (data) => {
      this.showNightPhase();
      this.displayCustomers(data.customers);
    });

    this.gameEngine.addEventListener('nextCustomer', (data) => {
      this.displayCurrentCustomer(data.customer);
    });

    this.gameEngine.addEventListener('showMessage', (data) => {
      this.showMessage(data.message, data.type);
    });
  }

  // UI全体の更新
  updateUI() {
    this.updatePhaseDisplay();
    this.updateReputationDisplay();
    this.updateActionPointsDisplay();
    this.updateInventoryDisplay();
  }

  // フェーズ表示の更新
  updatePhaseDisplay() {
    const dayPhase = document.getElementById('day-phase');
    const nightPhase = document.getElementById('night-phase');
    const switchBtn = document.getElementById('phase-switch-btn');

    if (this.gameEngine.gameState.currentPhase === 'day') {
      dayPhase?.classList.add('active');
      nightPhase?.classList.remove('active');
      if (switchBtn) switchBtn.textContent = 'Switch to Night';
    } else {
      dayPhase?.classList.remove('active');
      nightPhase?.classList.add('active');
      if (switchBtn) switchBtn.textContent = 'Switch to Day';
    }
  }

  // 評判表示の更新
  updateReputationDisplay() {
    const reputationValue = document.getElementById('reputation-value');
    const reputationFill = document.getElementById('reputation-fill');
    const reputationLevel = document.getElementById('reputation-level');

    if (reputationValue) {
      reputationValue.textContent = this.gameEngine.gameState.reputation;
    }

    if (reputationFill) {
      const percentage = this.gameEngine.gameState.reputation;
      reputationFill.style.width = `${percentage}%`;
    }

    if (reputationLevel) {
      const level = this.getReputationLevel(this.gameEngine.gameState.reputation);
      reputationLevel.textContent = level.level;
      reputationLevel.style.color = level.color;
    }
  }

  // アクションポイント表示の更新
  updateActionPointsDisplay() {
    const apValue = document.getElementById('ap-value');
    if (apValue) {
      apValue.textContent = this.gameEngine.gameState.actionPoints;
    }
  }

  // インベントリ表示の更新
  updateInventoryDisplay() {
    ['bases', 'flavors', 'garnishes'].forEach(type => {
      const container = document.querySelector(`[data-type="${type}"] .inventory-items`);
      if (container) {
        const items = this.gameEngine.gameState.inventory[type] || [];
        container.innerHTML = items.map(item => `
          <div class="rumor-item" draggable="true" 
               data-rumor-id="${item.id}" 
               data-rumor-type="${type}">
            <div class="rumor-name">${item.name}</div>
            <div class="rumor-rarity">${item.rarity}</div>
            <div class="rumor-expire">Expires: Day ${item.expireDay}</div>
          </div>
        `).join('');
      }
    });
  }

  // Create rumor element for drag and drop
  createRumorElement(rumor, type) {
    const rumorDiv = document.createElement('div');
    rumorDiv.className = 'rumor-item';
    rumorDiv.draggable = true;
    rumorDiv.dataset.rumorId = rumor.id;
    rumorDiv.dataset.rumorType = type;
    
    rumorDiv.innerHTML = `
      <div class="rumor-name">${rumor.name}</div>
      <div class="rumor-rarity">${rumor.rarity || 'common'}</div>
      <div class="rumor-effect">Effect: ${rumor.effect || rumor.matchBonus || 'N/A'}</div>
    `;
    
    return rumorDiv;
  }

  // 顧客表示
  displayCurrentCustomer(customer) {
    const customerAvatar = document.getElementById('customer-avatar');
    const moodIndicator = document.getElementById('mood-indicator');

    if (customerAvatar) {
      customerAvatar.textContent = customer.avatar;
      customerAvatar.title = `${customer.name} (${customer.type})`;
    }

    if (moodIndicator) {
      moodIndicator.innerHTML = `
        <div class="mood-info">
          <div class="mood-name">${customer.mood.toUpperCase()}</div>
          <div class="mood-desc">Customer is feeling ${customer.mood}</div>
        </div>
      `;
    }
  }

  // フェーズ表示
  showDayPhase() {
    this.updatePhaseDisplay();
  }

  showNightPhase() {
    this.updatePhaseDisplay();
    
    // Wait for DOM to update before populating rumor board
    setTimeout(() => {
      this.populateRumorBoard();
    }, 100);
    
    const customers = this.customerSystem.generateNightCustomers(this.gameEngine.gameState.reputation);
    this.gameEngine.setCustomers(customers);
    
    if (customers.length > 0) {
      this.displayCurrentCustomer(customers[0]);
    }
  }

  // Populate rumor board for night phase
  populateRumorBoard() {
    const boardBasesItems = document.getElementById('board-bases-items');
    const boardFlavorsItems = document.getElementById('board-flavors-items');
    const boardGarnishesItems = document.getElementById('board-garnishes-items');
    
    if (!boardBasesItems || !boardFlavorsItems || !boardGarnishesItems) {
      console.warn('Rumor board items containers not found, retrying...');
      // Retry after a short delay
      setTimeout(() => {
        const retryBases = document.getElementById('board-bases-items');
        const retryFlavors = document.getElementById('board-flavors-items');
        const retryGarnishes = document.getElementById('board-garnishes-items');
        
        if (retryBases && retryFlavors && retryGarnishes) {
          this.populateRumorBoardElements(retryBases, retryFlavors, retryGarnishes);
        } else {
          console.error('Rumor board containers still not found after retry');
        }
      }, 200);
      return;
    }

    this.populateRumorBoardElements(boardBasesItems, boardFlavorsItems, boardGarnishesItems);
  }

  // Helper method to populate rumor board elements
  populateRumorBoardElements(boardBasesItems, boardFlavorsItems, boardGarnishesItems) {
    // Clear existing content
    boardBasesItems.innerHTML = '';
    boardFlavorsItems.innerHTML = '';
    boardGarnishesItems.innerHTML = '';

    // Populate with available rumors from inventory
    const inventory = this.gameEngine.gameState.inventory;
    
    // Add base rumors
    if (inventory.bases && inventory.bases.length > 0) {
      inventory.bases.forEach(rumor => {
        const rumorElement = this.createRumorElement(rumor, 'bases');
        boardBasesItems.appendChild(rumorElement);
      });
    } else {
      boardBasesItems.innerHTML = '<div class="no-items">No base rumors available</div>';
    }

    // Add flavors
    if (inventory.flavors && inventory.flavors.length > 0) {
      inventory.flavors.forEach(rumor => {
        const rumorElement = this.createRumorElement(rumor, 'flavors');
        boardFlavorsItems.appendChild(rumorElement);
      });
    } else {
      boardFlavorsItems.innerHTML = '<div class="no-items">No flavors available</div>';
    }

    // Add garnishes
    if (inventory.garnishes && inventory.garnishes.length > 0) {
      inventory.garnishes.forEach(rumor => {
        const rumorElement = this.createRumorElement(rumor, 'garnishes');
        boardGarnishesItems.appendChild(rumorElement);
      });
    } else {
      boardGarnishesItems.innerHTML = '<div class="no-items">No garnishes available</div>';
    }
  }

  // メッセージ表示
  showMessage(message, type = 'info') {
    const messageArea = document.getElementById('message-area');
    if (!messageArea) return;

    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.textContent = message;

    messageArea.appendChild(messageEl);

    setTimeout(() => {
      messageEl.remove();
    }, 3000);
  }

  // 顧客リストの表示
  displayCustomers(customers) {
    console.log('Displaying customers:', customers);
    
    // DOM要素の取得をより安全に行う
    let customerContainer = document.getElementById('customers-container');
    
    // 要素が見つからない場合は少し待ってから再試行
    if (!customerContainer) {
      console.warn('Customer container not found, retrying in 100ms...');
      setTimeout(() => {
        customerContainer = document.getElementById('customers-container');
        if (customerContainer) {
          this.renderCustomers(customerContainer, customers);
        } else {
          console.error('Customer container still not found after retry');
        }
      }, 100);
      return;
    }
    
    this.renderCustomers(customerContainer, customers);
  }

  // 顧客のレンダリング（内部メソッド）
  renderCustomers(customerContainer, customers) {
    customerContainer.innerHTML = '';
    
    if (!customers || customers.length === 0) {
      customerContainer.innerHTML = '<div class="no-customers">No customers waiting</div>';
      return;
    }

    customers.forEach((customer, index) => {
      const customerDiv = document.createElement('div');
      customerDiv.className = `customer-card ${customer.type}`;
      customerDiv.innerHTML = `
        <div class="customer-info">
          <div class="customer-name">${customer.name}</div>
          <div class="customer-type">${customer.type}</div>
          <div class="customer-mood">${customer.mood}</div>
          <div class="customer-patience">${customer.patience}/10</div>
        </div>
      `;
      
      if (index === 0) {
        customerDiv.classList.add('current-customer');
      }
      
      customerContainer.appendChild(customerDiv);
    });
  }

  // 噂データの取得
  getRumorData(rumorId, rumorType) {
    const data = this.rumorSystem.availableRumors[rumorType];
    return data?.find(rumor => rumor.id === rumorId);
  }

  // 評判レベルの取得
  getReputationLevel(reputation) {
    if (reputation >= 90) return { level: 'Legendary', color: '#FFD700' };
    if (reputation >= 70) return { level: 'High', color: '#00FF00' };
    if (reputation >= 40) return { level: 'Medium', color: '#FFFF00' };
    if (reputation >= 20) return { level: 'Low', color: '#FF8800' };
    return { level: 'Terrible', color: '#FF0000' };
  }
}
