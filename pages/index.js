import React, { useEffect, useState } from "react";
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/style';
import { useDispatch, useSelector } from "react-redux";
import HomeScreen from "../components/Home/HomeScreen";
import Login from "../components/MyAccount/Login";
import app from "../server/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth(app);

import axios from "axios";
const URL_SERVICE = "https://api.aal-cloud.com/api/cosmos";
import { setDatosDashBoardPeriod } from "../components/store/slices/datosdashboard";
import { setDatosFiltros } from "../components/store/slices/datosfiltros";
import { setDatosVentas } from "../components/store/slices/filtrosventas";
import { setDatosUser } from "../components/store/slices/users";

//Anibal
import { showNotification } from '../utils/ShowNotifications';
import Loading from "../components/Loading";
//Fin Anibal

// Headers API
import { loadEnviroment } from '../helpers/loadEnviroment';

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch();
  const [ok, setOk] = useState(false)
  const [movimientoscompras, setMovimientoscompras] = useState(null)

  useEffect(() => {
    onAuthStateChanged(auth, (usuarioCosmos) => {
      //console.log("USUARIO : ", usuarioCosmos)
      if (usuarioCosmos) {
        setUser(usuarioCosmos);

        // Se debe mover al organizar el ingreso de usuario ya logueado
        axios({
          method: "post",
          url: `${URL_SERVICE}/99`,
          headers: {
            "Content-type": "application/json",
          },
        })
          .then((res) => {
            //console.log("RETORNA API COMPRAS: ", res.data)
            //res.json()
            if (res.status == 200) {

              if (res.data) {
                //console.log("RETORNA API COMPRAS: ", res.data)
                dispatch(setDatosDashBoardPeriod(res.data));
                setMovimientoscompras(res.data);
                setOk(true)
              } else {
                console.log("RETORNA API COMPRAS: ", "ERROR")
              }

            } else {
              console.log("RETORNA API COMPRAS: ", "ERROR")
            }
          })
          .catch((error) =>
            alert("Error Inesperado 1")
          )

        // lee datos filtros y los coloca en el state
        axios({
          method: "post",
          url: `${URL_SERVICE}/7`,
          headers: {
            "Content-type": "application/json",
          },
        })
          .then((res) => {
            //res.json()
            if (res.status == 200) {
              //console.log("RETORNA API DATOS FILTROS:: ", "OK")
              if (res.data) {
                dispatch(setDatosFiltros(res.data));
                setOk(true)
              } else {
                console.log("RETORNA API DATOS FILTROS:: ", "ERROR")
              }

            } else {
              console.log("RETORNA API DATOS FILTROS:: ", "ERROR")
            }
          })
          .catch((error) =>
            alert("Error Inesperado 2")
          )

        // lee datos filtros genear informes ventas
        axios({
          method: "post",
          url: `${URL_SERVICE}/13`,
          headers: {
            "Content-type": "application/json",
          },
        })
          .then((res) => {
            //res.json()
            if (res.status == 200) {
              //console.log("RETORNA DATOS FILTROS VENTAS: ", "OK")
              if (res.data) {
                localStorage.setItem("filtrosventas", JSON.stringify(res.data)
                );
                //console.log("DATOS FILTROS VENTAS : ", res.data)
                setOk(true)
              } else {
                console.log("RETORNA DATOS FILTROS VENTAS: ", "ERROR")
              }

            } else {
              console.log("RETORNA API FILTROS VENTAS: ", "ERROR")
            }
          })
          .catch((error) =>
            alert("Error Inesperado 3")
          )

      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <>
      <Head>
        <title>Calzado Cosmos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!user ? (
        <div className='flex flex-col h-screen bg-[url("/bg-3.jpg")]'>
          <Login />
        </div>
      ) : (
        isLoading ?
          (
            <Loading />
          ) : (
            movimientoscompras ?
              <HomeScreen movimientoscompras={movimientoscompras} />
              :
              <Loading />
          )
      )}
    </>
  )
}
