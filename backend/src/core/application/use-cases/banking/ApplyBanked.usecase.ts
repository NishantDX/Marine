import { IApplyBankedUseCase } from "../../../ports/inbound/IBankingUseCases";
import { IShipComplianceRepository } from "../../../ports/outbound/IShipComplianceRepository";
import { IBankEntryRepository } from "../../../ports/outbound/IBankEntryRepository";

export class ApplyBankedUseCase implements IApplyBankedUseCase {
  constructor(
    private shipComplianceRepository: IShipComplianceRepository,
    private bankEntryRepository: IBankEntryRepository
  ) {}

  async execute(
    shipId: string,
    year: number,
    amount: number
  ): Promise<{ cbBefore: number; applied: number; cbAfter: number }> {
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

    // Get total banked
    const totalBanked = await this.bankEntryRepository.getTotalBanked(
      shipId,
      year
    );

    // Validate amount
    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }

    if (amount > totalBanked) {
      throw new Error(
        `Insufficient banked amount. Available: ${totalBanked}, Requested: ${amount}`
      );
    }

    const cbBefore = compliance.cbGco2eq;
    const cbAfter = cbBefore + amount;

    // Update CB
    await this.shipComplianceRepository.update(compliance.id!, cbAfter);

    // Create negative bank entry to record usage
    await this.bankEntryRepository.create({
      shipId,
      year,
      amountGco2eq: -amount,
    });

    return {
      cbBefore,
      applied: amount,
      cbAfter,
    };
  }
}
