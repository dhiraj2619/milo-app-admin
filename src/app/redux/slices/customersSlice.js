import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "@/app/config/api";
export const fetchCustomers = createAsyncThunk("customers/fetch", () =>
  apiRequest("/admin/customers"),
);
const slice = createSlice({
  name: "customers",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) =>
    b
      .addCase(fetchCustomers.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload.data || a.payload;
      })
      .addCase(fetchCustomers.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message;
      }),
});
export default slice.reducer;
