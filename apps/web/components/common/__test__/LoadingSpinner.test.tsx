import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingSpinner from "../LoadingSpinner";
import "@testing-library/jest-dom";

describe("LoadingSpinner component", () => {
  it("renders the spinner SVG", () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("spinner");
  });
});
