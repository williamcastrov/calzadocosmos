import React from 'react';
import { createSlice } from "@reduxjs/toolkit";

export const ventasProductosSlice = createSlice({
    name: "ventasproductos",
    initialState: {
        ventasproductos: []
    },
    reducers: {
        setVentasProductos: (state, action) => {
            state.ventasproductos = action.payload;
        }
    },
})

export default ventasProductosSlice.reducer;

export const { setVentasProductos } = ventasProductosSlice.actions;
