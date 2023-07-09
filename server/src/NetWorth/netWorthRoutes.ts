import pgClient from "../Postgres/postgresClient";
import express from "express";
import { getUserFromUsername } from "../User/userUtils";
const netWorthRouter = express.Router();

// Get Net Worth range
netWorthRouter.get("/", async (req, res) => {
    const getTimeRangeQuery = (userId: number, interval: number, unit: string) => {
      var intervalQuery: string;
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
          FROM networths
          WHERE user_id = $1
            AND date_val >= (SELECT MAX(date_val) FROM networths) - ${intervalQuery}
            AND date_val <= (SELECT MAX(date_val) FROM networths)
          ORDER BY date_val ASC;
        `,
        values: [userId]
      };
    };
    
    // Set query variables
    const username = "generic_user";
    const user = await getUserFromUsername(username);

    const user_id = user.id; // TODO: set real users
    
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
  
    // Send query
    const query = getTimeRangeQuery(user_id, interval, unit);
    try {
      const { rows } = await pgClient.query(query);
      res.json(rows);
    } catch (error) {
      console.error("Error fetching networths:", error);
      res.status(500).json({ error: "An error occurred while fetching networths." });
    }
});
  
// get the networths
netWorthRouter.get("/all", async (req, res) => {
    // Set query variables
    const username = "generic_user";
    const user = await getUserFromUsername(username);
  
    const user_id = user.id; // TODO: set real users

    const { rows } = await pgClient.query("SELECT * FROM networths WHERE user_id = $1 ORDER BY date_val ASC", [user_id]); // TODO: Real user implementation
    res.json(rows);
});

export default netWorthRouter;
