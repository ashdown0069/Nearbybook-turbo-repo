import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PaginationWithIcon from "../_components/Pagination";
import "@testing-library/jest-dom";

// Mock next/link to prevent navigation errors in jsdom
jest.mock("next/link", () => {
  return ({ children, href, ...rest }: any) => {
    return (
      <a
        href={href}
        {...rest}
        onClick={(e) => {
          e.preventDefault();
          // If there's an original onClick handler, call it
          if (rest.onClick) rest.onClick(e);
        }}
      >
        {children}
      </a>
    );
  };
});

describe("PaginationWithIcon", () => {
  const createPageUrlFn = jest.fn().mockReturnValue("returnPageUrl");
  beforeEach(() => {
    createPageUrlFn.mockClear();
  });

  it("render pagination component correctly", () => {
    render(
      <PaginationWithIcon
        totalPages={10}
        currentPage={3}
        createPageUrl={createPageUrlFn}
      />,
    );

    const currentPageLink = screen.getByText("3");
    expect(currentPageLink).toBeInTheDocument();
  });

  it("calls onPageChange when a specific page number is clicked", async () => {
    const user = userEvent.setup();
    render(
      <PaginationWithIcon
        totalPages={10}
        currentPage={3}
        createPageUrl={createPageUrlFn}
      />,
    );

    const page5Link = screen.getByText("5");
    await user.click(page5Link);
    expect(createPageUrlFn).toHaveBeenCalled();
  });

  it("calls onPageChange when the buttons is clicked", async () => {
    const user = userEvent.setup();
    render(
      <PaginationWithIcon
        totalPages={10}
        currentPage={3}
        createPageUrl={createPageUrlFn}
      />,
    );

    const nextPageButton = screen.getByLabelText("Go to next page");
    const previousPageButton = screen.getByLabelText("Go to previous page");
    const firstPageButton = screen.getByLabelText("Go to first page");
    const lastPageButton = screen.getByLabelText("Go to last page");
    await user.click(firstPageButton);
    expect(createPageUrlFn).toHaveBeenCalled();

    await user.click(lastPageButton);
    expect(createPageUrlFn).toHaveBeenCalled();

    await user.click(nextPageButton);
    expect(createPageUrlFn).toHaveBeenCalled();

    await user.click(previousPageButton);
    expect(createPageUrlFn).toHaveBeenCalled();
  });
});
