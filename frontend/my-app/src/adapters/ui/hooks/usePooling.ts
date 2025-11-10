/**
 * Custom Hook: usePooling
 * Manages pooling operations and validation
 */
"use client";

import { useState, useCallback, useMemo } from "react";
import { PoolMember, CreatePoolRequest } from "@/src/core/domain/Pool";
import { AdjustedComplianceBalance } from "@/src/core/domain/ComplianceBalance";
import { PoolingApiClient } from "@/src/adapters/infrastructure/PoolingApiClient";
import { ComplianceApiClient } from "@/src/adapters/infrastructure/ComplianceApiClient";

const poolingClient = new PoolingApiClient();
const complianceClient = new ComplianceApiClient();

export function usePooling(year: number) {
  const [ships, setShips] = useState<AdjustedComplianceBalance[]>([]);
  const [members, setMembers] = useState<PoolMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShips = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all ships with their compliance balances
      const data = await complianceClient.getAllAdjustedComplianceBalances(
        year
      );
      setShips(data);

      // Initialize members with real CB values
      setMembers(
        data.map((ship) => ({
          shipId: ship.shipId,
          shipName: `Ship ${ship.shipId}`,
          cbBefore: ship.adjustedCb,
          contribution: 0,
          cbAfter: ship.adjustedCb,
        }))
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [year]);

  const updateContribution = (shipId: string, contribution: number) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.shipId === shipId
          ? {
              ...member,
              contribution,
              cbAfter: member.cbBefore - contribution,
            }
          : member
      )
    );
  };

  const poolMetrics = useMemo(() => {
    const poolSumBefore = members.reduce((sum, m) => sum + m.cbBefore, 0);
    const totalContribution = members.reduce(
      (sum, m) => sum + m.contribution,
      0
    );
    const poolSumAfter = poolSumBefore - totalContribution;

    return {
      poolSumBefore,
      totalContribution,
      poolSumAfter,
    };
  }, [members]);

  const validation = useMemo(() => {
    const { poolSumAfter } = poolMetrics;
    const errors: string[] = [];

    // Rule 1: Pool sum must be >= 0
    const poolSumNonNegative = poolSumAfter >= 0;
    if (!poolSumNonNegative) {
      errors.push(
        `Pool sum after contributions must be ≥ 0 (currently ${poolSumAfter.toFixed(
          2
        )} MJ)`
      );
    }

    // Rule 2: Deficit ships cannot exit worse
    const deficitShipsNotWorse = members
      .filter((m) => m.cbBefore < 0)
      .every((m) => m.cbAfter >= m.cbBefore);
    if (!deficitShipsNotWorse) {
      errors.push("Deficit ships cannot have lower CB after pooling");
    }

    // Rule 3: Surplus ships cannot exit negative
    const surplusShipsNotNegative = members
      .filter((m) => m.cbBefore >= 0)
      .every((m) => m.cbAfter >= 0);
    if (!surplusShipsNotNegative) {
      errors.push("Surplus ships cannot have negative CB after pooling");
    }

    const isValid =
      poolSumNonNegative && deficitShipsNotWorse && surplusShipsNotNegative;

    return {
      isValid,
      errors,
      poolSumNonNegative,
      deficitShipsNotWorse,
      surplusShipsNotNegative,
    };
  }, [members, poolMetrics]);

  const createPool = async () => {
    if (!validation.isValid) {
      setError("Pool validation failed: " + validation.errors.join(", "));
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const request: CreatePoolRequest = {
        year,
        members: members.map((m) => ({
          shipId: m.shipId,
          contribution: m.contribution,
        })),
      };

      await poolingClient.createPool(request);
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    ships,
    members,
    loading,
    error,
    poolMetrics,
    validation,
    fetchShips,
    updateContribution,
    createPool,
  };
}
