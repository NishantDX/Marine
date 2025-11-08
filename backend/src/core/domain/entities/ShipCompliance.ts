export interface ShipComplianceProps {
  id?: number;
  shipId: string;
  year: number;
  cbGco2eq: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ShipCompliance {
  private props: ShipComplianceProps;

  constructor(props: ShipComplianceProps) {
    this.validateProps(props);
    this.props = props;
  }

  private validateProps(props: ShipComplianceProps): void {
    if (!props.shipId) throw new Error('Ship ID is required');
    if (props.year < 2025) throw new Error('Year must be 2025 or later');
  }

  get id(): number | undefined { return this.props.id; }
  get shipId(): string { return this.props.shipId; }
  get year(): number { return this.props.year; }
  get cbGco2eq(): number { return this.props.cbGco2eq; }

  hasSurplus(): boolean {
    return this.props.cbGco2eq > 0;
  }

  hasDeficit(): boolean {
    return this.props.cbGco2eq < 0;
  }

  updateCB(newCB: number): void {
    this.props.cbGco2eq = newCB;
  }

  toJSON(): ShipComplianceProps {
    return { ...this.props };
  }
}