// gameData.js - ゲーム全体のデータ定義
export const rumorData = {
  bases: [
    {
      id: "mayors_cat",
      name: "Mayor's Cat",
      effect: 20,
      rarity: "common",
      description: "The mayor's cat is listening to secret plans",
      duration: 3
    },
    {
      id: "time_traveling_fountain",
      name: "Time-Traveling Fountain", 
      effect: 25,
      rarity: "rare",
      description: "The fountain in Central Park is actually a time machine",
      duration: 5
    },
    {
      id: "dj_dark_deal",
      name: "DJ's Dark Deal",
      effect: 30,
      rarity: "rare", 
      description: "Famous DJ's illegal underground club dealings",
      duration: 5
    },
    {
      id: "ghost_subway_station",
      name: "Ghost Subway Station",
      effect: 15,
      rarity: "common",
      description: "A haunted abandoned subway station",
      duration: 3
    },
    {
      id: "rooftop_secret_meeting",
      name: "Rooftop Secret Meeting",
      effect: 35,
      rarity: "epic",
      description: "Mysterious meetings on the skyscraper rooftop",
      duration: 7
    },
    {
      id: "memory_coffee",
      name: "Memory Coffee",
      effect: 40,
      rarity: "legendary",
      description: "The old cafe's memory-manipulating coffee",
      duration: 10
    }
  ],
  
  flavors: [
    {
      id: "joy",
      name: "Joy",
      matchBonus: 15,
      mismatchPenalty: -8,
      specialEffect: "nextVisitBonus",
      description: "Brings happiness and warmth"
    },
    {
      id: "anger", 
      name: "Anger",
      matchBonus: 15,
      mismatchPenalty: -10,
      specialEffect: "troublemakerPrevention",
      description: "Channels fury and passion"
    },
    {
      id: "sorrow",
      name: "Sorrow", 
      matchBonus: 15,
      mismatchPenalty: -6,
      specialEffect: "specialItemChance",
      description: "Evokes deep melancholy"
    },
    {
      id: "surprise",
      name: "Surprise",
      matchBonus: 18,
      mismatchPenalty: -5, 
      specialEffect: "hiddenRecipeBonus",
      description: "Creates unexpected wonder"
    }
  ],
  
  garnishes: [
    {
      id: "witness_testimony",
      name: "Witness Testimony",
      effect: "durationPlus1",
      bonus: 0,
      description: "There are witnesses to back up this rumor"
    },
    {
      id: "midnight_only",
      name: "Midnight Only", 
      effect: "effectBonus20",
      bonus: 20,
      description: "This phenomenon only happens at 2 AM"
    },
    {
      id: "black_market_gossip",
      name: "Black Market Gossip",
      effect: "cashBonus30",
      bonus: 30,
      description: "Heard through underground channels"
    },
    {
      id: "mysterious_note",
      name: "Mysterious Note",
      effect: "newRumorChance15",
      bonus: 15,
      description: "A cryptic note was found relating to this"
    }
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
  },
  {
    name: "Midnight Fountain Shock", 
    baseId: "time_traveling_fountain",
    flavorId: "surprise",
    garnishId: "midnight_only",
    satisfactionBonus: 50,
    reputationBonus: 12,
    specialEffect: "autoRumors"
  },
  {
    name: "Angry DJ's Secret",
    baseId: "dj_dark_deal",
    flavorId: "anger", 
    garnishId: "black_market_gossip",
    satisfactionBonus: 40,
    reputationBonus: 10,
    specialEffect: "cashBoost"
  },
  {
    name: "Sorrowful Memory",
    baseId: "memory_coffee",
    flavorId: "sorrow",
    garnishId: "mysterious_note", 
    satisfactionBonus: 35,
    reputationBonus: 18,
    specialEffect: "guaranteedItem"
  },
  {
    name: "Ghost Surprise",
    baseId: "ghost_subway_station",
    flavorId: "surprise",
    garnishId: "midnight_only",
    satisfactionBonus: 60,
    reputationBonus: 20, 
    specialEffect: "legendaryChance"
  }
];

export const customerTypes = {
  regular: {
    name: "Regular Customer",
    satisfactionRange: [20, 40],
    reputationMultiplier: 1.0,
    cashMultiplier: 1.0,
    description: "A friendly neighborhood regular"
  },
  tourist: {
    name: "Tourist",
    satisfactionRange: [15, 50], 
    reputationMultiplier: 0.8,
    cashMultiplier: 1.5,
    description: "A curious visitor to the city"
  },
  vip: {
    name: "VIP Customer", 
    satisfactionRange: [40, 60],
    reputationMultiplier: 2.0,
    cashMultiplier: 2.0,
    description: "An influential person in the city"
  },
  troublemaker: {
    name: "Troublemaker",
    satisfactionRange: [10, 30],
    reputationMultiplier: -1.5,
    cashMultiplier: 0.5,
    description: "Someone looking to cause problems"
  }
};

export const cityDistricts = [
  {
    id: "central_park",
    name: "Central Park", 
    apCost: 3,
    rumorTypes: ["mayors_cat", "time_traveling_fountain"],
    description: "A peaceful park in the city center"
  },
  {
    id: "city_hall",
    name: "City Hall Steps",
    apCost: 3, 
    rumorTypes: ["mayors_cat", "rooftop_secret_meeting"],
    description: "The seat of city government"
  },
  {
    id: "back_alleys",
    name: "Back Alleys",
    apCost: 3,
    rumorTypes: ["ghost_subway_station", "dj_dark_deal"], 
    description: "Dark and mysterious alleyways"
  },
  {
    id: "underground_club",
    name: "Underground Club", 
    apCost: 3,
    rumorTypes: ["dj_dark_deal", "memory_coffee"],
    description: "A hidden club beneath the city"
  },
  {
    id: "news_agency",
    name: "News Agency",
    apCost: 2,
    rumorTypes: ["mayors_cat", "rooftop_secret_meeting"],
    description: "Where all the city's news is gathered"
  },
  {
    id: "black_market",
    name: "Black Market",
    apCost: 1,
    rumorTypes: ["memory_coffee", "ghost_subway_station"],
    description: "A place to buy rare and unusual items"
  }
];

export const gameConfig = {
  initialActionPoints: 6,
  initialReputation: 50,
  maxReputation: 100,
  minReputation: 0,
  customersPerNight: 4,
  vipChanceHighRep: 0.15,
  vipChanceLowRep: 0.02,
  troublemakerChanceHighRep: 0.05,
  troublemakerChanceLowRep: 0.25,
  rarityProbabilities: {
    common: 0.70,
    rare: 0.20,
    epic: 0.08,
    legendary: 0.02
  },
  rarityMultipliers: {
    common: 1.0,
    rare: 1.5,
    epic: 2.0,
    legendary: 3.0
  }
};
