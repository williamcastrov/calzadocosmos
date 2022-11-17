import React from 'react';
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const productsSlice = createSlice({
    name: "productos",
    initialState: {
        products: []
    },
    reducers: {
        setProductsList: (state, action) => {
            state.products = action.payload;
        }
    },
})

export default productsSlice.reducer;

export const { setProductsList } = productsSlice.actions;

export const fetchProducts = () => (dispatch) => {
    axios
        .get("https://cosmos.aal-cloud.com/api/v1/products/index")
        .then((response) => {
            dispatch(setProductsList(response.data));
        })
        .catch((error) => console.log(error));
};