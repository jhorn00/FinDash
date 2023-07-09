import { keys } from "../keys";
import { Pool } from "pg";

// Postgres client setup
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: Number(keys.pgPort) // TODO: CHANGE THIS
});

// This happens each time there is a connection
pgClient.on("connect", client => {
  console.log("\nCONNECTION\n");
});

export default pgClient;
