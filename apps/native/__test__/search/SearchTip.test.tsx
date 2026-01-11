import SearchTip from "@/components/Search/SearchTip";
import SearchTipItem from "@/components/Search/SearchTipItem";
import { render, screen } from "@testing-library/react-native";

describe("<SearchTip /> Component", () => {
  it("renders correctly", () => {
    render(<SearchTip />);
    const tipTitle = screen.getByText("💡 검색 팁");
    expect(tipTitle).toBeOnTheScreen();

    const tipLastContent = screen.getByText("ISBN(13자리)");
    expect(tipLastContent).toBeOnTheScreen();
  });
});
