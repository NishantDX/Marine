export interface PoolMember {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface PoolProps {
  id?: number;
  year: number;
  members: PoolMember[];
  createdAt?: Date;
}

export class Pool {
  private props: PoolProps;

  constructor(props: PoolProps) {
    this.validateProps(props);
    this.props = props;
  }

  private validateProps(props: PoolProps): void {
    if (props.members.length < 2) {
      throw new Error('Pool must have at least 2 members');
    }

    const totalCB = this.calculateTotalCB(props.members);
    if (totalCB < 0) {
      throw new Error('Pool sum must be >= 0');
    }

    // Validate no member exits worse
    for (const member of props.members) {
      if (member.cbBefore < 0 && member.cbAfter < member.cbBefore) {
        throw new Error(`Deficit ship ${member.shipId} cannot exit worse`);
      }
      if (member.cbBefore > 0 && member.cbAfter < 0) {
        throw new Error(`Surplus ship ${member.shipId} cannot exit negative`);
      }
    }
  }

  private calculateTotalCB(members: PoolMember[]): number {
    return members.reduce((sum, m) => sum + m.cbBefore, 0);
  }

  get id(): number | undefined { return this.props.id; }
  get year(): number { return this.props.year; }
  get members(): PoolMember[] { return this.props.members; }

  getTotalCBBefore(): number {
    return this.calculateTotalCB(this.props.members);
  }

  getTotalCBAfter(): number {
    return this.props.members.reduce((sum, m) => sum + m.cbAfter, 0);
  }

  toJSON(): PoolProps {
    return { ...this.props };
  }
}