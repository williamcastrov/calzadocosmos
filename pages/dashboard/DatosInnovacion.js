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
import HomeInnovacion from './HomeInnovacion';

function DatosInnovacion(props) {
  const router = useRouter();
  const { datUsuario } = props;
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch();
  const [opcion, setOpcion] = useState(0)
  const [ventasDiariasMes, setVentasDiariasMes] = useState(null);
  const [existencias, setExistencias] = useState(null);
  const [vtasReferencias, setVtasReferencias] = useState(null);
  const [filtrosVentas, setFiltrosVentas] = useState(null);

  let tipousuario = null;

  useEffect(() => {

    tipousuario = JSON.parse(localStorage.getItem("tipousuario"));
    //console.log("TIPO DE USUARIO : ", tipousuario)

    let filtrosventas = null;
    filtrosventas = JSON.parse(localStorage.getItem("filtrosventas"));
    console.log("FILTROS VENTAS : ", filtrosventas)
    setFiltrosVentas(filtrosventas);

    // Debemos validar el tipo de usuario y cargar datos iniciales al state
    //Tipos de usuarios 1 = Compras, 4 = Ventas, 3 = Operaciones, 2 = Gerencia

    //if (tipousuario === 4) {
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
          if (res.data) {
            setVentasDiariasMes(res.data);
            cargaOpcion(tipousuario)
          } else {
            console.log("RETORNA API VENTAS INNOVACION: ", "ERROR")
          }

        } else {
          console.log("ERROR RETORNA API VENTAS INNOVACION: ", "ERROR")
        }
      })
      .catch((error) =>
        alert("Error Inesperado 7")
      )

    axios({
      method: "post",
      url: `${URL_SERVICE}/14`,
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        if (res.status == 200) {
          if (res.data) {
            setExistencias(res.data);
          } else {
            console.log("RETORNA API VENTAS INNOVACION: ", "ERROR")
          }

        } else {
          console.log("ERROR RETORNA API VENTAS INNOVACION: ", "ERROR")
        }
      })
      .catch((error) =>
        alert("Error Inesperado 7")
      )

    axios({
      method: "post",
      url: `${URL_SERVICE}/16`,
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        if (res.status == 200) {
          if (res.data) {
            setVtasReferencias(res.data);
            setIsLoading(false);
          } else {
            console.log("RETORNA API VENTAS REFERENCIAS: ", "ERROR")
          }

        } else {
          console.log("ERROR RETORNA API VENTAS REFERENCIAS: ", "ERROR")
        }
      })
      .catch((error) =>
        alert("Error Inesperado 7")
      )

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

          ventasDiariasMes ?
            existencias ?
              vtasReferencias ?
                <HomeInnovacion
                  ventasDiariasMes={ventasDiariasMes} existencias={existencias}
                  grupos={filtrosVentas.familias}
                  sublineas={filtrosVentas.subcategorias}
                  marcas={filtrosVentas.marcas}
                  vtasReferencias={vtasReferencias}
                />
                : <Loading />
              : <Loading />
            : <Loading />

      }
    </div>
  );
}

export default DatosInnovacion;