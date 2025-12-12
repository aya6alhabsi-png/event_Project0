import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Use Render URL in production via env var, fallback to localhost for local dev
const API_URL =
  process.env.REACT_APP_API_URL?.trim() || "http://localhost:5000";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/userRegister`, {
        name,
        email,
        password,
      });

      if (!res.data || !res.data.user) {
        return rejectWithValue(res.data?.msg || "Register failed");
      }

      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.msg || err?.message || "Register failed"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password, role }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/userLogin`, {
        email,
        password,
        role,
      });

      if (!res.data.loginStatus) {
        return rejectWithValue(res.data.serverMsg || "Login failed");
      }

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.serverMsg || err?.message || "Login failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Register failed";
      });

    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
