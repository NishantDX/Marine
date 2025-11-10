/**
 * Main Dashboard Component
 * Implements tabbed navigation and dark mode toggle
 */
"use client";

import { useState } from "react";
import { Ship, Moon, Sun } from "lucide-react";
import { RoutesTab } from "./RoutesTab";
import { CompareTab } from "./CompareTab";
import { BankingTab } from "./BankingTab";
import { PoolingTab } from "./PoolingTab";
import { Button } from "./Button";
import { Select } from "./Select";
import { cn } from "@/src/shared/utils";

type Tab = "routes" | "compare" | "banking" | "pooling";

const years = [2020, 2021, 2022, 2023, 2024, 2025];

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("routes");
  const [selectedYear, setSelectedYear] = useState(2024);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors">
        {/* Header */}
        <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#0f4c81] rounded-lg p-2">
                <Ship className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                FuelEU Compliance
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="rounded-full w-10 h-10 p-0"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* Year Selector */}
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-24"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>

              {/* User Avatar */}
              <div className="bg-[#0f4c81] rounded-full w-10 h-10 flex items-center justify-center text-white font-medium">
                US
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex gap-8">
              {(["routes", "compare", "banking", "pooling"] as Tab[]).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize",
                      activeTab === tab
                        ? "border-[#0f4c81] text-[#0f4c81]"
                        : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    )}
                  >
                    {tab}
                  </button>
                )
              )}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          {activeTab === "routes" && <RoutesTab />}
          {activeTab === "compare" && <CompareTab />}
          {activeTab === "banking" && <BankingTab year={selectedYear} />}
          {activeTab === "pooling" && <PoolingTab year={selectedYear} />}
        </main>
      </div>
    </div>
  );
}
