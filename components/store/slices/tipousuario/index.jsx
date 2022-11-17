import React from 'react';
import { createSlice } from "@reduxjs/toolkit";

export const SliceTipoUsuario = createSlice({
    name: "tipousuario",
    initialState: {
        tipousuario: []
    },
    reducers: {
        setTipoUsuario: (state, action) => {
            state.tipousuario = action.payload;
        }
    },
})

export default SliceTipoUsuario.reducer;

export const { setTipoUsuario } = SliceTipoUsuario.actions;
