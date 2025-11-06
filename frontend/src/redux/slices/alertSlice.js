import { createSlice } from "@reduxjs/toolkit";

const alertSlice = createSlice({
  name: "alerts",
  initialState: { list: [] },
  reducers: {
    setAlerts: (state, action) => { state.list = action.payload; },
    deleteAlert: (state, action) => {
      state.list = state.list.filter((a) => a._id !== action.payload);
    },
  },
});

export const { setAlerts, deleteAlert } = alertSlice.actions;
export default alertSlice.reducer;
