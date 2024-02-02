import pgClient from "../Postgres/postgresClient";
import express from "express";
import { getUserFromUsername } from "../User/userUtils";
import { AccountType, getUserAccounts } from "../Account/accountUtils";
const authRouter = express.Router();

// Login
authRouter.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log("printed");
    const user = await getUserFromUsername(username);
    console.log(user);
    console.log("printed user");
    // TODO: Add hashing
    // return bcrypt.compare(password, user.password);
    // return 200 if true, 401 if false
    if (user && user.password === password) {
        res.status(200).send("Login successful.");
    } else {
        res.status(401).send("Login failed. Incorrect username or password.");
    }
});

export default authRouter;
