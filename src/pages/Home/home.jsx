import React, { useState, useEffect } from "react";
import dashboardService from "../../services/dashboardService";
import { formatterPrice } from "../../utils/formatterPrice";
import CustomDatePicker from "./../../components/DatePicker/index";
import dayjs from "dayjs";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const FinancialDashboard = () => {
  const [currentFilter, setCurrentFilter] = useState("daily");
  const [filterValues, setFilterValues] = useState({
    dailyDate: new Date().toISOString().split("T")[0],
    monthlyMonth: new Date().getMonth() + 1,
    monthlyYear: new Date().getFullYear(),
    yearlyYear: new Date().getFullYear(),
    customStart: (() => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 1);
      return date.toISOString().split("T")[0];
    })(),
    customEnd: new Date().toISOString().split("T")[0],
  });

  const [totals, setTotals] = useState({
    received: 0,
    pending: 0,
    discount: 0,
    deposit: 0,
    actual: 0,
    expenses: 0,
  });

  const [expenseBreakdown, setexpenseBreakdown] = useState({
    fuel: 0,
    advance: 0,
    toll: 0,
    special: 0,
    other: 0,
  });

  const [expenseComparison, setexpenseComparison] = useState({});

  const [operatingResult, setoperatingResult] = useState([]);

  const getDateRangeFromFilter = (currentFilter, filterValues) => {
    const addDays = (dateStr, days) => {
      const date = new Date(dateStr);
      date.setDate(date.getDate() + days);
      return date.toISOString().split("T")[0];
    };

    const formatDate = (dateStr) => {
      return new Date(dateStr).toISOString().split("T")[0];
    };

    const getLastDayOfMonth = (year, month) => {
      return new Date(year, month, 0); // last day of the month
    };

    let dtStart = "",
      dtEnd = "";

    switch (currentFilter) {
      case "yearly": {
        const year = filterValues.yearlyYear;
        dtStart = `${year}-01-01`;
        dtEnd = `${year}-12-31`;
        break;
      }
      case "monthly": {
        const { monthlyMonth, monthlyYear } = filterValues;
        const monthStr = String(monthlyMonth).padStart(2, "0");
        const lastDay = getLastDayOfMonth(monthlyYear, monthlyMonth).getDate();
        dtStart = `${monthlyYear}-${monthStr}-01`;
        dtEnd = `${monthlyYear}-${monthStr}-${String(lastDay).padStart(
          2,
          "0"
        )}`;
        break;
      }
      case "weekly": {
        dtStart = addDays(filterValues.dailyDate, -7);
        dtEnd = formatDate(filterValues.dailyDate);
        break;
      }
      case "custom": {
        dtStart = formatDate(filterValues.customStart);
        dtEnd = addDays(filterValues.customEnd, 1); // inclusive range
        break;
      }
      case "daily":
      default: {
        dtStart = formatDate(filterValues.dailyDate);
        dtEnd = addDays(filterValues.dailyDate, 1);
        break;
      }
    }

    return { dtStart, dtEnd };
  };

  const getHeader = async () => {
    try {
      const { dtStart, dtEnd } = getDateRangeFromFilter(
        currentFilter,
        filterValues
      );

      const header = await dashboardService.getHeader({
        type: currentFilter === "yearly" ? "year" : "day",
        dtStart: dtStart,
        dtEnd: dtEnd,
      });
      setTotals(calculateTotals(header));
    } catch (error) {
      console.error("Failed to fetch header:", error);
    }
  };

  const getExpenseSummary = async () => {
    try {
      const { dtStart, dtEnd } = getDateRangeFromFilter(
        currentFilter,
        filterValues
      );

      const expenseSummary = await dashboardService.getExpenseSummary({
        type: currentFilter === "yearly" ? "year" : "day",
        dtStart: dtStart,
        dtEnd: dtEnd,
      });

      setexpenseBreakdown(calculateExpenseBreakdown(expenseSummary));
    } catch (error) {
      console.error("Failed to fetch header:", error);
    }
  };

  const getExpenseComparison = async () => {
    try {
      const { dtStart, dtEnd } = getDateRangeFromFilter(
        currentFilter,
        filterValues
      );

      const eComparison = await dashboardService.getExpenseComparison({
        type: currentFilter === "yearly" ? "year" : "day",
        dtStart: dtStart,
        dtEnd: dtEnd,
      });

      setexpenseComparison(eComparison);
    } catch (error) {
      console.error("Failed to fetch header:", error);
    }
  };


  const getOperatingResult = async () => {
    try {
      const { dtStart, dtEnd } = getDateRangeFromFilter(
        currentFilter,
        filterValues
      );

      const operatingResults = await dashboardService.getOperatingResult({
        type: currentFilter === "yearly" ? "year" : "day",
        dtStart: dtStart,
        dtEnd: dtEnd,
      });

      setoperatingResult(operatingResults);
    } catch (error) {
      console.error("Failed to fetch header:", error);
    }
  };


  useEffect(() => {
    console.log('currentFilter', currentFilter)
    getHeader();
    getExpenseSummary();
    getExpenseComparison();
    getOperatingResult();
  }, [currentFilter, filterValues]);

  const months = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2024 + 1 },
    (_, i) => currentYear - i
  );

  const expenseColors = ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe"];

  // Calculate totals
  const calculateTotals = (data) => {
    return data.reduce(
      (acc, item) => {
        acc.received = item.total;
        acc.pending = item.remain;
        acc.discount = item.discount;
        acc.deposit = item.deposit;
        acc.actual = item.price_after_discount;
        acc.expenses = item.total_expense;
        return acc;
      },
      {
        received: 0,
        pending: 0,
        discount: 0,
        deposit: 0,
        actual: 0,
        expenses: 0,
      }
    );
  };

  // Calculate expense breakdown
  const calculateExpenseBreakdown = (data) => {
    let results = data.reduce(
      (acc, item) => {
        acc.fuel =
          item.expense_type_name == "น้ำมัน"
            ? parseFloat(item.total)
            : acc.fuel;
        acc.advance =
          item.expense_type_name == "เบิกเงินล่วงหน้า"
            ? parseFloat(item.total)
            : acc.advance;
        acc.toll =
          item.expense_type_name == "ทางด่วน"
            ? parseFloat(item.total)
            : acc.toll;
        acc.special =
          item.expense_type_name == "พิเศษ"
            ? parseFloat(item.total)
            : acc.special;
        acc.other =
          item.expense_type_name == "อื่นๆ"
            ? parseFloat(item.total)
            : acc.other;
        return acc;
      },
      { fuel: 0, advance: 0, toll: 0, special: 0, other: 0 }
    );

    return results;
  };

  // Prepare chart data
  const prepareChartData = (data) => {
    if (data != null && data.length > 0) {
      return data
        .map((item) => ({
          date: new Date(item.create_date).toLocaleDateString("th-TH", {
            day: "2-digit",
            month: "2-digit",
          }),
          actual: (item.price_after_discount),
          expenses: (item.total_expense),
        }))
        .reverse();
    } else {
      return [{
        date: new Date(filterValues.dailyDate).toLocaleDateString("th-TH", {
            day: "2-digit",
            month: "2-digit",
          }),
        actual: 0,
        expenses: 0,
      }];
    }
  };

  // Prepare pie chart data
  const preparePieData = (expenseBreakdown) => {
    return [
      { name: "น้ำมัน", value: expenseBreakdown.fuel },
      { name: "เบิกเงินล่วงหน้า", value: expenseBreakdown.advance },
      { name: "ทางด่วน", value: expenseBreakdown.toll },
      { name: "พิเศษ", value: expenseBreakdown.special },
      { name: "อื่นๆ", value: expenseBreakdown.other },
    ];
  };

  const chartData = prepareChartData(expenseComparison);
  const pieData = preparePieData(expenseBreakdown);

  const handleFilterChange = (filterType) => {
    setCurrentFilter(filterType);
  };

  const handleInputChange = (field, value) => {
    setFilterValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatCurrency = (amount) => {
    return "฿" + formatterPrice(amount ?? 0);
  };

  const SummaryCard = ({ title, amount, changePercent, isPositive }) => (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden text-center">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      <h6 className="text-sm text-gray-600 font-semibold mb-3">{title}</h6>
      <div className="text-2xl font-bold text-gray-800 mb-2">
        {formatCurrency(amount)}
      </div>
    </div>
  );

  const ExpenseItem = ({ title, amount, color, index }) => (
    <div
      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center transition-transform duration-300 hover:scale-105 border-l-4"
      style={{ borderLeftColor: expenseColors[index] }}
    >
      <h6 className="text-xs text-gray-600 mb-2">{title}</h6>
      <div className="text-lg font-bold text-gray-800">
        {formatCurrency(amount)}
      </div>
    </div>
  );

  const TableRow = ({ item }) => {
    const totalExpenses = item.total_expense;
    const netProfit = item.total - totalExpenses;
    const efficiency = item.efficiency;
    const collectionRate = item.collectionrate;

    const profitClass =
      netProfit >= 0
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";
    const efficiencyClass =
      efficiency >= 70
        ? "bg-green-100 text-green-800"
        : efficiency >= 50
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800";

    return (
      <tr className="hover:bg-blue-50/50 transition-colors duration-200">
     
        <td className="px-4 py-3 border-b border-gray-200">
  {currentFilter === "yearly"
    ? new Date(item.create_date).toLocaleDateString("th-TH", {
        month: "2-digit",
        year: "numeric",
      })
    : new Date(item.create_date).toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })}
</td>

        <td className="px-4 py-3 border-b border-gray-200 text-right">
          {formatCurrency(item.total)}
        </td>
        <td className="px-4 py-3 border-b border-gray-200 text-right">
          {formatCurrency(item.remain)}
        </td>
        <td className="px-4 py-3 border-b border-gray-200 text-right">
          {formatCurrency(item.discount)}
        </td>
        <td className="px-4 py-3 border-b border-gray-200 text-right">
          {formatCurrency(item.deposit)}
        </td>
        <td className="px-4 py-3 border-b border-gray-200 text-right">
          {formatCurrency(item.price_after_discount)}
        </td>
        <td className="px-4 py-3 border-b border-gray-200 text-right">
          {formatCurrency(totalExpenses)}
        </td>
        <td
          className={`px-4 py-3 border-b border-gray-200 text-right font-bold rounded ${profitClass}`}
        >
          {formatCurrency(netProfit)}
        </td>
        <td
          className={`px-4 py-3 border-b border-gray-200 text-right rounded ${efficiencyClass}`}
        >
          {efficiency}%
        </td>
        <td className="px-4 py-3 border-b border-gray-200 text-right">
          {collectionRate}%
        </td>
      </tr>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-sans">
      <div className="max-w-10xl mx-auto p-5">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 mb-5 shadow-lg flex flex-col lg:flex-row justify-between items-center gap-5">
          <h3 className="text-3xl font-bold text-gray-800">
            Dashboard รายรับ-รายจ่าย
          </h3>

          <div className="flex flex-col lg:flex-row items-center gap-4">
            {/* Filter Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              {[
                { key: "daily", label: "รายวัน" },
                { key: "weekly", label: "รายสัปดาห์" },
                { key: "monthly", label: "รายเดือน" },
                { key: "yearly", label: "รายปี" },
                { key: "custom", label: "กำหนดเอง" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleFilterChange(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    currentFilter === key
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-3">
              {(currentFilter === "daily" || currentFilter === "weekly") && (
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 font-semibold mb-1">
                    วันที่
                  </label>
                  <CustomDatePicker
                    onChange={(value) => {
                      handleInputChange("dailyDate", value);
                    }}
                    style={{ width: "100%" }}
                    value={filterValues.dailyDate}
                  />
                </div>
              )}

              {currentFilter === "monthly" && (
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 font-semibold mb-1">
                    เดือน/ปี
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={filterValues.monthlyMonth}
                      onChange={(e) =>
                        handleInputChange("monthlyMonth", e.target.value)
                      }
                      className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                    >
                      {months.map((month, index) => (
                        <option key={index} value={index + 1}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <select
                      value={filterValues.monthlyYear}
                      onChange={(e) =>
                        handleInputChange("monthlyYear", e.target.value)
                      }
                      className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {currentFilter === "yearly" && (
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 font-semibold mb-1">
                    ปี
                  </label>
                  <select
                    value={filterValues.yearlyYear}
                    onChange={(e) =>
                      handleInputChange("yearlyYear", e.target.value)
                    }
                    className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {currentFilter === "custom" && (
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 font-semibold mb-1">
                    ช่วงวันที่
                  </label>
                  <div className="flex gap-2">
                     <CustomDatePicker
                    onChange={(value) => {
                      handleInputChange("customStart", value);
                    }}
                    style={{ width: "100%" }}
                    value={filterValues.customStart}
                  />
                    <CustomDatePicker
                    onChange={(value) => {
                      handleInputChange("customEnd", value);
                    }}
                    style={{ width: "100%" }}
                    value={filterValues.customEnd}
                  />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-5">
          <SummaryCard title="ยอดรับทั้งหมด" amount={totals.received} />
          <SummaryCard title="ยอดค้างชำระ" amount={totals.pending} />
          <SummaryCard title="ยอดส่วนลด" amount={totals.discount} />
          <SummaryCard title="ยอดมัดจำ" amount={totals.deposit} />
          <SummaryCard title="ยอดรับจริง" amount={totals.actual} />
          <SummaryCard title="รายจ่ายรวม" amount={totals.expenses} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
          {/* Trend Chart */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h5 className="text-xl font-bold text-gray-800 mb-4">
              แนวโน้มยอดรับ-จ่าย
            </h5>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={(value) => `฿ ${formatterPrice(value)}`}
                  />
                  <Tooltip
                    formatter={(value) => [`฿ ${formatterPrice(value)}`, ""]}
                    labelStyle={{ color: "#374151" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#667eea"
                    strokeWidth={3}
                    dot={{ fill: "#667eea", strokeWidth: 2, r: 4 }}
                    name="ยอดรับจริง"
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#e74c3c"
                    strokeWidth={3}
                    dot={{ fill: "#e74c3c", strokeWidth: 2, r: 4 }}
                    name="รายจ่ายรวม"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expense Analysis */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-gray-800 mb-4">
              การวิเคราะห์รายจ่าย
            </h4>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={expenseColors[index % expenseColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => `฿${formatterPrice(value)}`}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-3">
                <ExpenseItem
                  title="น้ำมัน"
                  amount={expenseBreakdown.fuel}
                  index={0}
                />
                <ExpenseItem
                  title="เบิกเงินล่วงหน้า"
                  amount={expenseBreakdown.advance}
                  index={1}
                />
                <ExpenseItem
                  title="ทางด่วน"
                  amount={expenseBreakdown.toll}
                  index={2}
                />
                <ExpenseItem
                  title="พิเศษ"
                  amount={expenseBreakdown.special}
                  index={3}
                />
                <ExpenseItem
                  title="อื่นๆ"
                  amount={expenseBreakdown.other}
                  index={4}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg overflow-x-auto">
          <h4 className="text-xl font-bold text-gray-800 mb-4">
            ตารางข้อมูลและการวิเคราะห์ผลประกอบการ
          </h4>
       <div
  className="overflow-y-auto"
  style={{ maxHeight: "400px" }}  // กำหนดความสูงที่ต้องการให้ scroll ได้
>
  <table className="w-full text-sm table-fixed border-collapse border border-gray-300">
    <thead className="bg-gray-50 sticky top-0 z-10">
      <tr>
          <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200">
                    วันที่
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700 border-b-2 border-gray-200">
                    ยอดรับ (฿)
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700 border-b-2 border-gray-200">
                    ยอดค้างชำระ (฿)
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700 border-b-2 border-gray-200">
                    ยอดส่วนลด (฿)
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700 border-b-2 border-gray-200">
                    ยอดมัดจำ (฿)
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700 border-b-2 border-gray-200">
                    ยอดรับจริง (฿)
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700 border-b-2 border-gray-200">
                    รายจ่ายรวม (฿)
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700 border-b-2 border-gray-200">
                    กำไรสุทธิ (฿)
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700 border-b-2 border-gray-200">
                    อัตราประสิทธิภาพ (%)
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700 border-b-2 border-gray-200">
                    อัตราการเก็บเงิน (%)
                  </th>
      </tr>
    </thead>
    <tbody>
      {operatingResult && operatingResult.length > 0 ? (
        operatingResult.map((item, index) => (
          <TableRow key={index} item={item} />
        ))
      ) : (
        <tr>
          <td colSpan={10} className="text-center py-4 text-gray-500">
            ไม่มีข้อมูล
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
