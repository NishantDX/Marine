import { IGetBankRecordsUseCase } from "../../../ports/inbound/IBankingUseCases";
import { IBankEntryRepository } from "../../../ports/outbound/IBankEntryRepository";
import { BankEntry } from "../../../domain/entities/BankEntry";

export class GetBankRecordsUseCase implements IGetBankRecordsUseCase {
  constructor(private bankEntryRepository: IBankEntryRepository) {}

  async execute(shipId: string, year: number): Promise<BankEntry[]> {
    return await this.bankEntryRepository.findByShipAndYear(shipId, year);
  }
}
