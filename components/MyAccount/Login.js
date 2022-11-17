import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import app from "../../server/firebase";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
const URL_SERVICE = "https://api.aal-cloud.com/api/cosmos";
import { setDatosDashBoardPeriod } from "../../components/store/slices/datosdashboard";
import { setDatosUser } from "../../components/store/slices/users";

//Empieza anibal
import Head from 'next/head';
import { Input, message } from 'antd';
import {
    AtSymbolIcon,
    LockClosedIcon
} from "@heroicons/react/outline";
import { validateEmail } from '../../utils/Validation'
import SRV from '../../helpers/Service'
import Loading from '../Loading';
import { showNotification } from '../../utils/ShowNotifications';
//Termina Anibal

const auth = getAuth(app);

function Login() {
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch();

    //Inicia Anibal
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const formComplete = validateEmail(email) && password.length > 6 ? true : false;

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    };
    //Termina Anibal

    const router = useRouter();

    async function registrarUsuario(email, password) {
        const datosUsuario = createUserWithEmailAndPassword(
            auth, email, password
        ).then((usuarioCosmos) => {
            return usuarioCosmos;
        })

        console.log("INFOR USUARIO  : ", datosUsuario)
    }

    async function iniciarSesion(email, password) {
        setIsLoading(false)
        try {
            let params = {
                tipoMov: 1,
                email,
                password
            }

            axios({
                method: "post",
                url: `${URL_SERVICE}/1`,
                params,
                headers: {
                    "Content-type": "application/json",
                },
            })
                .then((res) => {
                    //console.log("RETORNA API : ", res)
                    //res.json()
                    if (res.status == 200) {
                        showNotification(
                            "topRight",
                            4,
                            "Control de Acceso",
                            "Bienvenido(a) " + res.data.user.name
                        );
                        // Activo el dispatch para cargar los datos de entorno... datos.datosEnv datos.user
                        
                        if (res.data.datosEnv) {
                            dispatch(setDatosDashBoardPeriod(res.data.datosEnv));
                          } else {
                            showNotification(
                              "topRight",
                              2,
                              "Cargando Entorno",
                              "Error al descargar los datos"
                            );
                          }

                          if (res.data.user) {
                            dispatch(setDatosUser(res.data.user));
                          } else {
                            showNotification(
                              "topRight",
                              2,
                              "Cargando datos usuario",
                              "Error al descargar datos usuario"
                            );
                          }

                          setIsLoading(false)

                        signInWithEmailAndPassword(auth, email, password)
                        
                    } else {
                        showNotification(
                            "topRight",
                            4,
                            "CONTROL DE ACCESO",
                            datos.message
                        );
                    }
                })
                .catch((error) =>
                    alert("Error Inesperado")
                )
                .then((response) => response);
        } catch (error) {
            showNotification(
                "topRight",
                2,
                "Validando Credenciales",
                error
            );
            return false;
        }
        setIsLoading(false)

        const datosUsuario = signInWithEmailAndPassword(
            auth, email, password
        ).then((usuarioCosmos) => {
            return usuarioCosmos;
        })

        console.log("USUARIO REGISTRADO  : ", datosUsuario)
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className='flex flex-col h-screen'>
            <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <img
                        className="h-36 w-auto m-auto"
                        src="/logo-cosmos.jpg"
                        alt="Workflow"
                    />
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-basecosmos" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Bienvenido</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow shadow-purple-200 sm:rounded-lg sm:px-10">
                        <form className="space-y-6" action="#" method="POST">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Direccion de correo
                                </label>
                                <div className="mt-1">
                                    <Input placeholder='myuser@email.com' maxLength={60} prefix={<AtSymbolIcon className='h-6 text-gray-400' />} onChange={onChangeEmail} />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Contraseña
                                </label>
                                <div className="mt-1">
                                    <Input.Password placeholder='my-secure-password' prefix={<LockClosedIcon className='h-6 text-gray-400' />} onChange={onChangePassword} />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <a href="#" className="font-medium text-gray-600 hover:text-gray-500">
                                        Registro
                                    </a>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-basecosmos hover:text-cosmocolor">
                                        Olvidé mi contraseña?
                                    </a>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="button"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-basecosmos  hover:bg-cosmocolor focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    onClick={() => formComplete ? iniciarSesion(email, password) : message.error('Datos incorrectos... verifique')}
                                >
                                    Iniciar sesión
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;