import { useState, useCallback } from "react";
import axios from "axios";
import TimeframeSwitch from "../../functions/TimeframeSwitch";
import { LineGraph } from "../LineGraph/LineGraph";
import { processNetWorth } from "../../functions/ProcessNetWorth";
import "./NetWorth.css";
import { Moment } from "moment";

function NetWorth() {
  // Interface for timeframe selection
  interface Timeframe {
    interval: number;
    unit: string;
  }
  // Initial state for NetWorth database lists
  const initServerState = {
    xData: Array<Moment>(),
    yData: Array<number>(),
  };
  // NetWorth useState initialized with empty arrays
  const [netWorth, setNetWorth] = useState(initServerState);

  // Active button useState initialized with empty string so all buttons are unselected
  const [activeButton, setActiveButton] = useState("");

  const getRows = useCallback(async (timeframe: Timeframe) => {
    let newNetWorth = {
      xData: Array<Moment>(),
      yData: Array<number>(),
    };
    // If max was selected
    // TODO: Better way to denote max
    if (timeframe.interval === 12000) {
      // Get request for all values
      const response = await axios
        .get("/api/networths/all")
        .catch((error) => console.log(error));
      if (response) {
        const rows = response.data;
        console.log(rows);
        newNetWorth = processNetWorth(rows);
      }
    } else {
      // Get request with interval and unit
      const response = await axios
        .get("/api/networths", {
          params: {
            interval: timeframe.interval,
            unit: timeframe.unit,
          },
        })
        .catch((error) => console.log(error));
      if (response) {
        const rows = response.data;
        newNetWorth = processNetWorth(rows);
      }
    }

    setNetWorth(newNetWorth);
  }, []);

  // Update the netWorth arrays based on the selected timeframe
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
    setActiveButton(e.target.name);
  };

  return (
    <div className="net-worth">
      <div className="content">
        <div className="graph">
          <LineGraph
            // Title for Net worth graph
            plotLabel="Net Worth"
            // This will always be a list of dates provided by the DB
            xData={netWorth.xData}
            // This will always be a list of numbers provided by the DB
            yData={netWorth.yData}
          />
        </div>
        <div className="btn-group" role="group" aria-label="First group">
          <button
            name="1w"
            type="button"
            className={`btn ${
              activeButton === "1w"
                ? "btn-success selected"
                : "btn-outline-success"
            }`}
            onClick={handleTimeframeChange}
          >
            1w
          </button>
          <button
            name="1mo"
            type="button"
            className={`btn ${
              activeButton === "1mo"
                ? "btn-success selected"
                : "btn-outline-success"
            }`}
            onClick={handleTimeframeChange}
          >
            1mo
          </button>
          <button
            name="3mo"
            type="button"
            className={`btn ${
              activeButton === "3mo"
                ? "btn-success selected"
                : "btn-outline-success"
            }`}
            onClick={handleTimeframeChange}
          >
            3mo
          </button>
          <button
            name="6mo"
            type="button"
            className={`btn ${
              activeButton === "6mo"
                ? "btn-success selected"
                : "btn-outline-success"
            }`}
            onClick={handleTimeframeChange}
          >
            6mo
          </button>
          <button
            name="1yr"
            type="button"
            className={`btn ${
              activeButton === "1yr"
                ? "btn-success selected"
                : "btn-outline-success"
            }`}
            onClick={handleTimeframeChange}
          >
            1yr
          </button>
          <button
            name="2yr"
            type="button"
            className={`btn ${
              activeButton === "2yr"
                ? "btn-success selected"
                : "btn-outline-success"
            }`}
            onClick={handleTimeframeChange}
          >
            2yr
          </button>
          <button
            name="5yr"
            type="button"
            className={`btn ${
              activeButton === "5yr"
                ? "btn-success selected"
                : "btn-outline-success"
            }`}
            onClick={handleTimeframeChange}
          >
            5yr
          </button>
          <button
            name="10yr"
            type="button"
            className={`btn ${
              activeButton === "10yr"
                ? "btn-success selected"
                : "btn-outline-success"
            }`}
            onClick={handleTimeframeChange}
          >
            10yr
          </button>
          <button
            name="Max"
            type="button"
            className={`btn ${
              activeButton === "Max"
                ? "btn-success selected"
                : "btn-outline-success"
            }`}
            onClick={handleTimeframeChange}
          >
            Max
          </button>
        </div>
      </div>
    </div>
  );
}

export default NetWorth;
