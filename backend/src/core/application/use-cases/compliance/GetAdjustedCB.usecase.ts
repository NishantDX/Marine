import { IGetAdjustedCBUseCase } from "../../../ports/inbound/IComplianceUseCases";
import { IShipComplianceRepository } from "../../../ports/outbound/IShipComplianceRepository";
import { IBankEntryRepository } from "../../../ports/outbound/IBankEntryRepository";

export class GetAdjustedCBUseCase implements IGetAdjustedCBUseCase {
  constructor(
    private shipComplianceRepository: IShipComplianceRepository,
    private bankEntryRepository: IBankEntryRepository
  ) {}

  async execute(shipId: string, year: number): Promise<number> {
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

    // Get total banked amount
    const totalBanked = await this.bankEntryRepository.getTotalBanked(
      shipId,
      year
    );

    // Adjusted CB = Current CB + Banked amount
    return compliance.cbGco2eq + totalBanked;
  }
}
