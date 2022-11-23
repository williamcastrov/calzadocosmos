import { Fragment, useState, useEffect } from "react";
import { myNumber, nameMonth } from "../../../utils/ArrayFunctions";
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, FunnelIcon, } from "@heroicons/react/solid";
import Loading from "../../../components/Loading";
import axios from "axios";
const URL_SERVICE = "https://api.aal-cloud.com/api/cosmos";
import moment from "moment";
import TabVtasDiarias from "./TabVtasDiarias";

const filters = {
    price: [{ value: '0', label: '$0 - $25,000', checked: false },
    { value: '25', label: '$25,000 - $50,000', checked: false },
    { value: '50', label: '$50,000 - $75,000', checked: false },
    { value: '75', label: '$75,000+', checked: false },
    ],
    color: [{ value: '1', label: 'Semana1', checked: false },
    { value: '2', label: 'Semana2', checked: false },
    { value: '3', label: 'Semana3', checked: true },
    { value: '4', label: 'Semana4', checked: false },
    { value: '5', label: 'Semana5', checked: false },
    ],
    size: [{ value: 's', label: 'Femenina', checked: true },
    { value: 'm', label: 'Imperfectos', checked: false },
    { value: 'l', label: 'Mascotas', checked: false },
    { value: 'xl', label: 'Masculina', checked: false },
    { value: '2xl', label: 'Segunda', checked: false },
    { value: '3xl', label: 'Unisex', checked: false },
    ],
    category: [{ value: 'all-new-arrivals', label: 'PRODUCTO PROPIO', checked: false },
    { value: 'tees', label: 'PUNTO Y APARTE', checked: false },
    { value: 'objects', label: 'RAMIREZ GOMEZ SANDRA', checked: false },
    { value: 'sweatshirts', label: 'RAMIREZ RAMIREZ JUAN DE LA CRUZ', checked: false },
    { value: 'pants-and-shorts', label: 'REYES OCAMPO ISABEL CRISTINA', checked: false },
    { value: 'pants-and-shorts', label: 'RIVIERA MONTAGUTH LEIDY JOHANNA', checked: false },
    { value: 'pants-and-shorts', label: 'RODRIGUEZ LEON LUZ MERY', checked: false },
    { value: 'pants-and-shorts', label: 'ROEL SAS', checked: false },
    { value: 'pants-and-shorts', label: 'ROJAS PABON DORIS ELENA', checked: false },
    { value: 'pants-and-shorts', label: 'ROXANA SHOES SAS ', checked: false },
    ],
}

