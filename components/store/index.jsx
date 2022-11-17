import { configureStore } from '@reduxjs/toolkit';
import productos from "./slices/productos";
import datosdashboard from "./slices/datosdashboard";
import datosuser from "./slices/users";
import datosventas from "./slices/ventas";
import costosventas from "./slices/costosventas";
import ventasproductos from "./slices/ventasproductos";
import datosfiltros from "./slices/datosfiltros";
import filtrosventas from "./slices/filtrosventas";

export default configureStore({
  reducer: {
    productos,
    datosdashboard,
    datosuser,
    datosventas,
    costosventas,
    ventasproductos,
    datosfiltros,
    filtrosventas
  }
});