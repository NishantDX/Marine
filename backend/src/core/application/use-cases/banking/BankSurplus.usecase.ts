import { IShipComplianceRepository } from "../../../ports/outbound/IShipComplianceRepository";
import { IBankEntryRepository } from "../../../ports/outbound/IBankEntryRepository";

export interface BankSurplusResult {
  cbBefore: number;
  applied: number;
  cbAfter: number;
}

export class BankSurplusUseCase {
  constructor(
    private shipComplianceRepository: IShipComplianceRepository,
    private bankEntryRepository: IBankEntryRepository
  ) {}

  async execute(
    shipId: string,
    year: number,
    amount?: number
  ): Promise<BankSurplusResult> {
    // Get current CB
    const compliance = await this.shipComplianceRepository.findByShipAndYear(
      shipId,
      year
    );
    if (!compliance) {
      throw new Error(
        `No compliance data found for ship ${shipId} in year ${year}`
      );
    }

    // Check if CB is positive (surplus)
    if (!compliance.hasSurplus()) {
      throw new Error("Cannot bank deficit or zero CB");
    }

    const cbBefore = compliance.cbGco2eq;
    const amountToBank = amount !== undefined ? amount : compliance.cbGco2eq;

    // Validate amount
    if (amountToBank > compliance.cbGco2eq) {
      throw new Error("Cannot bank more than available surplus");
    }

    // Create bank entry with the surplus amount
    await this.bankEntryRepository.create({
      shipId,
      year,
      amountGco2eq: amountToBank,
    });

    // Update CB after banking
    const cbAfter = compliance.cbGco2eq - amountToBank;
    await this.shipComplianceRepository.update(compliance.id!, cbAfter);

    return {
      cbBefore,
      applied: amountToBank,
      cbAfter,
    };
  }
}
