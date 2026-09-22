import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "@/app/config/api";
export const fetchDashboard = createAsyncThunk("dashboard/fetch", () =>
  apiRequest("/admin/dashboard"),
);
const slice = createSlice({
  name: "dashboard",
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (b) =>
    b
      .addCase(fetchDashboard.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (s, a) => {
        s.loading = false;
        s.data = a.payload.data || a.payload;
      })
      .addCase(fetchDashboard.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message;
      }),
});
export default slice.reducer;
