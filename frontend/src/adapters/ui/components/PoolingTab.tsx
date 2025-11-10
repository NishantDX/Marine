/**
 * UI Component: Pooling Tab
 * Implements Article 21 - Pooling mechanism
 */
"use client";

import { useEffect } from "react";
import { usePooling } from "../hooks/usePooling";
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
import { AlertCircle } from "lucide-react";

export function PoolingTab({ year }: { year: number }) {
  const {
    members,
    loading,
    error,
    poolMetrics,
    validation,
    fetchShips,
    updateContribution,
    createPool,
  } = usePooling(year);

  useEffect(() => {
    fetchShips();
  }, [fetchShips]);

  const handleCreatePool = async () => {
    if (!validation.isValid) return;

    const success = await createPool();
    if (success) {
      alert("Pool created successfully");
      await fetchShips();
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
      {/* Pool Summary */}
      <Card
        className={`border-2 ${
          validation.isValid
            ? "border-green-500 bg-green-50 dark:bg-green-950"
            : "border-red-500 bg-red-50 dark:bg-red-950"
        }`}
      >
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Pool Sum Before
              </div>
              <div className="text-2xl font-bold">
                {formatNumber(poolMetrics.poolSumBefore, 1)} MJ
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Contribution
              </div>
              <div className="text-2xl font-bold">
                {formatNumber(poolMetrics.totalContribution, 1)} MJ
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Pool Sum After
              </div>
              <div
                className={`text-2xl font-bold ${
                  poolMetrics.poolSumAfter >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatNumber(poolMetrics.poolSumAfter, 1)} MJ
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Status
              </div>
              <div
                className={`text-2xl font-bold ${
                  validation.isValid ? "text-green-600" : "text-red-600"
                }`}
              >
                {validation.isValid ? "Valid" : "Invalid"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Errors */}
      {!validation.isValid && validation.errors.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Validation Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-400">
              {validation.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Create Pool Button */}
      <Button
        onClick={handleCreatePool}
        disabled={!validation.isValid || loading}
      >
        Create Pool
      </Button>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pool Members</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading ships...</div>
          ) : members.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No ships available
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ship Name</TableHead>
                  <TableHead>CB Before (MJ)</TableHead>
                  <TableHead>Contribution (MJ)</TableHead>
                  <TableHead>CB After (MJ)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.shipId}>
                    <TableCell className="font-medium">
                      {member.shipName}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          member.cbBefore < 0 ? "text-red-600 font-medium" : ""
                        }
                      >
                        {formatNumber(member.cbBefore, 1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.1"
                        value={member.contribution}
                        onChange={(e) =>
                          updateContribution(
                            member.shipId,
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-32"
                      />
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          member.cbAfter < 0
                            ? "text-red-600 font-medium"
                            : "text-green-600 font-medium"
                        }
                      >
                        {formatNumber(member.cbAfter, 1)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Article 21 Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>Article 21 — Pooling Mechanism</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Pooling allows multiple ships to combine their compliance balances.
            The pool is valid if:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
            <li>Sum of adjusted CB ≥ 0</li>
            <li>Deficit ships cannot exit worse (CB After ≥ CB Before)</li>
            <li>Surplus ships cannot exit negative (CB After ≥ 0)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
