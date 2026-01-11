import SearchTipItem from "@/components/Search/SearchTipItem";
import { render, screen } from "@testing-library/react-native";

describe("<SearchTipItem /> Component", () => {
  it("renders correctly", () => {
    render(<SearchTipItem>this is tip</SearchTipItem>);
    const text = screen.getByText("this is tip");
    expect(text).toBeOnTheScreen();
  });
});
