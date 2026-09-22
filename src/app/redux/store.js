import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./slices/dashboardSlice";
import usersReducer from "./slices/usersSlice";
import customersReducer from "./slices/customersSlice";
import subscriptionPlansReducer from "./slices/subscriptionPlanSlice";
import paymentsReducer from "./slices/paymentsSlice";
import coinPackagesReducer from "./slices/coinPackageSlice";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    users: usersReducer,
    customers: customersReducer,
    subscriptionPlans: subscriptionPlansReducer,
    payments: paymentsReducer,
    coinPackages: coinPackagesReducer,
  },
});