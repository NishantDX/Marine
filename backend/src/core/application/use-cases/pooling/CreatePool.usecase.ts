import {
  ICreatePoolUseCase,
  CreatePoolRequest,
} from "../../../ports/inbound/IPoolingUseCases";
import { IPoolRepository } from "../../../ports/outbound/IPoolRepository";
import { IShipComplianceRepository } from "../../../ports/outbound/IShipComplianceRepository";
import { Pool, PoolMember } from "../../../domain/entities/Pool";
import { PoolAllocationService } from "../../services/PoolAllocation.service";

export class CreatePoolUseCase implements ICreatePoolUseCase {
  constructor(
    private poolRepository: IPoolRepository,
    private shipComplianceRepository: IShipComplianceRepository,
    private allocationService: PoolAllocationService
  ) {}

  async execute(request: CreatePoolRequest): Promise<Pool> {
    const { year, shipIds } = request;

    if (shipIds.length < 2) {
      throw new Error("Pool must have at least 2 members");
    }

    // Get CB for each ship
    const members: PoolMember[] = [];
    for (const shipId of shipIds) {
      const compliance = await this.shipComplianceRepository.findByShipAndYear(
        shipId,
        year
      );
      if (!compliance) {
        throw new Error(
          `No compliance data found for ship ${shipId} in year ${year}`
        );
      }

      members.push({
        shipId,
        cbBefore: compliance.cbGco2eq,
        cbAfter: compliance.cbGco2eq, // Will be calculated
      });
    }

    // Calculate allocation using greedy algorithm
    const allocatedMembers = this.allocationService.allocate(members);

    // Create pool (validation happens in Pool entity)
    const pool = await this.poolRepository.create({
      year,
      members: allocatedMembers,
    });

    // Update each ship's CB
    for (const member of allocatedMembers) {
      const compliance = await this.shipComplianceRepository.findByShipAndYear(
        member.shipId,
        year
      );
      if (compliance) {
        await this.shipComplianceRepository.update(
          compliance.id!,
          member.cbAfter
        );
      }
    }

    return pool;
  }
}
