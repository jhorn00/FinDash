import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Navbar from "react-bootstrap/Navbar";
import { Accordion } from "react-bootstrap";

export function NavBar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Navbar>
      <a className="ml-2 " onClick={handleShow}>
        <svg viewBox="0 0 100 80" width="40" height="40">
          <rect width="100" height="10"></rect>
          <rect y="30" width="100" height="10"></rect>
          <rect y="60" width="100" height="10"></rect>
        </svg>
      </a>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="font-weight-bold">
            <a href="/" className="text-decoration-none text-black">
              FinDash
            </a>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Accordion className="shadow-none">
            <Accordion.Item eventKey="0" className="border-0 shadow-none">
              <Accordion.Header className="shadow-none">
                Profile
              </Accordion.Header>
              <Accordion.Body>
                <ul className="text-decoration-none list-unstyled">
                  <li>
                    <a
                      href="/profile"
                      className="text-decoration-none text-black"
                    >
                      Account Uploads
                    </a>
                  </li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1" className="border-0">
              <Accordion.Header>Finance Visualization</Accordion.Header>
              <Accordion.Body>
                <ul className="text-decoration-none list-unstyled">
                  <li>
                    <a
                      href="/networth"
                      className="text-decoration-none text-black"
                    >
                      Net Worth
                    </a>
                  </li>
                  <li>
                    <a
                      href="/balance"
                      className="text-decoration-none text-black"
                    >
                      Account Balances
                    </a>
                  </li>
                  <li>
                    <a
                      href="/monthlyexpenses"
                      className="text-decoration-none text-black"
                    >
                      Monthly Expenses
                    </a>
                  </li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>
            {/* Hold off on this until stock features are ready */}
            {/* <Accordion.Item eventKey="2" className="border-0">
              <Accordion.Header>Stocks</Accordion.Header>
              <Accordion.Body>Links related to stocks go here.</Accordion.Body>
            </Accordion.Item> */}
          </Accordion>
        </Offcanvas.Body>
      </Offcanvas>
    </Navbar>
  );
}
