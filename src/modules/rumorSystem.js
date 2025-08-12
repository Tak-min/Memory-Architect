// rumorSystem.js
// 噂の管理・組み合わせシステム
import { rumorData, specialRecipes, gameConfig } from '../data/gameData.js';

export class RumorSystem {
  constructor() {
    this.availableRumors = {
      bases: [...rumorData.bases],
      flavors: [...rumorData.flavors],
      garnishes: [...rumorData.garnishes]
    };
  }

  // メインカクテル作成メソッド
  combineCocktail(baseId, flavorId, garnishId = null, customerMood = null) {
    const base = this.getBase(baseId);
    const flavor = this.getFlavor(flavorId);
    const garnish = garnishId ? this.getGarnish(garnishId) : null;

    if (!base || !flavor) {
      return null;
    }

    // 特殊レシピチェック
    const specialRecipe = this.checkSpecialRecipe(baseId, flavorId, garnishId);

    const result = {
      base,
      flavor,
      garnish,
      specialRecipe,
      satisfaction: this.calculateSatisfaction(base, flavor, garnish, specialRecipe, customerMood),
      reputation: this.calculateReputation(base, flavor, garnish, specialRecipe),
      specialEffects: this.getSpecialEffects(specialRecipe, garnish),
      cashBonus: this.calculateCashBonus(garnish, specialRecipe)
    };

    return result;
  }

  // 満足度計算
  calculateSatisfaction(base, flavor, garnish, specialRecipe, customerMood) {
    let satisfaction = base.effect;

    // レア度による効果倍率適用
    const rarityMultiplier = gameConfig.rarityMultipliers[base.rarity] || 1.0;
    satisfaction *= rarityMultiplier;

    // 感情マッチング計算
    if (customerMood) {
      if (customerMood === flavor.id) {
        satisfaction += flavor.matchBonus;
      } else {
        satisfaction += flavor.mismatchPenalty;
      }
    }

    // 装飾効果
    if (garnish) {
      switch (garnish.effect) {
        case 'effectBonus20':
          satisfaction *= 1.2;
          break;
        case 'durationPlus1':
          // 持続時間延長は満足度には直接影響しないが、少しボーナス
          satisfaction += 5;
          break;
      }
    }

    // 特殊レシピボーナス
    if (specialRecipe) {
      satisfaction += specialRecipe.satisfactionBonus;
    }

    return Math.max(0, Math.round(satisfaction));
  }

  // 評判変化計算
  calculateReputation(base, flavor, garnish, specialRecipe) {
    let reputation = Math.floor(base.effect * 0.3);

    // 特殊レシピボーナス
    if (specialRecipe) {
      reputation += specialRecipe.reputationBonus;
    }

    // レア度ボーナス
    const rarityMultiplier = gameConfig.rarityMultipliers[base.rarity] || 1.0;
    reputation = Math.round(reputation * rarityMultiplier);

    return reputation;
  }

  // 現金ボーナス計算
  calculateCashBonus(garnish, specialRecipe) {
    let cashBonus = 0;

    if (garnish && garnish.effect === 'cashBonus30') {
      cashBonus += garnish.bonus;
    }

    if (specialRecipe && specialRecipe.specialEffect === 'cashBoost') {
      cashBonus += 50;
    }

    return cashBonus;
  }

  // 特殊効果の取得
  getSpecialEffects(specialRecipe, garnish) {
    const effects = [];

    if (specialRecipe) {
      effects.push({
        type: 'special_recipe',
        effect: specialRecipe.specialEffect,
        name: specialRecipe.name
      });
    }

    if (garnish) {
      effects.push({
        type: 'garnish',
        effect: garnish.effect,
        name: garnish.name,
        bonus: garnish.bonus
      });
    }

    return effects;
  }

  // 特殊レシピチェック
  checkSpecialRecipe(baseId, flavorId, garnishId) {
    return specialRecipes.find(recipe => 
      recipe.baseId === baseId &&
      recipe.flavorId === flavorId &&
      recipe.garnishId === garnishId
    );
  }

  // 個別要素取得メソッド
  getBase(baseId) {
    return rumorData.bases.find(base => base.id === baseId);
  }

  getFlavor(flavorId) {
    return rumorData.flavors.find(flavor => flavor.id === flavorId);
  }

  getGarnish(garnishId) {
    return rumorData.garnishes.find(garnish => garnish.id === garnishId);
  }

  // ランダム噂生成
  generateRandomRumor(type, location = null) {
    const rumorsOfType = rumorData[type];
    if (!rumorsOfType || rumorsOfType.length === 0) {
      return null;
    }

    // 場所による絞り込み（ベースの場合）
    let availableRumors = rumorsOfType;
    if (type === 'bases' && location) {
      // 特定の場所で入手可能な噂に限定
      availableRumors = rumorsOfType.filter(rumor => 
        location.rumorTypes && location.rumorTypes.includes(rumor.id)
      );
    }

    if (availableRumors.length === 0) {
      availableRumors = rumorsOfType;
    }

    // レア度に基づいた確率計算
    const rarity = this.determineRarity();
    const possibleRumors = availableRumors.filter(rumor => rumor.rarity === rarity);
    
    if (possibleRumors.length > 0) {
      return possibleRumors[Math.floor(Math.random() * possibleRumors.length)];
    }

    // 該当するレア度の噂がない場合は適当に選ぶ
    return availableRumors[Math.floor(Math.random() * availableRumors.length)];
  }

  // レア度決定
  determineRarity() {
    const rand = Math.random();
    const probs = gameConfig.rarityProbabilities;
    
    if (rand < probs.legendary) return 'legendary';
    if (rand < probs.legendary + probs.epic) return 'epic';
    if (rand < probs.legendary + probs.epic + probs.rare) return 'rare';
    return 'common';
  }

  // 噂の効果説明を生成
  getEffectDescription(cocktail) {
    let description = `Base: ${cocktail.base.name} (${cocktail.satisfaction} satisfaction)\n`;
    description += `Flavor: ${cocktail.flavor.name}\n`;
    
    if (cocktail.garnish) {
      description += `Garnish: ${cocktail.garnish.name}\n`;
    }
    
    if (cocktail.specialRecipe) {
      description += `Special Recipe: ${cocktail.specialRecipe.name}!\n`;
    }
    
    if (cocktail.specialEffects.length > 0) {
      description += `Special Effects: ${cocktail.specialEffects.map(e => e.name).join(', ')}`;
    }
    
    return description;
  }

  // 全データ取得メソッド
  getAllBases() {
    return [...rumorData.bases];
  }

  getAllFlavors() {
    return [...rumorData.flavors];
  }

  getAllGarnishes() {
    return [...rumorData.garnishes];
  }

  getAllSpecialRecipes() {
    return [...specialRecipes];
  }

  // デバッグ用メソッド
  testCombination(baseId, flavorId, garnishId = null, customerMood = null) {
    console.log('=== Cocktail Test ===');
    console.log(`Base: ${baseId}, Flavor: ${flavorId}, Garnish: ${garnishId}, Customer Mood: ${customerMood}`);
    
    const result = this.combineCocktail(baseId, flavorId, garnishId, customerMood);
    if (result) {
      console.log('Result:', result);
      console.log('Description:', this.getEffectDescription(result));
    } else {
      console.log('Invalid combination');
    }
    
    return result;
  }
}
