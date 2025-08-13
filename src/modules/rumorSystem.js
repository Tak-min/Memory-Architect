import { gameData } from '../data/gameData.js';

export class RumorSystem {
  constructor() {
    this.rumorData = gameData.rumorData;
    this.specialRecipes = gameData.specialRecipes;
  }

  combineCocktail(baseId, flavorId, garnishId = null) {
    const base = this.rumorData.bases.find(b => b.id === baseId);
    const flavor = this.rumorData.flavors.find(f => f.id === flavorId);
    const garnish = garnishId ? this.rumorData.garnishes.find(g => g.id === garnishId) : null;

    if (!base || !flavor) {
      console.error("Invalid base or flavor for cocktail combination.");
      return null;
    }

    const specialRecipe = this.checkSpecialRecipe(baseId, flavorId, garnishId);

    return {
      satisfaction: this.calculateSatisfaction(base, flavor, garnish, specialRecipe),
      reputation: this.calculateReputation(base, flavor, garnish, specialRecipe),
      specialEffects: this.getSpecialEffects(specialRecipe, garnish)
    };
  }

  calculateSatisfaction(base, flavor, garnish, specialRecipe) {
    let satisfaction = base.effect;
    // Add flavor bonus/penalty, garnish effects, and special recipe bonus
    satisfaction += flavor.matchBonus; // Simplified for now
    if (garnish) {
      // Simplified garnish effect
      satisfaction += 10;
    }
    if (specialRecipe) {
      satisfaction += specialRecipe.satisfactionBonus;
    }
    return satisfaction;
  }

  calculateReputation(base, flavor, garnish, specialRecipe) {
    let reputation = Math.floor(base.effect / 10);
    if (specialRecipe) {
      reputation += specialRecipe.reputationBonus;
    }
    return reputation;
  }

  getSpecialEffects(specialRecipe, garnish) {
    const effects = [];
    if (specialRecipe && specialRecipe.specialEffect) {
      effects.push(specialRecipe.specialEffect);
    }
    if (garnish && garnish.effect) {
      // This needs to be better defined in gameData
      effects.push(garnish.effect);
    }
    return effects;
  }

  checkSpecialRecipe(baseId, flavorId, garnishId) {
    return this.specialRecipes.find(recipe =>
      recipe.baseId === baseId &&
      recipe.flavorId === flavorId &&
      recipe.garnishId === garnishId
    );
  }
}