import { getUserFromUsername } from "../User/userUtils";
import { AccountType, getUserAccounts } from "../Account/accountUtils";
import pgClient from "./postgresClient";
import express from "express";
const clearRouter = express.Router();

// Clear the database
clearRouter.delete("/", async (req, res) => {
    // TODO: Check account mapping to clear proper tables. Right now it clears everything.
    // pgClient.query("DELETE FROM users WHERE id = 1"); // This will cause error with foreign key contraint (no id)
    // const values = await pgClient.query("SELECT * FROM users");
    // console.log(values.rows);

    // query variables    
    // TODO: real user handling
    const username = "generic_user";
    const user = await getUserFromUsername(username);
    const user_id = user.id;
    const accounts = await getUserAccounts(user_id);
    const accountIds = Array<number>();
    accounts.forEach((element: AccountType) => {
      accountIds.push(element.id);
    });

    pgClient.query("DELETE FROM transactions WHERE account_id = ANY($1)", [accountIds]); // TODO: Real user ids
    pgClient.query("DELETE FROM balances WHERE account_id = ANY($1)", [accountIds]);
    pgClient.query("DELETE FROM accounts WHERE id = ANY($1)", [accountIds]); // TODO: This is likely redundant
    pgClient.query("DELETE FROM networths WHERE user_id = $1", [user_id]); // TODO: Real user ids
  
    // Break glass in case of fire
    // pgClient.query("DROP TABLE transactions CASCADE");
    // pgClient.query("DROP TABLE networths CASCADE");
    // pgClient.query("DROP TABLE users CASCADE");
  
    res.send({ working: true });
});

export default clearRouter;
