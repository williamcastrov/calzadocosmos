import { Fragment, useState, useEffect } from "react";
import { myNumber, nameMonth } from "../../../utils/ArrayFunctions";
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Table, Tag, Typography } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { MultiSelect } from "react-multi-select-component";
import Select from 'react-select';
import swal from 'sweetalert';

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function TabProveedores(props) {
    const { Title } = Typography;
    const { tipo, setTipo, ingresosxlinea, ingresosxproveedor, presupuestosxlinea, detalleCompras, proveedorescompras } = props;
    const [entMes, setEntMes] = useState(true);
    const [entAcumuladas, setEntAcumuladas] = useState(false);
    const [movimientos, setmovimientos] = useState(false);
    const [movimientosMes, setmovimientosMes] = useState(false);
    const [opcion, setOpcion] = useState(0);
    const fecha = new Date();
    const mesActual = fecha.getMonth() + 1;

    let ventasDiariasMes = [];
    ventasDiariasMes = useSelector((state) => state.datosfiltros.datosfiltros);

    //const [vtasAno, setVtasAno] = useState(ventasDiariasMes.anos_vtasdiarias);
    //const [vtasMes, setVtasMes] = useState(ventasDiariasMes.meses_vtasdiarias);
    //const [vtasDia, setVtasDia] = useState(ventasDiariasMes.dias_vtas);
    const [vtasAno, setVtasAno] = useState([]);
    const [vtasMes, setVtasMes] = useState([]);
    const [vtasDia, setVtasDia] = useState([]);

    const [selectedAno, setSelectedAno] = useState([]);
    const [selectedMes, setSelectedMes] = useState([]);
    const [selectedDia, setSelectedDia] = useState([]);
    const [label, setLabel] = useState([]);

    useEffect(() => {
        let newDetAnos = [];
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
                ingresosxproveedor && ingresosxproveedor.map((items) => {
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
                    ingresosxproveedor && ingresosxproveedor.map((items) => {
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
        setSelectedAno([]);
        setSelectedMes([]);
        setSelectedDia([]);
        setmovimientosMes([]);
        setmovimientos([]);
    }

    const generarConsulta = () => {
        if (!selectedAno) {
            swal({
                title: "Tablero Cosmos",
                text: "Primero debes seleccionar el año!",
                icon: "warning",
            });
            return
        }

        if (selectedAno.length > 1 || selectedMes.length > 1) {
            swal({
                title: "Tablero Cosmos",
                text: "Solo puedes seleccionar un año y un mes !",
                icon: "warning",
            });
            return
        }

        if (selectedAno) {
            consolidar();
        }
        //setConsultarAno(true)
    }

    const consolidar = () => {
        if (selectedAno.length > 0 && selectedMes.length > 0 && !selectedDia.value) {
            setEntAcumuladas(false);
            setEntMes(true);
            setOpcion(0);

            setLabel("MES ")
            let newDetCompras = [];
            let newDetComprasMes = [];

            proveedorescompras &&
                proveedorescompras.map((lineas, index) => {
                    let undcompras = 0;
                    let valcompras = 0;
                    let undcomprasmes = 0;
                    let valcomprasmes = 0;

                    detalleCompras.costoproveedor &&
                        detalleCompras.costoproveedor.map((ingresos, index) => {
                            if (ingresos.Nombreproveedor == lineas.Proveedor && ingresos.ano == selectedAno[0].value) {
                                undcompras = parseInt(undcompras) + parseInt(ingresos.UND);
                                valcompras = parseInt(valcompras) + parseInt(ingresos.MND);
                            }
                            if (ingresos.Nombreproveedor == lineas.Proveedor && ingresos.ano == selectedAno[0].value
                                && ingresos.mes == selectedMes[0].value) {
                                undcomprasmes = parseInt(undcomprasmes) + parseInt(ingresos.UND);
                                valcomprasmes = parseInt(valcomprasmes) + parseInt(ingresos.MND);
                            }
                        });

                    if (undcompras > 0 || undcomprasmes > 0 && selectedDia) {
                        let mvto = {
                            Descripcion: lineas.Proveedor,
                            UndIngreso: undcompras,
                            ValIngreso: valcompras,
                        };

                        let mvtomes = {
                            Descripcion: lineas.Proveedor,
                            UndIngresoMes: undcomprasmes,
                            ValIngresoMes: valcomprasmes,
                        };

                        newDetCompras.push(mvto);
                        newDetComprasMes.push(mvtomes);
                    }
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

                    if (ingresos.ValIngresoMes > 0) {
                        let mvto = {
                            Descripcion: ingresos.Descripcion,
                            UndIngreso: ingresos.UndIngresoMes,
                            ValIngreso: ingresos.ValIngresoMes,
                            UndPst: undpstmes,
                            ValPst: valpstmes
                        };
                        newDetComprasVsPstMes.push(mvto);
                    }
                });

            newDetCompras &&
                newDetCompras.map((ingresos, index) => {
                    let undpst = 0;
                    let valpst = 0;
                    presupuestosxlinea &&
                        presupuestosxlinea.map((pst, index) => {
                            if (ingresos.Descripcion == pst.Sublinea && selectedAno[0].value == pst.ano) {
                                undpst = parseInt(undpst) + parseInt(pst.UND_PST);
                                valpst = parseInt(valpst) + parseInt(pst.VAL_PST);
                            }
                        });

                    if (ingresos.UndIngreso > 0) {
                        let mvto = {
                            Descripcion: ingresos.Descripcion,
                            UndIngreso: ingresos.UndIngreso,
                            ValIngreso: ingresos.ValIngreso,
                            UndPst: undpst,
                            ValPst: valpst
                        };
                        newDetComprasVsPst.push(mvto);
                    }
                });

            let und = 0;
            let val = 0;

            newDetComprasVsPstMes &&
                newDetComprasVsPstMes.map((mes, index) => {
                    und = parseInt(und) + parseInt(mes.UndIngreso)
                    val = parseInt(val) + parseInt(mes.ValIngreso)
                });

            let mvtomes = {
                Descripcion: "TOTAL",
                UndIngreso: und,
                ValIngreso: val,
                UndPst: 0,
                ValPst: 0
            };

            newDetComprasVsPstMes.push(mvtomes);

            let undtot = 0;
            let valtot = 0;

            newDetComprasVsPst &&
                newDetComprasVsPst.map((mes, index) => {
                    undtot = parseInt(undtot) + parseInt(mes.UndIngreso)
                    valtot = parseInt(valtot) + parseInt(mes.ValIngreso)
                });

            let mvto = {
                Descripcion: "TOTAL",
                UndIngreso: undtot,
                ValIngreso: valtot,
                UndPst: 0,
                ValPst: 0
            };

            newDetComprasVsPst.push(mvto);

            setmovimientosMes(newDetComprasVsPstMes);
            setmovimientos(newDetComprasVsPst);
        }
        else
            if (selectedAno.length > 0 && selectedMes.length == 0) {
                setEntAcumuladas(true);
                setEntMes(false);
                setOpcion(1);
                let newDetCompras = [];
                let newDetComprasMes = [];
                setLabel("TOTAL ")
                proveedorescompras &&
                    proveedorescompras.map((lineas, index) => {
                        let undcompras = 0;
                        let valcompras = 0;
                        let undcomprasmes = 0;
                        let valcomprasmes = 0;

                        detalleCompras.costoproveedor &&
                            detalleCompras.costoproveedor.map((ingresos, index) => {
                                if (ingresos.Nombreproveedor == lineas.Proveedor && ingresos.ano == selectedAno[0].value) {
                                    undcompras = parseInt(undcompras) + parseInt(ingresos.UND);
                                    valcompras = parseInt(valcompras) + parseInt(ingresos.MND);
                                }
                                /*
                                   if (ingresos.Nombreproveedor == lineas.Proveedor && ingresos.ano == selectedAno[0].value &&
                                       ingresos.mes == selectedMes[0].value) {
                                       undcomprasmes = undcomprasmes + ingresos.UND;
                                       valcomprasmes = valcomprasmes + ingresos.MND;
                                   }
                                   */
                            });

                        if (undcompras > 0) {
                            let mvto = {
                                Descripcion: lineas.Proveedor,
                                UndIngreso: undcompras,
                                ValIngreso: valcompras,
                            };

                            let mvtomes = {
                                Descripcion: lineas.Proveedor,
                                UndIngresoMes: undcomprasmes,
                                ValIngresoMes: valcomprasmes,
                            };

                            newDetCompras.push(mvto);
                            newDetComprasMes.push(mvtomes);
                        }
                    });

                let newDetComprasVsPst = [];
                let newDetComprasVsPstMes = [];

                newDetComprasMes &&
                    newDetComprasMes.map((ingresos, index) => {
                        let undpstmes = 0;
                        let valpstmes = 0;
                        presupuestosxlinea &&
                            presupuestosxlinea.map((pst, index) => {
                                if (ingresos.Descripcion == pst.Sublinea && selectedAno[0].value == pst.ano) {
                                    undpstmes = parseInt(undpstmes) + parseInt(pst.UND_PST);
                                    valpstmes = parseInt(valpstmes) + parseInt(pst.VAL_PST);
                                }
                            });

                        if (ingresos.ValIngresoMes > 0) {
                            let mvto = {
                                Descripcion: ingresos.Descripcion,
                                UndIngreso: ingresos.UndIngresoMes,
                                ValIngreso: ingresos.ValIngresoMes,
                                UndPst: undpstmes,
                                ValPst: valpstmes
                            };
                            newDetComprasVsPstMes.push(mvto);
                        }
                    });

                newDetCompras &&
                    newDetCompras.map((ingresos, index) => {
                        let undpst = 0;
                        let valpst = 0;
                        presupuestosxlinea &&
                            presupuestosxlinea.map((pst, index) => {
                                if (ingresos.Descripcion == pst.Sublinea && selectedAno[0].value == pst.ano) {
                                    undpst = parseInt(undpst) + parseInt(pst.UND_PST);
                                    valpst = parseInt(valpst) + parseInt(pst.VAL_PST);
                                }
                            });

                        if (ingresos.UndIngreso > 0) {
                            let mvto = {
                                Descripcion: ingresos.Descripcion,
                                UndIngreso: ingresos.UndIngreso,
                                ValIngreso: ingresos.ValIngreso,
                                UndPst: undpst,
                                ValPst: valpst
                            };
                            newDetComprasVsPst.push(mvto);
                        }
                    });

                setmovimientosMes(newDetComprasVsPstMes);
                setmovimientos(newDetComprasVsPst);
            } else
                if (selectedAno.length > 0 && selectedMes.length > 0 && selectedDia) {

                    setLabel("DIA ")
                    let newDetCompras = [];
                    let newDetComprasMes = [];

                    proveedorescompras &&
                        proveedorescompras.map((lineas, index) => {
                            let undcompras = 0;
                            let valcompras = 0;
                            let undcomprasmes = 0;
                            let valcomprasmes = 0;

                            detalleCompras.costoproveedor &&
                                detalleCompras.costoproveedor.map((ingresos, index) => {
                                    if (ingresos.Nombreproveedor == lineas.Proveedor && ingresos.ano == selectedAno[0].value) {
                                        undcompras = parseInt(undcompras) + parseInt(ingresos.UND);
                                        valcompras = parseInt(valcompras) + parseInt(ingresos.MND);
                                    }
                                    if (ingresos.Nombreproveedor == lineas.Proveedor && ingresos.ano == selectedAno[0].value
                                        && ingresos.mes == selectedMes[0].value && ingresos.dia == selectedDia.value) {
                                        undcomprasmes = parseInt(undcomprasmes) + parseInt(ingresos.UND);
                                        valcomprasmes = parseInt(valcomprasmes) + parseInt(ingresos.MND);
                                    }
                                });

                            if (undcompras > 0 || undcomprasmes > 0) {
                                let mvto = {
                                    Descripcion: lineas.Proveedor,
                                    UndIngreso: undcompras,
                                    ValIngreso: valcompras,
                                };

                                let mvtomes = {
                                    Descripcion: lineas.Proveedor,
                                    UndIngresoMes: undcomprasmes,
                                    ValIngresoMes: valcomprasmes,
                                };

                                newDetCompras.push(mvto);
                                newDetComprasMes.push(mvtomes);
                            }
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

                            if (ingresos.ValIngresoMes > 0) {
                                let mvto = {
                                    Descripcion: ingresos.Descripcion,
                                    UndIngreso: ingresos.UndIngresoMes,
                                    ValIngreso: ingresos.ValIngresoMes,
                                    UndPst: undpstmes,
                                    ValPst: valpstmes
                                };
                                newDetComprasVsPstMes.push(mvto);
                            }
                        });

                    newDetCompras &&
                        newDetCompras.map((ingresos, index) => {
                            let undpst = 0;
                            let valpst = 0;
                            presupuestosxlinea &&
                                presupuestosxlinea.map((pst, index) => {
                                    if (ingresos.Descripcion == pst.Sublinea && selectedAno[0].value == pst.ano) {
                                        undpst = parseInt(undpst) + parseInt(pst.UND_PST);
                                        valpst = parseInt(valpst) + parseInt(pst.VAL_PST);
                                    }
                                });

                            if (ingresos.UndIngreso > 0) {
                                let mvto = {
                                    Descripcion: ingresos.Descripcion,
                                    UndIngreso: ingresos.UndIngreso,
                                    ValIngreso: ingresos.ValIngreso,
                                    UndPst: undpst,
                                    ValPst: valpst
                                };
                                newDetComprasVsPst.push(mvto);
                            }
                        });

                    let und = 0;
                    let val = 0;

                    newDetComprasVsPstMes &&
                        newDetComprasVsPstMes.map((mes, index) => {
                            und = parseInt(und) + parseInt(mes.UndIngreso)
                            val = parseInt(val) + parseInt(mes.ValIngreso)
                        });

                    let mvtomes = {
                        Descripcion: "TOTAL",
                        UndIngreso: und,
                        ValIngreso: val,
                        UndPst: 0,
                        ValPst: 0
                    };

                    newDetComprasVsPstMes.push(mvtomes);

                    let undtot = 0;
                    let valtot = 0;

                    newDetComprasVsPst &&
                        newDetComprasVsPst.map((mes, index) => {
                            undtot = parseInt(undtot) + parseInt(mes.UndIngreso)
                            valtot = parseInt(valtot) + parseInt(mes.ValIngreso)
                        });

                    let mvto = {
                        Descripcion: "TOTAL",
                        UndIngreso: undtot,
                        ValIngreso: valtot,
                        UndPst: 0,
                        ValPst: 0
                    };

                    newDetComprasVsPst.push(mvto);

                    setmovimientosMes(newDetComprasVsPstMes);
                    setmovimientos(newDetComprasVsPst);
                }
    }

    const header_test = [
        { title: "PROVEEDOR", dataIndex: "Descripcion", key: "Descripcion", width: 80, fixed: true },
        {
            title: "UND MES", dataIndex: "UndIngreso", key: "UndIngreso", width: 150, align: "right",
            sorter: (a, b) => a.UndIngreso - b.UndIngreso,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.UndIngreso, 2)}
                    </Title>
                );
            }
        },
        {
            title: "VALOR MES", dataIndex: "ValIngreso", key: "ValIngreso", width: 150, align: "right",
            sorter: (a, b) => a.ValIngreso - b.ValIngreso,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.ValIngreso, 2)}
                    </Title>
                );
            }
        }
    ]

    const header_testtot = [
        { title: "PROVEEDOR", dataIndex: "Descripcion", key: "Descripcion", width: 80, fixed: true },
        {
            title: "UND TOTAL", dataIndex: "UndIngreso", key: "UndIngreso", width: 150, align: "right",
            sorter: (a, b) => a.UndIngreso - b.UndIngreso,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.UndIngreso, 2)}
                    </Title>
                );
            }
        },
        {
            title: "VALOR TOTAL", dataIndex: "ValIngreso", key: "ValIngreso", width: 150, align: "right",
            sorter: (a, b) => a.ValIngreso - b.ValIngreso,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.ValIngreso, 2)}
                    </Title>
                );
            }
        }
    ]

    const header_testdia = [
        { title: "PROVEEDOR", dataIndex: "Descripcion", key: "Descripcion", width: 80, fixed: true },
        {
            title: "UND DIA", dataIndex: "UndIngreso", key: "UndIngreso", width: 150, align: "right",
            sorter: (a, b) => a.UndIngreso - b.UndIngreso,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.UndIngreso, 2)}
                    </Title>
                );
            }
        },
        {
            title: "VALOR MES", dataIndex: "ValIngreso", key: "ValIngreso", width: 150, align: "right",
            sorter: (a, b) => a.ValIngreso - b.ValIngreso,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.ValIngreso, 2)}
                    </Title>
                );
            }
        }
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
                        <nav className="ml-1 -mb-px flex space-x-4" aria-label="Tabs">
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
                        <div className="mt-2 border-b border-gray-200">
                            <nav className="ml-80 mb-3 flex space-x-2" aria-label="Tabs">
                                <div className="mt-1 flex">
                                    <Menu as="div" className="relative inline-block" >
                                        <MultiSelect
                                            options={vtasAno}
                                            value={selectedAno}
                                            onChange={setSelectedAno}
                                            disableSearch="false"
                                            labelledBy="Filtrar por año"
                                            className=" p-0 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
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
                                    <Menu as="div" className="relative inline-block" >
                                        <Select
                                            options={vtasDia}
                                            value={selectedDia}
                                            onChange={setSelectedDia}
                                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                            placeholder="Selec. día"
                                        />
                                    </Menu>
                                </div>
                                <div className="mt-1 flex">
                                    <Menu as="div" className="ml-1 relative inline-block" >
                                        <div className="flex">

                                            <div className="mx-auto flex max-w-4xl h-10 space-x-6 divide-x bg-green rounded divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
                                                <button
                                                    onClick={() => generarConsulta()}
                                                >
                                                    Consultar
                                                </button>
                                            </div>
                                            <div className="ml-3 mx-auto flex max-w-4xl h-10 space-x-6 divide-x bg-yellow rounded divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
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

                    </div>

                    <div className="margenizaquierdanegativo px-4 sm:px-6 lg:px-8">
                        {
                            selectedDia.value ?
                                (
                                    <div className="mt-8 flex flex-col">
                                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                            <div className="ml-10">
                                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                                    <div className="min-w-full  margenizaquierdanegativo px-4 sm:px-6 lg:px-8">
                                                        <div className="min-w-full  mt-8 flex flex-col">
                                                            <div className="min-w-full  -my-2 -mx-4 sm:-mx-6 lg:-mx-8">
                                                                <div className="min-w-full py-2 align-middle md:px-6 lg:px-8">
                                                                    <div className="min-w-full shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                                                        <Table columns={header_testdia} dataSource={movimientosMes} pagination={false}
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
                                        </div>
                                    </div>
                                )
                                :
                                opcion == 0 ?
                                    (
                                        <div className="mt-8 flex flex-col">
                                            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                                <div className="ml-10">
                                                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                                        <div className="min-w-full  margenizaquierdanegativo px-4 sm:px-6 lg:px-8">
                                                            <div className="min-w-full  mt-8 flex flex-col">
                                                                <div className="min-w-full  -my-2 -mx-4 sm:-mx-6 lg:-mx-8">
                                                                    <div className="min-w-full py-2 align-middle md:px-6 lg:px-8">
                                                                        <div className="min-w-full shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                                                            <Table columns={header_test} dataSource={movimientosMes} pagination={false}
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
                                            </div>
                                        </div>
                                    )
                                    :
                                    opcion == 1 ?
                                        (
                                            <div className="mt-8 flex flex-col">
                                                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                                            <div className="min-w-full  margenizaquierdanegativo px-4 sm:px-6 lg:px-8">
                                                                <div className="min-w-full  mt-8 flex flex-col">
                                                                    <div className="min-w-full  -my-2 -mx-4 sm:-mx-6 lg:-mx-8">
                                                                        <div className="min-w-full py-2 align-middle md:px-6 lg:px-8">
                                                                            <div className="min-w-full shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
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
            </h2 >
        </div >
    );
}

export default TabProveedores;