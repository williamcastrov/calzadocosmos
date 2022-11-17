import React from 'react';
import { createSlice } from "@reduxjs/toolkit";

export const datosSlice = createSlice({
    name: "datosuser",
    initialState: {
        datosuser: []
    },
    reducers: {
        setDatosUser: (state, action) => {
            state.datosuser = action.payload;
        }
    },
})

export default datosSlice.reducer;

export const { setDatosUser } = datosSlice.actions;
