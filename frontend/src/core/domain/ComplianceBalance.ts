/**
 * Domain Entity: Compliance Balance (CB)
 * Represents Fuel EU Maritime compliance balance for banking/pooling
 */
export interface ComplianceBalance {
  shipId: string;
  year: number;
  cbValue: number; // MJ
  isDeficit: boolean;
}

export interface AdjustedComplianceBalance extends ComplianceBalance {
  adjustedCb: number; // MJ
}

export interface BankingRecord {
  id: string;
  shipId: string;
  year: number;
  action: "bank" | "apply";
  amount: number; // MJ
  cbBefore: number;
  cbAfter: number;
  timestamp: Date;
}

export interface BankingSummary {
  cbBefore: number;
  applied: number;
  cbAfter: number;
}
