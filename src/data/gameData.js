// gameData.js - Defines all the core data for the game.

/**
 * Rumor data, categorized by type.
 */
export const rumorData = {
  bases: [
    { id: "mayors_cat", name: "Mayor's Cat", description: "The mayor's cat knows secret plans.", baseEffect: 20 },
    { id: "time_traveling_fountain", name: "Time-Traveling Fountain", description: "The park fountain is a time machine.", baseEffect: 25 },
    { id: "dj_dark_deal", name: "DJ's Dark Deal", description: "A famous DJ's illegal dealings.", baseEffect: 30 },
    { id: "ghost_subway_station", name: "Ghost Subway Station", description: "A haunted, abandoned subway station.", baseEffect: 15 },
    { id: "rooftop_secret_meeting", name: "Rooftop Secret Meeting", description: "Mysterious meetings on skyscrapers.", baseEffect: 35 },
    { id: "memory_coffee", name: "Memory Coffee", description: "An old cafe serves memory-altering coffee.", baseEffect: 40 }
  ],
  flavors: [
    { id: "joy", name: "Joy", matchBonus: 15, mismatchPenalty: -8, specialEffect: "nextVisitBonus", description: "A burst of happiness." },
    { id: "anger", name: "Anger", matchBonus: 15, mismatchPenalty: -10, specialEffect: "troublemakerPrevention", description: "A touch of fury." },
    { id: "sorrow", name: "Sorrow", matchBonus: 15, mismatchPenalty: -6, specialEffect: "specialItemChance", description: "A wave of melancholy." },
    { id: "surprise", name: "Surprise", matchBonus: 18, mismatchPenalty: -5, specialEffect: "hiddenRecipeBonus", description: "An unexpected twist." }
  ],
  garnishes: [
    { id: "witness_testimony", name: "Witness Testimony", description: "Adds +1 day to effect duration.", effect: "duration", value: 1 },
    { id: "midnight_only", name: "Midnight Only", description: "Boosts effect by +20%.", effect: "effectMultiplier", value: 0.20 },
    { id: "black_market_gossip", name: "Black Market Gossip", description: "Increases cash reward by +30%.", effect: "cashMultiplier", value: 0.30 },
    { id: "mysterious_note", name: "Mysterious Note", description: "Increases new rumor chance by +15%.", effect: "newRumorChance", value: 0.15 }
  ]
};

/**
 * Special cocktail recipes.
 */
export const specialRecipes = [
  { name: "Mayor's Time Cat", baseId: "mayors_cat", flavorId: "joy", garnishId: "witness_testimony", satisfactionBonus: 45, reputationBonus: 15, specialEffect: "vipBoost" },
  { name: "Midnight Fountain Shock", baseId: "time_traveling_fountain", flavorId: "surprise", garnishId: "midnight_only", satisfactionBonus: 50, specialEffect: "autoRumors" },
  { name: "Angry DJ's Secret", baseId: "dj_dark_deal", flavorId: "anger", garnishId: "black_market_gossip", satisfactionBonus: 40, specialEffect: "cashBoost" },
  { name: "Sorrowful Memory", baseId: "memory_coffee", flavorId: "sorrow", garnishId: "mysterious_note", satisfactionBonus: 35, specialEffect: "guaranteedItem" },
  { name: "Ghost Surprise", baseId: "ghost_subway_station", flavorId: "surprise", garnishId: "midnight_only", satisfactionBonus: 60, specialEffect: "legendaryChance" }
];

/**
 * Customer type definitions.
 */
export const customerTypes = {
  regular: { name: "Regular Customer", description: "A familiar face." },
  tourist: { name: "Tourist", description: "Just visiting the city." },
  vip: { name: "VIP Customer", description: "An influential figure." },
  troublemaker: { name: "Troublemaker", description: "Looks like they might cause problems." }
};

/**
 * Day phase explorable districts.
 */
export const cityDistricts = [
  { id: "central_park", name: "Central Park", apCost: 3, rumorSources: ["time_traveling_fountain"] },
  { id: "city_hall", name: "City Hall Steps", apCost: 2, rumorSources: ["mayors_cat"] },
  { id: "back_alleys", name: "Back Alleys", apCost: 2, rumorSources: ["rooftop_secret_meeting"] },
  { id: "underground_club", name: "Underground Club", apCost: 2, rumorSources: ["dj_dark_deal", "ghost_subway_station"] },
  { id: "news_agency", name: "News Agency", apCost: 2, rumorSources: ["mayors_cat", "rooftop_secret_meeting"] },
  { id: "black_market", name: "Black Market", apCost: 1, rumorSources: ["memory_coffee", "dj_dark_deal"] }
];

/**
 * Core game configuration and balance settings.
 */
export const gameConfig = {
  initialActionPoints: 6,
  dayPhase: {
    npcConversationApCost: 2,
    blackMarketApCost: 1,
    specialEventApCost: 4,
  },
  initialReputation: 50,
  maxReputation: 100,
  minReputation: 0,
  customersPerNight: 3,
  
  rarity: {
    common: { probability: 0.70, multiplier: 1.0, duration: 3 },
    rare: { probability: 0.20, multiplier: 1.5, duration: 5 },
    epic: { probability: 0.08, multiplier: 2.0, duration: 7 },
    legendary: { probability: 0.02, multiplier: 3.0, duration: 10 }
  },

  reputationLevels: {
    legendary: { range: [90, 100], vipChance: 0.25, troublemakerChance: 0.00, effect: "Secret recipes unlocked." },
    high: { range: [70, 89], vipChance: 0.15, troublemakerChance: 0.05, effect: "Rare rumor chance +20%." },
    medium: { range: [40, 69], vipChance: 0.08, troublemakerChance: 0.10, effect: "Normal operation." },
    low: { range: [20, 39], vipChance: 0.02, troublemakerChance: 0.25, effect: "Bad reputation events may occur." },
    terrible: { range: [0, 19], vipChance: 0.00, troublemakerChance: 0.40, effect: "Sabotage events may occur." }
  },

  satisfactionToReputation: (satisfaction) => {
    if (satisfaction >= 80) return Math.floor(Math.random() * 3) + 8; // 8-10
    if (satisfaction >= 60) return Math.floor(Math.random() * 3) + 3; // 3-5
    if (satisfaction >= 40) return 0;
    if (satisfaction >= 20) return -(Math.floor(Math.random() * 3) + 3); // -3 to -5
    return -(Math.floor(Math.random() * 3) + 8); // -8 to -10
  }
};
