import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingSpinner from "../LoadingSpinner";
import "@testing-library/jest-dom";

describe("LoadingSpinner 컴포넌트", () => {
  it("스피너 SVG를 렌더링해야 한다", () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("spinner");
  });
});
