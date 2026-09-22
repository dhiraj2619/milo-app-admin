import { apiRequest } from "@/app/config/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchSubscriptionPlans = createAsyncThunk(
  "subscriptionPlans/fetchAll",
  async () => apiRequest("/commerce/subscription-plans"),
);

export const createSubscriptionPlan = createAsyncThunk(
  "subscriptionPlans/create",
  async (payload) =>
    apiRequest("/commerce/admin/subscription-plans", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
);

const subscriptionPlansSlice = createSlice({
  name: "subscriptionPlans",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || action.payload;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default subscriptionPlansSlice.reducer;
