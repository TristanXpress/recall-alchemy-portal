
// Helper functions for dynamic incentives
export class DynamicIncentiveHelpers {
  // Calculate dynamic incentive value
  static calculateDynamicIncentiveValue(
    baseAmount: number,
    incentiveAmount: number,
    incentiveType: "percentage" | "fixed"
  ) {
    if (incentiveType === "percentage") {
      return (baseAmount * incentiveAmount) / 100;
    }
    return incentiveAmount;
  }

  // Format currency for display
  static formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  }
}
