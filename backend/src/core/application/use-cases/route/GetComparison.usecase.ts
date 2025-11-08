import {
  IGetComparisonUseCase,
  ComparisonResult,
} from "../../../ports/inbound/IRouteUseCases";
import { IRouteRepository } from "../../../ports/outbound/IRouteRepository";
import { Route } from "../../../domain/entities/Route";
import {
  calculatePercentDifference,
  isCompliant,
} from "../../../../shared/utils/calculations.util";

export class GetComparisonUseCase implements IGetComparisonUseCase {
  constructor(private routeRepository: IRouteRepository) {}

  async execute(): Promise<{
    baseline: Route;
    comparisons: ComparisonResult[];
  }> {
    // Get baseline route
    const baseline = await this.routeRepository.findBaseline();
    if (!baseline) {
      throw new Error("No baseline route set");
    }

    // Get all routes
    const allRoutes = await this.routeRepository.findAll();

    // Compare each route with baseline
    const comparisons: ComparisonResult[] = allRoutes
      .filter((route) => route.routeId !== baseline.routeId)
      .map((route) => ({
        route,
        percentDiff: calculatePercentDifference(
          baseline.ghgIntensity,
          route.ghgIntensity
        ),
        compliant: isCompliant(route.ghgIntensity),
      }));

    return {
      baseline,
      comparisons,
    };
  }
}
