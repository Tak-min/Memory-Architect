// reputationSystem.js
// 評判計算・イベント発生管理
import { gameConfig } from '../data/gameData.js';

export class ReputationSystem {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.reputationHistory = [];
    this.specialEvents = [];
  }

  // 評判変化の処理
  processReputationChange(change, source = 'unknown') {
    const oldReputation = this.gameEngine.gameState.reputation;
    this.gameEngine.changeReputation(change);
    const newReputation = this.gameEngine.gameState.reputation;

    // 履歴に記録
    this.reputationHistory.push({
      day: this.gameEngine.gameState.currentDay,
      oldValue: oldReputation,
      newValue: newReputation,
      change: change,
      source: source,
      timestamp: Date.now()
    });

    // 特殊イベントチェック
    this.checkSpecialEvents(oldReputation, newReputation);

    return {
      oldReputation,
      newReputation,
      change
    };
  }

  // 特殊イベントのチェック
  checkSpecialEvents(oldReputation, newReputation) {
    // 高評判達成イベント
    if (oldReputation < 90 && newReputation >= 90) {
      this.triggerSpecialEvent('legendary_status', {
        title: 'Legendary Status Achieved!',
        description: 'Your bar has become the stuff of legends! VIP customers flock to your establishment.',
        effects: ['vip_boost', 'legendary_rumor_chance']
      });
    }

    // 低評判警告イベント
    if (oldReputation > 20 && newReputation <= 20) {
      this.triggerSpecialEvent('reputation_crisis', {
        title: 'Reputation Crisis!',
        description: 'Word is spreading about poor service. Troublemakers are starting to show up.',
        effects: ['troublemaker_increase', 'rumor_difficulty_up']
      });
    }

    // 評判回復イベント
    if (oldReputation <= 30 && newReputation > 50) {
      this.triggerSpecialEvent('reputation_recovery', {
        title: 'Reputation Recovery',
        description: 'Your improved service is getting noticed. Things are looking up!',
        effects: ['customer_patience_boost']
      });
    }

    // 中間評判安定化
    if (newReputation >= 40 && newReputation <= 70) {
      const recentChanges = this.getRecentReputationChanges(3);
      const stability = this.calculateStability(recentChanges);
      
      if (stability < 5) { // 安定している
        this.triggerSpecialEvent('stable_business', {
          title: 'Stable Business',
          description: 'Your consistent service has earned customer trust.',
          effects: ['customer_loyalty_boost']
        });
      }
    }
  }

  // 特殊イベントの発動
  triggerSpecialEvent(eventType, eventData) {
    const event = {
      type: eventType,
      day: this.gameEngine.gameState.currentDay,
      data: eventData,
      timestamp: Date.now()
    };

    this.specialEvents.push(event);
    this.gameEngine.triggerEvent('specialEvent', event);

    // 効果の適用
    this.applyEventEffects(event);
  }

  // イベント効果の適用
  applyEventEffects(event) {
    if (event.data.effects) {
      event.data.effects.forEach(effect => {
        switch (effect) {
          case 'vip_boost':
            // VIP出現率を一時的に上昇
            this.gameEngine.gameState.temporaryEffects = 
              this.gameEngine.gameState.temporaryEffects || {};
            this.gameEngine.gameState.temporaryEffects.vipBoost = {
              multiplier: 2.0,
              duration: 3
            };
            break;

          case 'legendary_rumor_chance':
            // レジェンダリー噂の出現率アップ
            this.gameEngine.gameState.temporaryEffects = 
              this.gameEngine.gameState.temporaryEffects || {};
            this.gameEngine.gameState.temporaryEffects.legendaryBoost = {
              multiplier: 3.0,
              duration: 5
            };
            break;

          case 'troublemaker_increase':
            // トラブルメーカー出現率上昇
            this.gameEngine.gameState.temporaryEffects = 
              this.gameEngine.gameState.temporaryEffects || {};
            this.gameEngine.gameState.temporaryEffects.troublemakerBoost = {
              multiplier: 2.0,
              duration: 4
            };
            break;

          default:
            break;
        }
      });
    }
  }

  // 最近の評判変化を取得
  getRecentReputationChanges(days) {
    const cutoffDay = this.gameEngine.gameState.currentDay - days;
    return this.reputationHistory.filter(entry => entry.day >= cutoffDay);
  }

  // 評判の安定性を計算
  calculateStability(recentChanges) {
    if (recentChanges.length === 0) return 0;
    
    const changes = recentChanges.map(entry => Math.abs(entry.change));
    const average = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    
    return average;
  }

  // 評判レベルの取得
  getReputationLevel(reputation = null) {
    const rep = reputation || this.gameEngine.gameState.reputation;
    
    if (rep >= 90) return { level: 'Legendary', color: '#FFD700', description: 'Your bar is the stuff of legends' };
    if (rep >= 70) return { level: 'High', color: '#00FF00', description: 'Well-respected establishment' };
    if (rep >= 40) return { level: 'Medium', color: '#FFFF00', description: 'Average neighborhood bar' };
    if (rep >= 20) return { level: 'Low', color: '#FF8800', description: 'Struggling to maintain reputation' };
    return { level: 'Terrible', color: '#FF0000', description: 'On the verge of closing' };
  }

  // 評判に基づく効果の計算
  getReputationEffects() {
    const reputation = this.gameEngine.gameState.reputation;
    const effects = {
      vipChance: this.calculateVipChance(reputation),
      troublemakerChance: this.calculateTroublemakerChance(reputation),
      rumorQuality: this.calculateRumorQuality(reputation),
      customerPatience: this.calculateCustomerPatience(reputation)
    };

    return effects;
  }

  // VIP出現確率計算
  calculateVipChance(reputation) {
    if (reputation >= 80) {
      return gameConfig.vipChanceHighRep;
    } else if (reputation >= 60) {
      return gameConfig.vipChanceHighRep * 0.6;
    } else if (reputation >= 40) {
      return gameConfig.vipChanceHighRep * 0.3;
    } else {
      return gameConfig.vipChanceLowRep;
    }
  }

  // トラブルメーカー出現確率計算
  calculateTroublemakerChance(reputation) {
    if (reputation <= 20) {
      return gameConfig.troublemakerChanceLowRep;
    } else if (reputation <= 40) {
      return gameConfig.troublemakerChanceLowRep * 0.6;
    } else if (reputation <= 60) {
      return gameConfig.troublemakerChanceLowRep * 0.3;
    } else {
      return gameConfig.troublemakerChanceHighRep;
    }
  }

  // 噂の質計算
  calculateRumorQuality(reputation) {
    const baseQuality = 1.0;
    if (reputation >= 80) return baseQuality * 1.5;
    if (reputation >= 60) return baseQuality * 1.2;
    if (reputation <= 20) return baseQuality * 0.7;
    return baseQuality;
  }

  // 顧客の忍耐力計算
  calculateCustomerPatience(reputation) {
    const basePatience = 1.0;
    if (reputation >= 80) return basePatience * 1.3;
    if (reputation >= 60) return basePatience * 1.1;
    if (reputation <= 20) return basePatience * 0.7;
    return basePatience;
  }

  // 評判統計の取得
  getReputationStats() {
    const history = this.reputationHistory;
    if (history.length === 0) {
      return {
        averageDaily: 0,
        totalChanges: 0,
        positiveChanges: 0,
        negativeChanges: 0,
        biggestGain: 0,
        biggestLoss: 0
      };
    }

    const changes = history.map(entry => entry.change);
    const positiveChanges = changes.filter(change => change > 0);
    const negativeChanges = changes.filter(change => change < 0);

    return {
      averageDaily: changes.reduce((sum, change) => sum + change, 0) / history.length,
      totalChanges: changes.length,
      positiveChanges: positiveChanges.length,
      negativeChanges: negativeChanges.length,
      biggestGain: Math.max(...positiveChanges, 0),
      biggestLoss: Math.min(...negativeChanges, 0)
    };
  }

  // 一時的効果の処理（日数経過時）
  processTemporaryEffects() {
    const effects = this.gameEngine.gameState.temporaryEffects;
    if (!effects) return;

    Object.keys(effects).forEach(effectName => {
      const effect = effects[effectName];
      effect.duration--;
      
      if (effect.duration <= 0) {
        delete effects[effectName];
        this.gameEngine.triggerEvent('temporaryEffectExpired', { effectName });
      }
    });
  }

  // 評判履歴のクリア（デバッグ用）
  clearHistory() {
    this.reputationHistory = [];
    this.specialEvents = [];
  }

  // デバッグ情報取得
  getDebugInfo() {
    return {
      currentReputation: this.gameEngine.gameState.reputation,
      reputationLevel: this.getReputationLevel(),
      effects: this.getReputationEffects(),
      stats: this.getReputationStats(),
      recentEvents: this.specialEvents.slice(-5),
      temporaryEffects: this.gameEngine.gameState.temporaryEffects || {}
    };
  }
}
