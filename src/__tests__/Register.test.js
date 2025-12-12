import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Register from "../components/Register";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

// ✅ must match the import inside Register.js: ../store/authSlice
jest.mock("../store/authSlice", () => ({
  registerUser: () => ({ unwrap: () => Promise.resolve() }),
}));

test("Register shows validation errors when empty", async () => {
  const store = configureStore({
    reducer: {
      auth: () => ({ status: "idle", error: null, user: null }),
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    </Provider>
  );

  await userEvent.click(screen.getByRole("button", { name: /register/i }));

  expect(await screen.findByText(/name can't be empty/i)).toBeInTheDocument();
  expect(await screen.findByText(/email can't be empty/i)).toBeInTheDocument();
  expect(await screen.findByText(/password can't be empty/i)).toBeInTheDocument();
});
