// gameData.js
// 全ゲームデータ（JSON形式）
export const rumorData = {
  bases: [
    {
      id: "mayors_cat",
      name: "Mayor's Cat",
      effect: 20,
      rarity: "common",
      description: "The mayor's cat is listening to secret plans"
    }
    // 他のBaseデータを追加
  ],
  flavors: [
    {
      id: "joy",
      name: "Joy",
      matchBonus: 15,
      mismatchPenalty: -8,
      specialEffect: "nextVisitBonus"
    }
    // 他のFlavorデータを追加
  ],
  garnishes: [
    {
      id: "witness_testimony",
      name: "Witness Testimony",
      effect: "durationPlus1",
      bonus: 0
    }
    // 他のGarnishデータを追加
  ]
};

export const specialRecipes = [
  {
    name: "Mayor's Time Cat",
    baseId: "mayors_cat",
    flavorId: "joy",
    garnishId: "witness_testimony",
    satisfactionBonus: 45,
    reputationBonus: 15,
    specialEffect: "vipBoost"
  }
  // 他の特殊レシピを追加
];

export const actionPoints = {
  initialAP: 6,
  gatherRumor: -2,
  buyIngredients: -1,
  exploreLocation: -3,
  specialEvent: -4
};

export const customerSatisfaction = {
  correctCocktail: 20,
  wrongCocktail: -15,
  emotionMatchBonus: 10,
  emotionMismatchPenalty: -8
};

export const rumorEffects = {
  common: { impact: 5, expiry: 3 },
  rare: { impact: 10, expiry: 5 },
  epic: { impact: 20, expiry: 7 },
  legendary: { impact: 35, expiry: 10 }
};

export const reputationSystem = {
  satisfactionToReputation: 0.1,
  negativeTrigger: 20,
  highTrigger: 80,
  troublemakerChance: 15,
  vipChance: 20
};

export const synergyBonuses = {
  fullEmotionMatch: 1.2,
  specialRecipeMatch: 1.5
};
