import React from 'react';
import { createSlice } from "@reduxjs/toolkit";

export const customHeaders = {
    Accept: "application/json",
};

export const datosSlice = createSlice({
    name: "datosdashboard",
    initialState: {
        datosdashboard: []
    },
    reducers: {
        setDatosDashBoardPeriod: (state, action) => {
            state.datosdashboard = action.payload;
        }
    },
})

export default datosSlice.reducer;

export const { setDatosDashBoardPeriod } = datosSlice.actions;
