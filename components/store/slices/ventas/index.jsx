import React from 'react';
import { createSlice } from "@reduxjs/toolkit";

export const datosSliceVentas = createSlice({
    name: "datosventas",
    initialState: {
        datosventas: []
    },
    reducers: {
        setDatosVentas: (state, action) => {
            state.datosventas = action.payload;
        }
    },
})

export default datosSliceVentas.reducer;

export const { setDatosVentas } = datosSliceVentas.actions;
