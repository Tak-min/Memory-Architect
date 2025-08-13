export class UIController {
  constructor(gameEngine, rumorSystem, customerSystem, animationEffects) {
    this.gameEngine = gameEngine;
    this.rumorSystem = rumorSystem;
    this.customerSystem = customerSystem;
    this.animationEffects = animationEffects;
    this.cocktailIngredients = {
      base: null,
      flavor: null,
      garnish: null
    };

    this.gameEngine.addEventListener('gameStateChanged', (gameState) => this.updateUI(gameState));
    this.gameEngine.addEventListener('reputationChanged', (data) => this.animationEffects.showReputationChange(data.change));
  }

  initialize() {
    this.setupDragAndDrop();
    this.setupEventListeners();
    this.updateUI(this.gameEngine.gameState);
  }

  setupEventListeners() {
    // This is a placeholder for other UI event listeners like buttons
  }

  updateUI(gameState) {
    document.getElementById('action-points-display').textContent = gameState.actionPoints;
    document.getElementById('reputation-display').textContent = gameState.reputation;
    // document.getElementById('current-day').textContent = gameState.currentDay;

    const dayPhase = document.getElementById('day-phase');
    const nightPhase = document.getElementById('night-phase');

    if (gameState.currentPhase === 'day') {
      dayPhase.classList.remove('hidden');
      nightPhase.classList.add('hidden');
    } else {
      dayPhase.classList.add('hidden');
      nightPhase.classList.remove('hidden');
    }
    this.renderInventory(gameState.inventory);
  }

  renderInventory(inventory) {
    const inventoryElement = document.getElementById('rumor-inventory');
    inventoryElement.innerHTML = '<h3>Rumor Inventory</h3>';
    Object.keys(inventory).forEach(type => {
        inventory[type].forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'rumor-item';
            itemEl.textContent = item.name;
            itemEl.draggable = true;
            itemEl.dataset.rumorId = item.id;
            itemEl.dataset.rumorType = type;
            inventoryElement.appendChild(itemEl);
        });
    });
    this.setupDragAndDrop(); // Re-setup drag and drop for new items
  }

  setupDragAndDrop() {
    document.querySelectorAll('.rumor-item').forEach(item => {
      item.addEventListener('dragstart', this.handleDragStart.bind(this));
    });
    
    document.querySelectorAll('.rumor-slot').forEach(slot => {
      slot.addEventListener('dragover', this.handleDragOver.bind(this));
      slot.addEventListener('drop', this.handleDrop.bind(this));
      slot.addEventListener('dragleave', (e) => e.target.classList.remove('droppable'));
    });
  }

  handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.rumorId);
    event.dataTransfer.effectAllowed = 'move';
  }

  handleDragOver(event) {
    event.preventDefault();
    event.target.classList.add('droppable');
  }
  
  handleDrop(event) {
    event.preventDefault();
    event.target.classList.remove('droppable');
    const rumorId = event.dataTransfer.getData('text/plain');
    const slotType = event.target.dataset.slotType; // 'base', 'flavor', 'garnish'
    
    if (this.isValidCombination(rumorId, slotType)) {
      this.placeCocktailIngredient(rumorId, slotType, event.target);
    }
  }

  isValidCombination(rumorId, slotType) {
    if (slotType === 'base' && this.rumorSystem.getBase(rumorId)) return true;
    if (slotType === 'flavor' && this.rumorSystem.getFlavor(rumorId)) return true;
    if (slotType === 'garnish' && this.rumorSystem.getGarnish(rumorId)) return true;
    console.warn(`Invalid combination: rumor ${rumorId} cannot be placed in ${slotType}`);
    return false;
  }

  placeCocktailIngredient(rumorId, slotType, targetElement) {
    const item = this.rumorSystem.getBase(rumorId) || this.rumorSystem.getFlavor(rumorId) || this.rumorSystem.getGarnish(rumorId);
    if (item) {
        this.cocktailIngredients[slotType] = item.id;
        targetElement.textContent = item.name;
        console.log(`Placed ${item.name} in ${slotType}. Current mix:`, this.cocktailIngredients);
    }
  }
}