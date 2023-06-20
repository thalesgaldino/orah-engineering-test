import { render, fireEvent, screen } from "@testing-library/react";
import "shared/helpers/load-icons"
import { HomeBoardPage } from "src/staff-app/daily-care/home-board.page"

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

test("flipping the sorting criteria", () => {

  render(<HomeBoardPage />);

  const flipBtn = screen.getByTestId("test-id-flip");
  const flipLabelNode = screen.getByTestId("test-id-flip-label");

  fireEvent.click(flipBtn);

  expect(flipLabelNode.textContent).toBe("Last Name");
});