/**
 * Custom Hook: useBanking
 * Manages banking operations
 */
"use client";

import { useState, useCallback } from "react";
import {
  BankingRecord,
  BankingSummary,
} from "@/src/core/domain/ComplianceBalance";
import { BankingApiClient } from "@/src/adapters/infrastructure/BankingApiClient";
import { ComplianceApiClient } from "@/src/adapters/infrastructure/ComplianceApiClient";

const bankingClient = new BankingApiClient();
const complianceClient = new ComplianceApiClient();

export function useBanking(shipId: string, year: number) {
  const [summary, setSummary] = useState<BankingSummary | null>(null);
  const [records, setRecords] = useState<BankingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    console.log("[useBanking] fetchSummary called with:", { shipId, year });
    setLoading(true);
    setError(null);

    try {
      console.log(
        "[useBanking] Calling complianceClient.computeComplianceBalance..."
      );
      const cb = await complianceClient.computeComplianceBalance(shipId, year);
      console.log("[useBanking] Compliance balance received:", cb);

      const summary = {
        cbBefore: cb.cbValue,
        applied: 0,
        cbAfter: cb.cbValue,
      };
      console.log("[useBanking] Setting summary:", summary);
      setSummary(summary);
    } catch (err) {
      console.error("[useBanking] fetchSummary error:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [shipId, year]);

  const fetchRecords = useCallback(async () => {
    console.log("[useBanking] fetchRecords called with:", { shipId, year });
    try {
      const data = await bankingClient.getBankingRecords(shipId, year);
      console.log("[useBanking] Records received:", data);
      setRecords(data);
    } catch (err) {
      console.error("[useBanking] fetchRecords error:", err);
      setError((err as Error).message);
    }
  }, [shipId, year]);

  const bankSurplus = async (amount: number) => {
    setLoading(true);
    setError(null);

    try {
      const result = await bankingClient.bankSurplus(shipId, year, amount);
      setSummary(result);
      await fetchRecords();
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const applySurplus = async (amount: number) => {
    setLoading(true);
    setError(null);

    try {
      const result = await bankingClient.applySurplus(shipId, year, amount);
      setSummary(result);
      await fetchRecords();
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    summary,
    records,
    loading,
    error,
    fetchSummary,
    fetchRecords,
    bankSurplus,
    applySurplus,
  };
}
