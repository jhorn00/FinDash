import pgClient from "../Postgres/postgresClient";

interface UserType {
    id: number;
    username: string;
    password: string;
}

async function getUserFromUsername(username: string) {
    // TODO: Error checking for this query
    // Get user id from username
    const userIdResults = await pgClient.query("SELECT * FROM users WHERE username = $1", [username]);
    const userRows = userIdResults.rows.map((row): UserType => ({
        id: row.id,
        username: row.username,
        password: row.password
    }));

    // TODO: if there is more than one row there is an issue and it should be handled

    const user = userRows[0];

    return user;
}

export { getUserFromUsername, UserType }