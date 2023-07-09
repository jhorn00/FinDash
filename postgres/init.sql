-- Create users table
CREATE TABLE IF NOT EXISTS users
(
    id SERIAL PRIMARY KEY,
    username VARCHAR(40) NOT NULL,
    password VARCHAR(40) NOT NULL,
    CONSTRAINT unique_username UNIQUE (username)
);

-- Create generic entry for users
INSERT INTO users (id, username, password)
VALUES(1, 'generic_user', 'asdf1234') ON CONFLICT (id) DO NOTHING;

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts
(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (id) ON DELETE CASCADE,
    account_name VARCHAR(50) NOT NULL,
    CONSTRAINT unique_user_account UNIQUE (user_id, account_name)
);

-- Create generic entry for accounts
INSERT INTO accounts (user_id, account_name)
VALUES(1, 'Generic Account 1');

-- Create balances table
CREATE TABLE IF NOT EXISTS balances
(
    id SERIAL PRIMARY KEY,
    account_id INT REFERENCES accounts (id) ON DELETE CASCADE,
    date_val DATE NOT NULL,
    balance MONEY NOT NULL
    -- CONSTRAINT unique_account_dates UNIQUE (account_id, date_val)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions
(
    id SERIAL PRIMARY KEY,
    account_id INT REFERENCES accounts (id) ON DELETE CASCADE,
    date_val DATE NOT NULL,
    transaction_val MONEY NOT NULL
);

-- Create networths table
CREATE TABLE IF NOT EXISTS networths
(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (id) ON DELETE CASCADE,
    date_val DATE NOT NULL,
    transaction_val MONEY NOT NULL
);
