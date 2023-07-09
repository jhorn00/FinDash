import { keys } from "./keys";

// Express Application Imports
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";

// Express Application setup
const app = express();
app.use(cors());
app.use(bodyParser.json());
const upload = multer({ dest: 'uploads/' });

// Import routes
import uploadRouter from "./Postgres/databaseUpload";
import clearRouter from "./Postgres/databaseClear";
import netWorthRouter from "./NetWorth/netWorthRoutes";
import transactionRouter from "./Transaction/transactionRoutes";
import accountRouter from "./Account/accountRoutes";
import balanceRouter from "./Balance/balanceRoutes";

// App endpoints
app.use("/upload", uploadRouter);
app.use("/clear", clearRouter);
app.use("/networths", netWorthRouter);
app.use("/transactions", transactionRouter);
app.use("/accounts", accountRouter);
app.use("/balances", balanceRouter);

// Verify responsiveness
app.get("/", (req, res) => {
  const responseText = "API is talking.";
  res.send(responseText);
});

app.listen(5000, (err?: Error) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Listening");
  }
});

export { app, upload };
