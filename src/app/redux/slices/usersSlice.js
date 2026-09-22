import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "@/app/config/api";
export const fetchUsers = createAsyncThunk("users/fetch", () => apiRequest("/admin/users"));
const slice = createSlice({name:"users",initialState:{items:[],loading:false,error:null},reducers:{},extraReducers:b=>b.addCase(fetchUsers.pending,s=>{s.loading=true;s.error=null}).addCase(fetchUsers.fulfilled,(s,a)=>{s.loading=false;s.items=a.payload.data||a.payload}).addCase(fetchUsers.rejected,(s,a)=>{s.loading=false;s.error=a.error.message})});
export default slice.reducer;