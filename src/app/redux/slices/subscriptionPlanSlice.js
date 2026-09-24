import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "@/app/config/api";

export const fetchSubscriptionPlans = createAsyncThunk("subscriptionPlans/fetchAll", () => apiRequest("/commerce/admin/subscription-plans"));
export const createSubscriptionPlan = createAsyncThunk("subscriptionPlans/create", (payload) => apiRequest("/commerce/admin/subscription-plans", { method: "POST", body: JSON.stringify(payload) }));
export const updateSubscriptionPlan = createAsyncThunk("subscriptionPlans/update", ({ id, payload }) => apiRequest(`/commerce/admin/subscription-plans/${id}`, { method: "PATCH", body: JSON.stringify(payload) }));
export const deleteSubscriptionPlan = createAsyncThunk("subscriptionPlans/delete", (id) => apiRequest(`/commerce/admin/subscription-plans/${id}`, { method: "DELETE" }).then(() => id));

const replaceItem = (items, item) => items.map((current) => (current._id === item._id ? item : current));
const subscriptionPlansSlice = createSlice({
  name: "subscriptionPlans",
  initialState: { items: [], loading: false, saving: false, error: null },
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(fetchSubscriptionPlans.pending, (state) => { state.loading = true; state.error = null; })
    .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => { state.loading = false; state.items = action.payload.data?.plans ?? []; })
    .addCase(fetchSubscriptionPlans.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
    .addCase(createSubscriptionPlan.pending, (state) => { state.saving = true; state.error = null; })
    .addCase(createSubscriptionPlan.fulfilled, (state, action) => { state.saving = false; const plan = action.payload.data?.plan; if (plan) state.items.unshift(plan); })
    .addCase(updateSubscriptionPlan.pending, (state) => { state.saving = true; state.error = null; })
    .addCase(updateSubscriptionPlan.fulfilled, (state, action) => { state.saving = false; const plan = action.payload.data?.plan; if (plan) state.items = replaceItem(state.items, plan); })
    .addCase(deleteSubscriptionPlan.fulfilled, (state, action) => { state.items = state.items.filter((item) => item._id !== action.payload); })
    .addMatcher((action) => action.type.startsWith("subscriptionPlans/") && action.type.endsWith("/rejected"), (state, action) => { state.saving = false; state.error = action.error.message; }),
});
export default subscriptionPlansSlice.reducer;