import { IBankSurplusUseCase } from "../../../ports/inbound/IBankingUseCases";
import { IShipComplianceRepository } from "../../../ports/outbound/IShipComplianceRepository";
import { IBankEntryRepository } from "../../../ports/outbound/IBankEntryRepository";
import { BankEntry } from "../../../domain/entities/BankEntry";

export class BankSurplusUseCase implements IBankSurplusUseCase {
  constructor(
    private shipComplianceRepository: IShipComplianceRepository,
    private bankEntryRepository: IBankEntryRepository
  ) {}

  async execute(shipId: string, year: number): Promise<BankEntry> {
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

    // Create bank entry with the surplus amount
    const bankEntry = await this.bankEntryRepository.create({
      shipId,
      year,
      amountGco2eq: compliance.cbGco2eq,
    });

    // Reset CB to zero after banking
    await this.shipComplianceRepository.update(compliance.id!, 0);

    return bankEntry;
  }
}
