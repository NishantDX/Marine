import { ISetBaselineUseCase } from "../../../ports/inbound/IRouteUseCases";
import { IRouteRepository } from "../../../ports/outbound/IRouteRepository";
import { Route } from "../../../domain/entities/Route";

export class SetBaselineUseCase implements ISetBaselineUseCase {
  constructor(private routeRepository: IRouteRepository) {}

  async execute(routeId: string): Promise<Route> {
    // Check if route exists
    const route = await this.routeRepository.findByRouteId(routeId);
    if (!route) {
      throw new Error(`Route ${routeId} not found`);
    }

    // Set as baseline (this will clear any existing baseline)
    return await this.routeRepository.setAsBaseline(routeId);
  }
}
