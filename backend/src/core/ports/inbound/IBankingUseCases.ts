import { BankEntry } from '../../domain/entities/BankEntry';

export interface IBankSurplusUseCase {
  execute(shipId: string, year: number): Promise<BankEntry>;
}

export interface IApplyBankedUseCase {
  execute(shipId: string, year: number, amount: number): Promise<{
    cbBefore: number;
    applied: number;
    cbAfter: number;
  }>;
}

export interface IGetBankRecordsUseCase {
  execute(shipId: string, year: number): Promise<BankEntry[]>;
}