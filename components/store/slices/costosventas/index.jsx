import React from 'react';
import { createSlice } from "@reduxjs/toolkit";

export const datosSliceCostosVentas = createSlice({
    name: "datoscostosventas",
    initialState: {
        datoscostosventas: []
    },
    reducers: {
        setDatosCostosVentas: (state, action) => {
            state.datoscostosventas = action.payload;
        }
    },
})

export default datosSliceCostosVentas.reducer;

export const { setDatosCostosVentas } = datosSliceCostosVentas.actions;
