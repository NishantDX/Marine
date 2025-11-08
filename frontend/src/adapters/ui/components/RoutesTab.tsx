/**
 * UI Component: Routes Tab
 * Displays routes table with filters and baseline setting
 */
"use client";

import { useState } from "react";
import { useRoutes } from "../hooks/useRoutes";
import { VesselType, FuelType } from "@/src/core/domain/Route";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./Table";
import { Button } from "./Button";
import { Select } from "./Select";
import { Card } from "./Card";
import { formatNumber, formatWithCommas } from "@/src/shared/utils";

const vesselTypes: VesselType[] = [
  "Container",
  "BulkCarrier",
  "Tanker",
  "RoRo",
  "General Cargo",
];
const fuelTypes: FuelType[] = ["HFO", "LNG", "MGO", "Methanol", "Ammonia"];
const years = [2020, 2021, 2022, 2023, 2024, 2025];

export function RoutesTab() {
  const [selectedVesselType, setSelectedVesselType] = useState<VesselType | "">(
    ""
  );
  const [selectedFuelType, setSelectedFuelType] = useState<FuelType | "">("");
  const [selectedYear, setSelectedYear] = useState<number | "">("");

  const { routes, loading, error, setFilters, setBaseline } = useRoutes();

  const handleSetBaseline = async (routeId: string) => {
    const success = await setBaseline(routeId);
    if (success) {
      alert(`Route ${routeId} set as baseline`);
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
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <Select
          value={selectedVesselType}
          onChange={(e) => {
            setSelectedVesselType(e.target.value as VesselType);
            setFilters({
              vesselTypes: e.target.value
                ? [e.target.value as VesselType]
                : undefined,
              fuelTypes: selectedFuelType ? [selectedFuelType] : undefined,
              year: selectedYear || undefined,
            });
          }}
        >
          <option value="">All Vessel Types</option>
          {vesselTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>

        <Select
          value={selectedFuelType}
          onChange={(e) => {
            setSelectedFuelType(e.target.value as FuelType);
            setFilters({
              vesselTypes: selectedVesselType
                ? [selectedVesselType]
                : undefined,
              fuelTypes: e.target.value
                ? [e.target.value as FuelType]
                : undefined,
              year: selectedYear || undefined,
            });
          }}
        >
          <option value="">All Fuel Types</option>
          {fuelTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>

        <Select
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value ? Number(e.target.value) : "");
            setFilters({
              vesselTypes: selectedVesselType
                ? [selectedVesselType]
                : undefined,
              fuelTypes: selectedFuelType ? [selectedFuelType] : undefined,
              year: e.target.value ? Number(e.target.value) : undefined,
            });
          }}
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
      </div>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : routes.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No routes found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route ID</TableHead>
                <TableHead>Vessel Type</TableHead>
                <TableHead>Fuel Type</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>GHG Intensity</TableHead>
                <TableHead>Fuel (t)</TableHead>
                <TableHead>Distance (km)</TableHead>
                <TableHead>Total (t)</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.routeId}>
                  <TableCell className="font-medium">{route.routeId}</TableCell>
                  <TableCell>{route.vesselType}</TableCell>
                  <TableCell>{route.fuelType}</TableCell>
                  <TableCell>{route.year}</TableCell>
                  <TableCell>{formatNumber(route.ghgIntensity, 1)}</TableCell>
                  <TableCell>
                    {formatWithCommas(route.fuelConsumption)}
                  </TableCell>
                  <TableCell>{formatWithCommas(route.distance)}</TableCell>
                  <TableCell>
                    {formatWithCommas(route.totalEmissions)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleSetBaseline(route.routeId)}
                      disabled={route.isBaseline}
                    >
                      {route.isBaseline ? "Baseline" : "Set Baseline"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <div className="text-sm text-gray-500">
        Showing 1 to {routes.length} of {routes.length} routes
      </div>
    </div>
  );
}
