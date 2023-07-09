import pgClient from "../Postgres/postgresClient";
import express from "express";
import { getUserFromUsername } from "../User/userUtils";
import { AccountType, getUserAccounts } from "../Account/accountUtils";
const accountRouter = express.Router();

// get user account names
accountRouter.get("/names", async (req, res) => {
    // TODO: real user handling
    const username = "generic_user";
    const user = await getUserFromUsername(username);
    const user_id = user.id;
    const accounts = await getUserAccounts(user_id);
    const accountNames = Array<string>();
    accounts.forEach((element: AccountType) => {
      accountNames.push(element.account_name);
    });

    res.json(accountNames);
});

export default accountRouter;
