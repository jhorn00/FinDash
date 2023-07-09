import { AccountType, getUserAccounts } from "../Account/accountUtils";
import pgClient from "../Postgres/postgresClient";
import { BalanceType, IntermediateBalanceType, convertIntermediateToBalance } from "../Balance/balanceUtils";
import { getUserFromUsername } from "../User/userUtils";
import { TransactionType } from "../Transaction/transactionUtils";
import moment from "moment";

interface NetWorthType {
  id: number;
  user_id: number;
  date_val: string;
  transaction_val: string;
}

// Given a list of account IDs and a list of BalanceType sorted by date (ascending)
// Calculates the net worth for every date there exists a balance
// Accepts BalanceType[] and list of accountIds (number[]) from BalanceType[]
// Returns NetWorthType[]
function calculateNetWorth(accountIds: number[], rows: BalanceType[], user_id: number) {
  // Create map to track latest balance of each account
  const indexMap = new Map();
  // Populate indexMap
  for (const account of accountIds) {
    indexMap.set(account, -1);
  }

  const result = new Array<NetWorthType>();

  // For each balance present in query result
  for (let index = 0; index < rows.length; index++) {
    const currBalance = rows[index];
    // Update the latest date for the current account
    indexMap.set(currBalance.account_id, index);
    
    // Skip calculation if not at end of list and there are more accounts with balances at the same date
    if (index + 1 < rows.length && rows[index + 1].date_val === currBalance.date_val) {
      continue;
    }

    let currNetWorth = 0.0;
    // For each account, add the latest balance
    indexMap.forEach((value, key) => {
      // If the account has a balance <= current date
      if (value > -1) {
        const latestBalanceStr = rows[value].balance;
        // Handle money amount for y values
        const dollarRemoved = latestBalanceStr.replace("$", "");
        // Parsing to float with comma only takes digits before comma
        const commaRemoved = dollarRemoved.replace(",", "");
        // Parse to float
        const latestBalance = parseFloat(commaRemoved);
        // Add to networth
        currNetWorth += latestBalance;
      }
    });

    const newNetWorth: NetWorthType = {
      id: -1,
      user_id: user_id,
      date_val: currBalance.date_val,
      transaction_val: currNetWorth.toString()
    }

    result.push(newNetWorth);
  };

  return result;
}

// Function to handle Net Worth calculations
async function handleNetWorth() {
  // TODO: real user implementation
  const username = "generic_user";
  // Get the user_id to find all corresponding accounts
  const user = await getUserFromUsername(username);
  const user_id = user.id;

  // Get the list of accounts for the user
  const accounts = await getUserAccounts(user_id);
  const accountIds = Array<number>();
  accounts.forEach((element: AccountType) => {
    accountIds.push(element.id);
  });


  const values = await pgClient.query("SELECT * FROM balances WHERE account_id = ANY($1) ORDER BY date_val ASC", [accountIds]);
  // console.log(values);
  const rows = values.rows.map((row): IntermediateBalanceType => ({
    id: row.id,
    account_id: row.account_id,
    date_val: row.date_val,
    balance: row.balance
  }));
  // TODO: error check query types?

  // TODO: Consider checking the table values and update them
  // For now, just clear the table and recalculate
  pgClient.query(
    "TRUNCATE TABLE networths"
  ).catch(err => console.log("PG ERROR", err));

  // Need to convert types for calculation (Date types are poor for comparisons)
  const convertedRows = convertIntermediateToBalance(rows);
  const netWorths = calculateNetWorth(accountIds, convertedRows, user_id);

  return netWorths;
}

// Database insertion for Net Worth data
async function iterateNetWorthData(netWorthData: NetWorthType[]) {
  const promises = netWorthData.map(async (netWorthItem) => {
    try {
      await pgClient
      .query("INSERT INTO networths (user_id, date_val, transaction_val) VALUES($1, $2, $3)", [netWorthItem.user_id, netWorthItem.date_val, netWorthItem.transaction_val]);
    }
    catch (err) {
      console.log("PG ERROR", err);
    }
  });

  await Promise.all(promises);
}

export { handleNetWorth, iterateNetWorthData, NetWorthType };