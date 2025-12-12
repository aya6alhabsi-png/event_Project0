import { render, screen } from "@testing-library/react";
import Header from "../components/Header";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

// ✅ must match the import inside Header.js: ../store/authSlice
jest.mock("../store/authSlice", () => ({
  logout: () => ({ type: "auth/logout" }),
}));

// ✅ Header imports: ../assets/logo.jpg
jest.mock("../assets/logo.jpg", () => "logo.jpg");

test("Header shows Logout button when user is logged in", () => {
  const store = configureStore({
    reducer: {
      auth: () => ({ user: { name: "Admin", role: "admin" } }),
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
});
