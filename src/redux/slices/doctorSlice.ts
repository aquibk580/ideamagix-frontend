import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type DoctorState = {
  doctor: boolean;
  doctorId: string;
};

const initialState: DoctorState = {
  doctor: false,
  doctorId: "",
};

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    setDoctor: (state, action: PayloadAction<DoctorState>) => {
      state.doctor = action.payload.doctor;
      state.doctorId = action.payload.doctorId;
    },
  },
});

export const { setDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;
