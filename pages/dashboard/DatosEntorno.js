import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loading";
const URL_SERVICE = "https://api.aal-cloud.com/api/cosmos";
import { setDatosDashBoardPeriod } from "../../components/store/slices/datosdashboard";
import { setDatosUser } from "../../components/store/slices/users";
import { setDatosVentas } from "../../components/store/slices/ventas";
import { setDatosCostosVentas } from "../../components/store/slices/costosventas";
import { setVentasProductos } from "../../components/store/slices/ventasproductos";
import HomeVentas from './HomeVentas';

function DatosEntorno(props) {
  const router = useRouter();
  const { datUsuario } = props;
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch();
  const [opcion, setOpcion] = useState(0)
  const [datos, setDatos] = useState(0)
  const [datosCostos, setDatosCostos] = useState(null)
  const [ventasDiariasMes, setVentasDiariasMes] = useState(null)
  const [ventasDiariasMesSubcategoria, setVentasDiariasMesSubcategoria] = useState(null)
  const [vtasProductos, setVtasProductos] = useState(null)
  const [detalleVtas, setDetalleVtas] = useState(null)
  const [listaPrecios, setListaPrecios] = useState(null)
  const [listaPresupuestos, setListaPresupuestos] = useState(null)
  let tipousuario = 4;

  const totalventas = useSelector((state) => state.datosdashboard.datosdashboard.ventas_periodo);
  //tipousuario = useSelector((state) => state.tipousuario.tipousuario);

  useEffect(() => {
    //tipousuario = JSON.parse(localStorage.getItem("tipousuario"));
    // Debemos validar el tipo de usuario y cargar datos iniciales al state

    // Datos de ventas
    //Tipos de usuarios 1 = Compras, 4 = Ventas, 3 = Operaciones, 2 = Gerencia
    if (tipousuario === 4) {
      // Lee datos de ventas, ventas diarias y acumuladas por periodo y total corrido del año

      axios({
        method: "post",
        url: `${URL_SERVICE}/6`,
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => {
          if (res.status == 200) {
            //console.log("RETORNA API INIT VENTAS: ", res.data)
            if (res.data) {
              dispatch(setDatosVentas(res.data));
              setDatos(res.data);
              cargaOpcion(tipousuario)
            } else {
              console.log("RETORNA API VENTAS: ", "ERROR")
            }

          } else {
            console.log("RETORNA API VENTAS: ", "ERROR")
          }
        })
        .catch((error) =>
          alert("Error Inesperado 0")
        )

      // Lee ventas diarias acumuladas por centro
      axios({
        method: "post",
        url: `${URL_SERVICE}/7`,
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => {
          if (res.status == 200) {
            //console.log("RETORNA API INIT VENTAS: ", res.data)
            if (res.data) {
              setVentasDiariasMes(res.data);
              cargaOpcion(tipousuario)
            } else {
              console.log("RETORNA API VENTAS DIARIAS MES: ", "ERROR")
            }

          } else {
            console.log("RETORNA API VENTAS DIARIAS MES: ", "ERROR")
          }
        })
        .catch((error) =>
          alert("Error Inesperado 1")
        )

      // Lee ventas diarias acumuladas por subcategorias
      axios({
        method: "post",
        url: `${URL_SERVICE}/9`,
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => {
          if (res.status == 200) {
            //console.log("VENTAS DIARIAS MES SUBCATEGORIAS: ", res.data)
            if (res.data) {
              setVentasDiariasMesSubcategoria(res.data);
              cargaOpcion(tipousuario)
            } else {
              console.log("VENTAS DIARIAS MES SUBCATEGORIAS: ", "ERROR")
            }

          } else {
            console.log("VENTAS DIARIAS MES SUBCATEGORIAS: ", "ERROR")
          }
        })
        .catch((error) =>
          alert("Error Inesperado 1")
        )

      // Lee datos costos de ventas, costos del mes y costos acumuladas total corrido del año
      axios({
        method: "post",
        url: `${URL_SERVICE}/10`,
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => {
          if (res.status == 200) {
            //console.log("RETORNA COSTOS VENTAS: ", res.data)
            if (res.data) {
              dispatch(setDatosCostosVentas(res.data));
              setDatosCostos(res.data);
              cargaOpcion(tipousuario)
            } else {
              console.log("RETORNA COSTOS VTAS: ", "ERROR")
            }

          } else {
            console.log("RETORNA COSTOS VTAS: ", "ERROR")
          }
        })
        .catch((error) =>
          alert("Error Inesperado 2")
        )

      // Lee ventas por productos mes y acumulada para calcular la participacion

      axios({
        method: "post",
        url: `${URL_SERVICE}/11`,
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => {
          if (res.status == 200) {
            //console.log("RETORNA VENTAS PRODUCTOS: ", res.data)
            if (res.data) {
              dispatch(setVentasProductos(res.data));
              setVtasProductos(res.data);
              cargaOpcion(tipousuario)
            } else {
              console.log("RETORNA VTAS PRODUCTOS: ", "ERROR")
            }

          } else {
            console.log("RETORNA VTAS PRODUCTOS: ", "ERROR")
          }
        })
        .catch((error) =>
          alert("Error Inesperado 3")
        )
      // Detalle datos de ventas para aplicar filtros
      axios({
        method: "post",
        url: `${URL_SERVICE}/8`,
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => {
          if (res.status == 200) {
            //console.log("RETORNA VENTAS RESUMEN: ", res.data)
            if (res) {
              setDetalleVtas(res.data);
              //localStorage.setItem('detalledatosvtas', JSON.stringify(datos));
              cargaOpcion(tipousuario)
            } else {
              console.log("RETORNA VTAS DETALLE: ", "ERROR")
            }

          } else {
            console.log("RETORNA VTAS DETALLE: ", "ERROR")
          }
        })
        .catch((error) =>
          alert("Error Inesperado 4")
        )

      // Datos listas de precios
      axios({
        method: "post",
        url: `${URL_SERVICE}/15`,
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => {
          if (res.status == 200) {
            //console.log("RETORNA VENTAS RESUMEN: ", res.data)
            if (res) {
              setListaPrecios(res.data);
              //localStorage.setItem('detalledatosvtas', JSON.stringify(datos));
              cargaOpcion(tipousuario)
            } else {
              console.log("RETORNA PRECIOS X LISTA: ", "ERROR")
            }

          } else {
            console.log("RETORNA PRECIOS X LISTA: ", "ERROR")
          }
        })
        .catch((error) =>
          alert("Error Inesperado 4")
        )

      // Datos Presupuestos
      axios({
        method: "post",
        url: `${URL_SERVICE}/18`,
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => {
          if (res.status == 200) {
            //console.log("RETORNA VENTAS RESUMEN: ", res.data)
            if (res) {
              setListaPresupuestos(res.data);
              //localStorage.setItem('detalledatosvtas', JSON.stringify(datos));
              setIsLoading(false);
            } else {
              console.log("RETORNA DATOS PRESUPUESTOS: ", "ERROR")
            }

          } else {
            console.log("RETORNA DATOS PRESUPUESTOS: ", "ERROR")
          }
        })
        .catch((error) =>
          alert("Error Inesperado 4")
        )

    } else {
      alert("ENTRE")
      router.push("/");
    }
  }, []);

  const cargaOpcion = (tipo) => {
    setOpcion(tipo)
  }

  return (
    <div>
      {
        isLoading ?
          <Loading />
          :
          opcion == 4 ?
            datos ?
              vtasProductos ?
                datosCostos ?
                  detalleVtas ?
                    ventasDiariasMes ?
                      ventasDiariasMesSubcategoria ?
                        listaPrecios ?
                          listaPresupuestos ?
                            <HomeVentas datos={datos} datosCostos={datosCostos} vtasProductos={vtasProductos}
                              detalleVtas={detalleVtas} ventasDiariasMes={ventasDiariasMes}
                              ventasDiariasMesSubcategoria={ventasDiariasMesSubcategoria}
                              listaPrecios={listaPrecios} listaPresupuestos={listaPresupuestos} />
                            : <Loading />
                          : <Loading />
                        : <Loading />
                      : <Loading />
                    : <Loading />
                  : <Loading />
                : <Loading />
              : <Loading />
            :
            null
      }
    </div>
  );
}

export default DatosEntorno;