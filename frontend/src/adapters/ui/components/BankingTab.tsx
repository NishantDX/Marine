/**
 * UI Component: Banking Tab
 * Implements Article 20 - Banking mechanism
 */
"use client";

import { useEffect, useState } from "react";
import { useBanking } from "../hooks/useBanking";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";
import { Button } from "./Button";
import { Input } from "./Input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./Table";
import { formatNumber } from "@/src/shared/utils";

const MOCK_SHIP_ID = "SHIP001"; // TODO: Get from context/props

export function BankingTab({ year }: { year: number }) {
  const {
    summary,
    records,
    loading,
    error,
    fetchSummary,
    fetchRecords,
    bankSurplus,
    applySurplus,
  } = useBanking(MOCK_SHIP_ID, year);

  const [applyAmount, setApplyAmount] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    fetchSummary();
    fetchRecords();
  }, [fetchSummary, fetchRecords]);

  const handleBankSurplus = async () => {
    if (!summary || summary.cbBefore <= 0) return;

    const success = await bankSurplus(summary.cbBefore);
    if (success) {
      alert("Surplus banked successfully");
    } else {
      alert(`Failed to bank surplus: ${error || "Unknown error"}`);
    }
  };

  const handleApplySurplus = async () => {
    const amount = parseFloat(applyAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const success = await applySurplus(amount);
    if (success) {
      alert("Banked surplus applied successfully");
      setShowApplyModal(false);
      setApplyAmount("");
    } else {
      // Show the error from the hook
      alert(`Failed to apply surplus: ${error || "Unknown error"}`);
    }
  };

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-red-600 dark:text-red-400">Error: {error}</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">CB Before</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary ? formatNumber(summary.cbBefore, 1) : "—"} MJ
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">Applied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary ? formatNumber(summary.applied, 1) : "—"} MJ
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">CB After</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary ? formatNumber(summary.cbAfter, 1) : "—"} MJ
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Article 20 Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>Article 20 — Banking Mechanism</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Banking allows ships with positive compliance balance to bank
            surplus for future use. Banked surplus can be applied to deficits in
            subsequent years.
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          onClick={handleBankSurplus}
          disabled={loading || !summary || summary.cbBefore <= 0}
        >
          Bank Positive CB
        </Button>

        <Button
          variant="secondary"
          onClick={() => setShowApplyModal(true)}
          disabled={loading}
        >
          Apply Banked Surplus
        </Button>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <Card>
          <CardHeader>
            <CardTitle>Apply Banked Surplus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Amount (MJ)"
                type="number"
                value={applyAmount}
                onChange={(e) => setApplyAmount(e.target.value)}
                placeholder="Enter amount to apply"
              />
              <div className="flex gap-2">
                <Button onClick={handleApplySurplus}>Apply</Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowApplyModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No transactions yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Amount (MJ)</TableHead>
                  <TableHead>CB Before</TableHead>
                  <TableHead>CB After</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {new Date(record.timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="capitalize">
                      {record.action}
                    </TableCell>
                    <TableCell>{formatNumber(record.amount, 1)}</TableCell>
                    <TableCell>{formatNumber(record.cbBefore, 1)}</TableCell>
                    <TableCell>{formatNumber(record.cbAfter, 1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
