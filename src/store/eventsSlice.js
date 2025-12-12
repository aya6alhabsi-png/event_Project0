import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Use Render URL in production via env var, fallback to localhost for local dev
const API_URL =
  process.env.REACT_APP_API_URL?.trim() || "http://localhost:5000";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/events`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.msg || err?.message || "Failed to load events"
      );
    }
  }
);

export const addEvent = createAsyncThunk(
  "events/addEvent",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/addEvent`, data, {
        headers: authHeader(),
      });
      return res.data.event;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.msg || err?.message || "Failed to add event"
      );
    }
  }
);

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/updateEvent/${id}`, data, {
        headers: authHeader(),
      });
      return res.data.event;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.msg || err?.message || "Failed to update event"
      );
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/deleteEvent/${id}`, {
        headers: authHeader(),
      });
      return id;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.msg || err?.message || "Failed to delete event"
      );
    }
  }
);

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    builder.addCase(addEvent.fulfilled, (state, action) => {
      state.list.push(action.payload);
    });

    builder.addCase(updateEvent.fulfilled, (state, action) => {
      const updated = action.payload;
      const index = state.list.findIndex((e) => e._id === updated._id);
      if (index !== -1) state.list[index] = updated;
    });

    builder.addCase(deleteEvent.fulfilled, (state, action) => {
      state.list = state.list.filter((e) => e._id !== action.payload);
    });
  },
});

export default eventsSlice.reducer;
