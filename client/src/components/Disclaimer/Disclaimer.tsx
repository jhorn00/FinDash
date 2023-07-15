import React from "react";
import "./Disclaimer.css";

function Disclaimer() {
  return (
    <div className="disclaimer">
      <div className="disclaimer-heading">Disclaimer: </div>
      <p className="disclaimer-text">
        This application is a work-in-progress and is hosted for demonstration
        purposes only.{" "}
        <a href="https://github.com/jhorn00" style={{ textDecoration: "none" }}>
          The author of this application{" "}
        </a>
        bears no responsibility for any use of this application with real
        financial data.
      </p>
      <p className="disclaimer-text">
        Therefore, it is recommended to upload only fake data. For real
        transaction data, please self-host FinDash on a development or local
        release environment.
      </p>
    </div>
  );
}

export default Disclaimer;