const sortOptions = [
    { name: 'Dia', value: 1, current: true },
    { name: 'Semana', value: 2, current: false },
    { name: 'Mes actual', value: 3, current: false },
    { name: 'Mes anterior', value: 4, current: false },
    { name: 'Trimestre', value: 5, current: false },
    { name: 'Semestre', value: 6, current: false },
    { name: 'Año', value: 7, current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function TabVtasDiariasFiltro(props) {
    const { tipo, setTipo, detalleVtas, detalleVentas, ventasSubcategorias, labelVentas } = props;
    const [habilitarFiltros, setHabilitarFiltros] = useState(false);
    const [movimientos, setmovimientos] = useState(false);
    const [movimientosCentros, setMovimientosCentros] = useState(false);
    const [movimientosSubCategorias, setMovimientosSubcategorias] = useState(false);
    const [movimientosLineas, setMovimientosLineas] = useState(false);
    const [opcion, setOpcion] = useState(0);
    const [tipoFiltro, setTipoFiltro] = useState(0);
    const [textoTipo, setTextoTipo] = useState(0);
    const [entVtasDia, setEntVtasDia] = useState(true);
    const [entVtasCentro, setEntVtasCentro] = useState(false);
    const [entVtasSubcategoria, setEntVtasSubcategoria] = useState(false);
    const [entVtasLinea, setEntVtasLinea] = useState(false);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date);
    const [isLoading, setIsLoading] = useState(false)

    let today = moment(fechaSeleccionada);
    let from_date = today.startOf('week');
    let iniciasemana = moment(from_date).add(1, 'd');
    let diados = moment(from_date).add(2, 'd');
    let diatres = moment(from_date).add(3, 'd');
    let diacuatro = moment(from_date).add(4, 'd');
    let diacinco = moment(from_date).add(5, 'd');
    let diaseis = moment(from_date).add(6, 'd');
    let diasiete = moment(from_date).add(7, 'd');

    let fechauno = moment(iniciasemana).format("YYYY-MM-DD");
    let fechados = moment(diados).format("YYYY-MM-DD");
    let fechatres = moment(diatres).format("YYYY-MM-DD");
    let fechacuatro = moment(diacuatro).format("YYYY-MM-DD");
    let fechacinco = moment(diacinco).format("YYYY-MM-DD");
    let fechaseis = moment(diaseis).format("YYYY-MM-DD");
    let fechasiete = moment(diasiete).format("YYYY-MM-DD");
    /*
        let primerDiaMesAnterior = moment(new Date(diamesanterior.getFullYear(), diamesanterior.getMonth(), 1)).format("YYYY-MM-DD");
        let ultimoDiaMesAnterior = moment(new Date(diamesanterior.getFullYear(), diamesanterior.getMonth() + 1, 0)).format("YYYY-MM-DD");
    
        let primerDiaMesActual = moment(new Date(diamesanterior.getFullYear(), date.getMonth(), 1)).format("YYYY-MM-DD");
        let ultimoDiaMesActual = moment(new Date(diamesanterior.getFullYear(), date.getMonth() + 1, 0)).format("YYYY-MM-DD");
    */
    let primerdiasemana = fechauno;
    let ultimodiasemana = fechasiete;

    const tabvtas = [
        { name: 'Ventas diarias', href: '#', current: entVtasDia },
        { name: 'Centro de operación', href: '#', current: entVtasCentro },
        { name: 'Subcategoría', href: '#', current: entVtasSubcategoria },
        { name: 'Linea', href: '#', current: entVtasLinea },
    ]
    //ventassubcategorias
    const filtroPeriodo = (value) => {
        console.log("VALOR SELECC : ", value)
        const newItem = [];
        const newItemSubcategoria = [];
        const newItemLinea = [];

        const newArray = [];
        const newArraySubCateg = [];
        const newArrayLineas = [];

        const validaDuplicados = [];
        const validaDuplicadosSubcateg = [];
        const validaDuplicadosLinea = [];

        setTipoFiltro(value);

        if (value === 1) {
            console.Console.log("Ventas diarias");
        } else
            if (value === 2) {
                // Agrupa información de ventas por centro
                detalleVtas.ventascentro &&
                    detalleVtas.ventascentro.map((items, index) => {
                        let CentroOperacion = 0;
                        let Fecha_Documentouno = 0;
                        let cantidaduno = 0;
                        let vtamasimpuestouno = 0;
                        let Fecha_Documentodos = 0;
                        let cantidaddos = 0;
                        let vtamasimpuestodos = 0;
                        let Fecha_Documentotres = 0;
                        let cantidadtres = 0;
                        let vtamasimpuestotres = 0;
                        let Fecha_Documentocuatro = 0;
                        let cantidadtcuatro = 0;
                        let vtamasimpuestocuatro = 0;
                        let Fecha_Documentocinco = 0;
                        let cantidadcinco = 0;
                        let vtamasimpuestocinco = 0;
                        let Fecha_Documentoseis = 0;
                        let cantidadseis = 0;
                        let vtamasimpuestoseis = 0;
                        let Fecha_Documentosiete = 0;
                        let cantidadsiete = 0;
                        let vtamasimpuestosiete = 0;

                        const seleccionar = [];
                        if (items.Fecha_Documento >= primerdiasemana && items.Fecha_Documento <= ultimodiasemana) {

                            detalleVtas.ventascentro &&
                                detalleVtas.ventascentro.map((registro, index) => {

                                    if ((items.Descripcion_Centro_Operacion === registro.Descripcion_Centro_Operacion) &&
                                        (registro.Fecha_Documento >= primerdiasemana && registro.Fecha_Documento <= ultimodiasemana)) {
                                        let vta = {
                                            CentroOperacion: registro.Descripcion_Centro_Operacion,
                                            Fecha_Documento: registro.Fecha_Documento,
                                            cantidad: registro.cantidad,
                                            vtamasimpuesto: registro.vtamasimpuesto
                                        };
                                        seleccionar.push(vta);
                                    }

                                });

                            let longitud = seleccionar.length;

                            for (var i = 1; i < longitud; i++) {

                                CentroOperacion = seleccionar[i].CentroOperacion;
                                let indice = i - 1;
                                if (i === 1) {
                                    Fecha_Documentouno = seleccionar[indice].Fecha_Documento;
                                    cantidaduno = seleccionar[indice].cantidad;
                                    vtamasimpuestouno = seleccionar[indice].vtamasimpuesto;
                                } else
                                    if (i === 2) {
                                        Fecha_Documentodos = seleccionar[indice].Fecha_Documento;
                                        cantidaddos = seleccionar[indice].cantidad;
                                        vtamasimpuestodos = seleccionar[indice].vtamasimpuesto;
                                    } else
                                        if (i === 3) {
                                            Fecha_Documentotres = seleccionar[indice].Fecha_Documento;
                                            cantidadtres = seleccionar[indice].cantidad;
                                            vtamasimpuestotres = seleccionar[indice].vtamasimpuesto;
                                        } else
                                            if (i === 4) {
                                                Fecha_Documentocuatro = seleccionar[indice].Fecha_Documento;
                                                cantidadtcuatro = seleccionar[indice].cantidad;
                                                vtamasimpuestocuatro = seleccionar[indice].vtamasimpuesto;
                                            } else
                                                if (i === 5) {
                                                    Fecha_Documentocinco = seleccionar[indice].Fecha_Documento;
                                                    cantidadcinco = seleccionar[indice].cantidad;
                                                    vtamasimpuestocinco = seleccionar[indice].vtamasimpuesto;
                                                } else
                                                    if (i === 6) {
                                                        Fecha_Documentoseis = seleccionar[indice].Fecha_Documento;
                                                        cantidadseis = seleccionar[indice].cantidad;
                                                        vtamasimpuestoseis = seleccionar[indice].vtamasimpuesto;
                                                    } else
                                                        if (i === 7) {
                                                            Fecha_Documentosiete = seleccionar[indice].Fecha_Documento;
                                                            cantidadsiete = seleccionar[indice].cantidad;
                                                            vtamasimpuestosiete = seleccionar[indice].vtamasimpuesto;
                                                        } else {
                                                            Fecha_Documentosiete = 0;
                                                            cantidadsiete = 0;
                                                            vtamasimpuestosiete = 0;
                                                        }

                            }

                            let item = {
                                CentroOperacion: CentroOperacion,
                                Fecha_Documentouno: Fecha_Documentouno,
                                cantidaduno: cantidaduno,
                                vtamasimpuestouno: vtamasimpuestouno,
                                Fecha_Documentodos: Fecha_Documentodos,
                                cantidaddos: cantidaddos,
                                vtamasimpuestodos: vtamasimpuestodos,
                                Fecha_Documentotres: Fecha_Documentotres,
                                cantidadtres: cantidadtres,
                                vtamasimpuestotres: vtamasimpuestotres,
                                Fecha_Documentocuatro: Fecha_Documentocuatro,
                                cantidadtcuatro: cantidadtcuatro,
                                vtamasimpuestocuatro: vtamasimpuestocuatro,
                                Fecha_Documentocinco: Fecha_Documentocinco,
                                cantidadcinco: cantidadcinco,
                                vtamasimpuestocinco: vtamasimpuestocinco,
                                Fecha_Documentoseis: Fecha_Documentoseis,
                                cantidadseis: cantidadseis,
                                vtamasimpuestoseis: vtamasimpuestoseis,
                                Fecha_Documentosiete: Fecha_Documentosiete,
                                cantidadsiete: cantidadsiete,
                                vtamasimpuestosiete: vtamasimpuestosiete,
                            }

                            newItem.push(item);

                        }
                    });

                let valida = false;
                newItem &&
                    newItem.map((items, index) => {
                        valida = validaDuplicados.includes(items.CentroOperacion);
                        if (!valida) {
                            newArray.push(items);
                        }
                        validaDuplicados.push(items.CentroOperacion);
                    });

                // Agrupar ventas por subcategorias
                detalleVtas.ventassubcategorias &&
                    detalleVtas.ventassubcategorias.map((items, index) => {
                        let subcategorias = 0;
                        let Fecha_Documentouno = 0;
                        let cantidaduno = 0;
                        let vtamasimpuestouno = 0;
                        let Fecha_Documentodos = 0;
                        let cantidaddos = 0;
                        let vtamasimpuestodos = 0;
                        let Fecha_Documentotres = 0;
                        let cantidadtres = 0;
                        let vtamasimpuestotres = 0;
                        let Fecha_Documentocuatro = 0;
                        let cantidadtcuatro = 0;
                        let vtamasimpuestocuatro = 0;
                        let Fecha_Documentocinco = 0;
                        let cantidadcinco = 0;
                        let vtamasimpuestocinco = 0;
                        let Fecha_Documentoseis = 0;
                        let cantidadseis = 0;
                        let vtamasimpuestoseis = 0;
                        let Fecha_Documentosiete = 0;
                        let cantidadsiete = 0;
                        let vtamasimpuestosiete = 0;

                        const seleccionar = [];
                        if (items.Fecha_Documento >= primerdiasemana && items.Fecha_Documento <= ultimodiasemana) {

                            detalleVtas.ventassubcategorias &&
                                detalleVtas.ventassubcategorias.map((registro, index) => {

                                    if ((items.SUBCATEGORIA === registro.SUBCATEGORIA) &&
                                        (registro.Fecha_Documento >= primerdiasemana && registro.Fecha_Documento <= ultimodiasemana)) {
                                        let vta = {
                                            subcategorias: registro.SUBCATEGORIA,
                                            Fecha_Documento: registro.Fecha_Documento,
                                            cantidad: registro.cantidad,
                                            vtamasimpuesto: registro.vtamasimpuesto
                                        };
                                        seleccionar.push(vta);
                                    }

                                });


                            //console.log("SELECCIONAR CATEGOR: ", seleccionar);
                            let longitud = seleccionar.length;

                            for (var i = 1; i < longitud; i++) {

                                subcategorias = seleccionar[i].subcategorias;
                                let indice = i - 1;
                                if (i === 1) {
                                    Fecha_Documentouno = seleccionar[indice].Fecha_Documento;
                                    cantidaduno = seleccionar[indice].cantidad;
                                    vtamasimpuestouno = seleccionar[indice].vtamasimpuesto;
                                } else
                                    if (i === 2) {
                                        Fecha_Documentodos = seleccionar[indice].Fecha_Documento;
                                        cantidaddos = seleccionar[indice].cantidad;
                                        vtamasimpuestodos = seleccionar[indice].vtamasimpuesto;
                                    } else
                                        if (i === 3) {
                                            Fecha_Documentotres = seleccionar[indice].Fecha_Documento;
                                            cantidadtres = seleccionar[indice].cantidad;
                                            vtamasimpuestotres = seleccionar[indice].vtamasimpuesto;
                                        } else
                                            if (i === 4) {
                                                Fecha_Documentocuatro = seleccionar[indice].Fecha_Documento;
                                                cantidadtcuatro = seleccionar[indice].cantidad;
                                                vtamasimpuestocuatro = seleccionar[indice].vtamasimpuesto;
                                            } else
                                                if (i === 5) {
                                                    Fecha_Documentocinco = seleccionar[indice].Fecha_Documento;
                                                    cantidadcinco = seleccionar[indice].cantidad;
                                                    vtamasimpuestocinco = seleccionar[indice].vtamasimpuesto;
                                                } else
                                                    if (i === 6) {
                                                        Fecha_Documentoseis = seleccionar[indice].Fecha_Documento;
                                                        cantidadseis = seleccionar[indice].cantidad;
                                                        vtamasimpuestoseis = seleccionar[indice].vtamasimpuesto;
                                                    } else
                                                        if (i === 7) {
                                                            Fecha_Documentosiete = seleccionar[indice].Fecha_Documento;
                                                            cantidadsiete = seleccionar[indice].cantidad;
                                                            vtamasimpuestosiete = seleccionar[indice].vtamasimpuesto;
                                                        } else {
                                                            Fecha_Documentosiete = 0;
                                                            cantidadsiete = 0;
                                                            vtamasimpuestosiete = 0;
                                                        }

                            }

                            let item = {
                                subcategorias: subcategorias,
                                Fecha_Documentouno: Fecha_Documentouno,
                                cantidaduno: cantidaduno,
                                vtamasimpuestouno: vtamasimpuestouno,
                                Fecha_Documentodos: Fecha_Documentodos,
                                cantidaddos: cantidaddos,
                                vtamasimpuestodos: vtamasimpuestodos,
                                Fecha_Documentotres: Fecha_Documentotres,
                                cantidadtres: cantidadtres,
                                vtamasimpuestotres: vtamasimpuestotres,
                                Fecha_Documentocuatro: Fecha_Documentocuatro,
                                cantidadtcuatro: cantidadtcuatro,
                                vtamasimpuestocuatro: vtamasimpuestocuatro,
                                Fecha_Documentocinco: Fecha_Documentocinco,
                                cantidadcinco: cantidadcinco,
                                vtamasimpuestocinco: vtamasimpuestocinco,
                                Fecha_Documentoseis: Fecha_Documentoseis,
                                cantidadseis: cantidadseis,
                                vtamasimpuestoseis: vtamasimpuestoseis,
                                Fecha_Documentosiete: Fecha_Documentosiete,
                                cantidadsiete: cantidadsiete,
                                vtamasimpuestosiete: vtamasimpuestosiete,
                            }

                            newItemSubcategoria.push(item);
                        }
                    });

                let validasubcategoria = false;

                newItemSubcategoria &&
                    newItemSubcategoria.map((items, index) => {
                        validasubcategoria = validaDuplicadosSubcateg.includes(items.subcategorias);
                        if (!validasubcategoria) {
                            newArraySubCateg.push(items);
                        }
                        validaDuplicadosSubcateg.push(items.subcategorias);
                    });


                //Agrupa información ventas por linea 
                detalleVtas.ventassublinea &&
                    detalleVtas.ventassublinea.map((items, index) => {
                        let lineas = 0;
                        let Fecha_Documentouno = 0;
                        let cantidaduno = 0;
                        let vtamasimpuestouno = 0;
                        let Fecha_Documentodos = 0;
                        let cantidaddos = 0;
                        let vtamasimpuestodos = 0;
                        let Fecha_Documentotres = 0;
                        let cantidadtres = 0;
                        let vtamasimpuestotres = 0;
                        let Fecha_Documentocuatro = 0;
                        let cantidadtcuatro = 0;
                        let vtamasimpuestocuatro = 0;
                        let Fecha_Documentocinco = 0;
                        let cantidadcinco = 0;
                        let vtamasimpuestocinco = 0;
                        let Fecha_Documentoseis = 0;
                        let cantidadseis = 0;
                        let vtamasimpuestoseis = 0;
                        let Fecha_Documentosiete = 0;
                        let cantidadsiete = 0;
                        let vtamasimpuestosiete = 0;

                        const seleccionar = [];
                        if (items.Fecha_Documento >= primerdiasemana && items.Fecha_Documento <= ultimodiasemana) {

                            detalleVtas.ventassublinea &&
                                detalleVtas.ventassublinea.map((registro, index) => {

                                    if ((items.Sublinea === registro.Sublinea) &&
                                        (registro.Fecha_Documento >= primerdiasemana && registro.Fecha_Documento <= ultimodiasemana)) {
                                        let vta = {
                                            lineas: registro.Sublinea,
                                            Fecha_Documento: registro.Fecha_Documento,
                                            cantidad: registro.cantidad,
                                            vtamasimpuesto: registro.vtamasimpuesto
                                        };
                                        seleccionar.push(vta);
                                    }

                                });


                            //console.log("SELECCIONAR CATEGOR: ", seleccionar);
                            let longitud = seleccionar.length;

                            for (var i = 1; i < longitud; i++) {

                                lineas = seleccionar[i].lineas;
                                let indice = i - 1;
                                if (i === 1) {
                                    Fecha_Documentouno = seleccionar[indice].Fecha_Documento;
                                    cantidaduno = seleccionar[indice].cantidad;
                                    vtamasimpuestouno = seleccionar[indice].vtamasimpuesto;
                                } else
                                    if (i === 2) {
                                        Fecha_Documentodos = seleccionar[indice].Fecha_Documento;
                                        cantidaddos = seleccionar[indice].cantidad;
                                        vtamasimpuestodos = seleccionar[indice].vtamasimpuesto;
                                    } else
                                        if (i === 3) {
                                            Fecha_Documentotres = seleccionar[indice].Fecha_Documento;
                                            cantidadtres = seleccionar[indice].cantidad;
                                            vtamasimpuestotres = seleccionar[indice].vtamasimpuesto;
                                        } else
                                            if (i === 4) {
                                                Fecha_Documentocuatro = seleccionar[indice].Fecha_Documento;
                                                cantidadtcuatro = seleccionar[indice].cantidad;
                                                vtamasimpuestocuatro = seleccionar[indice].vtamasimpuesto;
                                            } else
                                                if (i === 5) {
                                                    Fecha_Documentocinco = seleccionar[indice].Fecha_Documento;
                                                    cantidadcinco = seleccionar[indice].cantidad;
                                                    vtamasimpuestocinco = seleccionar[indice].vtamasimpuesto;
                                                } else
                                                    if (i === 6) {
                                                        Fecha_Documentoseis = seleccionar[indice].Fecha_Documento;
                                                        cantidadseis = seleccionar[indice].cantidad;
                                                        vtamasimpuestoseis = seleccionar[indice].vtamasimpuesto;
                                                    } else
                                                        if (i === 7) {
                                                            Fecha_Documentosiete = seleccionar[indice].Fecha_Documento;
                                                            cantidadsiete = seleccionar[indice].cantidad;
                                                            vtamasimpuestosiete = seleccionar[indice].vtamasimpuesto;
                                                        } else {
                                                            Fecha_Documentosiete = 0;
                                                            cantidadsiete = 0;
                                                            vtamasimpuestosiete = 0;
                                                        }

                            }

                            let item = {
                                lineas: lineas,
                                Fecha_Documentouno: Fecha_Documentouno,
                                cantidaduno: cantidaduno,
                                vtamasimpuestouno: vtamasimpuestouno,
                                Fecha_Documentodos: Fecha_Documentodos,
                                cantidaddos: cantidaddos,
                                vtamasimpuestodos: vtamasimpuestodos,
                                Fecha_Documentotres: Fecha_Documentotres,
                                cantidadtres: cantidadtres,
                                vtamasimpuestotres: vtamasimpuestotres,
                                Fecha_Documentocuatro: Fecha_Documentocuatro,
                                cantidadtcuatro: cantidadtcuatro,
                                vtamasimpuestocuatro: vtamasimpuestocuatro,
                                Fecha_Documentocinco: Fecha_Documentocinco,
                                cantidadcinco: cantidadcinco,
                                vtamasimpuestocinco: vtamasimpuestocinco,
                                Fecha_Documentoseis: Fecha_Documentoseis,
                                cantidadseis: cantidadseis,
                                vtamasimpuestoseis: vtamasimpuestoseis,
                                Fecha_Documentosiete: Fecha_Documentosiete,
                                cantidadsiete: cantidadsiete,
                                vtamasimpuestosiete: vtamasimpuestosiete,
                            }

                            newItemLinea.push(item);
                            console.log("SELECCIONAR LINEAS: ", newItemLinea);
                        }
                    });

                let validalineas = false;

                newItemLinea &&
                    newItemLinea.map((items, index) => {
                        validalineas = validaDuplicadosLinea.includes(items.lineas);
                        if (!validalineas) {
                            newArrayLineas.push(items);
                        }
                        validaDuplicadosLinea.push(items.lineas);
                    });

                console.log("NEW ITEM LINEAS: ", newArrayLineas)

            } else
                console.log("PENDIENTE")
        //console.log("VALORES FILTRADOS : ", newItem);
        setMovimientosCentros(newArray);
        setMovimientosSubcategorias(newArraySubCateg);
        setMovimientosLineas(newArrayLineas);
    }

    const selVentas = (seleccion) => {
        setOpcion(seleccion)
        console.log("SELECCION : ", seleccion)
        if (seleccion == 0) {
            setHabilitarFiltros(true);
            setEntVtasDia(true);
            setEntVtasCentro(false);
            setEntVtasSubcategoria(false);
            setEntVtasLinea(false);
            setTextoTipo("CENTROS DE OPERACIÓN")
            //setmovimientos("");
        }
        else
            if (seleccion == 1) {
                setHabilitarFiltros(false);
                setEntVtasDia(false);
                setEntVtasCentro(true);
                setEntVtasSubcategoria(false);
                setEntVtasLinea(false);
                setTextoTipo("CENTROS DE OPERACIÓN")
                setmovimientos(movimientosCentros);
            }
            else
                if (seleccion == 2) {
                    setHabilitarFiltros(false);
                    setEntVtasDia(false);
                    setEntVtasCentro(false);
                    setEntVtasSubcategoria(true);
                    setEntVtasLinea(false);
                    setTextoTipo("SUBCATEGORÍAS")
                    setmovimientos(movimientosSubCategorias);
                }
                else
                    if (seleccion == 3) {
                        setHabilitarFiltros(false);
                        setEntVtasDia(false);
                        setEntVtasCentro(false);
                        setEntVtasSubcategoria(false);
                        setEntVtasLinea(true);
                        setTextoTipo("LINEAS")
                        setmovimientos(movimientosLineas);
                    }
                    else {
                        setEntVtasDia(true);
                        setEntVtasDia(true);
                        setEntVtasCentro(false);
                        setEntVtasSubcategoria(false);
                        setEntVtasLinea(false);
                        setTextoTipo("")
                    }
    }

    useEffect(() => {
        setEntVtasDia(false)
        //setmovimientos([])
        if (opcion == 1)
            setmovimientos(movimientosCentros);
        else
            if (opcion == 2)
                setmovimientos(movimientosSubCategorias);
            else
                setmovimientos("");

    }, [opcion]);

    useEffect(() => {
        filtroPeriodo(tipoFiltro);
        //onsole.log("FECHA : ",fechaSeleccionada)
    }, [fechaSeleccionada]);

    const leeVentasDia = () => {
        // Detalle datos de ventas para aplicar filtros
        setIsLoading(true);
        const newDet = [];
        axios({
            method: "post",
            url: `${URL_SERVICE}/5`,
            headers: {
                "Content-type": "application/json",
            },
        })
            .then((res) => {
                if (res.status == 200) {
                    
                    if (res) {

                        res.data &&
                        res.data.map((row, index) => {
                          //console.log("ID FACTURAS LEIDAS : ", row);
                          let item = {
                            Id_Centro_Operacion: row.Id_Centro_Operacion,
                            Descripcion_Centro_Operacion: row.Descripcion_Centro_Operacion,
                            Tipo_Docto: row.Tipo_Docto,
                            Documento: row.Documento,
                            Fecha_Documento: row.Fecha_Documento,
                            Periodo: row.Periodo,
                            Referencia_Item: row.Referencia_Item ,
                            Descripcion_Item: row.Descripcion_Item,
                            Cant_U_M: row.Cant_U_M,
                            Vlr_Subtotal: row.Vlr_Subtotal,
                            Vlr_descuento: row.Vlr_descuento,
                            Vlr_Impuestos: row.Vlr_Impuestos,
                            Vlr_Neto: row.Vlr_Neto,
                            Vlr_Costo: row.Vlr_Costo,
                          };
        
                          newDet.push(item);
                        });
                        setIsLoading(false);
                        console.log("VENTAS DIARIAS : ", newDet)
                        localStorage.setItem('ventasdia', JSON.stringify(newDet));
                        //cargaOpcion(tipousuario)
                    } else {
                        console.log("RETORNA VTAS DETALLE: ", "ERROR")
                    }

                } else {
                    console.log("RETORNA VTAS DETALLE: ", "ERROR")
                }
            })
            .catch((error) =>
                alert("Error Inesperado 5")
            )
           
    }

    return (
        <div className="bg-white">
            {
                isLoading ?
                    <Loading />
                    : null
            }
            <div className="py-2 px-4 text-center sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Explorar información de ventas</h1>
                {/*
                <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
                    Explorar información de ventas
                </p>
                */
                }
            </div>
            <div className="col-start-1 row-start-1 py-4">
                <div className="mx-auto flex max-w-7xl justify-center px-4 sm:px-6 lg:px-8">
                    {/* justify-end */}
                    <Menu as="div" className="relative inline-block" >
                        <div className="flex">
                            <Menu.Button disabled={habilitarFiltros} className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                Filtros por periodo
                                <ChevronDownIcon
                                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                    aria-hidden="true"
                                />
                            </Menu.Button>
                            <div className="mx-auto flex max-w-7xl space-x-6 divide-x divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
                                <div className="pl-6">
                                    <button type="button" onClick={() => setOpcion(2)} className="text-gray-500">
                                        Limpiar filtros
                                    </button>
                                </div>
                            </div>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    {sortOptions.map((option) => (
                                        <Menu.Item key={option.name}>
                                            {({ active }) => (
                                                <a
                                                    href={option.href}
                                                    onClick={() => filtroPeriodo(option.value)}
                                                    className={classNames(
                                                        option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                                        active ? 'bg-gray-100' : '',
                                                        'block px-4 py-2 text-sm'
                                                    )}
                                                >
                                                    {option.name}
                                                </a>
                                            )}
                                        </Menu.Item>
                                    ))}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>

            <Disclosure
                as="section"
                aria-labelledby="filter-heading"
                className="grid items-center border-t border-b border-gray-200"
            >
                <h2 id="filter-heading" className="sr-only">
                    Filters
                </h2>
                <div className="relative col-start-1 row-start-1 py-4">
                    <div className="mx-auto flex max-w-7xl space-x-6 divide-x divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
                        <div>
                            <Disclosure.Button className="pt-2 group flex items-center font-medium text-gray-700">
                                <ChevronDownIcon
                                    className="mr-2 h-5 w-5 flex-none text-gray-400 group-hover:text-gray-500"
                                    aria-hidden="true"
                                />
                                Filtros clasificación
                            </Disclosure.Button>
                        </div>
                        {
                            tipoFiltro === 2 || tipoFiltro === 3 ?
                                (
                                    <div className="mx-auto flex max-w-7xl space-x-6 divide-x divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
                                        <label className="pl-4 pt-2">
                                            Seleccione Fecha:
                                        </label>
                                        <div className="relative col-start-1 row-start-1 py-0">
                                            <input
                                                id="search-field"
                                                name="fechaseleccionasemana"
                                                className="block w-full h-full pl-8 pr-3 py-2 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm"
                                                onChange={(e) => setFechaSeleccionada(new Date(e.target.value))}
                                                placeholder="Consultar movimientos"
                                                type="date"
                                            />
                                        </div>
                                    </div>
                                )
                                :
                                null
                        }
                        {/*
                        <div className="mx-auto flex max-w-7xl space-x-6 divide-x divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
                            <div className="relative col-start-1 row-start-1 py-0">
                                <button
                                    className="block w-full h-full pl-8 pr-3 py-2 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm"
                                    onClick={() => leeVentasDia()}
                                >
                                    Leer Vtas Diarias
                                </button>
                            </div>
                        </div>
                    */}
                    </div>
                </div>
                <Disclosure.Panel className="border-t border-gray-200 py-10">
                    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 px-4 text-sm sm:px-6 md:gap-x-6 lg:px-8">
                        <div className="grid auto-rows-min grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-6">
                            <fieldset>
                                <legend className="block font-medium">Precio</legend>
                                <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                                    {filters.price.map((option, optionIdx) => (
                                        <div key={option.value} className="flex items-center text-base sm:text-sm">
                                            <input
                                                id={`price-${optionIdx}`}
                                                name="price[]"
                                                defaultValue={option.value}
                                                type="checkbox"
                                                className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                defaultChecked={option.checked}
                                            />
                                            <label htmlFor={`price-${optionIdx}`} className="ml-3 min-w-0 flex-1 text-gray-600">
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </fieldset>
                            <fieldset>
                                <legend className="block font-medium">Semana</legend>
                                <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                                    {filters.color.map((option, optionIdx) => (
                                        <div key={option.value} className="flex items-center text-base sm:text-sm">
                                            <input
                                                id={`color-${optionIdx}`}
                                                name="color[]"
                                                defaultValue={option.value}
                                                type="checkbox"
                                                className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                defaultChecked={option.checked}
                                            />
                                            <label htmlFor={`color-${optionIdx}`} className="ml-3 min-w-0 flex-1 text-gray-600">
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </fieldset>
                        </div>
                        <div className="grid auto-rows-min grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-6">
                            <fieldset>
                                <legend className="block font-medium">Categoría</legend>
                                <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                                    {filters.size.map((option, optionIdx) => (
                                        <div key={option.value} className="flex items-center text-base sm:text-sm">
                                            <input
                                                id={`size-${optionIdx}`}
                                                name="size[]"
                                                defaultValue={option.value}
                                                type="checkbox"
                                                className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                defaultChecked={option.checked}
                                            />
                                            <label htmlFor={`size-${optionIdx}`} className="ml-3 min-w-0 flex-1 text-gray-600">
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </fieldset>
                            <fieldset>
                                <legend className="block font-medium">Marca</legend>
                                <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                                    {filters.category.map((option, optionIdx) => (
                                        <div key={option.value} className="flex items-center text-base sm:text-sm">
                                            <input
                                                id={`category-${optionIdx}`}
                                                name="category[]"
                                                defaultValue={option.value}
                                                type="checkbox"
                                                className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                defaultChecked={option.checked}
                                            />
                                            <label htmlFor={`category-${optionIdx}`} className="ml-3 min-w-0 flex-1 text-gray-600">
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </Disclosure.Panel>
            </Disclosure>

            <div className="margenizaquierdanegativo px-4 sm:px-6 lg:px-8">
                <div className="border-b border-gray-200">
                    <nav className="ml-1 -mb-px flex space-x-8" aria-label="Tabs">
                        {tabvtas.map((tab, index) => (
                            <a
                                key={tab.name}
                                onClick={() => selVentas(index)}
                                className={classNames(
                                    tab.current
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                                )}
                                aria-current={tab.current ? 'page' : undefined}
                            >
                                {tab.name}
                            </a>
                        ))}
                    </nav>
                </div>

                {tipoFiltro === 2 ?
                    (
                        entVtasDia ?
                            <TabVtasDiarias tipo={tipo} setTipo={setTipo} detalleVentas={detalleVentas}
                                ventasSubcategorias={ventasSubcategorias} labelVentas={labelVentas}
                            /> : entVtasCentro ?
                                (
                                    <div className="mt-8 flex flex-col">
                                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">

                                                    <table className="min-w-full divide-y divide-gray-300">
                                                        <thead className="bg-gray-50">

                                                            <tr>
                                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                                    {textoTipo}
                                                                </th>
                                                                <th scope="col" className="px-0 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                    {fechauno}
                                                                </th>
                                                                <th scope="col" className="px-2 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                    {fechados}
                                                                </th>
                                                                <th scope="col" className="px-6 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                    {fechatres}
                                                                </th>
                                                                <th scope="col" className="px-0 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                    {fechacuatro}
                                                                </th>
                                                                <th scope="col" className="px-0 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                    {fechacinco}
                                                                </th>
                                                                <th scope="col" className="px-4 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                    {fechaseis}
                                                                </th>
                                                                <th scope="col" className="px-4 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                    {fechasiete}
                                                                </th>

                                                            </tr>
                                                        </thead>{ }
                                                        <tbody className="bg-white">
                                                            {
                                                                movimientos && movimientos.map((ventas, comprasIdx) => (

                                                                    <tr key={ventas.nombre} className={comprasIdx % 2 === 0 ? undefined : 'bg-gray-50'}>
                                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                            {ventas.CentroOperacion}
                                                                        </td>
                                                                        <td className="whitespace-nowrap py-4 text-right text-sm text-gray-500">
                                                                            {
                                                                                myNumber(1, ventas.vtamasimpuestouno)
                                                                            }
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-2 py-4 text-right text-sm text-gray-500">
                                                                            {
                                                                                myNumber(1, ventas.vtamasimpuestodos)
                                                                            }
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                                                                            {
                                                                                myNumber(1, ventas.vtamasimpuestotres)
                                                                            }
                                                                        </td>

                                                                        <td className="whitespace-nowrap py-4 text-right text-sm text-gray-500">
                                                                            {
                                                                                myNumber(1, ventas.vtamasimpuestocuatro)
                                                                            }
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-2 py-4 text-right text-sm text-gray-500">
                                                                            {
                                                                                myNumber(1, ventas.vtamasimpuestocinco)
                                                                            }
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                                                                            {
                                                                                myNumber(1, ventas.vtamasimpuestoseis)
                                                                            }
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                                                                            {
                                                                                myNumber(1, ventas.vtamasimpuestosiete)
                                                                            }
                                                                        </td>

                                                                    </tr>

                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                                :
                                entVtasSubcategoria ?
                                    (
                                        <div className="mt-8 flex flex-col">
                                            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">

                                                        <table className="min-w-full divide-y divide-gray-300">
                                                            <thead className="bg-gray-50">

                                                                <tr>
                                                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                                        {textoTipo}
                                                                    </th>
                                                                    <th scope="col" className="px-0 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                        {fechauno}
                                                                    </th>
                                                                    <th scope="col" className="px-2 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                        {fechados}
                                                                    </th>
                                                                    <th scope="col" className="px-6 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                        {fechatres}
                                                                    </th>
                                                                    <th scope="col" className="px-0 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                        {fechacuatro}
                                                                    </th>
                                                                    <th scope="col" className="px-0 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                        {fechacinco}
                                                                    </th>
                                                                    <th scope="col" className="px-4 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                        {fechaseis}
                                                                    </th>
                                                                    <th scope="col" className="px-4 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                        {fechasiete}
                                                                    </th>

                                                                </tr>
                                                            </thead>{ }
                                                            <tbody className="bg-white">
                                                                {
                                                                    movimientos && movimientos.map((ventas, comprasIdx) => (

                                                                        <tr key={ventas.nombre} className={comprasIdx % 2 === 0 ? undefined : 'bg-gray-50'}>
                                                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                                {ventas.subcategorias}
                                                                            </td>
                                                                            <td className="whitespace-nowrap py-4 text-right text-sm text-gray-500">
                                                                                {
                                                                                    myNumber(1, ventas.vtamasimpuestouno)
                                                                                }
                                                                            </td>
                                                                            <td className="whitespace-nowrap px-2 py-4 text-right text-sm text-gray-500">
                                                                                {
                                                                                    myNumber(1, ventas.vtamasimpuestodos)
                                                                                }
                                                                            </td>
                                                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                                                                                {
                                                                                    myNumber(1, ventas.vtamasimpuestotres)
                                                                                }
                                                                            </td>

                                                                            <td className="whitespace-nowrap py-4 text-right text-sm text-gray-500">
                                                                                {
                                                                                    myNumber(1, ventas.vtamasimpuestocuatro)
                                                                                }
                                                                            </td>
                                                                            <td className="whitespace-nowrap px-2 py-4 text-right text-sm text-gray-500">
                                                                                {
                                                                                    myNumber(1, ventas.vtamasimpuestocinco)
                                                                                }
                                                                            </td>
                                                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                                                                                {
                                                                                    myNumber(1, ventas.vtamasimpuestoseis)
                                                                                }
                                                                            </td>
                                                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                                                                                {
                                                                                    myNumber(1, ventas.vtamasimpuestosiete)
                                                                                }
                                                                            </td>

                                                                        </tr>

                                                                    ))
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                    :
                                    entVtasLinea ?
                                        (
                                            <div className="mt-8 flex flex-col">
                                                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">

                                                            <table className="min-w-full divide-y divide-gray-300">
                                                                <thead className="bg-gray-50">

                                                                    <tr>
                                                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                                            {textoTipo}
                                                                        </th>
                                                                        <th scope="col" className="px-0 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                            {fechauno}
                                                                        </th>
                                                                        <th scope="col" className="px-2 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                            {fechados}
                                                                        </th>
                                                                        <th scope="col" className="px-6 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                            {fechatres}
                                                                        </th>
                                                                        <th scope="col" className="px-0 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                            {fechacuatro}
                                                                        </th>
                                                                        <th scope="col" className="px-0 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                            {fechacinco}
                                                                        </th>
                                                                        <th scope="col" className="px-4 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                            {fechaseis}
                                                                        </th>
                                                                        <th scope="col" className="px-4 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                            {fechasiete}
                                                                        </th>

                                                                    </tr>
                                                                </thead>{ }
                                                                <tbody className="bg-white">
                                                                    {
                                                                        movimientos && movimientos.map((ventas, comprasIdx) => (

                                                                            <tr key={ventas.nombre} className={comprasIdx % 2 === 0 ? undefined : 'bg-gray-50'}>
                                                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                                    {ventas.lineas}
                                                                                </td>
                                                                                <td className="whitespace-nowrap py-4 text-right text-sm text-gray-500">
                                                                                    {
                                                                                        myNumber(1, ventas.vtamasimpuestouno)
                                                                                    }
                                                                                </td>
                                                                                <td className="whitespace-nowrap px-2 py-4 text-right text-sm text-gray-500">
                                                                                    {
                                                                                        myNumber(1, ventas.vtamasimpuestodos)
                                                                                    }
                                                                                </td>
                                                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                                                                                    {
                                                                                        myNumber(1, ventas.vtamasimpuestotres)
                                                                                    }
                                                                                </td>

                                                                                <td className="whitespace-nowrap py-4 text-right text-sm text-gray-500">
                                                                                    {
                                                                                        myNumber(1, ventas.vtamasimpuestocuatro)
                                                                                    }
                                                                                </td>
                                                                                <td className="whitespace-nowrap px-2 py-4 text-right text-sm text-gray-500">
                                                                                    {
                                                                                        myNumber(1, ventas.vtamasimpuestocinco)
                                                                                    }
                                                                                </td>
                                                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                                                                                    {
                                                                                        myNumber(1, ventas.vtamasimpuestoseis)
                                                                                    }
                                                                                </td>
                                                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                                                                                    {
                                                                                        myNumber(1, ventas.vtamasimpuestosiete)
                                                                                    }
                                                                                </td>

                                                                            </tr>

                                                                        ))
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                        :
                                        null
                    )
                    :
                    null
                }
            </div>
        </div>
    )
}

export default TabVtasDiariasFiltro;