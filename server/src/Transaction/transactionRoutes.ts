import pgClient from "../Postgres/postgresClient";
import express from "express";
import { getUserFromUsername } from "../User/userUtils";
import { AccountType, getUserAccounts } from "../Account/accountUtils";
const transactionRouter = express.Router();

// get all transactions
transactionRouter.get("/all", async (req, res) => {
    // TODO: real user handling
    const username = "generic_user";
    const user = await getUserFromUsername(username);
    const user_id = user.id;
    const accounts = await getUserAccounts(user_id);
    const accountIds = Array<number>();
    accounts.forEach((element: AccountType) => {
      accountIds.push(element.id);
    });

    const { rows } = await pgClient.query("SELECT * FROM transactions WHERE account_id = ANY($1) ORDER BY date_val ASC", [accountIds]); // TODO: Real user implementation
    // const ids = values.rows.map(row => row.id);
    // const date_values = values.rows.map(row => row.date_val);
    // const transaction_vals = values.rows.map(row => row.transaction_val);
    // console.log(ids);
    // console.log(date_values);
    // console.log(transaction_vals);
    res.json(rows);
});

// get monthly net transaction
transactionRouter.get("/net", async (req, res) => {
    // TODO: real user handling
    const username = "generic_user";
    const user = await getUserFromUsername(username);
    const user_id = user.id;
    const accounts = await getUserAccounts(user_id);
    const accountIds = Array<number>();
    accounts.forEach((element: AccountType) => {
      accountIds.push(element.id);
    });

    const { rows } = await pgClient.query(
      "SELECT DATE_TRUNC('month', date_val) AS month, " +
      "SUM(transaction_val) AS total_expenses " +
      "FROM transactions " +
      "WHERE account_id = ANY($1) " +
      "AND CAST(transaction_val AS NUMERIC) < 0 " +
      "AND date_val >= DATE_TRUNC('year', NOW()) - INTERVAL '1 year' " +
      "GROUP BY month " +
      "ORDER BY month ASC",
      [accountIds]
    ); // TODO: Real user implementation
    // console.log(rows);
    res.json(rows);
});

export default transactionRouter;
