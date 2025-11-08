export interface BankEntryProps {
  id?: number;
  shipId: string;
  year: number;
  amountGco2eq: number;
  createdAt?: Date;
}

export class BankEntry {
  private props: BankEntryProps;

  constructor(props: BankEntryProps) {
    this.validateProps(props);
    this.props = props;
  }

  private validateProps(props: BankEntryProps): void {
    if (!props.shipId) throw new Error('Ship ID is required');
    if (props.amountGco2eq <= 0) throw new Error('Bank amount must be positive');
  }

  get id(): number | undefined { return this.props.id; }
  get shipId(): string { return this.props.shipId; }
  get year(): number { return this.props.year; }
  get amountGco2eq(): number { return this.props.amountGco2eq; }

  toJSON(): BankEntryProps {
    return { ...this.props };
  }
}