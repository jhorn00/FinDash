import React, { useState, useCallback, useEffect } from "react";
import "./MonthlyExpenses.css";
import axios from "axios";
import { BarChart } from "../BarChart/BarChart";
import getShortMonthUTC from "../../functions/GetMonthUTC";

function MonthlyExpenses() {
  interface MonthlyExpenseType {
    month: string;
    total_expenses: string;
  }

  // Initial state for Monthly Expense database lists
  const initServerState = {
    xData: Array<string>(),
    yData: Array<number>(),
  };

  // Monthly Expense useState initialized with empty arrays
  const [monthlyExpenses, setMonthlyExpenses] = useState(initServerState);

  const getRows = useCallback(async () => {
    const newMonthlyExpenses = {
      xData: Array<string>(),
      yData: Array<number>(),
    };

    const monthMap = new Map([
      ["Jan", "Feb"],
      ["Feb", "Mar"],
      ["Mar", "Apr"],
      ["Apr", "May"],
      ["May", "Jun"],
      ["Jun", "Jul"],
      ["Jul", "Aug"],
      ["Aug", "Sep"],
      ["Sep", "Oct"],
      ["Oct", "Nov"],
      ["Nov", "Dec"],
      ["Dec", "Jan"],
    ]);

    function processMonthlyExpense(monthylExpense: MonthlyExpenseType) {
      const thisMonth = getShortMonthUTC(monthylExpense.month);
      if (!monthMap.has(thisMonth)) {
        throw new Error(
          "processMonthlyExpense: Could not parse UTC string into month."
        );
      }
      monthylExpense.month = thisMonth;
      return monthylExpense;
    }

    // Get request for all values
    const data = await axios
      .get("/api/transactions/net")
      .then(function (response) {
        // Assign the response data and process it
        const rows: MonthlyExpenseType[] = response.data;
        try {
          rows.map(processMonthlyExpense);
        } catch (error) {
          // Pass it up to the axios catch
          throw error;
        }

        // Fill any gaps in the processed response data
        for (let i = 0; i < rows.length - 1; i++) {
          const thisMonth = rows[i].month;
          const nextMonth = rows[i + 1].month;
          // Check for fail value (should never occur)
          if (!monthMap.has(thisMonth) || !monthMap.has(nextMonth)) {
            console.log("Could not parse UTC string into month.");
            break;
          }
          // Check month mapping and correct data as-needed
          if (monthMap.get(thisMonth) !== nextMonth) {
            // Start at the first missing month and add all missing entries
            let currentMonth = monthMap.get(thisMonth);
            while (currentMonth && currentMonth !== nextMonth) {
              // Create new month with no expenses (that is why it would be abscent)
              const newEntry: MonthlyExpenseType = {
                month: currentMonth,
                total_expenses: "$0",
              };
              // Adjust the index of the array since insertion should be over 1
              // We also want to account for the fact that the array is growing
              i++;
              // Insert new month
              rows.splice(i, 0, newEntry);
              // shift to next month
              currentMonth = monthMap.get(currentMonth);
            }
          }
        }

        // Convert money type to number and push data
        rows.forEach((element: MonthlyExpenseType) => {
          // Handle money amount for y values
          const dollarRemoved = element.total_expenses.replace("$", "");
          // Parsing to float with comma only takes digits before comma
          const commaRemoved = dollarRemoved.replace(",", "");
          // Parse to float
          const yDataNumeric = parseFloat(commaRemoved);
          newMonthlyExpenses.yData.push(yDataNumeric);
          // Handle the month name for x values
          const monthName: string = element.month;
          newMonthlyExpenses.xData.push(monthName);
        });
        console.log(rows);
      })
      .catch((error) => console.log(error));

    setMonthlyExpenses(newMonthlyExpenses);
  }, []);

  useEffect(() => {
    getRows();
  }, [getRows]);

  return (
    <div className="monthly-expenses">
      <BarChart
        plotLabel="Monthly Expenses"
        xData={monthlyExpenses.xData}
        yData={monthlyExpenses.yData}
      />
    </div>
  );
}

export default MonthlyExpenses;
