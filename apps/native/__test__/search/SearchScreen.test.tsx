import SearchScreen from "@/app/(root)/search";
import SearchTipItem from "@/components/Search/SearchTipItem";
import { render, screen } from "@testing-library/react-native";

describe("<SearchScreen /> Component", () => {
  it("renders correctly", () => {
    render(<SearchScreen />);
  });
});
