import pgClient from "../Postgres/postgresClient";

interface TransactionType {
    id: number;
    account_id: number;
    date_val: Date;
    transaction_val: string;
}

// Database insertion for transaction data
// This is async because it needs to await an async function it uses (query)
async function insertTransactions(dates: string[], values: number[], accountIds: number[]) {
    // Push to transaction table
    for (let index = 0; index < accountIds.length; index++){
        await pgClient
        .query("INSERT INTO transactions (account_id, date_val, transaction_val) VALUES($1, $2, $3)", [accountIds[index], dates[index], values[index]])
        .catch(err => console.log("PG ERROR", err));
    }
}

export { insertTransactions, TransactionType };