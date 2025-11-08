import { IRouteRepository } from "../../../ports/outbound/IRouteRepository";
import {
  calculatePercentDifference,
  isCompliant,
} from "../../../../shared/utils/calculations.util";
import { TARGET_GHG_INTENSITY_2025 } from "../../../../shared/constants/fueleu.constants";

export interface ComparisonInput {
  baselineId: string;
  comparisonId: string;
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
    const baseline = await this.routeRepository.findByRouteId(baselineId);
    if (!baseline) {
      throw new Error(`Baseline route ${baselineId} not found`);
    }

    // Get comparison route
    const comparison = await this.routeRepository.findByRouteId(comparisonId);
    if (!comparison) {
      throw new Error(`Comparison route ${comparisonId} not found`);
    }

    // Calculate percentage difference: ((comparison / baseline) - 1) × 100
    const percentDifference = calculatePercentDifference(
      baseline.ghgIntensity,
      comparison.ghgIntensity
    );

    // Check compliance against target
    const compliant = isCompliant(comparison.ghgIntensity);

    return {
      target: TARGET_GHG_INTENSITY_2025,
      comparisons: [
        {
          routeId: comparison.routeId,
          baselineGhgIntensity: baseline.ghgIntensity,
          comparisonGhgIntensity: comparison.ghgIntensity,
          percentDifference,
          isCompliant: compliant,
        },
      ],
    };
  }
}
