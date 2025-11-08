import { BankEntry, BankEntryProps } from '../../domain/entities/BankEntry';

export interface IBankEntryRepository {
  findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]>;
  getTotalBanked(shipId: string, year: number): Promise<number>;
  create(data: Omit<BankEntryProps, 'id'>): Promise<BankEntry>;
}