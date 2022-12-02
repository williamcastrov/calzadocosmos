import { Fragment, useState, useEffect } from "react";
import { myNumber, nameMonth } from "../../../utils/ArrayFunctions";
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, FunnelIcon, } from "@heroicons/react/solid";
import { useDispatch, useSelector } from "react-redux";
import { MultiSelect } from "react-multi-select-component";
import Select from 'react-select';
import swal from 'sweetalert';

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function TabDetalle(props) {
    const { tipo, setTipo, ingresosxlinea, ingreosxproveedor, presupuestosxlinea, lineasproductos,
        filtrosVentas, proveedorescompras } = props;
    const [entMes, setEntMes] = useState(true);
    const [entAcumuladas, setEntAcumuladas] = useState(false);
    const [movimientos, setmovimientos] = useState(false);
    const [movimientosMes, setmovimientosMes] = useState(false);
    const [opcion, setOpcion] = useState(0);
    const [semestre, setSemestre] = useState(0);
    const fecha = new Date();
    const mesActual = fecha.getMonth() + 1;

    const [centrosoperacion, setCentrosoperacion] = useState(filtrosVentas.centrosoperacion);
    const [subcategorias, setSubcategorias] = useState(filtrosVentas.subcategorias);
    const [proveedores, setProveedores] = useState(filtrosVentas.proveedores);
    const [nombreUno, setNombreUno] = useState("");
    const [nombreDos, setNombreDos] = useState("");
    const [nombreTres, setNombreTres] = useState("");

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

    const [labelUno, setLabelUno] = useState([]);
    const [labelDos, setLabelDos] = useState([]);
    const [labelTres, setLabelTres] = useState([]);
    let und = "Und";
    let pesos = "Pesos";

    const datosFiltros = () => {
        //console.log("FILTROS VENTAS :", filtrosVentas)
        setVtasSemestre(filtrosVentas.semestre_vtasdiarias);
        setVtasTrimestre(filtrosVentas.trimestre_vtasdiarias);

        let newDetAnos = [];
        filtrosVentas.anos_vtasdiarias &&
            filtrosVentas.anos_vtasdiarias.map((anos, index) => {
                let vta = {
                    Ventas_ano: anos.Ventas_ano,
                    value: anos.Ventas_ano,
                    label: anos.Ventas_ano
                };
                newDetAnos.push(vta);
            });
        setVtasAno(newDetAnos);

        let newDetMes = [];
        filtrosVentas.meses_vtasdiarias &&
            filtrosVentas.meses_vtasdiarias.map((meses, index) => {
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
        filtrosVentas.dias_vtas &&
            filtrosVentas.dias_vtas.map((dias, index) => {
                let vta = {
                    dia: dias.dia,
                    value: dias.dia,
                    label: dias.dia
                };
                newDetDia.push(vta);
            });
        setVtasDia(newDetDia);
    }

    const tabsdos = [
        { name: 'Entradas mes', href: '#', current: entMes },
        { name: 'Entradas acumuladas', href: '#', current: entAcumuladas },
    ]

    const selIngresolinea = (seleccion) => {
        setOpcion(seleccion)
    }

    useEffect(() => {
        let det;
        let newdat = [];
        if (opcion == 0) {
            setTipo(1)
            setEntMes(true)
            setEntAcumuladas(false)
            {
                ingresosxlinea && ingresosxlinea.map((items) => {
                    det = {
                        nombre: items.SubLinea,
                        undcorr: items.DETUNDMES_ANT,
                        undpst: items.DETUNDMES_PST,
                        mndcorr: items.DETMNDMES_ANT,
                        mndpst: items.DETMNDMES_PST
                    };
                    newdat.push(det)
                })
                //setmovimientos(newdat);
                //console.log("DATOS NEW MES:", newdat)
            }
        } else
            if (opcion == 1) {
                setTipo(2)
                setEntMes(false)
                setEntAcumuladas(true)
                {
                    ingresosxlinea && ingresosxlinea.map((items) => {
                        det = {
                            nombre: items.SubLinea,
                            undcorr: items.DETUND_ANT,
                            undpst: items.DETUND_PST,
                            mndcorr: items.DETMND_ANT,
                            mndpst: items.DETMND_PST
                        };
                        newdat.push(det)
                        //console.log("DATOS NEW TOT:", newdat)
                    })
                    //setmovimientos(newdat);
                }
            } else {
                setEntMes(true)
                setEntAcumuladas(false)
                //setmovimientos([])
            }
    }, [opcion]);

    const limpiarFiltros = () => {
        /*
        setFiltroAno([]);
        setFiltroMes([]);
        setFiltroDia([]);
        setdatosVariacion([]);
        */
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

        if (selectedAno.length > 1) {
            swal({
                title: "Tablero Cosmos",
                text: "Solo un año a comparar!",
                icon: "warning",
            });
            return
        }

        consolidar();

        //setConsultarAno(true)
    }

    const consolidar = () => {
        if ((selectedAno.length > 0 && selectedMes.length > 0 && selectedSemestre.length > 0) ||
            (selectedAno.length > 0 && selectedTrimestre.length > 0 && selectedSemestre.length > 0) ||
            (selectedAno.length > 0 && selectedTrimestre.length > 0 && selectedMes.length > 0)
        ) {
            swal({
                title: "Tablero Cosmos",
                text: "Puedes seleccionar, Año-semestre, Año-trimestre o Año-mes!",
                icon: "warning",
            });
            return
        }

        if (selectedAno.length > 0 && selectedMes.length > 0 && selectedSemestre.length === 0 && selectedTrimestre.length === 0) {
            let newDetCompras = [];
            let newDetComprasMes = [];
            setSemestre(0);

            lineasproductos &&
                lineasproductos.map((lineas, index) => {
                    let undcompras = 0;
                    let valcompras = 0;
                    let undcomprasmes = 0;
                    let valcomprasmes = 0;

                    ingresosxlinea &&
                        ingresosxlinea.map((ingresos, index) => {

                            if (ingresos.Sublinea == lineas.Sublinea && ingresos.ano == selectedAno[0].value
                                && ingresos.mes <= selectedMes[0].value) {
                                undcompras = parseInt(undcompras) + parseInt(ingresos.UND);
                                valcompras = parseInt(valcompras) + parseInt(ingresos.MND);
                            }

                            if (ingresos.Sublinea == lineas.Sublinea && ingresos.ano == selectedAno[0].value
                                && ingresos.mes == selectedMes[0].value) {

                                undcomprasmes = parseInt(undcomprasmes) + parseInt(ingresos.UND);
                                valcomprasmes = parseInt(valcomprasmes) + parseInt(ingresos.MND);
                            }
                        });
                    let mvto = {
                        Descripcion: lineas.Sublinea,
                        UndIngreso: undcompras,
                        ValIngreso: valcompras,
                    };

                    let mvtomes = {
                        Descripcion: lineas.Sublinea,
                        UndIngresoMes: undcomprasmes,
                        ValIngresoMes: valcomprasmes,
                    };
                    newDetCompras.push(mvto);
                    newDetComprasMes.push(mvtomes);
                });

            let newDetComprasVsPst = [];
            let newDetComprasVsPstMes = [];

            newDetComprasMes &&
                newDetComprasMes.map((ingresos, index) => {
                    let undpstmes = 0;
                    let valpstmes = 0;
                    presupuestosxlinea &&
                        presupuestosxlinea.map((pst, index) => {
                            if (ingresos.Descripcion == pst.Sublinea && selectedAno[0].value == pst.ano
                                && pst.mes == selectedMes[0].value) {
                                undpstmes = parseInt(undpstmes) + parseInt(pst.UND_PST);
                                valpstmes = parseInt(valpstmes) + parseInt(pst.VAL_PST);
                            }
                        });
                    let mvto = {
                        Descripcion: ingresos.Descripcion,
                        UndIngreso: ingresos.UndIngresoMes,
                        ValIngreso: ingresos.ValIngresoMes,
                        UndPst: undpstmes,
                        ValPst: valpstmes
                    };
                    newDetComprasVsPstMes.push(mvto);
                });

            newDetCompras &&
                newDetCompras.map((ingresos, index) => {
                    let undpst = 0;
                    let valpst = 0;
                    presupuestosxlinea &&
                        presupuestosxlinea.map((pst, index) => {
                            if (ingresos.Descripcion == pst.Sublinea && selectedAno[0].value == pst.ano
                                && pst.mes <= selectedMes[0].value) {
                                undpst = parseInt(undpst) + parseInt(pst.UND_PST);
                                valpst = parseInt(valpst) + parseInt(pst.VAL_PST);
                            }
                        });
                    let mvto = {
                        Descripcion: ingresos.Descripcion,
                        UndIngreso: ingresos.UndIngreso,
                        ValIngreso: ingresos.ValIngreso,
                        UndPst: undpst,
                        ValPst: valpst
                    };
                    newDetComprasVsPst.push(mvto);
                });

            setmovimientosMes(newDetComprasVsPstMes);
            setmovimientos(newDetComprasVsPst);
        } else
            if (selectedAno.length > 0 && selectedMes.length === 0 && selectedSemestre.length > 0 && selectedTrimestre.length === 0) {

                let newDetCompras = [];
                let newDetComprasSemestre = [];
                let opcionSemestre = 0;
                let longitudano = selectedAno.length;
                let longitudsemestre = selectedSemestre.length;
                //console.log("AÑO SELECCIONADO : ", selectedAno)

                if (selectedAno.length > 1 && selectedSemestre.length > 1) {
                    swal({
                        title: "Tablero Cosmos",
                        text: "Debes comparar un semestre, para dos o mas años!",
                        icon: "warning",
                    });
                    return
                } else
                    if (selectedSemestre.length > 2) {
                        swal({
                            title: "Tablero Cosmos",
                            text: "Solo puedes comparar dos semestre!",
                            icon: "warning",
                        });
                        return
                    }

                if (longitudsemestre === 1) {
                    let nombreuno = "Semestre" + selectedSemestre[0].value
                    setNombreUno(nombreuno)
                    setNombreDos(null)
                    setNombreTres(null)
                } else
                    if (longitudsemestre === 2) {
                        let nombreuno = "Semestre" + selectedSemestre[0].value;
                        let nombredos = "Semestre" + selectedSemestre[1].value;
                        setNombreUno(nombreuno);
                        setNombreDos(nombredos);
                        setNombreTres(null);
                        console.log("NOMBRE : ", nombreuno, " : ", nombredos, longitudsemestre)
                    } else
                        if (longitudsemestre === 2) {
                            let nombreuno = "Semestre" + selectedSemestre[0].value;
                            let nombredos = "Semestre" + selectedSemestre[1].value;
                            let nombretres = "Semestre" + selectedSemestre[2].value;
                            setNombreUno(nombreuno);
                            setNombreDos(nombredos);
                            setNombreTres(nombretres);

                        } else {
                            setNombreUno("");
                            setNombreDos("");
                            setNombreTres("");
                        }

                if (selectedAno.length === 1 && selectedSemestre.length > 0)
                    opcionSemestre = 1;
                else
                    if (selectedAno.length > 1 && selectedSemestre.length === 1)
                        opcionSemestre = 2;
                    else {
                        opcionSemestre = 0;
                        return
                    }
                //console.log("INGRESOS LINEA : ", ingresosxlinea)
                //console.log("SEMESTRE SELECCIONADO : ", selectedSemestre)
                setSemestre(opcionSemestre);
                if (opcionSemestre === 1) {
                    lineasproductos &&
                        lineasproductos.map((lineas, index) => {
                            let undcompras1 = 0;
                            let valcompras1 = 0;
                            let undcompras2 = 0;
                            let valcompras2 = 0;
                            let undcompras3 = 0;
                            let valcompras3 = 0;

                            ingresosxlinea &&
                                ingresosxlinea.map((ingresos, index) => {
                                    for (var i = 0; i < longitudsemestre; i++) {
                                        if (ingresos.Sublinea == lineas.Sublinea
                                            && ingresos.periodo >= selectedSemestre[i].Inicia && ingresos.periodo <= selectedSemestre[i].Termina) {
                                            if (i == 0) {
                                                undcompras1 = parseInt(undcompras1) + parseInt(ingresos.UND);
                                                valcompras1 = parseInt(valcompras1) + parseInt(ingresos.MND);
                                            }
                                            if (i == 1) {
                                                undcompras2 = parseInt(undcompras2) + parseInt(ingresos.UND);
                                                valcompras2 = parseInt(valcompras2) + parseInt(ingresos.MND);
                                            }
                                            if (i == 2) {
                                                undcompras3 = parseInt(undcompras3) + parseInt(ingresos.UND);
                                                valcompras3 = parseInt(valcompras3) + parseInt(ingresos.MND);
                                            }
                                        }
                                    }
                                });

                            let mvto = {
                                Descripcion: lineas.Sublinea,
                                UndIngreso1: undcompras1,
                                ValIngreso1: valcompras1,
                                UndIngreso2: undcompras2,
                                ValIngreso2: valcompras2,
                                UndIngreso3: undcompras3,
                                ValIngreso3: valcompras3,
                            };
                            //newDetCompras.push(mvto);
                            newDetComprasSemestre.push(mvto);
                        });

                    //console.log("INGRESOS LINEA : ", newDetComprasSemestre)

                    let newDetComprasVsPst = [];
                    let newDetComprasVsPstMes = [];

                    newDetComprasSemestre &&
                        newDetComprasSemestre.map((ingresos, index) => {
                            let undpstmes1 = 0;
                            let valpstmes1 = 0;
                            let undpstmes2 = 0;
                            let valpstmes2 = 0;
                            let undpstmes3 = 0;
                            let valpstmes3 = 0;
                            let variacion = 0;

                            presupuestosxlinea &&
                                presupuestosxlinea.map((pst, index) => {
                                    for (var i = 0; i < longitudsemestre; i++) {
                                        if (ingresos.Descripcion == pst.Sublinea &&
                                            pst.Periodo >= selectedSemestre[i].Inicia && pst.Periodo <= selectedSemestre[i].Termina) {
                                            if (i == 0) {
                                                undpstmes1 = parseInt(undpstmes1) + parseInt(pst.UND_PST);
                                                valpstmes1 = parseInt(valpstmes1) + parseInt(pst.VAL_PST);
                                            } else
                                                if (i == 1) {
                                                    undpstmes2 = parseInt(undpstmes2) + parseInt(pst.UND_PST);
                                                    valpstmes2 = parseInt(valpstmes2) + parseInt(pst.VAL_PST);
                                                }
                                            if (i == 2) {
                                                undpstmes3 = parseInt(undpstmes3) + parseInt(pst.UND_PST);
                                                valpstmes3 = parseInt(valpstmes3) + parseInt(pst.VAL_PST);
                                            }
                                        }
                                    }
                                });

                            variacion = (((ingresos.ValIngreso2 / ingresos.ValIngreso1) - 1) * 100).toFixed(2);
                            if (isNaN(variacion)) {
                                variacion = 0;
                            }

                            let mvto = {
                                Descripcion: ingresos.Descripcion,
                                UndIngreso1: ingresos.UndIngreso1,
                                ValIngreso1: ingresos.ValIngreso1,
                                UndIngreso2: ingresos.UndIngreso2,
                                ValIngreso2: ingresos.ValIngreso2,
                                UndPst1: undpstmes1,
                                ValPst1: valpstmes1,
                                UndPst2: undpstmes2,
                                ValPst2: valpstmes2,
                                Variacion: variacion

                            };
                            newDetComprasVsPstMes.push(mvto);
                        });

                    //console.log("DATOS COMPRAS : ",newDetComprasVsPstMes)  

                    setmovimientos(newDetComprasVsPstMes);
                }
                //setmovimientos(newDetComprasVsPst);
            } else
                if (selectedAno.length > 0 && selectedMes.length === 0 && selectedSemestre.length === 0 
                    && selectedTrimestre.length > 0) {

                    let newDetCompras = [];
                    let newDetComprasTrimestre = [];
                    let opcionSemestre = 0;
                    let longitudano = selectedAno.length;
                    let longitudtrimestre = selectedTrimestre.length;
                    //console.log("AÑO SELECCIONADO : ", selectedAno)

                    if (selectedAno.length > 1 && selectedTrimestre.length > 1) {
                        swal({
                            title: "Tablero Cosmos",
                            text: "Debes comparar un trimestre, para dos o mas años!",
                            icon: "warning",
                        });
                        return
                    }

                    if (selectedTrimestre.length > 2) {
                        swal({
                            title: "Tablero Cosmos",
                            text: "Solo puedes comparar dos trimestre!",
                            icon: "warning",
                        });
                        return
                    }

                    if (longitudtrimestre === 1) {
                        let nombreuno = "Trimestre" + selectedTrimestre[0].value
                        setNombreUno(nombreuno)
                        setNombreDos(null)
                        setNombreTres(null)
                    } else
                        if (longitudtrimestre === 2) {
                            let nombreuno = "Trimestre" + selectedTrimestre[0].value;
                            let nombredos = "Trimestre" + selectedTrimestre[1].value;
                            setNombreUno(nombreuno);
                            setNombreDos(nombredos);
                            setNombreTres(null);
                        } else
                            if (longitudtrimestre === 2) {
                                let nombreuno = "Trimestre" + selectedTrimestre[0].value;
                                let nombredos = "Trimestre" + selectedTrimestre[1].value;
                                let nombretres = "Trimestre" + selectedTrimestre[2].value;
                                setNombreUno(nombreuno);
                                setNombreDos(nombredos);
                                setNombreTres(nombretres);

                            } else {
                                setNombreUno("");
                                setNombreDos("");
                                setNombreTres("");
                            }

                    if (selectedAno.length === 1 && selectedTrimestre.length > 0)
                        opcionSemestre = 1;
                    else
                        if (selectedAno.length > 1 && selectedTrimestre.length === 1)
                            opcionSemestre = 2;
                        else {
                            opcionSemestre = 0;
                            return
                        }
                    //console.log("INGRESOS LINEA : ", ingresosxlinea)
                    //console.log("SEMESTRE SELECCIONADO : ", selectedSemestre)
                    setSemestre(opcionSemestre);
                    if (opcionSemestre === 1) {
                        lineasproductos &&
                            lineasproductos.map((lineas, index) => {
                                let undcompras1 = 0;
                                let valcompras1 = 0;
                                let undcompras2 = 0;
                                let valcompras2 = 0;
                                let undcompras3 = 0;
                                let valcompras3 = 0;

                                ingresosxlinea &&
                                    ingresosxlinea.map((ingresos, index) => {
                                        for (var i = 0; i < longitudtrimestre; i++) {
                                            if (ingresos.Sublinea == lineas.Sublinea
                                                && ingresos.periodo >= selectedTrimestre[i].Inicia && ingresos.periodo <= selectedTrimestre[i].Termina) {
                                                if (i == 0) {
                                                    undcompras1 = parseInt(undcompras1) + parseInt(ingresos.UND);
                                                    valcompras1 = parseInt(valcompras1) + parseInt(ingresos.MND);
                                                }
                                                if (i == 1) {
                                                    undcompras2 = parseInt(undcompras2) + parseInt(ingresos.UND);
                                                    valcompras2 = parseInt(valcompras2) + parseInt(ingresos.MND);
                                                }
                                                if (i == 2) {
                                                    undcompras3 = parseInt(undcompras3) + parseInt(ingresos.UND);
                                                    valcompras3 = parseInt(valcompras3) + parseInt(ingresos.MND);
                                                }
                                            }
                                        }
                                    });

                                let mvto = {
                                    Descripcion: lineas.Sublinea,
                                    UndIngreso1: undcompras1,
                                    ValIngreso1: valcompras1,
                                    UndIngreso2: undcompras2,
                                    ValIngreso2: valcompras2,
                                    UndIngreso3: undcompras3,
                                    ValIngreso3: valcompras3,
                                };
                                //newDetCompras.push(mvto);
                                newDetComprasTrimestre.push(mvto);
                            });

                        //console.log("INGRESOS LINEA : ", newDetComprasTrimestre)

                        let newDetComprasVsPst = [];
                        let newDetComprasVsPstMes = [];

                        newDetComprasTrimestre &&
                            newDetComprasTrimestre.map((ingresos, index) => {
                                let undpstmes1 = 0;
                                let valpstmes1 = 0;
                                let undpstmes2 = 0;
                                let valpstmes2 = 0;
                                let undpstmes3 = 0;
                                let valpstmes3 = 0;
                                let variacion = 0;

                                presupuestosxlinea &&
                                    presupuestosxlinea.map((pst, index) => {
                                        for (var i = 0; i < longitudtrimestre; i++) {
                                            if (ingresos.Descripcion == pst.Sublinea &&
                                                pst.Periodo >= selectedTrimestre[i].Inicia && pst.Periodo <= selectedTrimestre[i].Termina) {
                                                if (i == 0) {
                                                    undpstmes1 = parseInt(undpstmes1) + parseInt(pst.UND_PST);
                                                    valpstmes1 = parseInt(valpstmes1) + parseInt(pst.VAL_PST);
                                                } else
                                                    if (i == 1) {
                                                        undpstmes2 = parseInt(undpstmes2) + parseInt(pst.UND_PST);
                                                        valpstmes2 = parseInt(valpstmes2) + parseInt(pst.VAL_PST);
                                                    }
                                                if (i == 2) {
                                                    undpstmes3 = parseInt(undpstmes3) + parseInt(pst.UND_PST);
                                                    valpstmes3 = parseInt(valpstmes3) + parseInt(pst.VAL_PST);
                                                }
                                            }
                                        }
                                    });

                                variacion = (((ingresos.ValIngreso2 / ingresos.ValIngreso1) - 1) * 100).toFixed(2);
                                if (isNaN(variacion)) {
                                    variacion = 0;
                                }

                                let mvto = {
                                    Descripcion: ingresos.Descripcion,
                                    UndIngreso1: ingresos.UndIngreso1,
                                    ValIngreso1: ingresos.ValIngreso1,
                                    UndIngreso2: ingresos.UndIngreso2,
                                    ValIngreso2: ingresos.ValIngreso2,
                                    UndPst1: undpstmes1,
                                    ValPst1: valpstmes1,
                                    UndPst2: undpstmes2,
                                    ValPst2: valpstmes2,
                                    Variacion: variacion

                                };
                                newDetComprasVsPstMes.push(mvto);
                            });

                        //console.log("DATOS COMPRAS : ",newDetComprasVsPstMes)  

                        setmovimientos(newDetComprasVsPstMes);
                    }
                } else
                    if (selectedAno.length > 0 && selectedMes.length === 0 && selectedSemestre.length === 0 && 
                        selectedTrimestre.length === 0) {
                        //console.log("INGRESOS LINEAS : ", ingresosxlinea)

                        let newDetCompras = [];
                        let newDetComprasMes = [];

                        lineasproductos &&
                            lineasproductos.map((lineas, index) => {
                                let undcompras = 0;
                                let valcompras = 0;
                                let undcomprasmes = 0;
                                let valcomprasmes = 0;

                                ingresosxlinea &&
                                    ingresosxlinea.map((ingresos, index) => {

                                        if (ingresos.Sublinea == lineas.Sublinea && ingresos.ano == selectedAno[0].value) {
                                            undcompras = parseInt(undcompras) + parseInt(ingresos.UND);
                                            valcompras = parseInt(valcompras) + parseInt(ingresos.MND);
                                        }

                                        if (ingresos.Sublinea == lineas.Sublinea && ingresos.ano == selectedAno[0].value &&
                                            ingresos.mes == 10) {

                                            undcomprasmes = parseInt(undcomprasmes) + parseInt(ingresos.UND);
                                            valcomprasmes = parseInt(valcomprasmes) + parseInt(ingresos.MND);
                                        }
                                    });
                                let mvto = {
                                    Descripcion: lineas.Sublinea,
                                    UndIngreso: undcompras,
                                    ValIngreso: valcompras,
                                };

                                let mvtomes = {
                                    Descripcion: lineas.Sublinea,
                                    UndIngresoMes: undcomprasmes,
                                    ValIngresoMes: valcomprasmes,
                                };
                                newDetCompras.push(mvto);
                                newDetComprasMes.push(mvtomes);
                            });

                        let newDetComprasVsPst = [];
                        let newDetComprasVsPstMes = [];

                        //console.log("INGRESOS LINEA  : ", newDetCompras);

                        newDetComprasMes &&
                            newDetComprasMes.map((ingresos, index) => {
                                let undpstmes = 0;
                                let valpstmes = 0;
                                presupuestosxlinea &&
                                    presupuestosxlinea.map((pst, index) => {
                                        if (ingresos.Descripcion == pst.Sublinea && selectedAno[0].value == pst.ano &&
                                            pst.mes == 10) {
                                            undpstmes = parseInt(undpstmes) + parseInt(pst.UND_PST);
                                            valpstmes = parseInt(valpstmes) + parseInt(pst.VAL_PST);
                                        }
                                    });
                                let mvto = {
                                    Descripcion: ingresos.Descripcion,
                                    UndIngreso: ingresos.UndIngresoMes,
                                    ValIngreso: ingresos.ValIngresoMes,
                                    UndPst: undpstmes,
                                    ValPst: valpstmes
                                };
                                newDetComprasVsPstMes.push(mvto);
                            });

                        //console.log("UND COMPRAS : ",  newDetCompras)

                        newDetCompras &&
                            newDetCompras.map((ingresos, index) => {
                                let undpst = 0;
                                let valpst = 0;
                                presupuestosxlinea &&
                                    presupuestosxlinea.map((pst, index) => {
                                        if (ingresos.Descripcion == pst.Sublinea && selectedAno[0].value == pst.ano &&
                                            pst.mes <= 10) {
                                            undpst = parseInt(undpst) + parseInt(pst.UND_PST);
                                            valpst = parseInt(valpst) + parseInt(pst.VAL_PST);
                                        }
                                    });
                                let mvto = {
                                    Descripcion: ingresos.Descripcion,
                                    UndIngreso: ingresos.UndIngreso,
                                    ValIngreso: ingresos.ValIngreso,
                                    UndPst: undpst,
                                    ValPst: valpst
                                };
                                newDetComprasVsPst.push(mvto);
                            });

                        setmovimientosMes(newDetComprasVsPstMes);
                        setmovimientos(newDetComprasVsPst);
                    }
    }

    return (
        <div className="mlanegativo">
            <h2 className="mx-auto mt-1 px-4 text-lg leading-6 font-medium text-gray-900 sm:px-6 lg:px-8">
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

                <div className="hidden sm:block ml-12">
                    <div className="border-b border-gray-200">
                        <nav className="ml-1 -mb-px flex space-x-0" aria-label="Tabs">
                            {tabsdos.map((tab, index) => (
                                <a
                                    key={tab.name}
                                    onClick={() => selIngresolinea(index)}
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
                    <div className="mt-4 hidden sm:block ml-12">
                        <nav className="ml-1 -mb-px flex space-x-0" aria-label="Tabs">
                            <div className="mt-1 flex" onClick={datosFiltros} >
                                <Menu as="div" className="relative inline-block" >
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
                            <div className="mt-1 flex">
                                <Menu as="div" className="relative inline-block" >
                                    <MultiSelect
                                        options={vtasSemestre}
                                        value={selectedSemestre}
                                        onChange={setSelectedSemestre}
                                        disableSearch="false"
                                        labelledBy="Filtrar por año"
                                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                        overrideStrings={{
                                            selectSomeItems: "Filtrar por semestre",
                                            allItemsAreSelected:
                                                "Todos los semestres",
                                            search: "Buscar",
                                            selectAll:
                                                "Todos"
                                        }}
                                    />
                                </Menu>
                            </div>
                            <div className="mt-1 flex">
                                <Menu as="div" className="relative inline-block" >
                                    <MultiSelect
                                        options={vtasTrimestre}
                                        value={selectedTrimestre}
                                        onChange={setSelectedTrimestre}
                                        disableSearch="false"
                                        labelledBy="Filtrar por trimestre"
                                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                        overrideStrings={{
                                            selectSomeItems: "Filtrar por trimestre",
                                            allItemsAreSelected:
                                                "Todos los trimestres",
                                            search: "Buscar",
                                            selectAll:
                                                "Todos"
                                        }}
                                    />
                                </Menu>
                            </div>

                            <div className="mt-1 flex">
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
                            
                            <div className="mt-1 flex">
                                <Menu as="div" className="ml-1 relative inline-block" >
                                    <div className="flex">

                                        <div className="mx-auto flex max-w-4xl h-10 space-x-6 divide-x bg-violet rounded divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
                                            <button
                                                onClick={() => generarConsulta()}
                                            >
                                                Consultar
                                            </button>
                                        </div>
                                        <div className="ml-3 mx-auto flex max-w-4xl h-10 space-x-6 divide-x bg-cosmocolor rounded divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
                                            <div >
                                                <button
                                                    type="button"
                                                    onClick={() => limpiarFiltros()}
                                                    className="text-white text-sm p-2 max-w-4xl ">
                                                    Limpiar filtros
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Menu>
                            </div>
                        </nav>
                    </div>

                    <div className="margenizaquierdanegativo px-4 sm:px-6 lg:px-8">
                        {opcion == 0 && semestre == 0 ?
                            (
                                <div className="mt-5 flex flex-col">
                                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                                <table className="min-w-full divide-y divide-gray-300">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                                Linea
                                                            </th>
                                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                Und Mes Actual
                                                            </th>
                                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                Und Presupuesto
                                                            </th>
                                                            <th scope="col" className="px-8 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                %
                                                            </th>
                                                            <th scope="col" className="px-7 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                Valor Mes Actual
                                                            </th>
                                                            <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                Valor Presupuesto
                                                            </th>
                                                            <th scope="col" className="px-8 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                %
                                                            </th>
                                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                                <span className="sr-only">Edit</span>
                                                            </th>
                                                        </tr>
                                                    </thead>{ }
                                                    <tbody className="bg-white">
                                                        {movimientosMes && movimientosMes.map((compras, comprasIdx) => (
                                                            <tr key={compras.nombre} className={comprasIdx % 2 === 0 ? undefined : 'bg-gray-50'}>
                                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                    {compras.Descripcion}
                                                                </td>
                                                                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 text-right">{myNumber(1, compras.UndIngreso)}</td>
                                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500 text-right">{myNumber(1, compras.UndPst)}</td>
                                                                <td className="whitespace-nowrap px-8 py-4 text-sm text-gray-500 text-right">
                                                                    {isNaN(parseInt(((compras.UndIngreso / compras.UndPst) * 100).toFixed(2))) ?
                                                                        0
                                                                        :
                                                                        myNumber(1, (((compras.UndIngreso / compras.UndPst) - 1) * 100).toFixed(2))
                                                                    }
                                                                </td>

                                                                <td className="whitespace-nowrap px-9 py-4 text-sm text-gray-500 text-right">
                                                                    {myNumber(1, compras.ValIngreso)}</td>
                                                                <td className="whitespace-nowrap px-9 py-4 text-sm text-gray-500 text-right">
                                                                    {myNumber(1, compras.ValPst)}</td>
                                                                <td className="whitespace-nowrap px-9 py-4 text-sm text-gray-500 text-right">
                                                                    {isNaN(parseInt(((compras.ValIngreso / compras.ValPst) * 100).toFixed(2))) ?
                                                                        0
                                                                        :
                                                                        myNumber(1, (((compras.ValIngreso / compras.ValPst) - 1) * 100).toFixed(2))
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
                            )
                            :
                            opcion == 1 && semestre == 0 ?
                                (
                                    <div className="mt-8 flex flex-col">
                                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                                    <table className="min-w-full divide-y divide-gray-300">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                                    Linea
                                                                </th>
                                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                    Und Ent Acumuladas
                                                                </th>
                                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                    Und Pto Acumuladas
                                                                </th>
                                                                <th scope="col" className="px-8 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                    % Desviación
                                                                </th>
                                                                <th scope="col" className="px-7 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                    $ Ent Acumuladas
                                                                </th>
                                                                <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                    $ Pto Acumuladas
                                                                </th>
                                                                <th scope="col" className="px-8 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                    % Desviación
                                                                </th>
                                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                                    <span className="sr-only">Edit</span>
                                                                </th>
                                                            </tr>
                                                        </thead>{ }
                                                        <tbody className="bg-white">
                                                            {movimientos && movimientos.map((compras, comprasIdx) => (
                                                                <tr key={compras.nombre} className={comprasIdx % 2 === 0 ? undefined : 'bg-gray-50'}>
                                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                        {compras.Descripcion}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 text-right">{myNumber(1, compras.UndIngreso)}</td>
                                                                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500 text-right">{myNumber(1, compras.UndPst)}</td>
                                                                    <td className="whitespace-nowrap px-8 py-4 text-sm text-gray-500 text-right">
                                                                        {isNaN(parseInt(((compras.UndIngreso / compras.UndPst) * 100).toFixed(2))) ?
                                                                            0
                                                                            :
                                                                            myNumber(1, (((compras.UndIngreso / compras.UndPst) - 1) * 100).toFixed(2))
                                                                        }
                                                                    </td>

                                                                    <td className="whitespace-nowrap px-9 py-4 text-sm text-gray-500 text-right">
                                                                        {myNumber(1, compras.ValIngreso)}</td>
                                                                    <td className="whitespace-nowrap px-9 py-4 text-sm text-gray-500 text-right">
                                                                        {myNumber(1, compras.ValPst)}</td>
                                                                    <td className="whitespace-nowrap px-9 py-4 text-sm text-gray-500 text-right">
                                                                        {isNaN(parseInt(((compras.ValIngreso / compras.ValPst) * 100).toFixed(2))) ?
                                                                            0
                                                                            :
                                                                            myNumber(1, (((compras.ValIngreso / compras.ValPst) - 1) * 100).toFixed(2))
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
                                )
                                :
                                semestre == 1 ?
                                    (
                                        <div className="mt-8 flex flex-col">
                                            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                                        <table className="min-w-full divide-y divide-gray-300">
                                                            <thead className="bg-gray-50">
                                                                <tr>
                                                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                                        Linea
                                                                    </th>
                                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                        {
                                                                            nombreUno ?
                                                                                und + " - " + nombreUno
                                                                                :
                                                                                null
                                                                        }

                                                                    </th>
                                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                        {
                                                                            nombreUno ?
                                                                                pesos + " - " + nombreUno
                                                                                :
                                                                                null
                                                                        }
                                                                    </th>
                                                                    <th scope="col" className="px-8 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                        {
                                                                            nombreDos ?
                                                                                und + " - " + nombreDos
                                                                                :
                                                                                null
                                                                        }
                                                                    </th>
                                                                    <th scope="col" className="px-7 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                        {
                                                                            nombreDos ?
                                                                                pesos + " - " + nombreDos
                                                                                :
                                                                                null
                                                                        }
                                                                    </th>
                                                                    <th scope="col" className="px-8 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                        % Desviación
                                                                    </th>
                                                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                                        <span className="sr-only">Edit</span>
                                                                    </th>
                                                                </tr>
                                                            </thead>{ }
                                                            <tbody className="bg-white">
                                                                {movimientos && movimientos.map((compras, comprasIdx) => (
                                                                    <tr key={compras.nombre} className={comprasIdx % 2 === 0 ? undefined : 'bg-gray-50'}>
                                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                            {compras.Descripcion}
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 text-right">{myNumber(1, compras.UndIngreso1)}</td>
                                                                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500 text-right">{myNumber(1, compras.ValIngreso1)}</td>
                                                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 text-right">
                                                                            {
                                                                                nombreDos ?
                                                                                    myNumber(1, compras.UndIngreso2)
                                                                                    :
                                                                                    null
                                                                            }</td>
                                                                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500 text-right">
                                                                            {
                                                                                nombreDos ?
                                                                                    myNumber(1, compras.ValIngreso2)
                                                                                    :
                                                                                    null
                                                                            }
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-9 py-4 text-sm text-gray-500 text-right">
                                                                            {isNaN(parseInt(compras.Variacion)) ?
                                                                                0
                                                                                :
                                                                                myNumber(1, compras.Variacion)
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
                                    )
                                    :
                                    null
                        }
                    </div>
                </div>
            </h2>
        </div>
    );
}

export default TabDetalle;