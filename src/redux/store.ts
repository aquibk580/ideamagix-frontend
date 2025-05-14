import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import doctorReducer from "./slices/doctorSlice";
import patientReducer from "./slices/patientSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    doctor: doctorReducer,
    patient: patientReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
