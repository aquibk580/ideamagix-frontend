import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type PatientState = {
  patient: boolean;
  patientId: string;
};

const initialState: PatientState = {
  patient: false,
  patientId: "",
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    setpatient: (state, action: PayloadAction<PatientState>) => {
      state.patient = action.payload.patient;
      state.patientId = action.payload.patientId;
    },
  },
});

export const { setpatient } = patientSlice.actions;
export default patientSlice.reducer;
