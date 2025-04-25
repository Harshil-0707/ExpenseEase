import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell } from "recharts";
import sort from "../../assets/sort.svg";
import filter from "../../assets/filter.svg";
import axios from "axios";

const Summary = () => {
  const [budgetCategories, setBudgetCategories] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  // Fetch category data and total income/expense
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoryRes = await axios.post(
          "http://localhost:8000/expense/getAllCategory",
          {
            user_id: 2,
            email: "one@gmail.com",
          }
        );

        if (categoryRes.data.message === "true") {
          const categories = categoryRes.data.data.map((category) => ({
            name: category.category_name,
            spent: parseFloat(category.total_spent_amount),
            total: parseFloat(category.total_category_budget),
            color: getRandomColor(),
          }));
          setBudgetCategories(categories);
        }

        // Fetch total income and expense
        const totalRes = await axios.post(
          "http://localhost:8000/api/budget/get-all-budget",
          {
            user_id: 2,
            email: "one@gmail.com",
          }
        );

        if (totalRes.data.message === "true") {
          setTotalIncome(parseFloat(totalRes.data.data[0].total_income || 0));
          setTotalExpense(parseFloat(totalRes.data.data[0].total_expense || 0));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const calculateProgress = (spent, total) => {
    if (total === 0) return 0;
    return (spent / total) * 100;
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const balance = totalIncome - totalExpense;
  const incomePercent =
    totalIncome + totalExpense > 0
      ? (totalIncome / (totalIncome + totalExpense)) * 100
      : 0;
  const expensePercent = 100 - incomePercent;

  // Prepare Pie chart data dynamically
  const chartData = budgetCategories.map((category) => ({
    name: category.name,
    value: calculateProgress(category.spent, category.total),
    color: category.color, // Pass the color to Pie chart data
  }));

  return (
    <div className="dashboardParent w-full px-4 md:px-6 lg:px-8 h-full overflow-auto pb-24">
      {/* Header */}
      <div className="mb-6 md:mb-10">
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">
          ExpenseEase
        </h3>
        <div className="text-[#101010] opacity-50 text-xs md:text-sm">
          01 - 24 March, 2025
        </div>
      </div>

      <div className="flex flex-col items-start w-full">
        <div className="text-xl md:text-2xl font-bold pl-2 pb-3 mb-6 border-b-[0.5px] border-[#828282] w-full">
          Summary
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 lg:gap-6">
        {/* Left */}
        <div className="space-y-6">
          {/* Totals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
              <div className="text-sm text-gray-600">Total Income</div>
              <div className="text-lg md:text-xl font-semibold">
                ₹ {totalIncome}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
              <div className="text-sm text-gray-600">Total Expense</div>
              <div className="text-lg md:text-xl font-semibold">
                ₹ {totalExpense}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm sm:col-span-2 lg:col-span-1">
              <div className="text-sm text-gray-600">Balance</div>
              <div className="text-lg md:text-xl font-semibold">
                ₹ {balance}
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {/* Income vs Expense Chart */}
            <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
              <h3 className="text-base font-medium mb-4">Income Vs Expense</h3>
              <div className="flex justify-center items-center">
                <PieChart width={180} height={180}>
                  <Pie
                    data={chartData}
                    cx={90}
                    cy={90}
                    innerRadius={0}
                    outerRadius={70}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              {/* <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: chartData[0]?.color }}
                    mr-2
                  ></div>
                  <span className="text-sm">Expense</span>
                </div>
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: chartData[1]?.color }}
                    mr-2
                  ></div>
                  <span className="text-sm">Income</span>
                </div>
              </div> */}
            </div>

            {/* Budget Tracking */}
            <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
              <h3 className="text-base font-medium mb-4">Budget Tracking</h3>
              <div className="space-y-4">
                {budgetCategories.map((category, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {category.spent}/{category.total} Rs
                      </span>
                    </div>
                    <div className="relative h-2 w-full bg-gray-200 rounded-full">
                      <div
                        className="absolute top-0 left-0 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${calculateProgress(
                            category.spent,
                            category.total
                          )}%`,
                          backgroundColor: category.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right - Recent Transactions (Static for now) */}
        <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm h-fit">
          <div className="flex justify-between items-center mb-4">
            <div className="text-[#101010] opacity-50 text-xs sm:text-sm">
              01 - 24 March, 2025
            </div>
            <div className="flex items-center gap-4">
              <img
                src={filter}
                alt="Filter"
                className="w-3.5 h-5 cursor-pointer"
              />
              <img src={sort} alt="Sort" className="w-4 h-5 cursor-pointer" />
            </div>
          </div>

          <div className="space-y-3">
            {/* Dummy Transaction Item */}
            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <div className="text-red-500 text-sm">N</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Entertainment</div>
                  <div className="text-xs text-gray-500">5:17 pm • Netflix</div>
                </div>
              </div>
              <div className="text-sm font-medium text-red-500">-150</div>
            </div>

            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                  <div className="text-orange-500 text-sm">A</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Transport</div>
                  <div className="text-xs text-gray-500">5:13 pm • AMTS</div>
                </div>
              </div>
              <div className="text-sm font-medium text-red-500">-150</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
