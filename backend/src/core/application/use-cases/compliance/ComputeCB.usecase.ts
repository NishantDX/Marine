import { IComputeCBUseCase } from "../../../ports/inbound/IComplianceUseCases";
import { IShipComplianceRepository } from "../../../ports/outbound/IShipComplianceRepository";
import { IRouteRepository } from "../../../ports/outbound/IRouteRepository";
import { ShipCompliance } from "../../../domain/entities/ShipCompliance";
import { calculateComplianceBalance } from "../../../../shared/utils/calculations.util";

export class ComputeCBUseCase implements IComputeCBUseCase {
  constructor(
    private shipComplianceRepository: IShipComplianceRepository,
    private routeRepository: IRouteRepository
  ) {}

  async execute(shipId: string, year: number): Promise<ShipCompliance> {
    // Find routes for this ship and year
    const routes = await this.routeRepository.findAll({ year });

    if (routes.length === 0) {
      throw new Error(`No routes found for ship ${shipId} in year ${year}`);
    }

    // For simplicity, use the first route (in reality, aggregate all routes for the ship)
    const route = routes[0];

    // Calculate CB
    const cbGco2eq = calculateComplianceBalance(
      route.ghgIntensity,
      route.fuelConsumption
    );

    // Check if already exists
    let compliance = await this.shipComplianceRepository.findByShipAndYear(
      shipId,
      year
    );

    if (compliance) {
      // Update existing
      compliance = await this.shipComplianceRepository.update(
        compliance.id!,
        cbGco2eq
      );
    } else {
      // Create new
      compliance = await this.shipComplianceRepository.create({
        shipId,
        year,
        cbGco2eq,
      });
    }

    return compliance;
  }
}
