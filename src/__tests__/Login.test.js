import { render, screen } from "@testing-library/react";
import Login from "../components/Login";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

// ✅ must match the import inside Login.js: ../store/authSlice
jest.mock("../store/authSlice", () => ({
  login: () => ({ unwrap: () => Promise.resolve() }),
}));

test("Login page renders email, password and login button", () => {
  const store = configureStore({
    reducer: {
      auth: () => ({ status: "idle", error: null, user: null }),
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
});
