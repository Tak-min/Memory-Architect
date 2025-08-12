// customerSystem.js
// 顧客の生成・行動・満足度管理
import { customerTypes, rumorData, gameConfig } from '../data/gameData.js';

export class CustomerSystem {
  constructor() {
    this.customerNames = [
      'Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona', 'George', 'Hannah',
      'Ivan', 'Julia', 'Kevin', 'Luna', 'Marcus', 'Nina', 'Oscar', 'Petra',
      'Quinn', 'Rachel', 'Sam', 'Tina', 'Urban', 'Vera', 'Walter', 'Xena'
    ];
    this.currentCustomers = [];
  }

  // 夜の顧客リストを生成
  generateNightCustomers(reputation) {
    const customers = [];
    const customerCount = gameConfig.customersPerNight;

    for (let i = 0; i < customerCount; i++) {
      customers.push(this.generateCustomer(reputation));
    }

    this.currentCustomers = customers;
    return customers;
  }

  // 単一顧客の生成
  generateCustomer(reputation) {
    const customerType = this.determineCustomerType(reputation);
    const typeData = customerTypes[customerType];
    
    const customer = {
      id: this.generateCustomerId(),
      name: this.getRandomName(),
      type: customerType,
      typeData: typeData,
      mood: this.randomMood(),
      requestBase: this.randomBase(),
      requestFlavor: this.randomFlavor(),
      satisfaction: this.getInitialSatisfaction(customerType),
      baseSatisfaction: this.getRandomInRange(typeData.satisfactionRange),
      patience: this.calculatePatience(customerType),
      specialRequest: this.generateSpecialRequest(customerType),
      avatar: this.generateAvatar(customerType)
    };

    return customer;
  }

  // 顧客タイプの決定（評判に基づく）
  determineCustomerType(reputation) {
    const rand = Math.random();
    
    if (reputation >= 80) {
      if (rand < gameConfig.vipChanceHighRep) {
        return 'vip';
      } else if (rand < gameConfig.vipChanceHighRep + gameConfig.troublemakerChanceHighRep) {
        return 'troublemaker';
      } else if (rand < 0.7) {
        return 'regular';
      } else {
        return 'tourist';
      }
    } else if (reputation <= 20) {
      if (rand < gameConfig.troublemakerChanceLowRep) {
        return 'troublemaker';
      } else if (rand < gameConfig.troublemakerChanceLowRep + gameConfig.vipChanceLowRep) {
        return 'vip';
      } else if (rand < 0.8) {
        return 'regular';
      } else {
        return 'tourist';
      }
    } else {
      // 中間評判
      if (rand < 0.08) {
        return 'vip';
      } else if (rand < 0.18) {
        return 'troublemaker';
      } else if (rand < 0.7) {
        return 'regular';
      } else {
        return 'tourist';
      }
    }
  }

  // ランダムな感情の選択
  randomMood() {
    const moods = ['joy', 'anger', 'sorrow', 'surprise'];
    return moods[Math.floor(Math.random() * moods.length)];
  }

  // ランダムなベース噂の選択
  randomBase() {
    const bases = rumorData.bases;
    return bases[Math.floor(Math.random() * bases.length)].id;
  }

  // ランダムなフレーバーの選択
  randomFlavor() {
    return this.randomMood(); // 感情とフレーバーは同じ
  }

  // 顧客タイプに応じた初期満足度
  getInitialSatisfaction(customerType) {
    const typeData = customerTypes[customerType];
    return this.getRandomInRange(typeData.satisfactionRange);
  }

  // 範囲内でランダムな値を取得
  getRandomInRange(range) {
    return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
  }

  // 忍耐力の計算
  calculatePatience(customerType) {
    const basePatience = {
      regular: 3,
      tourist: 2,
      vip: 4,
      troublemaker: 1
    };
    
    return basePatience[customerType] + Math.floor(Math.random() * 2);
  }

  // 特別なリクエストの生成
  generateSpecialRequest(customerType) {
    if (customerType === 'vip' && Math.random() < 0.3) {
      return {
        type: 'specific_recipe',
        message: 'I heard you know some special recipes...'
      };
    } else if (customerType === 'troublemaker' && Math.random() < 0.4) {
      return {
        type: 'difficult_order',
        message: 'Make me something that will surprise me, or else...'
      };
    }
    return null;
  }

  // 顧客のアバター生成（プレースホルダー）
  generateAvatar(customerType) {
    const avatarSets = {
      regular: ['👨', '👩', '🧑', '👨‍💼', '👩‍💼'],
      tourist: ['👨‍🎒', '👩‍🎒', '🧳', '📷', '🗺️'],
      vip: ['👨‍💼', '👩‍💼', '💼', '💎', '🎩'],
      troublemaker: ['😠', '😡', '💀', '🔥', '⚡']
    };
    
    const set = avatarSets[customerType] || avatarSets.regular;
    return set[Math.floor(Math.random() * set.length)];
  }

