"use client";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
import { Dropdown } from "../ui/dropdown/Dropdown";
// import { MoreDotIcon } from "@/icons";
import { useState, useEffect } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Ellipsis } from "lucide-react";
import MonthlyTargetDialog from "../MonthlyTargetDialog";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface MonthlyTargetData {
  target: number;
  currentRevenue: number;
  todayRevenue: number;
  progressPercentage: number;
  percentChange: number;
  trend: "up" | "down";
}

export default function MonthlyTarget() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [targetData, setTargetData] = useState<MonthlyTargetData | null>(null);
  const [open, setOpen] = useState(false);
  const [targetchange, setTargetchange] = useState(false);

  useEffect(() => {
    const fetchTargetData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/dashboard/monthlytarget");
        const result = await response.json();

        if (result.success) {
          setTargetData(result.data);
        } else {
          console.error("Failed to fetch target data:", result.message);
        }
      } catch (error) {
        console.error("Error fetching target data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTargetData();
  }, [targetchange]);

  // Format currency
  // const formatCurrency = (amount: number) => {
  //   return new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "USD",
  //     maximumFractionDigits: 0,
  //   }).format(amount);
  // };
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Create chart options with real data
  const getOptions = (): ApexOptions => {
    return {
      colors: ["#ff6600"],
      chart: {
        fontFamily: "Outfit, sans-serif",
        type: "radialBar",
        height: 330,
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {
        radialBar: {
          startAngle: -85,
          endAngle: 85,
          hollow: {
            size: "80%",
          },
          track: {
            background: "#FFF1E5",
            strokeWidth: "100%",
            margin: 5, // margin is in pixels
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              fontSize: "36px",
              fontWeight: "600",
              offsetY: -40,
              color: "#1D2939",
              formatter: function (val) {
                return val + "%";
              },
            },
          },
        },
      },
      fill: {
        type: "solid",
        colors: ["#ff6600"],
      },
      stroke: {
        lineCap: "round",
      },
      labels: ["Progress"],
    };
  };

  // Chart series data
  const series = loading || !targetData ? [0] : [targetData.progressPercentage];

  // Determine if we're trending up or down
  const isTrendingUp = !loading && targetData?.trend === "up";

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <>
      <MonthlyTargetDialog
        setTargetchange={setTargetchange}
        targetChange={targetchange}
        open={open}
        onClose={() => setOpen(false)}
      />
      <div className="rounded-2xl h-full border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 shadow-sm overflow-hidden flex flex-col justify-between">
        <div className="px-5 pt-5 pb-6 sm:px-6 sm:pt-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                  {loading ? (
                    <div className="h-6 w-32 bg-stone-200 dark:bg-stone-800 animate-pulse rounded-md" />
                  ) : (
                    "Monthly Sales Target"
                  )}
                </h3>
              </div>
              <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                Track revenue pace vs set targets
              </p>
            </div>
            <button
              onClick={() => setOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors cursor-pointer"
            >
              Set Target
            </button>
          </div>
          <div className="relative">
            {loading ? (
              <div className="flex justify-center items-center w-full">
                <div className="h-[280px]s w-[330px]s rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                  <div className="h-[264px]s w-[264px]s rounded-full bg-white dark:bg-gray-800"></div>
                </div>
              </div>
            ) : (
              <div className="max-h-[330px]">
                <ReactApexChart
                  options={getOptions()}
                  series={series}
                  type="radialBar"
                  height={330}
                />
              </div>
            )}

            {!loading && targetData && (
              <span
                className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full ${
                  isTrendingUp
                    ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
                    : "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500"
                } px-3 py-1 text-xs font-medium`}
              >
                {isTrendingUp ? "+" : ""}
                {targetData.percentChange}%
              </span>
            )}
          </div>
          {loading ? (
            <div className="mx-auto mt-10 w-full max-w-[380px] flex justify-center">
              <div className="h-5 w-80 bg-gray-200 animate-pulse rounded dark:bg-gray-700"></div>
            </div>
          ) : (
            <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
              You earned{" "}
              <span className=" text-orange-500">
                {formatCurrency(targetData?.todayRevenue || 0)}
              </span>{" "}
              today, it&apos;s {targetData?.trend === "up" ? "higher" : "lower"}{" "}
              than last month.
              {targetData?.trend === "up"
                ? " Keep up your good work!"
                : " Let&apos;s work on improving sales!"}
            </p>
          )}
        </div>

        <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
          <div>
            <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
              Target
            </p>
            {loading ? (
              <div className="h-6 w-16 bg-gray-200 animate-pulse rounded dark:bg-gray-700 mx-auto"></div>
            ) : (
              <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
                {formatCurrency(targetData?.target || 0)}
                {/* <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.26816 13.6632C7.4056 13.8192 7.60686 13.9176 7.8311 13.9176C7.83148 13.9176 7.83187 13.9176 7.83226 13.9176C8.02445 13.9178 8.21671 13.8447 8.36339 13.6981L12.3635 9.70076C12.6565 9.40797 12.6567 8.9331 12.3639 8.6401C12.0711 8.34711 11.5962 8.34694 11.3032 8.63973L8.5811 11.36L8.5811 2.5C8.5811 2.08579 8.24531 1.75 7.8311 1.75C7.41688 1.75 7.0811 2.08579 7.0811 2.5L7.0811 11.3556L4.36354 8.63975C4.07055 8.34695 3.59568 8.3471 3.30288 8.64009C3.01008 8.93307 3.01023 9.40794 3.30321 9.70075L7.26816 13.6632Z"
                  fill="#D92D20"
                />
              </svg> */}
              </p>
            )}
          </div>

          <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

          <div>
            <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
              Revenue
            </p>
            {loading ? (
              <div className="h-6 w-16 bg-gray-200 animate-pulse rounded dark:bg-gray-700 mx-auto"></div>
            ) : (
              <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
                {formatCurrency(targetData?.currentRevenue || 0)}
                {/* <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
                  fill="#039855"
                />
              </svg> */}
              </p>
            )}
          </div>

          <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

          <div>
            <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
              Today
            </p>
            {loading ? (
              <div className="h-6 w-16 bg-gray-200 animate-pulse rounded dark:bg-gray-700 mx-auto"></div>
            ) : (
              <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
                {formatCurrency(targetData?.todayRevenue || 0)}
                {/* <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
                  fill="#039855"
                />
              </svg> */}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
