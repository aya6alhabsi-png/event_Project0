import { render, screen } from "@testing-library/react";
import ShowEvents from "../components/ShowEvents";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

// ✅ must match the import inside ShowEvents.js: ../store/eventsSlice
jest.mock("../store/eventsSlice", () => ({
  fetchEvents: () => ({ type: "events/fetchEvents" }),
}));

// ✅ ShowEvents imports: ../assets/logo.jpg
jest.mock("../assets/logo.jpg", () => "logo.jpg");

test("ShowEvents displays event title from state", () => {
  const store = configureStore({
    reducer: {
      auth: () => ({ user: { name: "User", role: "user" } }),
      events: () => ({
        list: [{ _id: "1", title: "Hackathon" }],
        status: "idle",
        error: null,
      }),
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <ShowEvents />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByText("Hackathon")).toBeInTheDocument();
});
