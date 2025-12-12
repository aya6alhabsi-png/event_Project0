import ShowEvents from "../components/ShowEvents";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

jest.mock("../store/eventsSlice", () => ({
  fetchEvents: () => ({ type: "events/fetchEvents" }),
}));

jest.mock("../assets/logo.jpg", () => "logo.jpg");

const mockStore = configureStore([]);

const store = mockStore({
  auth: {
    user: { role: "user" },
    status: "idle",
    error: null,
  },
  events: {
    list: [],
    status: "idle",
    error: null,
  },
});

test("To test the UI of ShowEvents.js", () => {
  const { container } = render(
    <Provider store={store}>
      <BrowserRouter>
        <ShowEvents />
      </BrowserRouter>
    </Provider>
  );

  expect(container).toMatchSnapshot();
});
