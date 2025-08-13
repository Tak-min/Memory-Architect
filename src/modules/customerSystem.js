// src/modules/customerSystem.js
import { rumorData } from '../data/gameData.js';

export class CustomerSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.customers = [];
    }

    update(deltaTime) {
        // 顧客関連のロジックを更新
    }

    generateCustomers() {
        // 新しい顧客を生成
    }

    generateCustomer(reputation) {
        const customerType = this.determineCustomerType(reputation);
        
        return {
            type: customerType,
            mood: this.randomMood(),
            requestBase: this.randomBase(),
            requestFlavor: this.randomFlavor(),
            satisfaction: this.getInitialSatisfaction(customerType)
        };
    }
    
    // VIP出現確率計算
    determineCustomerType(reputation) {
        if (reputation >= 80) {
            return Math.random() < 0.15 ? 'vip' : 'regular';
        } else if (reputation <= 20) {
            return Math.random() < 0.25 ? 'troublemaker' : 'regular';
        }
        return 'regular';
    }

    randomMood() {
        const moods = ['joy', 'anger', 'sorrow', 'surprise'];
        return moods[Math.floor(Math.random() * moods.length)];
    }

    randomBase() {
        const bases = rumorData.bases;
        return bases[Math.floor(Math.random() * bases.length)].id;
    }

    randomFlavor() {
        const flavors = rumorData.flavors;
        return flavors[Math.floor(Math.random() * flavors.length)].id;
    }

    getInitialSatisfaction(customerType) {
        switch(customerType) {
          case 'vip': return 60;
          case 'troublemaker': return 20;
          default: return 40;
        }
    }
}