  // 顧客ID生成
  generateCustomerId() {
    return 'customer_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
  }

  // ランダムな名前取得
  getRandomName() {
    return this.customerNames[Math.floor(Math.random() * this.customerNames.length)];
  }

  // カクテル提供の処理
  serveCocktail(customer, cocktailResult) {
    if (!customer || !cocktailResult) {
      return {
        success: false,
        message: 'Invalid service attempt'
      };
    }

    // 感情マッチの確認
    const moodMatch = customer.mood === cocktailResult.flavor.id;
    
    // 基本満足度計算
    let finalSatisfaction = cocktailResult.satisfaction;
    
    // 顧客タイプによる満足度調整
    finalSatisfaction *= customer.typeData.reputationMultiplier > 0 ? 
      customer.typeData.reputationMultiplier : 
      Math.abs(customer.typeData.reputationMultiplier);

    // 感情マッチボーナス/ペナルティ
    if (moodMatch) {
      finalSatisfaction += 10;
    } else {
      finalSatisfaction -= 5;
    }

    // 特別リクエスト処理
    if (customer.specialRequest) {
      if (this.handleSpecialRequest(customer, cocktailResult)) {
        finalSatisfaction += 15;
      } else {
        finalSatisfaction -= 10;
      }
    }

    // 最終満足度の調整
    finalSatisfaction = Math.max(0, Math.round(finalSatisfaction));
    
    // 評判変化の計算
    let reputationChange = Math.floor(finalSatisfaction * 0.15);
    reputationChange *= customer.typeData.reputationMultiplier;
    
    // 現金収入の計算
    let cashEarned = Math.floor(finalSatisfaction * 0.5);
    cashEarned *= customer.typeData.cashMultiplier;
    cashEarned += cocktailResult.cashBonus || 0;

    // 顧客の反応メッセージ
    const reaction = this.generateReaction(customer, finalSatisfaction, moodMatch);

    return {
      success: true,
      customer: customer,
      cocktail: cocktailResult,
      satisfaction: finalSatisfaction,
      reputationChange: Math.round(reputationChange),
      cashEarned: Math.round(cashEarned),
      moodMatch: moodMatch,
      reaction: reaction,
      specialEffects: cocktailResult.specialEffects
    };
  }

  // 特別リクエストの処理
  handleSpecialRequest(customer, cocktailResult) {
    if (!customer.specialRequest) return false;

    switch (customer.specialRequest.type) {
      case 'specific_recipe':
        return !!cocktailResult.specialRecipe;
      case 'difficult_order':
        return cocktailResult.satisfaction > 50;
      default:
        return false;
    }
  }

  // 顧客の反応メッセージ生成
  generateReaction(customer, satisfaction, moodMatch) {
    const reactions = {
      excellent: [
        "This is absolutely perfect!",
        "You really understand what I needed!",
        "I'll definitely be back!",
        "This exceeded my expectations!"
      ],
      good: [
        "This is quite good, thank you!",
        "Not bad at all!",
        "I'm satisfied with this.",
        "This hits the spot."
      ],
      average: [
        "It's okay, I guess.",
        "This will do.",
        "Not what I expected, but fine.",
        "Could be better, but thanks."
      ],
      poor: [
        "This isn't what I wanted...",
        "I'm disappointed.",
        "This doesn't match my mood at all.",
        "I expected better."
      ],
      terrible: [
        "This is awful!",
        "What were you thinking?!",
        "I'm never coming back!",
        "This is completely wrong!"
      ]
    };

    let category;
    if (satisfaction >= 70) category = 'excellent';
    else if (satisfaction >= 50) category = 'good';
    else if (satisfaction >= 30) category = 'average';
    else if (satisfaction >= 15) category = 'poor';
    else category = 'terrible';

    // 顧客タイプによる反応の調整
    if (customer.type === 'troublemaker' && category !== 'excellent') {
      category = 'terrible';
    } else if (customer.type === 'vip' && !moodMatch) {
      // VIPは感情マッチしないと厳しい
      if (category === 'excellent') category = 'good';
      else if (category === 'good') category = 'average';
    }

    const messages = reactions[category];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // 現在の顧客リスト取得
  getCurrentCustomers() {
    return [...this.currentCustomers];
  }

  // デバッグ用メソッド
  testCustomerGeneration(reputation, count = 5) {
    console.log(`=== Testing Customer Generation (Reputation: ${reputation}) ===`);
    for (let i = 0; i < count; i++) {
      const customer = this.generateCustomer(reputation);
      console.log(`${i + 1}. ${customer.name} (${customer.type}) - Mood: ${customer.mood}, Wants: ${customer.requestBase}`);
    }
  }
}
