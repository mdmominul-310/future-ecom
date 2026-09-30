"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { DropdownItem } from "@/components/dashboard/ui/dropdown/DropdownItem";
import { useState, useEffect } from "react";
import { Dropdown } from "@/components/dashboard/ui/dropdown/Dropdown";
import { Ellipsis } from "lucide-react";

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

  const availableYears = Array.from(
    { length: new Date().getFullYear() - 2019 },
    (_, index) => 2020 + index
  );

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

  const fetchMonthlySales = async (selectedYear: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/dashboard/monthlysales?year=${selectedYear}`
      );
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
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
        setYear(selectedYear);
      } else {
        console.error("Failed to fetch monthly sales data:", result.message);
      }
    } catch (error) {
      console.error("Error fetching monthly sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlySales(year);
  }, [year]);

  const options: ApexOptions = {
    colors: ["#ff6600"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: monthNames,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: { title: { text: undefined } },
    grid: {
      yaxis: { lines: { show: true } },
    },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (val: number) => `৳${val.toFixed(2)}`,
      },
    },
  };

  const series = [
    {
      name: "Sales",
      data: loading ? Array(12).fill(0) : salesData.map((item) => item.sales),
    },
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {loading ? (
            <div className="h-7 w-40 bg-gray-200 animate-pulse rounded dark:bg-gray-700"></div>
          ) : (
            `Monthly Sales ${year}`
          )}
        </h3>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <Ellipsis className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            {availableYears.map((y) => (
              <DropdownItem
                key={y}
                onItemClick={() => {
                  closeDropdown();
                  setYear(y);
                }}
                className={`flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 ${
                  y === year ? "bg-gray-100 dark:bg-white/5 font-semibold" : ""
                }`}
              >
                {y}
              </DropdownItem>
            ))}
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          {loading ? (
            <div className="flex flex-col justify-between h-[480px] w-full animate-pulse py-4">
              <div className="flex justify-between items-end h-full px-2">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-end space-y-1 w-full"
                  >
                    <div
                      className="w-6 bg-gray-200 dark:bg-gray-700 rounded"
                      style={{
                        height: `${Math.floor(Math.random() * 150) + 40}px`, // simulate different bar heights
                      }}
                    ></div>
                    <div className="h-4 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded mt-3"></div>
            </div>
          ) : (
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={480}
            />
          )}
        </div>
      </div>
    </div>
  );
}
