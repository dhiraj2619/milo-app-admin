import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "@/app/config/api";
export const fetchCoinPackages = createAsyncThunk("coinPackages/fetch", () =>
  apiRequest("/commerce/coin-packages"),
);
const slice = createSlice({
  name: "coinPackages",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) =>
    b
      .addCase(fetchCoinPackages.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchCoinPackages.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload.data || a.payload;
      })
      .addCase(fetchCoinPackages.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message;
      }),
});
export default slice.reducer;
