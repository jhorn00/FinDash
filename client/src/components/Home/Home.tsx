import "./Home.css";

function Home() {
  return (
    <div className="home">
      <h1>FinDash</h1>
      <p>
        Containerized transaction-based data visualization application created
        and hosted in a short time-frame.
      </p>
      <h2>Usage</h2>
      <main>
        <section id="step1" className="section">
          <h3>Step 1: Obtain CSVs of acceptable format</h3>
          <p>
            The current acceptable format is a date column followed by a number
            column, no headers.
          </p>
          <a href="https://github.com/jhorn00/FinDash/tree/main/samples">
            Sample files can be found here.
          </a>
        </section>

        <section id="step2" className="section">
          <h3>Step 2: Upload samples</h3>
          <p>Let's upload some data for the server to process.</p>
          <ol>
            <li>Select menu icon in top left corner of application.</li>
            <li>Select the 'Profile' dropdown.</li>
            <li>Select 'Profile Settings'.</li>
            <li>
              <strong>[Optional]</strong> If you would like to test with only
              the data you are uploading, select 'Clear Database'.
              <br />
              <strong>
                Note: This will remove all existing accounts, requiring you to
                create a new one as described in part 7 of this Step.
              </strong>
            </li>
            <li>
              Select your file or files and enter a current balance for the
              account the represent.
            </li>
            <li>
              Click the dropdown for account selection and choose an available
              account.
            </li>
            <li>
              <strong>[Optional]</strong> Select 'New...' to create a new
              account and enter a name.
            </li>
            <li>Click 'Submit'.</li>
          </ol>
        </section>

        <section id="step3" className="section">
          <h3>Step 3: View available data</h3>
          <p>Now it's time to test some data visualization.</p>
          <ol>
            <li>Select menu icon in top left corner of application.</li>
            <li>Select the 'Finance Visualization' dropdown.</li>
            <li>Select desired visualization.</li>
            <li>
              Interact with available timeframes or account selections, where
              applicable.
            </li>
          </ol>
        </section>
      </main>
    </div>
  );
}

export default Home;
