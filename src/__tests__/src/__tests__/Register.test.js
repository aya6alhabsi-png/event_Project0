import Register from "../components/Register";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "redux-mock-store";

jest.mock("../store/authSlice", () => ({
  registerUser: () => ({ unwrap: () => Promise.resolve() }),
}));

const mockStore = configureStore([]);
const store = mockStore({
  auth: { user: null, status: "idle", error: null },
});

test("To test the UI of Register.js", () => {
  const { container } = render(
    <Provider store={store}>
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    </Provider>
  );

  expect(container).toMatchSnapshot();
});