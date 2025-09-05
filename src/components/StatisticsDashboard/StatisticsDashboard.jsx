import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectTransactions,
  selectTransactionCategories,
} from "../../redux/transactions/selectors";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "./StatisticsDashboard.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const StatisticsDashboard = () => {
  const transactions = useSelector(selectTransactions);
  const categories = useSelector(selectTransactionCategories);

  const [selectedMonth, setSelectedMonth] = useState("September");
  const [selectedYear, setSelectedYear] = useState("2025");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = ["2020", "2021", "2022", "2023", "2024", "2025"];

  // Kategori ID'lerini kategori adlarına eşle
  const getCategoryName = (categoryId) => {
    if (!categories || !categoryId) return "Unknown";
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  // Seçilen ay ve yıra göre transaction'ları filtrele
  const filteredTransactions = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const monthIndex = months.indexOf(selectedMonth);
    const year = parseInt(selectedYear);

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.transactionDate);
      const transactionMonth = transactionDate.getMonth();
      const transactionYear = transactionDate.getFullYear();

      return transactionMonth === monthIndex && transactionYear === year;
    });
  }, [transactions, selectedMonth, selectedYear, months]);

  // Sadece EXPENSE transaction'ları filtrele
  const expenseTransactions = useMemo(() => {
    if (!filteredTransactions || filteredTransactions.length === 0) return [];

    return filteredTransactions.filter(
      (transaction) => transaction.type === "EXPENSE"
    );
  }, [filteredTransactions]);

  const statistics = useMemo(() => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      return {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        categoryExpenses: {},
        chartData: {
          labels: [],
          datasets: [
            {
              data: [],
              backgroundColor: [],
              borderColor: [],
              borderWidth: 2,
              hoverOffset: 4,
            },
          ],
        },
      };
    }

    // Kategori ID'lerini kategori adlarına eşle
    const categoryMap = {};
    if (categories) {
      categories.forEach((category) => {
        categoryMap[category.id] = category.name;
      });
    }

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryExpenses = {};

    // Sadece EXPENSE transaction'ları işle
    filteredTransactions.forEach((transaction) => {
      if (transaction.type === "INCOME") {
        totalIncome += Math.abs(transaction.amount);
      } else if (transaction.type === "EXPENSE") {
        totalExpense += Math.abs(transaction.amount);

        // Kategori adını bul
        const categoryName =
          categoryMap[transaction.categoryId] || "Other expenses";
        if (!categoryExpenses[categoryName]) {
          categoryExpenses[categoryName] = 0;
        }
        categoryExpenses[categoryName] += Math.abs(transaction.amount);
      }
    });

    const balance = totalIncome - totalExpense;

    // Chart için sadece expense verilerini hazırla - her kategori için farklı renk
    const labels = Object.keys(categoryExpenses);
    const data = Object.values(categoryExpenses);

    // Her kategori için farklı renk kullan
    const colors = [
      "#FF6384", // Pembe
      "#36A2EB", // Mavi
      "#FFCE56", // Sarı
      "#4BC0C0", // Turkuaz
      "#9966FF", // Mor
      "#FF9F40", // Turuncu
      "#FF6384", // Pembe
      "#C9CBCF", // Gri
    ];

    const chartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: colors
            .slice(0, labels.length)
            .map((color) => color + "80"),
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    };

    return {
      totalIncome,
      totalExpense,
      balance,
      categoryExpenses,
      chartData,
    };
  }, [filteredTransactions, categories]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ₹${value.toLocaleString(
              "en-IN"
            )} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "60%",
  };

  return (
    <div className={styles.statisticsDashboard}>
      {/* Main Content - Chart (Sol) ve Expense Details (Sağ) */}
      <div className={styles.dashboardContent}>
        {/* Left Side - Chart */}
        <div className={styles.chartSection}>
          <div className={styles.chartContainer}>
            <Doughnut data={statistics.chartData} options={chartOptions} />
            <div className={styles.chartCenter}>
              <div className={styles.balanceText}>
                ₹{" "}
                {statistics.balance}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Expense Details */}
        <div className={styles.expenseDetailsSection}>
          {/* Header with Filters */}
          <div className={styles.dashboardHeader}>
            <div className={styles.filters}>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className={styles.monthFilter}
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className={styles.yearFilter}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {expenseTransactions && expenseTransactions.length > 0 ? (
            <div className={styles.transactionsTable}>
              <div className={styles.tableHeader}>
                <span>Category</span>
                <span>Comment</span>
                <span>Amount</span>
              </div>

              {expenseTransactions.map((transaction) => {
                // Kategori adını bul
                const categoryName = getCategoryName(transaction.categoryId);

                // Kategori için renk bul
                const categoryIndex = Object.keys(
                  statistics.categoryExpenses
                ).indexOf(categoryName);
                const categoryColor =
                  statistics.chartData.datasets[0].backgroundColor[
                    categoryIndex
                  ] || "#C9CBCF";

                return (
                  <div key={transaction.id} className={styles.tableRow}>
                    <span className={styles.category}>
                      <div
                        className={styles.categoryColorBox}
                        style={{ backgroundColor: categoryColor }}
                      />
                      {categoryName}
                    </span>

                    <span className={styles.comment}>
                      {transaction.comment}
                    </span>

                    <span className={`${styles.amount} ${styles.expense}`}>
                      ₹
                      {Math.abs(transaction.amount).toLocaleString("en-IN", {
                        minimumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.noTransactions}>
              <p>
                No expenses found for {selectedMonth} {selectedYear}
              </p>
            </div>
          )}

          {/* Summary Totals */}
          <div className={styles.summaryTotals}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Expenses:</span>
              <span className={styles.summaryValue}>
                ₹
                {statistics.totalExpense.toLocaleString("en-IN", {
                  minimumFractionDigits: 0,
                })}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Income:</span>
              <span className={`${styles.summaryValue} ${styles.income}`}>
                ₹
                {statistics.totalIncome.toLocaleString("en-IN", {
                  minimumFractionDigits: 0,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboard;
