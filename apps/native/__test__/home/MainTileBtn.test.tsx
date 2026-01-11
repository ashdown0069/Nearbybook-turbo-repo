import MainTileBtn from "@/components/MainTileBtn";
import { render, screen } from "@testing-library/react-native";
import { SearchCheck } from "lucide-react-native";

jest.mock("lucide-react-native", () => {
  const MockIcon = ({ testID }: { testID: string }) => {
    const { View } = require("react-native");
    return <View testID={testID} />;
  };

  return {
    SearchCheck: MockIcon,
  };
});

describe("<SearchTipItem /> Component", () => {
  it("renders correctly", async () => {
    render(
      <MainTileBtn
        BtnText="button text"
        Icon={<SearchCheck testID="mock-icon" />}
      />,
    );
    const Btn = screen.getByText("button text");
    expect(Btn).toBeOnTheScreen();

    const Icon = await screen.findByTestId("mock-icon");
    expect(Icon).toBeOnTheScreen();
  });
});
