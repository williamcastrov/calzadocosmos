import { Fragment, useState, useEffect } from "react";
import { myNumber, nameMonth } from "../../../utils/ArrayFunctions";
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MultiSelect } from "react-multi-select-component";
import { Table, Tag, Typography } from 'antd';
import swal from 'sweetalert';

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function TabVtasDiarias(props) {
    const { Title } = Typography;
    const { tipo, setTipo, ventasDiariasMes, ventasDiariasMesSubcategoria } = props;
    const [entMes, setEntMes] = useState(true);
    const [entAcumuladas, setEntAcumuladas] = useState(false);
    const [movimientos, setmovimientos] = useState(false);
    const [opcion, setOpcion] = useState(0);
    const [actualiza, setActualiza] = useState(false);
    const [textoTipo, setTextoTipo] = useState("CENTROS_DE_OPERACIÓN");

    const [filtroAno, setFiltroAno] = useState(null);
    const [filtroMes, setFiltroMes] = useState(null);
    const [filtroDia, setFiltroDia] = useState(null);
    const [labeldias, setLabeldias] = useState([]);
    const [labeldiasDos, setLabeldiasDos] = useState([]);
    const [consultar, setConsultar] = useState(false);

    const [label1, setLabel1] = useState("");
    const [label2, setLabel2] = useState("");
    const [label3, setLabel3] = useState("");

    const [selectedAno, setSelectedAno] = useState([]);
    const [selectedSemestre, setSelectedSemestre] = useState([]);
    const [selectedTrimestre, setSelectedTrimestre] = useState([]);
    const [selectedMes, setSelectedMes] = useState([]);
    const [selectedDia, setSelectedDia] = useState([]);

    const [vtasAno, setVtasAno] = useState([]);
    const [vtasMes, setVtasMes] = useState([]);
    const [vtasDia, setVtasDia] = useState([]);
    const [vtasSemestre, setVtasSemestre] = useState([]);
    const [vtasTrimestre, setVtasTrimestre] = useState([]);

    const [centrosoperacion, setCentrosoperacion] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);

    //console.log("VENTAS DIARIAS MES XXX: ", ventasDiariasMes);
    //console.log("LABEL DIAS: ", labelVentas);
    const tabsdos = [
        { name: 'Centro operación', href: '#', current: entMes },
        { name: 'Sublínea', href: '#', current: entAcumuladas },
    ]

    const reiniciar = () => {
        setmovimientos([])
    }

    useEffect(() => {
        setCentrosoperacion(ventasDiariasMes.centrosoperacion);
        setSubcategorias(ventasDiariasMes.subcategorias);

        let newDetAnos = [];
        setVtasSemestre(ventasDiariasMes.semestre_vtasdiarias);
        setVtasTrimestre(ventasDiariasMes.trimestre_vtasdiarias);

        ventasDiariasMes.anos_vtasdiarias &&
            ventasDiariasMes.anos_vtasdiarias.map((anos, index) => {
                let vta = {
                    Ventas_ano: anos.Ventas_ano,
                    value: anos.Ventas_ano,
                    label: anos.Ventas_ano
                };
                newDetAnos.push(vta);
            });
        setVtasAno(newDetAnos);

        let newDetMes = [];
        ventasDiariasMes.meses_vtasdiarias &&
            ventasDiariasMes.meses_vtasdiarias.map((meses, index) => {
                let mes;
                if (meses.Ventas_mes < 10)
                    mes = "0" + meses.Ventas_mes;
                else
                    mes = "" + meses.Ventas_mes;

                let vta = {
                    Ventas_mes: mes,
                    value: meses.Ventas_mes,
                    label: nameMonth(mes)
                };
                newDetMes.push(vta);
            });
        setVtasMes(newDetMes);

        let newDetDia = [];
        ventasDiariasMes.dias_vtas &&
            ventasDiariasMes.dias_vtas.map((dias, index) => {
                let vta = {
                    dia: dias.dia,
                    value: dias.dia,
                    label: dias.dia
                };
                newDetDia.push(vta);
            });
        setVtasDia(newDetDia);
    }, [ventasDiariasMes]);

    const selVentas = (seleccion) => {
        setOpcion(seleccion)
        setActualiza(!actualiza);
        generarConsulta();
        console.log("SEL OPCION: ", seleccion);
        if (seleccion == 0)
            setTextoTipo("CENTROS_DE_OPERACIÓN")
        else
            if (seleccion == 1)
                setTextoTipo("SUBCATEGORÍAS")
            else
                setTextoTipo("")
    }

    const limpiarFiltros = () => {
        setFiltroAno(null);
        setFiltroMes(null);
        setFiltroDia(null);
        setmovimientos([]);
    }

    const generarConsulta = () => {
        if (selectedAno.length < 1) {
            swal({
                title: "Tablero Cosmos",
                text: "Primero debes seleccionar el año!",
                icon: "warning",
            });
            return
        }
        setActualiza(!actualiza);
        setConsultar(true)
    }

    useEffect(() => {
        setConsultar(false);
        setActualiza(!actualiza);
        if (selectedAno.length > 0 && selectedMes.length > 0 && selectedDia.length == 0) {

            if (selectedAno.length > 1) {
                swal({
                    title: "Tablero Cosmos",
                    text: "Seleccionar maximo un año!",
                    icon: "warning",
                });
                return
            }

            let periodo = 0;
            if (selectedMes[0].value > 9)
                periodo = "" + selectedAno[0].value + selectedMes[0].value;
            else
                periodo = "" + selectedAno[0].value + "0" + selectedMes[0].value;
            //console.log("PERIODO : ", periodo);

            let newDet = [];
            let newDetDos = [];

            ventasDiariasMes.label_ventas_diarias &&
                ventasDiariasMes.label_ventas_diarias.map((dias, index) => {

                    if (dias.Periodo == periodo) {
                        let vta = {
                            Periodo: dias.Periodo,
                            Dia1: dias.Dia1, Dia2: dias.Dia2, Dia3: dias.Dia3, Dia4: dias.Dia4, Dia5: dias.Dia5,
                            Dia6: dias.Dia6, Dia7: dias.Dia7, Dia8: dias.Dia8, Dia9: dias.Dia9, Dia10: dias.Dia10,
                            Dia11: dias.Dia11, Dia12: dias.Dia12, Dia13: dias.Dia13, Dia14: dias.Dia14, Dia15: dias.Dia15,
                            Dia16: dias.Dia16, Dia17: dias.Dia17, Dia18: dias.Dia18, Dia19: dias.Dia19, Dia20: dias.Dia20,
                            Dia21: dias.Dia21, Dia22: dias.Dia22, Dia23: dias.Dia23, Dia24: dias.Dia24, Dia25: dias.Dia25,
                            Dia26: dias.Dia26, Dia27: dias.Dia27, Dia28: dias.Dia28, Dia29: dias.Dia29, Dia30: dias.Dia30,
                            Dia31: dias.Dia31,
                        };
                        newDet.push(vta);
                    }
                });
            setLabeldias(newDet)
            setLabeldiasDos(newDetDos)
            //console.log("LABEL DIAS : ", newDetDos)

            if (opcion == 0) {
                let newDetVtas = [];

                let totaldia1 = 0; let totaldia2 = 0; let totaldia3 = 0; let totaldia4 = 0;
                let totaldia5 = 0; let totaldia6 = 0; let totaldia7 = 0; let totaldia8 = 0;
                let totaldia9 = 0; let totaldia10 = 0; let totaldia11 = 0; let totaldia12 = 0;
                let totaldia13 = 0; let totaldia14 = 0; let totaldia15 = 0; let totaldia16 = 0;
                let totaldia17 = 0; let totaldia18 = 0; let totaldia19 = 0; let totaldia20 = 0;
                let totaldia21 = 0; let totaldia22 = 0; let totaldia23 = 0; let totaldia24 = 0;
                let totaldia25 = 0; let totaldia26 = 0; let totaldia27 = 0; let totaldia28 = 0;
                let totaldia29 = 0; let totaldia30 = 0; let totaldia31 = 0;

                ventasDiariasMes.ventas_diarias &&
                    ventasDiariasMes.ventas_diarias.map((vtas, index) => {

                        if (vtas.Periodo == periodo) {

                            let valor = parseInt(vtas.dia_1) + parseInt(vtas.dia_2) + parseInt(vtas.dia_3) + parseInt(vtas.dia_4) +
                                parseInt(vtas.dia_5) + parseInt(vtas.dia_6) + parseInt(vtas.dia_7) + parseInt(vtas.dia_8) +
                                parseInt(vtas.dia_9) + parseInt(vtas.dia_10) + parseInt(vtas.dia_11) + parseInt(vtas.dia_12) +
                                parseInt(vtas.dia_13) + parseInt(vtas.dia_14) + parseInt(vtas.dia_15) + parseInt(vtas.dia_16) +
                                parseInt(vtas.dia_17) + parseInt(vtas.dia_18) + parseInt(vtas.dia_19) +
                                parseInt(vtas.dia_20) + parseInt(vtas.dia_21) + parseInt(vtas.dia_22) +
                                parseInt(vtas.dia_23) + parseInt(vtas.dia_24) + parseInt(vtas.dia_25) +
                                parseInt(vtas.dia_26) + parseInt(vtas.dia_27) + parseInt(vtas.dia_28) + parseInt(vtas.dia_29) +
                                parseInt(vtas.dia_30) + parseInt(vtas.dia_31)

                            let vta = {
                                Nombreagrupa: vtas.Nombreagrupa,
                                Periodo: vtas.Periodo,
                                dia_1: vtas.dia_1, dia_2: vtas.dia_2, dia_3: vtas.dia_3, dia_4: vtas.dia_4,
                                dia_5: vtas.dia_5, dia_6: vtas.dia_6, dia_7: vtas.dia_7,
                                dia_8: vtas.dia_8, dia_9: vtas.dia_9, dia_10: vtas.dia_10,
                                dia_11: vtas.dia_11, dia_12: vtas.dia_12, dia_13: vtas.dia_13,
                                dia_14: vtas.dia_14, dia_15: vtas.dia_15, dia_16: vtas.dia_16,
                                dia_17: vtas.dia_17, dia_18: vtas.dia_18, dia_19: vtas.dia_19,
                                dia_20: vtas.dia_20, dia_21: vtas.dia_21, dia_22: vtas.dia_22,
                                dia_23: vtas.dia_23, dia_24: vtas.dia_24, dia_25: vtas.dia_25,
                                dia_26: vtas.dia_26, dia_27: vtas.dia_27, dia_28: vtas.dia_28,
                                dia_29: vtas.dia_29, dia_30: vtas.dia_30, dia_31: vtas.dia_31,
                                totalcentro: valor,
                            };
                            newDetVtas.push(vta);

                        }
                    });

                newDetVtas &&
                    newDetVtas.map((vtas, index) => {
                        totaldia1 = parseInt(totaldia1) + parseInt(vtas.dia_1); totaldia2 = parseInt(totaldia2) + parseInt(vtas.dia_2);
                        totaldia3 = parseInt(totaldia3) + parseInt(vtas.dia_3); totaldia4 = parseInt(totaldia4) + parseInt(vtas.dia_4);
                        totaldia5 = parseInt(totaldia5) + parseInt(vtas.dia_5); totaldia6 = parseInt(totaldia6) + parseInt(vtas.dia_6);
                        totaldia7 = parseInt(totaldia7) + parseInt(vtas.dia_7); totaldia8 = parseInt(totaldia8) + parseInt(vtas.dia_8);
                        totaldia9 = parseInt(totaldia9) + parseInt(vtas.dia_9); totaldia10 = parseInt(totaldia10) + parseInt(vtas.dia_10);
                        totaldia11 = parseInt(totaldia11) + parseInt(vtas.dia_11); totaldia12 = parseInt(totaldia12) + parseInt(vtas.dia_12);
                        totaldia13 = parseInt(totaldia13) + parseInt(vtas.dia_13); totaldia14 = parseInt(totaldia14) + parseInt(vtas.dia_14);
                        totaldia15 = parseInt(totaldia15) + parseInt(vtas.dia_15); totaldia16 = parseInt(totaldia16) + parseInt(vtas.dia_16);
                        totaldia17 = parseInt(totaldia17) + parseInt(vtas.dia_17); totaldia18 = parseInt(totaldia18) + parseInt(vtas.dia_18);
                        totaldia19 = parseInt(totaldia19) + parseInt(vtas.dia_19); totaldia20 = parseInt(totaldia20) + parseInt(vtas.dia_20);
                        totaldia21 = parseInt(totaldia21) + parseInt(vtas.dia_21); totaldia22 = parseInt(totaldia22) + parseInt(vtas.dia_22);
                        totaldia23 = parseInt(totaldia23) + parseInt(vtas.dia_23); totaldia24 = parseInt(totaldia24) + parseInt(vtas.dia_24);
                        totaldia25 = parseInt(totaldia25) + parseInt(vtas.dia_25); totaldia26 = parseInt(totaldia26) + parseInt(vtas.dia_26);
                        totaldia27 = parseInt(totaldia27) + parseInt(vtas.dia_27); totaldia28 = parseInt(totaldia28) + parseInt(vtas.dia_28);
                        totaldia29 = parseInt(totaldia29) + parseInt(vtas.dia_29); totaldia30 = parseInt(totaldia30) + parseInt(vtas.dia_30);
                        totaldia31 = parseInt(totaldia31) + parseInt(vtas.dia_31);
                    });

                let tot = {
                    Nombreagrupa: "TOTAL",
                    Periodo: periodo,
                    dia_1: totaldia1, dia_2: totaldia2, dia_3: totaldia3, dia_4: totaldia4,
                    dia_5: totaldia5, dia_6: totaldia6, dia_7: totaldia7,
                    dia_8: totaldia8, dia_9: totaldia9, dia_10: totaldia10,
                    dia_11: totaldia11, dia_12: totaldia12, dia_13: totaldia13,
                    dia_14: totaldia14, dia_15: totaldia15, dia_16: totaldia16,
                    dia_17: totaldia17, dia_18: totaldia18, dia_19: totaldia19,
                    dia_20: totaldia20, dia_21: totaldia21, dia_22: totaldia22,
                    dia_23: totaldia23, dia_24: totaldia24, dia_25: totaldia25,
                    dia_26: totaldia26, dia_27: totaldia27, dia_28: totaldia28,
                    dia_29: totaldia29, dia_30: totaldia30, dia_31: totaldia31,
                    totalcentro: (totaldia1 + totaldia2 + totaldia3 + totaldia4 + totaldia5 + totaldia6 + totaldia7 + totaldia8 + totaldia9 + totaldia10 + totaldia11 +
                        totaldia12 + totaldia13 + totaldia14 + totaldia15 + totaldia16 + totaldia17 + totaldia18 + totaldia19 + totaldia20 + totaldia21 +
                        totaldia22 + totaldia23 + totaldia24 + totaldia25 + totaldia26 + totaldia27 + totaldia28 + totaldia29 + totaldia30 + totaldia31)

                }

                newDetVtas.push(tot);
                //console.log("VENTAS DIAS : ", tot);
                setmovimientos(newDetVtas);
            } else
                if (opcion == 1) {
                    let newDetVtas = [];

                    let totaldia1 = 0; let totaldia2 = 0; let totaldia3 = 0; let totaldia4 = 0;
                    let totaldia5 = 0; let totaldia6 = 0; let totaldia7 = 0; let totaldia8 = 0;
                    let totaldia9 = 0; let totaldia10 = 0; let totaldia11 = 0; let totaldia12 = 0;
                    let totaldia13 = 0; let totaldia14 = 0; let totaldia15 = 0; let totaldia16 = 0;
                    let totaldia17 = 0; let totaldia18 = 0; let totaldia19 = 0; let totaldia20 = 0;
                    let totaldia21 = 0; let totaldia22 = 0; let totaldia23 = 0; let totaldia24 = 0;
                    let totaldia25 = 0; let totaldia26 = 0; let totaldia27 = 0; let totaldia28 = 0;
                    let totaldia29 = 0; let totaldia30 = 0; let totaldia31 = 0;


                    ventasDiariasMesSubcategoria &&
                        ventasDiariasMesSubcategoria.map((vtas, index) => {

                            let valor = parseInt(vtas.dia_1) + parseInt(vtas.dia_2) + parseInt(vtas.dia_3) + parseInt(vtas.dia_4) +
                                parseInt(vtas.dia_5) + parseInt(vtas.dia_6) + parseInt(vtas.dia_7) + parseInt(vtas.dia_8) +
                                parseInt(vtas.dia_9) + parseInt(vtas.dia_10) + parseInt(vtas.dia_11) + parseInt(vtas.dia_12) +
                                parseInt(vtas.dia_13) + parseInt(vtas.dia_14) + parseInt(vtas.dia_15) + parseInt(vtas.dia_16) +
                                parseInt(vtas.dia_17) + parseInt(vtas.dia_18) + parseInt(vtas.dia_19) +
                                parseInt(vtas.dia_20) + parseInt(vtas.dia_21) + parseInt(vtas.dia_22) +
                                parseInt(vtas.dia_23) + parseInt(vtas.dia_24) + parseInt(vtas.dia_25) +
                                parseInt(vtas.dia_26) + parseInt(vtas.dia_27) + parseInt(vtas.dia_28) + parseInt(vtas.dia_29) +
                                parseInt(vtas.dia_30) + parseInt(vtas.dia_31)

                            if (vtas.Periodo == periodo) {
                                let vta = {
                                    Nombreagrupa: vtas.Nombreagrupa,
                                    Periodo: vtas.Periodo,
                                    dia_1: vtas.dia_1, dia_2: vtas.dia_2, dia_3: vtas.dia_3, dia_4: vtas.dia_4,
                                    dia_5: vtas.dia_5, dia_6: vtas.dia_6, dia_7: vtas.dia_7,
                                    dia_8: vtas.dia_8, dia_9: vtas.dia_9, dia_10: vtas.dia_10,
                                    dia_11: vtas.dia_11, dia_12: vtas.dia_12, dia_13: vtas.dia_13,
                                    dia_14: vtas.dia_14, dia_15: vtas.dia_15, dia_16: vtas.dia_16,
                                    dia_17: vtas.dia_17, dia_18: vtas.dia_18, dia_19: vtas.dia_19,
                                    dia_20: vtas.dia_20, dia_21: vtas.dia_21, dia_22: vtas.dia_22,
                                    dia_23: vtas.dia_23, dia_24: vtas.dia_24, dia_25: vtas.dia_25,
                                    dia_26: vtas.dia_26, dia_27: vtas.dia_27, dia_28: vtas.dia_28,
                                    dia_29: vtas.dia_29, dia_30: vtas.dia_30, dia_31: vtas.dia_31,
                                    totalcentro: valor,
                                };
                                newDetVtas.push(vta);
                            }
                        });

                    newDetVtas &&
                        newDetVtas.map((vtas, index) => {
                            totaldia1 = parseInt(totaldia1) + parseInt(vtas.dia_1); totaldia2 = parseInt(totaldia2) + parseInt(vtas.dia_2);
                            totaldia3 = parseInt(totaldia3) + parseInt(vtas.dia_3); totaldia4 = parseInt(totaldia4) + parseInt(vtas.dia_4);
                            totaldia5 = parseInt(totaldia5) + parseInt(vtas.dia_5); totaldia6 = parseInt(totaldia6) + parseInt(vtas.dia_6);
                            totaldia7 = parseInt(totaldia7) + parseInt(vtas.dia_7); totaldia8 = parseInt(totaldia8) + parseInt(vtas.dia_8);
                            totaldia9 = parseInt(totaldia9) + parseInt(vtas.dia_9); totaldia10 = parseInt(totaldia10) + parseInt(vtas.dia_10);
                            totaldia11 = parseInt(totaldia11) + parseInt(vtas.dia_11); totaldia12 = parseInt(totaldia12) + parseInt(vtas.dia_12);
                            totaldia13 = parseInt(totaldia13) + parseInt(vtas.dia_13); totaldia14 = parseInt(totaldia14) + parseInt(vtas.dia_14);
                            totaldia15 = parseInt(totaldia15) + parseInt(vtas.dia_15); totaldia16 = parseInt(totaldia16) + parseInt(vtas.dia_16);
                            totaldia17 = parseInt(totaldia17) + parseInt(vtas.dia_17); totaldia18 = parseInt(totaldia18) + parseInt(vtas.dia_18);
                            totaldia19 = parseInt(totaldia19) + parseInt(vtas.dia_19); totaldia20 = parseInt(totaldia20) + parseInt(vtas.dia_20);
                            totaldia21 = parseInt(totaldia21) + parseInt(vtas.dia_21); totaldia22 = parseInt(totaldia22) + parseInt(vtas.dia_22);
                            totaldia23 = parseInt(totaldia23) + parseInt(vtas.dia_23); totaldia24 = parseInt(totaldia24) + parseInt(vtas.dia_24);
                            totaldia25 = parseInt(totaldia25) + parseInt(vtas.dia_25); totaldia26 = parseInt(totaldia26) + parseInt(vtas.dia_26);
                            totaldia27 = parseInt(totaldia27) + parseInt(vtas.dia_27); totaldia28 = parseInt(totaldia28) + parseInt(vtas.dia_28);
                            totaldia29 = parseInt(totaldia29) + parseInt(vtas.dia_29); totaldia30 = parseInt(totaldia30) + parseInt(vtas.dia_30);
                            totaldia31 = parseInt(totaldia31) + parseInt(vtas.dia_31);
                        });

                    let tot = {
                        Nombreagrupa: "TOTAL",
                        Periodo: periodo,
                        dia_1: totaldia1, dia_2: totaldia2, dia_3: totaldia3, dia_4: totaldia4,
                        dia_5: totaldia5, dia_6: totaldia6, dia_7: totaldia7,
                        dia_8: totaldia8, dia_9: totaldia9, dia_10: totaldia10,
                        dia_11: totaldia11, dia_12: totaldia12, dia_13: totaldia13,
                        dia_14: totaldia14, dia_15: totaldia15, dia_16: totaldia16,
                        dia_17: totaldia17, dia_18: totaldia18, dia_19: totaldia19,
                        dia_20: totaldia20, dia_21: totaldia21, dia_22: totaldia22,
                        dia_23: totaldia23, dia_24: totaldia24, dia_25: totaldia25,
                        dia_26: totaldia26, dia_27: totaldia27, dia_28: totaldia28,
                        dia_29: totaldia29, dia_30: totaldia30, dia_31: totaldia31,
                        totalcentro: (totaldia1 + totaldia2 + totaldia3 + totaldia4 + totaldia5 + totaldia6 + totaldia7 + totaldia8 + totaldia9 + totaldia10 + totaldia11 +
                            totaldia12 + totaldia13 + totaldia14 + totaldia15 + totaldia16 + totaldia17 + totaldia18 + totaldia19 + totaldia20 + totaldia21 +
                            totaldia22 + totaldia23 + totaldia24 + totaldia25 + totaldia26 + totaldia27 + totaldia28 + totaldia29 + totaldia30 + totaldia31)

                    }

                    newDetVtas.push(tot);
                    //console.log("VENTAS DIAS : ", newDetVtas);
                    setmovimientos(newDetVtas);
                } else
                    setmovimientos([])
        } else
            if (selectedAno.length > 0 && selectedMes.length > 0 && selectedDia.length > 0) {

                let periodo = 0;

                if (selectedMes[0].value > 9)
                    periodo = "" + selectedAno[0].value + selectedMes[0].value;
                else
                    periodo = "" + selectedAno[0].value + "0" + selectedMes[0].value;

                if (opcion == 0) {
                    let longitud = selectedAno.length;

                    let newDet = [];

                    if (selectedAno.length > 1 || selectedMes.length > 1 && selectedDia.length > 0) {
                        swal({
                            title: "Tablero Cosmos",
                            text: "Solo puedes seleccionar año, mes, día!",
                            icon: "warning",
                        });
                        return
                    }

                    let vta;
                    vta = {
                        Periodo: selectedAno[0].value,
                        Dia1: "VENTA-" + selectedAno[0].value + "-" + selectedMes[0].value + "-" + selectedDia[0].value
                    };
                    newDet.push(vta);
                    setLabeldias(newDet)

                    let newDetVtasAcum = [];
                    let newDetVtas = [];

                    let dia = selectedDia[0].value;
                    let total = 0;

                    ventasDiariasMes.ventas_diarias &&
                        ventasDiariasMes.ventas_diarias.map((vtas, index) => {

                            let valor = 0;

                            if (vtas.Periodo == periodo && 1 == dia) { valor = vtas.dia_1; }
                            else
                                if (vtas.Periodo == periodo && 2 == dia) { valor = vtas.dia_2; }
                                else
                                    if (vtas.Periodo == periodo && 3 == dia) { valor = vtas.dia_3; }
                                    else
                                        if (vtas.Periodo == periodo && 4 == dia) { valor = vtas.dia_4; }
                                        else
                                            if (vtas.Periodo == periodo && 5 == dia) { valor = vtas.dia_5; }
                                            else
                                                if (vtas.Periodo == periodo && 6 == dia) { valor = vtas.dia_6; }
                                                else
                                                    if (vtas.Periodo == periodo && 7 == dia) { valor = vtas.dia_7; }
                                                    else
                                                        if (vtas.Periodo == periodo && 8 == dia) { valor = vtas.dia_8; }
                                                        else
                                                            if (vtas.Periodo == periodo && 9 == dia) { valor = vtas.dia_9; }
                                                            else
                                                                if (vtas.Periodo == periodo && 10 == dia) { valor = vtas.dia_10; }
                                                                else
                                                                    if (vtas.Periodo == periodo && 11 == dia) { valor = vtas.dia_11; }
                                                                    else
                                                                        if (vtas.Periodo == periodo && 12 == dia) { valor = vtas.dia_12; }
                                                                        else
                                                                            if (vtas.Periodo == periodo && 13 == dia) { valor = vtas.dia_13; }
                                                                            else
                                                                                if (vtas.Periodo == periodo && 14 == dia) { valor = vtas.dia_14; }
                                                                                else
                                                                                    if (vtas.Periodo == periodo && 15 == dia) { valor = vtas.dia_15; }
                                                                                    else
                                                                                        if (vtas.Periodo == periodo && 16 == dia) { valor = vtas.dia_16; }
                                                                                        else
                                                                                            if (vtas.Periodo == periodo && 17 == dia) { valor = vtas.dia_17; }
                                                                                            else
                                                                                                if (vtas.Periodo == periodo && 18 == dia) { valor = vtas.dia_18; }
                                                                                                else
                                                                                                    if (vtas.Periodo == periodo && 19 == dia) { valor = vtas.dia_19; }
                                                                                                    else
                                                                                                        if (vtas.Periodo == periodo && 20 == dia) { valor = vtas.dia_20; }
                                                                                                        else
                                                                                                            if (vtas.Periodo == periodo && 21 == dia) { valor = vtas.dia_21; }
                                                                                                            else
                                                                                                                if (vtas.Periodo == periodo && 22 == dia) { valor = vtas.dia_22; }
                                                                                                                else
                                                                                                                    if (vtas.Periodo == periodo && 23 == dia) { valor = vtas.dia_23; }
                                                                                                                    else
                                                                                                                        if (vtas.Periodo == periodo && 24 == dia) { valor = vtas.dia_24; }
                                                                                                                        else
                                                                                                                            if (vtas.Periodo == periodo && 25 == dia) { valor = vtas.dia_25; }
                                                                                                                            else
                                                                                                                                if (vtas.Periodo == periodo && 26 == dia) { valor = vtas.dia_26; }
                                                                                                                                else
                                                                                                                                    if (vtas.Periodo == periodo && 27 == dia) { valor = vtas.dia_27; }
                                                                                                                                    else
                                                                                                                                        if (vtas.Periodo == periodo && 28 == dia) { valor = vtas.dia_28; }
                                                                                                                                        else
                                                                                                                                            if (vtas.Periodo == periodo && 29 == dia) { valor = vtas.dia_29; }
                                                                                                                                            else
                                                                                                                                                if (vtas.Periodo == periodo && 30 == dia) { valor = vtas.dia_30; }
                                                                                                                                                else
                                                                                                                                                    if (vtas.Periodo == periodo && 31 == dia) { valor = vtas.dia_31; }

                            if (valor > 0) {
                                total = parseInt(total) + parseInt(valor);

                                let vta = {
                                    Nombreagrupa: vtas.Nombreagrupa,
                                    Periodo: vtas.Periodo,
                                    dia_1: valor,
                                };
                                newDetVtas.push(vta);
                            }

                        });

                    let item = {
                        Nombreagrupa: "TOTAL",
                        Periodo: periodo,
                        dia_1: total,
                    };
                    newDetVtas.push(item);

                    setmovimientos(newDetVtas);
                } else
                    if (opcion == 1) {
                        let periodo = 0;

                        if (selectedMes[0].value > 9)
                            periodo = "" + selectedAno[0].value + selectedMes[0].value;
                        else
                            periodo = "" + selectedAno[0].value + "0" + selectedMes[0].value;

                        let longitud = selectedAno.length;

                        let newDet = [];

                        if (selectedAno.length > 1 || selectedMes.length > 1 && selectedDia.length > 0) {
                            swal({
                                title: "Tablero Cosmos",
                                text: "Solo puedes seleccionar año, mes, día!",
                                icon: "warning",
                            });
                            return
                        }

                        let vta;
                        vta = {
                            Periodo: selectedAno[0].value,
                            Dia1: "VENTA-" + selectedAno[0].value + "-" + selectedMes[0].value + "-" + selectedDia[0].value
                        };
                        newDet.push(vta);
                        setLabeldias(newDet)

                        //newDet.push(vta);

                        let newDetVtasAcum = [];
                        let newDetVtas = [];
                        setLabeldias(newDet)

                        //console.log("VTAS SUB: ", ventasDiariasMesSubcategoria)
                        //return

                        let dia = selectedDia[0].value;
                        let total = 0;

                        subcategorias &&
                            subcategorias.map((centros, index) => {

                                ventasDiariasMesSubcategoria &&
                                    ventasDiariasMesSubcategoria.map((vtas, index) => {

                                        if (vtas.Nombreagrupa == centros.Subcategorias) {

                                            let valor = 0;

                                            if (vtas.Periodo == periodo && 1 == dia) { valor = vtas.dia_1; }
                                            else
                                                if (vtas.Periodo == periodo && 2 == dia) { valor = vtas.dia_2; }
                                                else
                                                    if (vtas.Periodo == periodo && 3 == dia) { valor = vtas.dia_3; }
                                                    else
                                                        if (vtas.Periodo == periodo && 4 == dia) { valor = vtas.dia_4; }
                                                        else
                                                            if (vtas.Periodo == periodo && 5 == dia) { valor = vtas.dia_5; }
                                                            else
                                                                if (vtas.Periodo == periodo && 6 == dia) { valor = vtas.dia_6; }
                                                                else
                                                                    if (vtas.Periodo == periodo && 7 == dia) { valor = vtas.dia_7; }
                                                                    else
                                                                        if (vtas.Periodo == periodo && 8 == dia) { valor = vtas.dia_8; }
                                                                        else
                                                                            if (vtas.Periodo == periodo && 9 == dia) { valor = vtas.dia_9; }
                                                                            else
                                                                                if (vtas.Periodo == periodo && 10 == dia) { valor = vtas.dia_10; }
                                                                                else
                                                                                    if (vtas.Periodo == periodo && 11 == dia) { valor = vtas.dia_11; }
                                                                                    else
                                                                                        if (vtas.Periodo == periodo && 12 == dia) { valor = vtas.dia_12; }
                                                                                        else
                                                                                            if (vtas.Periodo == periodo && 13 == dia) { valor = vtas.dia_13; }
                                                                                            else
                                                                                                if (vtas.Periodo == periodo && 14 == dia) { valor = vtas.dia_14; }
                                                                                                else
                                                                                                    if (vtas.Periodo == periodo && 15 == dia) { valor = vtas.dia_15; }
                                                                                                    else
                                                                                                        if (vtas.Periodo == periodo && 16 == dia) { valor = vtas.dia_16; }
                                                                                                        else
                                                                                                            if (vtas.Periodo == periodo && 17 == dia) { valor = vtas.dia_17; }
                                                                                                            else
                                                                                                                if (vtas.Periodo == periodo && 18 == dia) { valor = vtas.dia_18; }
                                                                                                                else
                                                                                                                    if (vtas.Periodo == periodo && 19 == dia) { valor = vtas.dia_19; }
                                                                                                                    else
                                                                                                                        if (vtas.Periodo == periodo && 20 == dia) { valor = vtas.dia_20; }
                                                                                                                        else
                                                                                                                            if (vtas.Periodo == periodo && 21 == dia) { valor = vtas.dia_21; }
                                                                                                                            else
                                                                                                                                if (vtas.Periodo == periodo && 22 == dia) { valor = vtas.dia_22; }
                                                                                                                                else
                                                                                                                                    if (vtas.Periodo == periodo && 23 == dia) { valor = vtas.dia_23; }
                                                                                                                                    else
                                                                                                                                        if (vtas.Periodo == periodo && 24 == dia) { valor = vtas.dia_24; }
                                                                                                                                        else
                                                                                                                                            if (vtas.Periodo == periodo && 25 == dia) { valor = vtas.dia_25; }
                                                                                                                                            else
                                                                                                                                                if (vtas.Periodo == periodo && 26 == dia) { valor = vtas.dia_26; }
                                                                                                                                                else
                                                                                                                                                    if (vtas.Periodo == periodo && 27 == dia) { valor = vtas.dia_27; }
                                                                                                                                                    else
                                                                                                                                                        if (vtas.Periodo == periodo && 28 == dia) { valor = vtas.dia_28; }
                                                                                                                                                        else
                                                                                                                                                            if (vtas.Periodo == periodo && 29 == dia) { valor = vtas.dia_29; }
                                                                                                                                                            else
                                                                                                                                                                if (vtas.Periodo == periodo && 30 == dia) { valor = vtas.dia_30; }
                                                                                                                                                                else
                                                                                                                                                                    if (vtas.Periodo == periodo && 31 == dia) { valor = vtas.dia_31; }


                                            if (valor > 0) {
                                                total = parseInt(total) + parseInt(valor);

                                                let vta = {
                                                    Nombreagrupa: vtas.Nombreagrupa,
                                                    Periodo: vtas.Periodo,
                                                    dia_1: valor,
                                                };
                                                newDetVtas.push(vta);
                                            }
                                        }
                                    });
                            });

                        let item = {
                            Nombreagrupa: "TOTAL",
                            Periodo: periodo,
                            dia_1: total,
                        };
                        newDetVtas.push(item);

                        //console.log("VENTAS ANÑO : ", newDetVtasAcum)
                        setmovimientos(newDetVtas);
                    }
            } else
                if (selectedAno.length > 0) {
                    if (opcion == 0) {
                        let longitud = selectedAno.length;

                        let newDet = [];

                        if (longitud == 1) {
                            let vta = {
                                Periodo: selectedAno[0].value,
                                Dia1: "VENTA_TOTAL" + selectedAno[0].value
                            };
                            setLabel1(vta.Dia1);
                            newDet.push(vta);
                        } else
                            if (longitud == 2) {
                                let vta;
                                vta = {
                                    Periodo: selectedAno[0].value,
                                    Dia1: "VENTA_AÑO" + selectedAno[0].value,
                                    Dia2: "VENTA_AÑO" + selectedAno[1].value,
                                    Dia3: "VARIACIÓN"
                                };
                                setLabel1(vta.Dia1);
                                setLabel2(vta.Dia2);
                                setLabel3(vta.Dia3);
                                newDet.push(vta);
                            } else {
                                swal({
                                    title: "Tablero Cosmos",
                                    text: "Seleccionar maximo dos años!",
                                    icon: "warning",
                                });
                                return
                            }
                        setLabeldias(newDet)

                        let newDetVtasAcum = [];
                        centrosoperacion &&
                            centrosoperacion.map((centros, index) => {
                                let ventas = 0;
                                let ventasuno = 0;
                                let variacion = 0;
                                ventasDiariasMes.ventas_diarias &&
                                    ventasDiariasMes.ventas_diarias.map((vtas, index) => {

                                        if (vtas.Nombreagrupa == centros.Centros_Operacion &&
                                            vtas.Ventas_ano == selectedAno[0].value) {

                                            ventas = parseInt(ventas) + parseInt(vtas.dia_1) +
                                                parseInt(vtas.dia_2) + parseInt(vtas.dia_3) + parseInt(vtas.dia_4) +
                                                parseInt(vtas.dia_5) + parseInt(vtas.dia_6) + parseInt(vtas.dia_7) +
                                                parseInt(vtas.dia_8) + parseInt(vtas.dia_9) + parseInt(vtas.dia_10) +
                                                parseInt(vtas.dia_11) + parseInt(vtas.dia_12) + parseInt(vtas.dia_13) +
                                                parseInt(vtas.dia_14) + parseInt(vtas.dia_15) + parseInt(vtas.dia_16) +
                                                parseInt(vtas.dia_17) + parseInt(vtas.dia_18) + parseInt(vtas.dia_19) +
                                                parseInt(vtas.dia_20) + parseInt(vtas.dia_21) + parseInt(vtas.dia_22) +
                                                parseInt(vtas.dia_23) + parseInt(vtas.dia_24) + parseInt(vtas.dia_25) +
                                                parseInt(vtas.dia_26) + parseInt(vtas.dia_27) + parseInt(vtas.dia_28) +
                                                parseInt(vtas.dia_29) + parseInt(vtas.dia_30) + parseInt(vtas.dia_31);
                                        }

                                        if (longitud == 2) {
                                            if (vtas.Nombreagrupa == centros.Centros_Operacion &&
                                                vtas.Ventas_ano == selectedAno[1].value) {

                                                ventasuno = parseInt(ventasuno) + parseInt(vtas.dia_1) +
                                                    parseInt(vtas.dia_2) + parseInt(vtas.dia_3) + parseInt(vtas.dia_4) +
                                                    parseInt(vtas.dia_5) + parseInt(vtas.dia_6) + parseInt(vtas.dia_7) +
                                                    parseInt(vtas.dia_8) + parseInt(vtas.dia_9) + parseInt(vtas.dia_10) +
                                                    parseInt(vtas.dia_11) + parseInt(vtas.dia_12) + parseInt(vtas.dia_13) +
                                                    parseInt(vtas.dia_14) + parseInt(vtas.dia_15) + parseInt(vtas.dia_16) +
                                                    parseInt(vtas.dia_17) + parseInt(vtas.dia_18) + parseInt(vtas.dia_19) +
                                                    parseInt(vtas.dia_20) + parseInt(vtas.dia_21) + parseInt(vtas.dia_22) +
                                                    parseInt(vtas.dia_23) + parseInt(vtas.dia_24) + parseInt(vtas.dia_25) +
                                                    parseInt(vtas.dia_26) + parseInt(vtas.dia_27) + parseInt(vtas.dia_28) +
                                                    parseInt(vtas.dia_29) + parseInt(vtas.dia_30) + parseInt(vtas.dia_31);
                                            }
                                        }

                                        variacion = (((ventasuno / ventas) - 1) * 100).toFixed(2);
                                        if (isNaN(variacion)) {
                                            variacion = 0;
                                        }
                                    });

                                let vta;
                                if (longitud == 2) {
                                    vta = {
                                        Nombreagrupa: centros.Centros_Operacion,
                                        Periodo: selectedAno[0].value,
                                        dia_1: ventas,
                                        dia_2: ventasuno,
                                        dia_3: variacion + " %"
                                    };
                                } else {
                                    vta = {
                                        Nombreagrupa: centros.Centros_Operacion,
                                        Periodo: selectedAno[0].value,
                                        dia_1: ventas
                                    };
                                }
                                newDetVtasAcum.push(vta);
                            });
                        //console.log("VENTAS ANÑO : ", newDetVtasAcum)
                        setmovimientos(newDetVtasAcum);
                    } else
                        if (opcion == 1) {
                            let longitud = selectedAno.length;

                            let newDet = [];

                            if (longitud == 1) {
                                let vta = {
                                    Periodo: selectedAno[0].value,
                                    Dia1: "VENTA_TOTAL" + selectedAno[0].value
                                };
                                newDet.push(vta);
                                setLabel1(vta.Dia1);
                            } else
                                if (longitud == 2) {
                                    let vta;
                                    vta = {
                                        Periodo: selectedAno[0].value,
                                        Dia1: "VENTA_AÑO" + selectedAno[0].value,
                                        Dia2: "VARIACIÓN" + selectedAno[1].value,
                                        Dia3: "VARIACIÓN"
                                    };
                                    newDet.push(vta);
                                    setLabel1(vta.Dia1);
                                    setLabel2(vta.Dia2);
                                    setLabel3(vta.Dia3);
                                } else {
                                    swal({
                                        title: "Tablero Cosmos",
                                        text: "Seleccionar maximo dos años!",
                                        icon: "warning",
                                    });
                                    return
                                }
                            setLabeldias(newDet)

                            //newDet.push(vta);
                            setLabeldias(newDet)

                            let newDetVtasAcum = [];
                            subcategorias &&
                                subcategorias.map((centros, index) => {
                                    let ventas = 0;
                                    let ventasuno = 0;
                                    let variacion = 0;
                                    ventasDiariasMesSubcategoria &&
                                        ventasDiariasMesSubcategoria.map((vtas, index) => {

                                            if (vtas.Nombreagrupa == centros.Subcategorias &&
                                                vtas.Ventas_ano == selectedAno[0].value) {

                                                ventas = parseInt(ventas) + parseInt(vtas.dia_1) +
                                                    parseInt(vtas.dia_2) + parseInt(vtas.dia_3) + parseInt(vtas.dia_4) +
                                                    parseInt(vtas.dia_5) + parseInt(vtas.dia_6) + parseInt(vtas.dia_7) +
                                                    parseInt(vtas.dia_8) + parseInt(vtas.dia_9) + parseInt(vtas.dia_10) +
                                                    parseInt(vtas.dia_11) + parseInt(vtas.dia_12) + parseInt(vtas.dia_13) +
                                                    parseInt(vtas.dia_14) + parseInt(vtas.dia_15) + parseInt(vtas.dia_16) +
                                                    parseInt(vtas.dia_17) + parseInt(vtas.dia_18) + parseInt(vtas.dia_19) +
                                                    parseInt(vtas.dia_20) + parseInt(vtas.dia_21) + parseInt(vtas.dia_22) +
                                                    parseInt(vtas.dia_23) + parseInt(vtas.dia_24) + parseInt(vtas.dia_25) +
                                                    parseInt(vtas.dia_26) + parseInt(vtas.dia_27) + parseInt(vtas.dia_28) +
                                                    parseInt(vtas.dia_29) + parseInt(vtas.dia_30) + parseInt(vtas.dia_31);
                                            }

                                            if (longitud == 2) {

                                                if (vtas.Nombreagrupa == centros.Subcategorias &&
                                                    vtas.Ventas_ano == selectedAno[1].value) {

                                                    ventasuno = parseInt(ventas) + parseInt(vtas.dia_1) +
                                                        parseInt(vtas.dia_2) + parseInt(vtas.dia_3) + parseInt(vtas.dia_4) +
                                                        parseInt(vtas.dia_5) + parseInt(vtas.dia_6) + parseInt(vtas.dia_7) +
                                                        parseInt(vtas.dia_8) + parseInt(vtas.dia_9) + parseInt(vtas.dia_10) +
                                                        parseInt(vtas.dia_11) + parseInt(vtas.dia_12) + parseInt(vtas.dia_13) +
                                                        parseInt(vtas.dia_14) + parseInt(vtas.dia_15) + parseInt(vtas.dia_16) +
                                                        parseInt(vtas.dia_17) + parseInt(vtas.dia_18) + parseInt(vtas.dia_19) +
                                                        parseInt(vtas.dia_20) + parseInt(vtas.dia_21) + parseInt(vtas.dia_22) +
                                                        parseInt(vtas.dia_23) + parseInt(vtas.dia_24) + parseInt(vtas.dia_25) +
                                                        parseInt(vtas.dia_26) + parseInt(vtas.dia_27) + parseInt(vtas.dia_28) +
                                                        parseInt(vtas.dia_29) + parseInt(vtas.dia_30) + parseInt(vtas.dia_31);

                                                }
                                            }

                                            variacion = (((ventasuno / ventas) - 1) * 100).toFixed(2);
                                            if (isNaN(variacion)) {
                                                variacion = 0;
                                            }
                                        });

                                    let vta;
                                    if (longitud == 2) {
                                        vta = {
                                            Nombreagrupa: centros.Subcategorias,
                                            Periodo: selectedAno[0].value,
                                            dia_1: ventas,
                                            dia_2: ventasuno,
                                            dia_3: variacion + " %"
                                        };
                                    } else {
                                        vta = {
                                            Nombreagrupa: centros.Subcategorias,
                                            Periodo: selectedAno[0].value,
                                            dia_1: ventas
                                        };
                                    }
                                    newDetVtasAcum.push(vta);
                                });

                            //console.log("VENTAS ANÑO : ", newDetVtasAcum)

                            setmovimientos(newDetVtasAcum);
                        }
                }


    }, [consultar]);

    useEffect(() => {
        let det;
        let newdat = [];
        if (opcion == 0) {
            setTipo(1)
            setEntMes(true)
            setEntAcumuladas(false)
        } else
            if (opcion == 1) {
                setTipo(2)
                setEntMes(false)
                setEntAcumuladas(true)

            } else {
                setEntMes(true)
                setEntAcumuladas(false)
            }
    }, [opcion]);
    // }, [opcion || consultar]);

    const header_test = [
        { title: "Centro", dataIndex: "Nombreagrupa", key: "Nombreagrupa", width: 200, fixed: true },
        {
            title: "01", dataIndex: "dia_1", key: "dia_1", width: 150, align: "right",
            sorter: (a, b) => a.dia_ - b.dia_,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_1, 2)}
                    </Title>

                );
            }
        },
        {
            title: "02", dataIndex: "dia_2", key: "dia_2", width: 150, align: "right",
            sorter: (a, b) => a.dia_2 - b.dia_2,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_2, 2)}
                    </Title>

                );
            }
        },
        {
            title: "03", dataIndex: "dia_3", key: "dia_3", width: 150, align: "right",
            sorter: (a, b) => a.dia_3 - b.dia_3,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_3, 2)}
                    </Title>

                );
            }
        },
        {
            title: "04", dataIndex: "dia_4", key: "dia_4", width: 150, align: "right",
            sorter: (a, b) => a.dia_4 - b.dia_4,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_4, 2)}
                    </Title>

                );
            }
        },
        {
            title: "05", dataIndex: "dia_5", key: "dia_5", width: 150, align: "right",
            sorter: (a, b) => a.dia_5 - b.dia_5,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_5, 2)}
                    </Title>

                );
            }
        },
        {
            title: "06", dataIndex: "dia_6", key: "dia_6", width: 150, align: "right",
            sorter: (a, b) => a.dia_6 - b.dia_6,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_6, 2)}
                    </Title>

                );
            }
        },
        {
            title: "07", dataIndex: "dia_7", key: "dia_7", width: 150, align: "right",
            sorter: (a, b) => a.dia_7 - b.dia_7,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_7, 2)}
                    </Title>

                );
            }
        },
        {
            title: "08", dataIndex: "dia_8", key: "dia_8", width: 150, align: "right",
            sorter: (a, b) => a.dia_8 - b.dia_8,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_8, 2)}
                    </Title>

                );
            }
        },
        {
            title: "09", dataIndex: "dia_9", key: "dia_9", width: 150, align: "right", sorter: (a, b) => a.dia_2 - b.dia_2,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_9, 2)}
                    </Title>

                );
            }
        },
        {
            title: "10", dataIndex: "dia_10", key: "dia_10", width: 150, align: "right",
            sorter: (a, b) => a.dia_10 - b.dia_10,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_10, 2)}
                    </Title>

                );
            }
        },
        {
            title: "11", dataIndex: "dia_11", key: "dia_11", width: 150, align: "right",
            sorter: (a, b) => a.dia_11 - b.dia_11,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_11, 2)}
                    </Title>

                );
            }
        },
        {
            title: "12", dataIndex: "dia_12", key: "dia_v", width: 150, align: "right",
            sorter: (a, b) => a.dia_12 - b.dia_12,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_12, 2)}
                    </Title>

                );
            }
        },
        {
            title: "13", dataIndex: "dia_13", key: "dia_v", width: 150, align: "right",
            sorter: (a, b) => a.dia_13 - b.dia_13,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_13, 2)}
                    </Title>

                );
            }
        },
        {
            title: "14", dataIndex: "dia_14", key: "dia_14", width: 150, align: "right",
            sorter: (a, b) => a.dia_14 - b.dia_14,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_14, 2)}
                    </Title>

                );
            }
        },
        {
            title: "15", dataIndex: "dia_15", key: "dia_15", width: 150, align: "right",
            sorter: (a, b) => a.dia_15 - b.dia_15,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_15, 2)}
                    </Title>

                );
            }
        },
        {
            title: "16", dataIndex: "dia_16", key: "dia_16", width: 150, align: "right",
            sorter: (a, b) => a.dia_16 - b.dia_16,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_16, 2)}
                    </Title>

                );
            }
        },
        {
            title: "17", dataIndex: "dia_17", key: "dia_17", width: 150, align: "right",
            sorter: (a, b) => a.dia_17 - b.dia_17,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_17, 2)}
                    </Title>

                );
            }
        },
        {
            title: "18", dataIndex: "dia_18", key: "dia_18", width: 150, align: "right",
            sorter: (a, b) => a.dia_18 - b.dia_18,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_18, 2)}
                    </Title>

                );
            }
        },
        {
            title: "19", dataIndex: "dia_19", key: "dia_19", width: 150, align: "right",
            sorter: (a, b) => a.dia_19 - b.dia_19,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_19, 2)}
                    </Title>

                );
            }
        },
        {
            title: "20", dataIndex: "dia_20", key: "dia_20", width: 150, align: "right",
            sorter: (a, b) => a.dia_20 - b.dia_20,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_20, 2)}
                    </Title>

                );
            }
        },
        {
            title: "21", dataIndex: "dia_21", key: "dia_21", width: 150, align: "right",
            sorter: (a, b) => a.dia_21 - b.dia_21,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_21, 2)}
                    </Title>

                );
            }
        },
        {
            title: "22", dataIndex: "dia_22", key: "dia_22", width: 150, align: "right",
            sorter: (a, b) => a.dia_22 - b.dia_22,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_22, 2)}
                    </Title>

                );
            }
        },
        {
            title: "23", dataIndex: "dia_23", key: "dia_23", width: 150, align: "right",
            sorter: (a, b) => a.dia_23 - b.dia_23,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_23, 2)}
                    </Title>

                );
            }
        },
        {
            title: "24", dataIndex: "dia_24", key: "dia_24", width: 150, align: "right",
            sorter: (a, b) => a.dia_24 - b.dia_24,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_24, 2)}
                    </Title>

                );
            }
        },
        {
            title: "25", dataIndex: "dia_25", key: "dia_25", width: 150, align: "right",
            sorter: (a, b) => a.dia_25 - b.dia_25,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_25, 2)}
                    </Title>

                );
            }
        },
        {
            title: "26", dataIndex: "dia_26", key: "dia_26", width: 150, align: "right",
            sorter: (a, b) => a.dia_26 - b.dia_26,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_26, 2)}
                    </Title>

                );
            }
        },
        {
            title: "27", dataIndex: "dia_27", key: "dia_27", width: 150, align: "right",
            sorter: (a, b) => a.dia_27 - b.dia_27,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_27, 2)}
                    </Title>

                );
            }
        },
        {
            title: "28", dataIndex: "dia_28", key: "dia_28", width: 150, align: "right",
            sorter: (a, b) => a.dia_28 - b.dia_28,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_28, 2)}
                    </Title>

                );
            }
        },
        {
            title: "29", dataIndex: "dia_29", key: "dia_29", width: 150, align: "right",
            sorter: (a, b) => a.dia_29 - b.dia_29,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_29, 2)}
                    </Title>

                );
            }
        },
        {
            title: "30", dataIndex: "dia_30", key: "dia_30", width: 150, align: "right",
            sorter: (a, b) => a.dia_30 - b.dia_30,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_30, 2)}
                    </Title>

                );
            }
        },
        {
            title: "31", dataIndex: "dia_31", key: "dia_31", width: 150, align: "right",
            sorter: (a, b) => a.dia_31 - b.dia_31,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.dia_31, 2)}
                    </Title>

                );
            }
        },
        {
            title: "TOTAL", dataIndex: "totalcentro", key: "totalcentro", width: 150, align: "right",
            sorter: (a, b) => a.totalcentro - b.totalcentro,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.totalcentro, 2)}
                    </Title>

                );
            }
        },


    ]

    const header_testtot = [
        { title: textoTipo, dataIndex: "Nombreagrupa", key: "Nombreagrupa", width: 100, fixed: true },
        {
            title: label1, dataIndex: "label1", key: "label1", width: 100, align: "right",
            sorter: (a, b) => a.dia_1 - b.dia_1,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {isNaN(parseInt(row.dia_1)) ?
                            null
                            :
                            myNumber(1, (row.dia_1))
                        }
                    </Title>
                );
            }
        },
        {
            title: label2, dataIndex: "label2", key: "label2", width: 100, align: "right",
            sorter: (a, b) => a.dia_2 - b.dia_2,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {isNaN(parseInt(row.dia_2)) ?
                            null
                            :
                            myNumber(1, (row.dia_2))
                        }
                    </Title>
                );
            }
        },
        {
            title: label3, dataIndex: "label3", key: "label3", width: 100, align: "right",
            sorter: (a, b) => a.dia_3 - b.dia_3,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {isNaN(parseInt(row.dia_3)) ?
                            null
                            :
                            myNumber(1, (row.dia_3))
                        }
                    </Title>
                );
            }
        }
    ]


    return (
        <div className="mlanegativo">

            <h2 className="mx-auto mt-1 px-4 text-lg leading-6 font-medium text-gray-900 sm:px-6 lg:px-8">
                <div className="col-start-1 row-start-1 py-3">
                    <div className="ml-10 mx-auto flex max-w-7xl justify-center px-4 sm:px-6 lg:px-8">
                        {/* justify-end */}
                        <div className="flex"
                            onClick={reiniciar}
                        >
                            <Menu as="div" className="relative inline-block">
                                <MultiSelect
                                    options={vtasAno}
                                    value={selectedAno}
                                    onChange={setSelectedAno}
                                    disableSearch="false"
                                    labelledBy="Filtrar por año"
                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    overrideStrings={{
                                        selectSomeItems: "Filtrar por año...",
                                        allItemsAreSelected:
                                            "Todos los años",
                                        search: "Buscar",
                                        selectAll:
                                            "Todos"
                                    }}
                                />
                            </Menu>
                        </div>
                        <div className="flex"
                            onClick={reiniciar}
                        >
                            <Menu as="div" className="relative inline-block" >
                                <MultiSelect
                                    options={vtasMes}
                                    value={selectedMes}
                                    onChange={setSelectedMes}
                                    disableSearch="false"
                                    labelledBy="Filtrar por mes"
                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    overrideStrings={{
                                        selectSomeItems: " Filtrar por mes...",
                                        allItemsAreSelected:
                                            "Todos los meses",
                                        search: "Buscar",
                                        selectAll:
                                            "Todos"
                                    }}
                                />
                            </Menu>
                        </div>
                        <div className="flex"
                            onClick={reiniciar}
                        >
                            <Menu as="div" className="relative inline-block" >
                                <MultiSelect
                                    options={vtasDia}
                                    value={selectedDia}
                                    onChange={setSelectedDia}
                                    disableSearch="false"
                                    labelledBy="Filtrar por día"
                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    overrideStrings={{
                                        selectSomeItems: " Filtrar por día...",
                                        allItemsAreSelected:
                                            "Todos los días",
                                        search: "Buscar",
                                        selectAll:
                                            "Todos"
                                    }}
                                />
                            </Menu>
                        </div>
                        <div className="flex">
                            <Menu as="div" className="relative inline-block" >

                                <h3 className="ml-4 text-sm font-medium text-gray-700 hover:text-gray-900">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <tbody className="bg-white">
                                            {
                                                filtroDia && filtroDia.map((row, comprasIdx) => (
                                                    <tr>
                                                        <td className="whitespace-nowrap py-0 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                            {row}
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </h3>
                            </Menu>
                        </div>

                        <Menu as="div" className="ml-1 relative inline-block" >
                            <div className="flex">

                                <div className="ml-1 mx-auto flex max-w-4xl h-10 space-x-6 divide-x bg-violet rounded divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
                                    <button
                                        onClick={() => generarConsulta()}
                                    >
                                        Consultar
                                    </button>
                                </div>

                            </div>
                        </Menu>
                    </div>

                </div>

                <div className="sm:hidden">
                    <label htmlFor="tabs" className="sr-only">
                        Select a tab
                    </label>
                    {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                    <select
                        id="tabs"
                        name="tabs"
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        defaultValue={tabsdos.find((tab) => tab.current).name}
                    >
                        {tabsdos.map((tab) => (
                            <option key={tab.name}>{tab.name}</option>
                        ))}
                    </select>
                </div>
                <div className="min-w-full  -mt-4 hidden sm:block ml-12">
                    <div className="border-b border-gray-200">
                        <nav className="ml-1 -mb-px flex space-x-8" aria-label="Tabs">
                            {tabsdos.map((tab, index) => (
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
                                    <div>
                                        {tab.name}
                                    </div>
                                </a>
                            ))}
                        </nav>
                    </div>
                    {
                        selectedAno.length == 1 && selectedMes.length > 0 && selectedDia.length == 0 ?
                            (
                                <div className="min-w-full  margenizaquierdanegativo px-4 sm:px-6 lg:px-8">
                                    <div className="min-w-full  mt-8 flex flex-col">
                                        <div className="min-w-full  -my-2 -mx-4 sm:-mx-6 lg:-mx-8">
                                            <div className="min-w-full py-2 align-middle md:px-6 lg:px-8">
                                                <div className="min-w-full shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                                    <Table columns={header_test} dataSource={movimientos} pagination={false}
                                                        scroll={{
                                                            x: 1200,
                                                            y: 500,
                                                        }}
                                                        bordered />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                            :
                            selectedAno.length > 0 && selectedMes.length > 0 && selectedDia.length > 0 ?
                                (

                                    <div className="margenizaquierdanegativo px-4 sm:px-6 lg:px-8">
                                        <div className="mt-8 flex flex-col">
                                            <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
                                                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">

                                                    <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                                        <table className="min-w-full divide-y divide-gray-300">
                                                            <thead className="bg-slate-300">

                                                                {labeldias && labeldias.map((dias, index) => (
                                                                    <tr>
                                                                        <th scope="col" className="bg-slate-300 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                                            {textoTipo}
                                                                        </th>
                                                                        <th scope="col" className=" bg-slate-300 px-6 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                            {dias.Dia1}
                                                                        </th>
                                                                        <th scope="col" className=" bg-slate-300 px-6 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                            {dias.Dia2}
                                                                        </th>
                                                                        <th scope="col" className=" bg-slate-300 px-6 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                            {dias.Dia3}
                                                                        </th>

                                                                    </tr>
                                                                ))}
                                                            </thead>{ }
                                                            <tbody className="bg-white">
                                                                {movimientos && movimientos.map((ventas, index) => (
                                                                    <tr key={index} className={index % 2 === 0 ? undefined : 'bg-gray-50'}>
                                                                        <td className=" whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  text-gray-900 sm:pl-6">
                                                                            {ventas.Nombreagrupa}
                                                                        </td>
                                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-left text-gray-900 sm:pl-6">
                                                                            {isNaN(parseInt(ventas.dia_1)) ?
                                                                                null
                                                                                :
                                                                                myNumber(1, (ventas.dia_1))
                                                                            }
                                                                        </td>

                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : selectedAno.length > 0 && selectedMes.length == 0 ?
                                    (
                                        <div className="margenizaquierdanegativo px-4 sm:px-6 lg:px-8">
                                            <div className="mt-8 flex flex-col">
                                                <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
                                                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                                        <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                                            <Table columns={header_testtot} dataSource={movimientos} pagination={false}
                                                                scroll={{
                                                                    x: 1200,
                                                                    y: 500,
                                                                }}
                                                                bordered />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) :
                                    null
                    }


                </div>
            </h2>

        </div>
    );
}

export default TabVtasDiarias;