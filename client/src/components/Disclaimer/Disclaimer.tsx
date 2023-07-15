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
          The author{" "}
        </a>
        of this application is not responsible for any use of this application
        with real financial data, nor do they want your financial information.
      </p>
      <p className="disclaimer-text">
        It is recommended to only upload fake data, as anyone with the link can
        view your dates/transactions. For real transaction data, please
        self-host FinDash on a development environment or local release
        environment.
      </p>
    </div>
  );
}

export default Disclaimer;
