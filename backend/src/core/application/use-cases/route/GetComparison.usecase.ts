import { IRouteRepository } from "../../../ports/outbound/IRouteRepository";
import {
  calculatePercentDifference,
  isCompliant,
} from "../../../../shared/utils/calculations.util";
import { TARGET_GHG_INTENSITY_2025 } from "../../../../shared/constants/fueleu.constants";

export interface ComparisonInput {
  baselineId?: string;
  comparisonId?: string;
}

export interface ComparisonData {
  routeId: string;
  baselineGhgIntensity: number;
  comparisonGhgIntensity: number;
  percentDifference: number;
  isCompliant: boolean;
}

export class GetComparisonUseCase {
  constructor(private routeRepository: IRouteRepository) {}

  async execute(input: ComparisonInput): Promise<{
    target: number;
    comparisons: ComparisonData[];
  }> {
    const { baselineId, comparisonId } = input;

    // Get baseline route
    let baseline;
    if (baselineId) {
      baseline = await this.routeRepository.findByRouteId(baselineId);
    } else {
      // If no baselineId provided, find the route marked as baseline
      baseline = await this.routeRepository.findBaseline();
    }

    if (!baseline) {
      throw new Error("Baseline route not found");
    }

    // Get comparison route(s)
    let comparisonRoutes;
    if (comparisonId) {
      // Single comparison
      const single = await this.routeRepository.findByRouteId(comparisonId);
      comparisonRoutes = single ? [single] : [];
    } else {
      // Compare all non-baseline routes
      const allRoutes = await this.routeRepository.findAll();
      comparisonRoutes = allRoutes.filter(
        (r) => r.routeId !== baseline.routeId
      );
    }

    // Transform to comparison data
    const comparisons: ComparisonData[] = comparisonRoutes.map((route) => {
      // Calculate percentage difference: ((comparison / baseline) - 1) × 100
      const percentDifference =
        baseline.ghgIntensity === 0
          ? 0
          : (route.ghgIntensity / baseline.ghgIntensity - 1) * 100;

      // Check compliance against target
      const compliant = route.ghgIntensity < TARGET_GHG_INTENSITY_2025;

      return {
        routeId: route.routeId,
        baselineGhgIntensity: baseline.ghgIntensity,
        comparisonGhgIntensity: route.ghgIntensity,
        percentDifference: Number(percentDifference.toFixed(2)),
        isCompliant: compliant,
      };
    });

    return {
      target: TARGET_GHG_INTENSITY_2025,
      comparisons,
    };
  }
}
