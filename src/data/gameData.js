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
