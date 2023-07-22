import pgClient from "../Postgres/postgresClient";

interface AccountType {
    id: number;
    user_id: number;
    account_name: string;
}

async function checkAccountNameExists(user_id: number, account_name: string) {
    // Execute a query to check if the account exists
    const query = `SELECT COUNT(*) AS count FROM accounts WHERE user_id = $1 AND account_name = $2`;
    const result = await pgClient.query(query, [user_id, account_name]);
    
    // Access the count value from the query result
    const count = result.rows[0].count;
    
    // Account name exists
    if (count > 0) {
      return true;
    }

    // Account name does not exist
    return false;
}

async function createAccount(user_id: number, newAccountName: string) {
    const query = `
        INSERT INTO accounts (user_id, account_name)
        VALUES($1, $2)
        ON CONFLICT (user_id, account_name) DO NOTHING
    `;
    try {
        const result = await pgClient.query(query, [user_id, newAccountName]);
        if (result.rowCount === 1) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        throw error;
      }
}

// Accepts user_id number and account_name string
// Returns AccountType when account is found, null when 0 or > 1 are found
async function getAccountFromUserIdAccountName(user_id: number, account_name: string) {
    // TODO: error checking
    // Get account number from accounts table
    const accountIdResults = await pgClient.query("SELECT * FROM accounts WHERE user_id = $1 AND account_name = $2", [user_id, account_name]);
    const accountRows = accountIdResults.rows.map((row): AccountType => ({
        id: row.id,
        user_id: row.user_id,
        account_name: row.account_name
    }));

    // User has no account with given name or multiple accounts with that name
    if (accountRows.length != 1){
        console.log(accountRows.length);
        return null;
    }

    // Assign found account
    const account = accountRows[0];

    return account;
}

// Accepts user_id number
// Returns AccountType Array
async function getUserAccounts(user_id: number) {
    // TODO: error checking
    // Get account number from accounts table
    const accountIdResults = await pgClient.query("SELECT * FROM accounts WHERE user_id = $1", [user_id]);
    const accountRows = accountIdResults.rows.map((row): AccountType => ({
        id: row.id,
        user_id: row.user_id,
        account_name: row.account_name
    }));

    return accountRows;
}

export { checkAccountNameExists, createAccount, getAccountFromUserIdAccountName, getUserAccounts };
export type { AccountType };