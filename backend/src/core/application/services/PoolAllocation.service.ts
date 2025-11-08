import { PoolMember } from "../../domain/entities/Pool";

/**
 * Greedy allocation algorithm for pool members
 * Transfers surplus from surplus ships to deficit ships
 */
export class PoolAllocationService {
  allocate(members: PoolMember[]): PoolMember[] {
    // Clone members to avoid mutation
    const result = members.map((m) => ({ ...m }));

    // Sort by CB descending (surplus first)
    result.sort((a, b) => b.cbBefore - a.cbBefore);

    // Separate surplus and deficit ships
    const surplus = result.filter((m) => m.cbBefore > 0);
    const deficit = result.filter((m) => m.cbBefore < 0);

    // Transfer from surplus to deficit
    for (const deficitShip of deficit) {
      let remaining = Math.abs(deficitShip.cbBefore);

      for (const surplusShip of surplus) {
        if (remaining <= 0) break;
        if (surplusShip.cbAfter <= 0) continue;

        const transfer = Math.min(surplusShip.cbAfter, remaining);
        surplusShip.cbAfter -= transfer;
        deficitShip.cbAfter += transfer;
        remaining -= transfer;
      }
    }

    return result;
  }
}
