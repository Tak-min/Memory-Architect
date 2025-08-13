import { rumorData, specialRecipes } from '../data/gameData.js';

export class RumorSystem {
  constructor() {
    this.bases = rumorData.bases;
    this.flavors = rumorData.flavors;
    this.garnishes = rumorData.garnishes;
    this.specialRecipes = specialRecipes;
  }

  getBase(id) {
    return this.bases.find(b => b.id === id);
  }

  getFlavor(id) {
    return this.flavors.find(f => f.id === id);
  }

  getGarnish(id) {
    return this.garnishes.find(g => g.id === id);
  }

  checkSpecialRecipe(baseId, flavorId, garnishId) {
    return this.specialRecipes.find(r => 
      r.baseId === baseId && 
      r.flavorId === flavorId && 
      r.garnishId === garnishId
    );
  }

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
    let totalSatisfaction = 0;
    if (base) totalSatisfaction += base.effect;
    if (flavor) totalSatisfaction += flavor.matchBonus; // 仮のロジック
    if (garnish) totalSatisfaction += garnish.bonus;
    if (specialRecipe) totalSatisfaction += specialRecipe.satisfactionBonus;
    return totalSatisfaction;
  }

  calculateReputation(base, flavor, garnish, specialRecipe) {
    let totalReputation = 0;
    // ここに評判計算ロジックを実装
    if (specialRecipe) {
      totalReputation += specialRecipe.reputationBonus;
    }
    return totalReputation;
  }

  getSpecialEffects(specialRecipe) {
    if (specialRecipe) {
      return [specialRecipe.specialEffect];
    }
    return [];
  }
}