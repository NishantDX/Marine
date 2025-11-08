export class ComplianceBalance {
  private readonly value: number;

  constructor(value: number) {
    this.value = value;
  }

  isSurplus(): boolean {
    return this.value > 0;
  }

  isDeficit(): boolean {
    return this.value < 0;
  }

  isNeutral(): boolean {
    return this.value === 0;
  }

  getValue(): number {
    return this.value;
  }

  add(other: ComplianceBalance): ComplianceBalance {
    return new ComplianceBalance(this.value + other.value);
  }

  subtract(other: ComplianceBalance): ComplianceBalance {
    return new ComplianceBalance(this.value - other.value);
  }
}