import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "@/app/config/api";
export const fetchPayments = createAsyncThunk("payments/fetch", () => apiRequest("/admin/payments"));
const slice = createSlice({name:"payments",initialState:{items:[],loading:false,error:null},reducers:{},extraReducers:b=>b.addCase(fetchPayments.pending,s=>{s.loading=true;s.error=null}).addCase(fetchPayments.fulfilled,(s,a)=>{s.loading=false;s.items=a.payload.data||a.payload}).addCase(fetchPayments.rejected,(s,a)=>{s.loading=false;s.error=a.error.message})});
export default slice.reducer;