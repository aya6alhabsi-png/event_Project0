import Login from "../components/Login";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "redux-mock-store";

jest.mock("../store/authSlice", () => ({
  login: () => ({ unwrap: () => Promise.resolve() }),
}));

const mockStore = configureStore([]);
const store = mockStore({
  auth: { user: null, status: "idle", error: null },
});

test("To get snapshot of Login.js UI", () => {
  const { container } = render(
    <Provider store={store}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );

  expect(container).toMatchSnapshot();
});