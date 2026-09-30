"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
// import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { Ellipsis } from "lucide-react";
import Link from "next/link";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface MonthlySalesData {
  month: number;
  sales: number;
  orders: number;
}

export default function MonthlySalesChart() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<MonthlySalesData[]>([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  // Month names for chart
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    const fetchMonthlySales = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/dashboard/monthlysales");
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          // Normalize months to ensure all have values
          const fullYearData = Array.from({ length: 12 }, (_, index) => {
            const matched = result.data.find(
              (item: any) => Number(item.month) === index + 1
            );
            return {
              month: index + 1,
              sales: matched ? Number(matched.sales) : 0,
              orders: matched ? Number(matched.orders) : 0,
            };
          });

          setSalesData(fullYearData);
          setYear(result.year);
        } else {
          console.error("Failed to fetch monthly sales data:", result.message);
        }
      } catch (error) {
        console.error("Error fetching monthly sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlySales();
  }, []);

  // console.log(salesData);

  const options: ApexOptions = {
    colors: ["#ff6600"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: monthNames,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `৳${val.toFixed(2)}`,
      },
    },
  };

  // Transform API data into chart series format
  // const series = [
  //   {
  //     name: "Sales",
  //     data: loading
  //       ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  //       : salesData.map((item) => item.sales),
  //   },
  // ];

  // const normalizedSales = Array.from({ length: 12 }, (_, i) => {
  //   const monthData = salesData.find((item) => item.month === i + 1);
  //   return monthData ? monthData.sales : 0;
  // });

  // const series = [
  //   {
  //     name: "Sales",
  //     data: loading ? Array(12).fill(0) : normalizedSales,
  //   },
  // ];
  const series = [
    {
      name: "Sales",
      data: loading ? Array(12).fill(0) : salesData.map((item) => item.sales),
    },
  ];

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const totalYearSales = salesData.reduce((acc, curr) => acc + (curr.sales || 0), 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 shadow-sm p-5 md:p-6 space-y-3">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              {loading ? (
                <div className="h-6 w-36 bg-stone-200 dark:bg-stone-800 animate-pulse rounded-md" />
              ) : (
                `Monthly Sales Performance (${year})`
              )}
            </h3>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Year-to-date total:{" "}
            <span className="font-bold text-orange-600 dark:text-orange-400">
              ৳{totalYearSales.toLocaleString()}
            </span>
          </p>
        </div>

        <div className="relative inline-block">
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
          >
            <span>Orders Report</span>
          </Link>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2 ">
          {loading ? (
            <div className="flex flex-col space-y-2 h-[180px] w-full">
              <div className="flex justify-between items-end mt-4">
                {/* Skeleton bars for the chart */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
                  <div
                    key={item}
                    className="flex flex-col items-center space-y-1 w-full"
                  >
                    <div
                      className="bg-gray-200 dark:bg-gray-700 rounded-t-sm animate-pulse w-8"
                      style={{
                        height: `${Math.floor(Math.random() * 100) + 20}px`,
                      }}
                    ></div>
                    <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                  </div>
                ))}
              </div>

              {/* Skeleton for axis labels */}
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-2"></div>
            </div>
          ) : (
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={180}
            />
          )}
        </div>
      </div>
    </div>
  );
}
