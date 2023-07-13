import { useState, useCallback, useEffect, ChangeEvent } from "react";
import axios from "axios";
import TimeframeSwitch from "../../functions/TimeframeSwitch";
import { LineGraph } from "../LineGraph/LineGraph";
import "./Balance.css";
import { Moment } from "moment";
import { Form, Row, Col } from "react-bootstrap";
import { processBalance } from "../../functions/ProcessBalance";

function Balance() {
  // Form state
  const [selectedAccount, setSelectedAccount] = useState<string>("");

  const [accountOptions, setAccountOptions] = useState<string[]>([]);
  useEffect(() => {
    fetchNames(); // Call the function to fetch the names when the component mounts
  }, []);

  const fetchNames = async () => {
    try {
      const response = await axios.get("/api/accounts/names");
      const accountNames = response.data; // Assuming the response data is an array of names
      setAccountOptions(accountNames);
    } catch (error) {
      console.log(error);
    }
  };

  // Balance text field handling
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedAccount(e.target.value);
  };

  // Interface for timeframe selection
  interface Timeframe {
    interval: number;
    unit: string;
  }
  // Initial state for Balance database lists
  const initServerState = {
    xData: Array<Moment>(),
    yData: Array<number>(),
  };
  // balance useState initialized with empty arrays
  const [balance, setBalance] = useState(initServerState);

  const getRows = useCallback(
    async (timeframe: Timeframe) => {
      let newBalance = {
        xData: Array<Moment>(),
        yData: Array<number>(),
      };
      // If max was selected
      // TODO: Better way to denote max
      if (timeframe.interval === 12000) {
        // Get request for all values
        const response = await axios
          .get("/api/balances/all", {
            params: {
              accountName: selectedAccount,
            },
          })
          .catch((error) => console.log(error));
        if (response) {
          const rows = response.data;
          console.log(rows);
          newBalance = processBalance(rows);
        }
      } else {
        // Get request with interval and unit
        const response = await axios
          .get("/api/balances", {
            params: {
              interval: timeframe.interval,
              unit: timeframe.unit,
              accountName: selectedAccount,
            },
          })
          .catch((error) => console.log(error));
        if (response) {
          const rows = response.data;
          console.log(rows);
          newBalance = processBalance(rows);
        }
      }

      setBalance(newBalance);
    },
    [selectedAccount]
  );

  // Update the Balance arrays based on the selected timeframe
  const handleTimeframeChange = (e: any) => {
    // Get target interval and units
    const timeframe = TimeframeSwitch(e);
    // If timeframe was invalid
    if (timeframe.interval < 0) {
      console.log("Timeframe interval is invalid.");
      return;
    }
    if (timeframe.unit !== "weeks" && timeframe.unit !== "months") {
      console.log("Timeframe unit is invalid.");
      return;
    }
    getRows(timeframe);
  };

  return (
    <div className="balance">
      <div className="content">
        <div className="graph">
          <LineGraph
            // Title for Balance graph
            plotLabel="Balance"
            // This will always be a list of dates provided by the DB
            xData={balance.xData}
            // This will always be a list of numbers provided by the DB
            yData={balance.yData}
          />
        </div>
        <div className="btn-group" role="group" aria-label="First group">
          <button
            name="1w"
            type="button"
            className="btn btn-outline-success"
            onClick={handleTimeframeChange}
          >
            1w
          </button>
          <button
            name="1mo"
            type="button"
            className="btn btn-outline-success"
            onClick={handleTimeframeChange}
          >
            1mo
          </button>
          <button
            name="3mo"
            type="button"
            className="btn btn-outline-success"
            onClick={handleTimeframeChange}
          >
            3mo
          </button>
          <button
            name="6mo"
            type="button"
            className="btn btn-outline-success"
            onClick={handleTimeframeChange}
          >
            6mo
          </button>
          <button
            name="1yr"
            type="button"
            className="btn btn-outline-success"
            onClick={handleTimeframeChange}
          >
            1yr
          </button>
          <button
            name="2yr"
            type="button"
            className="btn btn-outline-success"
            onClick={handleTimeframeChange}
          >
            2yr
          </button>
          <button
            name="5yr"
            type="button"
            className="btn btn-outline-success"
            onClick={handleTimeframeChange}
          >
            5yr
          </button>
          <button
            name="10yr"
            type="button"
            className="btn btn-outline-success"
            onClick={handleTimeframeChange}
          >
            10yr
          </button>
          <button
            name="Max"
            type="button"
            className="btn btn-outline-success"
            onClick={handleTimeframeChange}
          >
            Max
          </button>
        </div>
        <Form>
          <Form.Group as={Row} className="mb-3" controlId="upload-form">
            <Form.Label column sm="3">
              Select Account
            </Form.Label>
            <Col sm="9">
              <Form.Control
                as="select"
                name="selectedAccount"
                value={selectedAccount}
                onChange={handleChange}
              >
                <option value="">Select Account</option>
                {accountOptions.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </Form.Control>
            </Col>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}

export default Balance;
