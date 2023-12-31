import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "./mock/matchMedia.mock";
import Home from "../src/components/Home/Home";

// This is just a test.......... test.
test("renders home page and checks for FinDash", () => {
  render(<Home />);
  // Check that home has the text "FinDash" in it
  const elementsWithText = screen.getAllByText(/FinDash/i);
  expect(elementsWithText.length).toBeGreaterThan(0);
});
