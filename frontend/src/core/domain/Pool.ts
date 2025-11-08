/**
 * Domain Entity: Pool
 * Represents Fuel EU Maritime Article 21 - Pooling mechanism
 */
export interface PoolMember {
  shipId: string;
  shipName: string;
  cbBefore: number; // MJ
  contribution: number; // MJ
  cbAfter: number; // MJ
}

export interface Pool {
  id: string;
  year: number;
  members: PoolMember[];
  poolSumBefore: number;
  totalContribution: number;
  poolSumAfter: number;
  isValid: boolean;
  validationErrors: string[];
}

export interface PoolValidationRules {
  // Sum of adjusted CB must be >= 0
  poolSumNonNegative: boolean;
  // Deficit ships cannot exit worse
  deficitShipsNotWorse: boolean;
  // Surplus ships cannot exit negative
  surplusShipsNotNegative: boolean;
}

export interface CreatePoolRequest {
  year: number;
  members: Array<{
    shipId: string;
    contribution: number;
  }>;
}
