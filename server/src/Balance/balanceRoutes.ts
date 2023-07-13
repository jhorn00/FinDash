import pgClient from "../Postgres/postgresClient";
import express from "express";
import { getUserFromUsername } from "../User/userUtils";
const balanceRouter = express.Router();
import { checkAccountNameExists, getAccountFromUserIdAccountName } from "../Account/accountUtils";

// Get Balance Range
balanceRouter.get("/", async (req, res) => {
    const getTimeRangeQuery = (account_id: number, interval: number, unit: string) => {
      let intervalQuery: string;
      // Check which type of unit we are dealing with
      // Weeks can be in else because validity is verified before function call
      if (unit === "months") {
        intervalQuery = `(${interval}::text || ' months')::interval`;
      }
      else {
        intervalQuery = `(${interval}::text || ' weeks')::interval`;
      }
      return {
        text: `
          SELECT *
          FROM balances
          WHERE account_id = $1
            AND date_val >= (SELECT MAX(date_val) FROM balances) - ${intervalQuery}
            AND date_val <= (SELECT MAX(date_val) FROM balances)
          ORDER BY date_val ASC;
        `,
        values: [account_id]
      };
    };
    
    // Set unit for query (only used for sub-month precision)
    const unit = req.query.unit;
    if (unit != "weeks" && unit != "months"){
      console.log("Error: Interval unit was invalid. Was not weeks or months.")
      return res.status(500).json({ error: "Error: Unit was not weeks or months." });
    }
  
    // Set interval from request
    const interval = Number(req.query.interval);
    if (isNaN(interval)){
      console.log("Error: Interval was invalid. Number conversion resulted in NaN.")
      return res.status(500).json({ error: "Error: Interval was NaN." });
    }

    // Set user information
    const username = "generic_user";
    const user = await getUserFromUsername(username);
    const user_id = user.id; // TODO: set real users

    // Set account name from request
    const account_name = req.query.accountName;
    if (typeof account_name != "string") {
        console.log("Error: Account name was not a string.")
        return res.status(500).json({ error: "Error: Account name was not a string." });
    }
    // Check that the user has an account with the name
    if (!checkAccountNameExists(user_id, account_name)){
        const error = "Error: Account with name " + account_name + " does not exist for user " + String(user_id) + ".";
        console.log(error)
        return res.status(500).json({ error: error });
    }

    // Get account and acount id from known data
    const account = await getAccountFromUserIdAccountName(user_id, account_name);
    if (account === null){
        const message = "Error: Encountered problem resolving account with name '" + account_name + "'. It does not exist or has duplicates.";
        console.log(message);
        return {code: 400, success: false, message: message};
    }
    const account_id = account.id;

    // Send query
    const query = getTimeRangeQuery(account_id, interval, unit);
    try {
      const { rows } = await pgClient.query(query);
      res.json(rows);
    } catch (error) {
      console.error("Error fetching balances:", error);
      res.status(500).json({ error: "An error occurred while fetching balances." });
    }
});
  
// get the balances
balanceRouter.get("/all", async (req, res) => {
    // Set query variables
    const username = "generic_user";
    const user = await getUserFromUsername(username);
  
    const user_id = user.id; // TODO: set real users

    // Set account name from request
    const account_name = req.query.accountName;
    if (typeof account_name != "string") {
        console.log("Error: Account name was not a string.")
        return res.status(500).json({ error: "Error: Account name was not a string." });
    }
    // Check that the user has an account with the name
    if (!checkAccountNameExists(user_id, account_name)){
        const error = "Error: Account with name " + account_name + " does not exist for user " + String(user_id) + ".";
        console.log(error)
        return res.status(500).json({ error: error });
    }

    const account = await getAccountFromUserIdAccountName(user_id, account_name);
    if (account === null){
        const message = "Error: Encountered problem resolving account with name '" + account_name + "'. It does not exist or has duplicates.";
        console.log(message);
        return {code: 400, success: false, message: message};
    }
    const account_id = account.id;

    const { rows } = await pgClient.query("SELECT * FROM balances WHERE account_id = $1 ORDER BY date_val ASC", [account_id]); // TODO: Real user implementation
    res.json(rows);
});

export default balanceRouter;
