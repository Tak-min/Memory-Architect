// uiController.js
// UI制御・ユーザー入力処理
export class UIController {
  setupDragAndDrop() {
    document.querySelectorAll('.rumor-item').forEach(item => {
      item.addEventListener('dragstart', this.handleDragStart.bind(this));
    });

    document.querySelectorAll('.rumor-slot').forEach(slot => {
      slot.addEventListener('dragover', this.handleDragOver.bind(this));
      slot.addEventListener('drop', this.handleDrop.bind(this));
    });
  }

  handleDrop(event) {
    event.preventDefault();
    const rumorId = event.dataTransfer.getData('text/plain');
    const slotType = event.target.dataset.slotType;

    if (this.isValidCombination(rumorId, slotType)) {
      this.placeCocktailIngredient(rumorId, slotType);
    }
  }
}
