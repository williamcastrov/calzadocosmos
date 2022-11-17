import React from 'react';
import { createSlice } from "@reduxjs/toolkit";

export const datosSliceFiltros = createSlice({
    name: "datosfiltros",
    initialState: {
        datosfiltros: []
    },
    reducers: {
        setDatosFiltros: (state, action) => {
            state.datosfiltros = action.payload;
        }
    },
})

export default datosSliceFiltros.reducer;

export const { setDatosFiltros } = datosSliceFiltros.actions;
