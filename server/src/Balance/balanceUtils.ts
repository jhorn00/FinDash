import { AccountType, getUserAccounts } from "../Account/accountUtils";
import pgClient from "../Postgres/postgresClient";
import { getUserFromUsername } from "../User/userUtils";
import { TransactionType } from "../Transaction/transactionUtils";
import moment, { Moment } from "moment";

interface BalanceType {
  id: number;
  account_id: number;
  date_val: string;
  balance: string;
}

interface IntermediateBalanceType {
  id: number;
  account_id: number;
  date_val: Date;
  balance: string;
}

// Converts list of intermediate types (from database) to usable balance types
// Accepts IntermediateBalanceType[]
// Returns BalanceType[]
function convertIntermediateToBalance (intermediates: IntermediateBalanceType[]) {
  const result = new Array<BalanceType>();
  intermediates.forEach((balance) => {
    // Parse date to string
    const parsedDate = moment(balance.date_val, "YYYY-MM-DD").format("YYYY-MM-DD");
    // Construct object
    const newBalanceType: BalanceType = {
      id: balance.id,
      account_id: balance.account_id,
      date_val: parsedDate,
      balance: balance.balance
    };
    // Store object
    result.push(newBalanceType);
  });
  return result;
}

// Function to handle Net Worth calculations
async function handleBalances(account_id: number, currentBalance: number) {
  // Gather relevant transaction data in reverse order
  const values = await pgClient.query("SELECT * FROM transactions WHERE account_id = $1 ORDER BY date_val DESC", [account_id]);
  // TODO: error handling if no transactions are found
  const rows = values.rows.map((row): TransactionType => ({
    id: row.id,
    account_id: row.account_id,
    date_val: row.date_val,
    transaction_val: row.transaction_val
  }));
  // TODO: error check query types?

  // TODO: Consider checking the table values and update them
  // For now, just clear the table and recalculate
  pgClient.query("DELETE FROM balances WHERE account_id = $1", [account_id])
      .catch(err => console.log("PG ERROR", err));

  // Need to calculate the net transaction amount for each day
  let netTransaction: Map<string, number> = new Map(); // Have to use string since objects (like Date) are compared by reference
  rows.forEach((element) => {
    // Process money string
    const noDollar = element.transaction_val.replace("$", "");
    const noCommaDollar = noDollar.replace(",", "");
    // Convert to Float
    const transactionValNumeric = parseFloat(noCommaDollar);
    // Parse date to string
    const parsedDate = moment(element.date_val, "YYYY-MM-DD").format("YYYY-MM-DD");
    // If the date is in the map, update net transaction
    if (netTransaction.has(parsedDate)){
      const currentTransaction = netTransaction.get(parsedDate); // Because we check has(), currentTransaction should always be defined
      const newTransaction = (currentTransaction ?? -99999999) + transactionValNumeric; // Chose a large negative number so it should be obvious it failed here
      // TODO: Error check the get function
      netTransaction.set(parsedDate, newTransaction);
    }
    // If the date is not in the map, initialize the transaction amount
    else {
      netTransaction.set(parsedDate, transactionValNumeric);
    }
  });

  // Because JS maps are ordered by insertion, and the rows list was sorted by date,
  // the rolling account balance can be calculated by traversing the map from the head.
  let rollingBalance = currentBalance;
  let rollingBalances = Array<BalanceType>();
  netTransaction.forEach((value, key) => {
    const totalTransaction: BalanceType = {
      id: -1, // TODO: This is literally just wasted space, maybe make new type?
      account_id: account_id,
      date_val: key,
      balance: rollingBalance.toString() // TODO: Maybe add $ in front? Shouldn't matter...
    }
    rollingBalances.push(totalTransaction);
    rollingBalance += (value * -1.0); // TODO: This gets some precision weirdness. Should get cut off by database but maybe look into it.
  });

  return rollingBalances;
}

// Database insertion for Net Worth data
async function iterateBalanceData(balanceData: BalanceType[]) {
  const promises = balanceData.map(async (balanceItem) => {
    try {
      await pgClient.query("INSERT INTO balances (account_id, date_val, balance) VALUES($1, $2, $3)", [balanceItem.account_id, balanceItem.date_val, balanceItem.balance]);
    }
    catch (err) {
      console.log("PG ERROR", err);
    }
  });

  await Promise.all(promises);
}

export { convertIntermediateToBalance, handleBalances, iterateBalanceData, BalanceType, IntermediateBalanceType, TransactionType };