import { useState, useEffect } from "react";
import { myNumber, nameMonth } from "../../../utils/ArrayFunctions";
import { useDispatch, useSelector } from "react-redux";
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Table, Tag, Typography } from 'antd';
import { MultiSelect } from "react-multi-select-component";
import swal from 'sweetalert';

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function TabCostos(props) {
    const { Title } = Typography;
    const { tipo, setTipo, detalleCostos, detalleCompras } = props;
    const [entProveedor, setEntProveedor] = useState(true);
    const [entLinea, setEntLinea] = useState(false);
    const [entFamilia, setEntFamilia] = useState(false);
    const [movimientos, setmovimientos] = useState(false);
    const [opcion, setOpcion] = useState(0);
    const [tituloTipo, setTituloTipo] = useState("PROVEEDORES");
    const [detalleFamilia, setdetalleFamilia] = useState(detalleCompras.costofamilia)

    //console.log("DETALLE COMPRAS : ", detalleCompras.costoproveedor);
    let ventasDiariasMes = [];
    ventasDiariasMes = useSelector((state) => state.datosfiltros.datosfiltros);

    const [selectedAno, setSelectedAno] = useState([]);
    const [selectedSemestre, setSelectedSemestre] = useState([]);
    const [selectedTrimestre, setSelectedTrimestre] = useState([]);
    const [selectedMes, setSelectedMes] = useState([]);
    const [selectedDia, setSelectedDia] = useState([]);
    const [vtasSemestre, setVtasSemestre] = useState([]);
    const [vtasTrimestre, setVtasTrimestre] = useState([]);

    const [nombreUno, setNombreUno] = useState("");
    const [nombreDos, setNombreDos] = useState("");
    const [nombreTres, setNombreTres] = useState("");

    const [consultar, setConsultar] = useState(false);
    const [labelcostos, setLabelcostos] = useState([]);

    const [vtasAno, setVtasAno] = useState(ventasDiariasMes.anos_vtasdiarias);
    const [vtasMes, setVtasMes] = useState(ventasDiariasMes.meses_vtasdiarias);
    const [vtasDia, setVtasDia] = useState(ventasDiariasMes.dias_vtas);
    const [sublineas, setSublineas] = useState(ventasDiariasMes.sublineas);
    const [familias, setFamilias] = useState(ventasDiariasMes.familias);
    //const [proveedores, setProveedores] = useState(detalleCompras.proveedorescompras);

    const [labelUno, setLabelUno] = useState([]);
    const [labelDos, setLabelDos] = useState([]);
    const [labelTres, setLabelTres] = useState([]);
    let und = "Und";
    let pesos = "Pesos";

    const tabsdos = [
        { name: 'Variación x Proveedor', href: '#', current: entProveedor },
        { name: 'Variación x Línea', href: '#', current: entLinea },
        { name: 'Variación x Familia', href: '#', current: entFamilia },
    ]

    const selCostoslinea = (seleccion) => {
        //console.log("OPCION : ", seleccion)
        setOpcion(seleccion)

        if (seleccion == 0) {
            setEntProveedor(true)
            setEntLinea(false)
            setEntFamilia(false)
            setTituloTipo("PROVEEDORES");
        } else
            if (seleccion == 1) {
                setEntProveedor(false)
                setEntLinea(true)
                setEntFamilia(false)
                setTituloTipo("LINEAS DE PRODUCTOS");
            } else
                if (seleccion == 2) {
                    setEntProveedor(false)
                    setEntLinea(false)
                    setEntFamilia(true)
                    setTituloTipo("FAMILIA");
                } else {
                    setEntProveedor(false)
                    setEntLinea(false)
                    setEntFamilia(false)
                    setTituloTipo("");
                }

    }

    useEffect(() => {
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
                    Ventas_mes: meses.Ventas_mes,
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

    const generarConsulta = () => {
        setmovimientos([]);
        if (selectedAno.length == 0) {
            swal({
                title: "Tablero Cosmos",
                text: "Primero debes seleccionar el año!",
                icon: "warning",
            });
            return
        }

        if (selectedAno.length < 2 && selectedMes.length == 0) {
            swal({
                title: "Tablero Cosmos",
                text: "Debes seleccionar dos años para ver la variación!",
                icon: "warning",
            });
            return
        }

        if (selectedAno.length == 1 && selectedMes.length < 2) {
            swal({
                title: "Tablero Cosmos",
                text: "Debes seleccionar año y dos meses para ver la variación!",
                icon: "warning",
            });
            return
        }
        setConsultar(true)
    }

    const limpiarFiltros = () => {
        setSelectedAno([]);
        setSelectedMes([]);
        setmovimientos([]);
    }

    useEffect(() => {

        setConsultar(false);
        if (selectedAno.length > 0 && selectedMes.length == 0) {

            let longitud = selectedAno.length;
            let newDet = [];

            if (longitud == 1) {
                let vta = {
                    nombre: { tituloTipo },
                    ano1: "Variación" + selectedAno[0].value
                };
                newDet.push(vta);
            } else
                if (longitud == 2) {
                    let vta;
                    vta = {
                        nombre: { tituloTipo },
                        ano1: selectedAno[0].value,
                        ano2: selectedAno[1].value,
                        variacion: "VARIACIÓN"
                    };
                    setLabelUno(vta.ano1);
                    setLabelDos(vta.ano2);
                    newDet.push(vta);
                } else {
                    swal({
                        title: "Tablero Cosmos",
                        text: "Seleccionar maximo dos años!",
                        icon: "warning",
                    });
                    return
                }

            setLabelcostos(newDet);
            //setLabeldias(newDet)
            //console.log("PROVEEDORES : ", detalleCompras.proveedorescompras)

            if (opcion == 0) {
                let newDetCostos = [];

                detalleCompras.proveedorescompras && detalleCompras.proveedorescompras.map((prov) => {

                    let valcomprasprov = 0;
                    let undcomprasprov = 0;
                    let valcomprasprovdos = 0;
                    let undcomprasprovdos = 0;

                    detalleCompras.costoproveedor && detalleCompras.costoproveedor.map((items) => {
                        if (items.ano == selectedAno[0].value && prov.Nombreproveedor == items.Nombreproveedor) {
                            valcomprasprov = parseInt(valcomprasprov) + parseInt(items.MND);
                            undcomprasprov = parseInt(undcomprasprov) + parseInt(items.UND);
                        }

                        if (longitud == 2) {
                            if (items.ano == selectedAno[1].value && prov.Nombreproveedor == items.Nombreproveedor) {
                                valcomprasprovdos = parseInt(valcomprasprovdos) + parseInt(items.MND);
                                undcomprasprovdos = parseInt(undcomprasprovdos) + parseInt(items.UND);
                            }
                        }
                    })

                    let variacion = 0;
                    variacion = ((1 - (valcomprasprov / valcomprasprovdos)) * 100).toFixed(2);

                    if (isNaN(variacion)) {
                        variacion = 0;
                    }

                    let det = {
                        nombre: prov.Nombreproveedor,
                        valanouno: valcomprasprov,
                        undanouno: undcomprasprov,
                        valanodos: valcomprasprovdos,
                        undanodos: undcomprasprovdos,
                        variacion: variacion
                    };
                    newDetCostos.push(det)
                })

                let totunduno = 0;
                let totunddos = 0;
                let totvaluno = 0;
                let totvaldos = 0;

                newDetCostos && newDetCostos.map((items) => {
                    totunduno = parseInt(totunduno) + items.undanouno;
                    totunddos = parseInt(totunddos) + items.undanodos;
                    totvaluno = parseInt(totvaluno) + items.valanouno;
                    totvaldos = parseInt(totvaldos) + items.valanodos;
                });

                let variacion = 0;
                variacion = ((1 - (totvaluno / totvaldos)) * 100).toFixed(2);

                let item = {
                    nombre: "TOTAL",
                    valanouno: totvaluno,
                    undanouno: totunduno,
                    valanodos: totvaldos,
                    undanodos: totunddos,
                    variacion: variacion
                };

                newDetCostos.push(item);

                setmovimientos(newDetCostos);
                console.log("COSTOS INGRESOS : ", newDetCostos);
            } else
                if (opcion == 1) {
                    let newDetCostos = [];
                    //console.log("LINEA : ", sublineas);
                    //return

                    sublineas && sublineas.map((prov) => {

                        let valcomprasprov = 0;
                        let undcomprasprov = 0;
                        let valcomprasprovdos = 0;
                        let undcomprasprovdos = 0;

                        detalleCompras.costolinea && detalleCompras.costolinea.map((items) => {
                            if (items.ano == selectedAno[0].value && prov.Sublinea == items.Sublinea) {
                                valcomprasprov = parseInt(valcomprasprov) + parseInt(items.MND);
                                undcomprasprov = parseInt(undcomprasprov) + parseInt(items.UND);
                            }

                            if (longitud == 2) {
                                if (items.ano == selectedAno[1].value && prov.Sublinea == items.Sublinea) {
                                    valcomprasprovdos = parseInt(valcomprasprovdos) + parseInt(items.MND);
                                    undcomprasprovdos = parseInt(undcomprasprovdos) + parseInt(items.UND);
                                }
                            }
                        })

                        let variacion = 0;
                        variacion = ((1 - (valcomprasprov / valcomprasprovdos)) * 100).toFixed(2);

                        if (isNaN(variacion)) {
                            variacion = 0;
                        }

                        let det = {
                            nombre: prov.Sublinea,
                            valanouno: valcomprasprov,
                            undanouno: undcomprasprov,
                            valanodos: valcomprasprovdos,
                            undanodos: undcomprasprovdos,
                            variacion: variacion
                        };
                        newDetCostos.push(det)
                    })

                    let totunduno = 0;
                    let totunddos = 0;
                    let totvaluno = 0;
                    let totvaldos = 0;

                    newDetCostos && newDetCostos.map((items) => {
                        totunduno = parseInt(totunduno) + parseInt(items.undanouno);
                        totunddos = parseInt(totunddos) + parseInt(items.undanodos);
                        totvaluno = parseInt(totvaluno) + parseInt(items.valanouno);
                        totvaldos = parseInt(totvaldos) + parseInt(items.valanodos);
                    });

                    let variacion = 0;
                    variacion = ((1 - (totvaluno / totvaldos)) * 100).toFixed(2);

                    let item = {
                        nombre: "TOTAL",
                        valanouno: totvaluno,
                        undanouno: totunduno,
                        valanodos: totvaldos,
                        undanodos: totunddos,
                        variacion: variacion
                    };

                    newDetCostos.push(item);

                    setmovimientos(newDetCostos);

                } else
                    if (opcion == 2) {

                        let newDetCostos = [];
                        //console.log("FAMILIA : ", familias);
                        //return 

                        familias && familias.map((prov) => {
                            let valcomprasprov = 0;
                            let undcomprasprov = 0;
                            let valcomprasprovdos = 0;
                            let undcomprasprovdos = 0;


                            detalleCompras.costofamilia && detalleCompras.costofamilia.map((items) => {
                                if (items.ano == selectedAno[0].value && prov.Familia == items.Grupo) {

                                    valcomprasprov = parseInt(valcomprasprov) + parseInt(items.MND);
                                    undcomprasprov = parseInt(undcomprasprov) + parseInt(items.UND);
                                }

                                if (longitud == 2) {
                                    if (items.ano == selectedAno[1].value && prov.Familia == items.Grupo) {
                                        valcomprasprovdos = parseInt(valcomprasprovdos) + parseInt(items.MND);
                                        undcomprasprovdos = parseInt(undcomprasprovdos) + parseInt(items.UND);
                                    }
                                }
                            })

                            let variacion = 0;
                            variacion = ((1 - (valcomprasprov / valcomprasprovdos)) * 100).toFixed(2);

                            if (isNaN(variacion)) {
                                variacion = 0;
                            }

                            let det = {
                                nombre: prov.Familia,
                                valanouno: valcomprasprov,
                                undanouno: undcomprasprov,
                                valanodos: valcomprasprovdos,
                                undanodos: undcomprasprovdos,
                                variacion: variacion
                            };
                            newDetCostos.push(det)
                        })

                        let totunduno = 0;
                        let totunddos = 0;
                        let totvaluno = 0;
                        let totvaldos = 0;

                        newDetCostos && newDetCostos.map((items) => {
                            totunduno = parseInt(totunduno) + parseInt(items.undanouno);
                            totunddos = parseInt(totunddos) + parseInt(items.undanodos);
                            totvaluno = parseInt(totvaluno) + parseInt(items.valanouno);
                            totvaldos = parseInt(totvaldos) + parseInt(items.valanodos);
                        });

                        let variacion = 0;
                        variacion = ((1 - (totvaluno / totvaldos)) * 100).toFixed(2);

                        let item = {
                            nombre: "TOTAL",
                            valanouno: totvaluno,
                            undanouno: totunduno,
                            valanodos: totvaldos,
                            undanodos: totunddos,
                            variacion: variacion
                        };

                        newDetCostos.push(item);

                        setmovimientos(newDetCostos);
                    }
                    else
                        setmovimientos([])
        } else
            if (selectedAno.length > 0 && selectedMes.length > 0) {
                if (selectedAno.length > 1 && selectedMes.length > 1) {
                    swal({
                        title: "Tablero Cosmos",
                        text: "Si seleccionas mas de un año, solo puedes consultar un mes!",
                        icon: "warning",
                    });
                    return
                }

                let longitud = selectedMes.length;
                let newDet = [];

                if (longitud == 1) {
                    let vta = {
                        nombre: { tituloTipo },
                        ano1: "VARIACIÓN" + selectedAno[0].value + selectedMes[0].value
                    };
                    newDet.push(vta);
                } else
                    if (longitud == 2) {
                        let vta;
                        let nommesuno = "";
                        let nommesdos = "";

                        if (selectedMes[0].value < 10) {
                            let mes = "0" + selectedMes[0].value;
                            nommesuno = nameMonth(mes);
                        } else {
                            let mes = "" + selectedMes[0].value;
                            nommesuno = nameMonth(mes);
                        }

                        if (selectedMes[1].value < 10) {
                            let mes = "0" + selectedMes[1].value;
                            nommesdos = nameMonth(mes);
                        } else {
                            let mes = "" + selectedMes[1].value;
                            nommesdos = nameMonth(mes);
                        }

                        vta = {
                            nombre: { tituloTipo },
                            ano1: nommesuno + "-" + selectedAno[0].value,
                            ano2: nommesdos + "-" + selectedAno[0].value,
                            variacion: "VARIACIÓN"
                        };
                        newDet.push(vta);
                        setLabelUno(vta.ano1);
                        setLabelDos(vta.ano2);
                    } else {
                        swal({
                            title: "Tablero Cosmos",
                            text: "Seleccionar maximo dos años!",
                            icon: "warning",
                        });
                        return
                    }

                setLabelcostos(newDet);

                if (opcion == 0) {
                    let newDetCostos = [];

                    detalleCompras.proveedorescompras && detalleCompras.proveedorescompras.map((prov) => {
                        let valcomprasprov = 0;
                        let undcomprasprov = 0;
                        let valcomprasprovdos = 0;
                        let undcomprasprovdos = 0;
                        let mes = selectedMes[0].value;
                        let mesdos = 0;

                        detalleCompras.costoproveedor && detalleCompras.costoproveedor.map((items) => {

                            if (items.ano == selectedAno[0].value && prov.Nombreproveedor == items.Nombreproveedor &&
                                items.mes == mes) {

                                valcomprasprov = valcomprasprov + items.MND;
                                undcomprasprov = undcomprasprov + items.UND;
                            }

                            if (longitud == 2) {
                                mesdos = selectedMes[1].value;
                                if (items.ano == selectedAno[0].value && prov.Nombreproveedor == items.Nombreproveedor &&
                                    items.mes == mesdos) {
                                    valcomprasprovdos = valcomprasprovdos + items.MND;
                                    undcomprasprovdos = undcomprasprovdos + items.UND;
                                }

                            }
                        })

                        let variacion = 0;
                        variacion = ((1 - (valcomprasprov / valcomprasprovdos)) * 100).toFixed(2);

                        if (isNaN(variacion)) {
                            variacion = 0;
                        }

                        if (valcomprasprov > 0 || valcomprasprovdos > 0) {

                            let det = {
                                nombre: prov.Nombreproveedor,
                                valanouno: valcomprasprov,
                                undanouno: undcomprasprov,
                                valanodos: valcomprasprovdos,
                                undanodos: undcomprasprovdos,
                                variacion: variacion
                            };
                            newDetCostos.push(det)

                        }
                    })

                    setmovimientos(newDetCostos);
                    //console.log("COSTOS INGRESOS : ", newDetCostos);

                } else
                    if (opcion == 1) {


                        let newDetCostos = [];
                        sublineas && sublineas.map((prov) => {
                            let valcomprasprov = 0;
                            let undcomprasprov = 0;
                            let valcomprasprovdos = 0;
                            let undcomprasprovdos = 0;
                            let mes = selectedMes[0].value;
                            let mesdos = 0;

                            detalleCompras.costolinea && detalleCompras.costolinea.map((items) => {
                                if (items.ano == selectedAno[0].value && prov.Sublinea == items.Sublinea &&
                                    items.mes == mes) {

                                    valcomprasprov = valcomprasprov + items.MND;
                                    undcomprasprov = undcomprasprov + items.UND;
                                }

                                if (longitud == 2) {
                                    mesdos = selectedMes[1].value;
                                    if (items.ano == selectedAno[0].value && prov.Sublinea == items.Sublinea &&
                                        items.mes == mesdos) {
                                        valcomprasprovdos = valcomprasprovdos + items.MND;
                                        undcomprasprovdos = undcomprasprovdos + items.UND;
                                    }
                                }
                            })

                            let variacion = 0;
                            variacion = ((1 - (valcomprasprov / valcomprasprovdos)) * 100).toFixed(2);

                            if (isNaN(variacion)) {
                                variacion = 0;
                            }

                            let det = {
                                nombre: prov.Sublinea,
                                valanouno: valcomprasprov,
                                undanouno: undcomprasprov,
                                valanodos: valcomprasprovdos,
                                undanodos: undcomprasprovdos,
                                variacion: variacion
                            };
                            newDetCostos.push(det)
                        })

                        setmovimientos(newDetCostos);
                    } else
                        if (opcion == 2) {

                            let newDetCostos = [];

                            familias && familias.map((prov) => {
                                let valcomprasprov = 0;
                                let undcomprasprov = 0;
                                let valcomprasprovdos = 0;
                                let undcomprasprovdos = 0;
                                let mes = selectedMes[0].value;
                                let mesdos = 0;

                                detalleCompras.costofamilia && detalleCompras.costofamilia.map((items) => {
                                    if (items.ano == selectedAno[0].value && prov.Familia == items.Grupo &&
                                        items.mes == mes) {

                                        valcomprasprov = valcomprasprov + items.MND;
                                        undcomprasprov = undcomprasprov + items.UND;
                                    }

                                    if (longitud == 2) {
                                        mesdos = selectedMes[1].value;
                                        if (items.ano == selectedAno[0].value && prov.Familia == items.Grupo &&
                                            items.mes == mesdos) {
                                            valcomprasprovdos = valcomprasprovdos + items.MND;
                                            undcomprasprovdos = undcomprasprovdos + items.UND;
                                        }
                                    }
                                })

                                let variacion = 0;
                                variacion = ((1 - (valcomprasprov / valcomprasprovdos)) * 100).toFixed(2);

                                if (isNaN(variacion)) {
                                    variacion = 0;
                                }

                                let det = {
                                    nombre: prov.Familia,
                                    valanouno: valcomprasprov,
                                    undanouno: undcomprasprov,
                                    valanodos: valcomprasprovdos,
                                    undanodos: undcomprasprovdos,
                                    variacion: variacion
                                };
                                newDetCostos.push(det)
                            })

                            setmovimientos(newDetCostos);

                        } else
                            setmovimientos([])
            }


    }, [consultar]);

    const header_test = [
        { title: tituloTipo, dataIndex: "nombre", key: "nombre", width: 200 },
        {
            title: "VALORES-" + labelUno, dataIndex: "valanouno", key: "valanouno", width: 150, align: "right",
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.valanouno - b.valanouno,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.valanouno, 2)}
                    </Title>

                );
            }
        },
        {
            title: "UNIDADES-" + labelUno, dataIndex: "undanouno", key: "undanouno", width: 150, align: "right",
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.undanouno - b.undanouno,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.undanouno, 2)}
                    </Title>

                );
            }
        },
        {
            title: "VALORES-" + labelDos, dataIndex: "valanodos", key: "valanodos", width: 150, align: "right",
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.valanodos - b.valanodos,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.valanodos, 2)}
                    </Title>

                );
            }
        },
        {
            title: "UNIDADES-" + labelDos, dataIndex: "undanodos", key: "undanodos", width: 150, align: "right",
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.undanodos - b.undanodos,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.undanodos, 2)}
                    </Title>

                );
            }
        },
        {
            title: "DIFERENCIA", dataIndex: "variacion", key: "variacion", width: 150, align: "right",
            sortDirections: ['descend', 'ascend'],
            //sorter: (a, b) => a.unidades4_ - b.unidades4_,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, zIndex: 0 }}>
                        {isNaN(parseInt(row.variacion)) ?
                            0
                            :
                            myNumber(1, row.variacion, 2)
                        }
                    </Title>

                );
            }
        },
    ]

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
                        <nav className="ml-1 -mb-px flex space-x-2" aria-label="Tabs">
                            {tabsdos.map((tab, index) => (
                                <a
                                    key={tab.name}
                                    onClick={() => selCostoslinea(index)}
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
                    <div className="mt-2 border-b border-gray-200">
                        <nav className="ml-1 mb-3 flex space-x-2" aria-label="Tabs">
                            <div className="flex">
                                <Menu as="div" className="ml-7 relative inline-block" >
                                    <MultiSelect
                                        options={vtasAno}
                                        value={selectedAno}
                                        onChange={setSelectedAno}
                                        disableSearch="false"
                                        labelledBy="Filtrar por año"
                                        className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-300"
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

                            <div className="flex">
                                <Menu as="div" className="relative inline-block" >
                                    <MultiSelect
                                        options={vtasMes}
                                        value={selectedMes}
                                        onChange={setSelectedMes}
                                        disableSearch="false"
                                        labelledBy="Filtrar por mes"
                                        className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-300"
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

                                        <div className="mx-auto flex max-w-4xl h-10 space-x-2 divide-x bg-redhdr rounded divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
                                            <button
                                                onClick={() => generarConsulta()}
                                            >
                                                Consultar
                                            </button>
                                        </div>
                                        <div className="ml-3 mx-auto flex max-w-4xl h-10 space-x-6 divide-x bg-green rounded divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
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
                    </div>
                </div>
            </h2 >
        </div >
    );
}

export default TabCostos;