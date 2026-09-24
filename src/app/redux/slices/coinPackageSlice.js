import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "@/app/config/api";

export const fetchCoinStores = createAsyncThunk("coinStores/fetchAll", () => apiRequest("/commerce/admin/coin-store"));
export const createCoinStore = createAsyncThunk("coinStores/create", (payload) => apiRequest("/commerce/admin/coin-store", { method: "POST", body: JSON.stringify(payload) }));
export const updateCoinStore = createAsyncThunk("coinStores/update", ({ id, payload }) => apiRequest(`/commerce/admin/coin-store/${id}`, { method: "PATCH", body: JSON.stringify(payload) }));
export const deleteCoinStore = createAsyncThunk("coinStores/delete", (id) => apiRequest(`/commerce/admin/coin-store/${id}`, { method: "DELETE" }).then(() => id));

const replaceItem = (items, item) => items.map((current) => (current._id === item._id ? item : current));
const coinStoreSlice = createSlice({
  name: "coinStores",
  initialState: { items: [], loading: false, saving: false, error: null },
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(fetchCoinStores.pending, (state) => { state.loading = true; state.error = null; })
    .addCase(fetchCoinStores.fulfilled, (state, action) => { state.loading = false; state.items = action.payload.data?.coinStores ?? []; })
    .addCase(fetchCoinStores.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
    .addCase(createCoinStore.pending, (state) => { state.saving = true; state.error = null; })
    .addCase(createCoinStore.fulfilled, (state, action) => { state.saving = false; const item = action.payload.data?.coinStore; if (item) state.items.unshift(item); })
    .addCase(updateCoinStore.pending, (state) => { state.saving = true; state.error = null; })
    .addCase(updateCoinStore.fulfilled, (state, action) => { state.saving = false; const item = action.payload.data?.coinStore; if (item) state.items = replaceItem(state.items, item); })
    .addCase(deleteCoinStore.fulfilled, (state, action) => { state.items = state.items.filter((item) => item._id !== action.payload); })
    .addMatcher((action) => action.type.startsWith("coinStores/") && action.type.endsWith("/rejected"), (state, action) => { state.saving = false; state.error = action.error.message; }),
});
export default coinStoreSlice.reducer;