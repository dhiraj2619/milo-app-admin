import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "@/app/config/api";

export const fetchSubscriptionPlans = createAsyncThunk(
  "subscriptionPlans/fetchAll",
  async () => apiRequest("/commerce/subscription-plans"),
);

export const createSubscriptionPlan = createAsyncThunk(
  "subscriptionPlans/create",
  async (payload) => apiRequest("/commerce/admin/subscription-plans", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
);

const subscriptionPlansSlice = createSlice({
  name: "subscriptionPlans",
  initialState: { items: [], loading: false, saving: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionPlans.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => { state.loading = false; state.items = action.payload.data?.plans ?? []; })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(createSubscriptionPlan.pending, (state) => { state.saving = true; state.error = null; })
      .addCase(createSubscriptionPlan.fulfilled, (state, action) => { state.saving = false; const plan = action.payload.data?.plan; if (plan) state.items.unshift(plan); })
      .addCase(createSubscriptionPlan.rejected, (state, action) => { state.saving = false; state.error = action.error.message; });
  },
});

export default subscriptionPlansSlice.reducer;