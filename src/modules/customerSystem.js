// customerSystem.js
// 顧客の生成・行動・満足度管理
export class CustomerSystem {
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

  determineCustomerType(reputation) {
    if (reputation >= 80) {
      return Math.random() < 0.15 ? 'vip' : 'regular';
    } else if (reputation <= 20) {
      return Math.random() < 0.25 ? 'troublemaker' : 'regular';
    }
    return 'regular';
  }
}
