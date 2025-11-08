/**
 * UI Component: Compare Tab
 * Displays route comparison with chart
 */
"use client";

import { useComparison } from "../hooks/useComparison";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./Table";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";
import { formatNumber } from "@/src/shared/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Check, X } from "lucide-react";

export function CompareTab() {
  const { data, loading, error } = useComparison();

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-red-600 dark:text-red-400">Error: {error}</div>
      </Card>
    );
  }

  if (loading || !data) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading comparison data...</div>
      </Card>
    );
  }

  const chartData =
    data.comparisons?.map((comp) => ({
      route: comp.routeId,
      baseline: comp.baselineGhgIntensity,
      comparison: comp.comparisonGhgIntensity,
      target: data.target,
    })) || [];

  return (
    <div className="space-y-6">
      {/* Target KPI Card */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Target</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-[#0f4c81]">
            {data.target ? formatNumber(data.target, 4) : "—"} gCO₂e/MJ
          </div>
          <p className="text-sm text-gray-500 mt-1">
            2% below 91.16 gCO₂e/MJ baseline
          </p>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Route Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route ID</TableHead>
                <TableHead>Baseline GHG</TableHead>
                <TableHead>Comparison GHG</TableHead>
                <TableHead>Difference %</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.comparisons?.map((comp) => (
                <TableRow key={comp.routeId}>
                  <TableCell className="font-medium">{comp.routeId}</TableCell>
                  <TableCell>
                    {comp.baselineGhgIntensity
                      ? formatNumber(comp.baselineGhgIntensity, 1)
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {comp.comparisonGhgIntensity
                      ? formatNumber(comp.comparisonGhgIntensity, 1)
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        comp.percentDifference < 0
                          ? "text-green-600 font-medium"
                          : "text-red-600 font-medium"
                      }
                    >
                      {comp.percentDifference !== undefined
                        ? formatNumber(comp.percentDifference, 1)
                        : "—"}
                      %
                    </span>
                  </TableCell>
                  <TableCell>
                    {comp.isCompliant ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="h-4 w-4" />
                        <span className="text-sm">Compliant</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600">
                        <X className="h-4 w-4" />
                        <span className="text-sm">Non-Compliant</span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>GHG Intensity Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="route" />
              <YAxis
                label={{
                  value: "gCO₂e/MJ",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="baseline" fill="#94a3b8" name="Baseline" />
              <Bar dataKey="comparison" fill="#0f4c81" name="Comparison" />
              <Bar dataKey="target" fill="#16a34a" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
