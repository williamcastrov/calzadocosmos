import { Fragment, useState, useEffect } from "react";
import { myNumber, nameMonth } from "../../../utils/ArrayFunctions";
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MultiSelect } from "react-multi-select-component";
import { Table, Tag, Typography } from 'antd';
import swal from 'sweetalert';

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function TabMaterialEmpaque(props) {
    const { Title } = Typography;
    const { tipo, setTipo, ventasDiariasMes, listaMaterialEmpaque } = props;
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

    const [selectedAno, setSelectedAno] = useState([]);
    const [selectedSemestre, setSelectedSemestre] = useState([]);
    const [selectedTrimestre, setSelectedTrimestre] = useState([]);
    const [selectedMes, setSelectedMes] = useState([]);
    const [selectedDia, setSelectedDia] = useState([]);

    const [vtasAno, setVtasAno] = useState(ventasDiariasMes.anos_vtasdiarias);
    const [vtasMes, setVtasMes] = useState(ventasDiariasMes.meses_vtasdiarias);
    const [vtasDia, setVtasDia] = useState(ventasDiariasMes.dias_vtas);
    const [vtasSemestre, setVtasSemestre] = useState([]);
    const [vtasTrimestre, setVtasTrimestre] = useState([]);

    const [centrosoperacion, setCentrosoperacion] = useState(ventasDiariasMes.centrosoperacion);
    const [subcategorias, setSubcategorias] = useState(ventasDiariasMes.subcategorias);
    const [ordenaTotalStock, setOrdenaTotalStock] = useState(true);

    //console.log("VENTAS DIARIAS MES XXX: ", ventasDiariasMes);
    //console.log("LABEL DIAS: ", labelVentas);
    const tabsdos = [
        { name: 'Centro operación', href: '#', current: entMes }
    ]

    const reiniciar = () => {
        setmovimientos([])
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

    const sortTotalStock = (item) => {
        alert("AQUI")
        /*
        setOrdenaTotalStock(!ordenaTotalStock)
        if (ordenaTotalStock) {
            movimientos.sort(function (a, b) {
                return (b.Totalstock - a.Totalstock)
            })
        } else {
            movimientos.sort(function (a, b) {
                return (a.Totalstock - b.Totalstock)
            })
        }
        */
    }

    useEffect(() => {
        setConsultar(false);
        setActualiza(!actualiza);
        let datosmaterialempaque = listaMaterialEmpaque.ventasmaterialempaque;
        let tipoempaque = listaMaterialEmpaque.tipoempaque;

        if (selectedAno.length == 1 && selectedMes.length == 0) {
            if (opcion == 0) {

                let newDet = [];
                datosmaterialempaque && datosmaterialempaque.map((items) => {
                    if (items.ano == selectedAno[0].value) {
                        let dat = {
                            ano: items.ano,
                            grupo: items.Grupo,
                            marca: items.Marca,
                            descripcion: items.Descripcion_Item,
                            sublinea: items.Sublinea,
                            Centro: items.Centro,
                            periodo: items.Periodo,
                            cantidad: items.Cantidad,
                            valorneto: items.Vlr_Neto,
                            valorneto: items.Vlr_Total
                        }
                        newDet.push(dat)
                    }
                });

                let newDetCentro = [];

                centrosoperacion && centrosoperacion.map((cent) => {
                    tipoempaque && tipoempaque.map((emp) => {
                        let unidades = 0;
                        let valneto = 0;
                        let valtotal = 0;

                        newDet && newDet.map((items) => {
                            if (cent.Centros_Operacion == items.Centro && items.descripcion == emp.Descripcion_Item) {
                                unidades = parseInt(unidades) + parseInt(items.cantidad);
                                valneto = parseInt(valneto) + parseInt(items.valorneto);
                                valtotal = parseInt(valtotal) + parseInt(items.valorneto);
                            }

                        });
                        let dat = {
                            descripcion: cent.Centros_Operacion,
                            tipo: emp.Descripcion_Item,
                            cantidad: unidades,
                            valorneto: valneto,
                            valortotal: valtotal
                        }
                        newDetCentro.push(dat)
                    });
                });

                let newDetTot = [];
                let unidadestot1 = 0;
                let valnetotot1 = 0;
                let unidadestot2 = 0;
                let valnetotot2 = 0;
                let unidadestot3 = 0;
                let valnetotot3 = 0;

                centrosoperacion && centrosoperacion.map((cent) => {
                    let unidades4 = 0;
                    let valneto4 = 0;
                    let valtotal4 = 0;
                    let bolsa4 = "";
                    let unidades5 = 0;
                    let valneto5 = 0;
                    let valtotal5 = 0;
                    let bolsa5 = "";
                    let unidades6 = 0;
                    let valneto6 = 0;
                    let valtotal6 = 0;
                    let bolsa6 = "";


                    newDetCentro && newDetCentro.map((items) => {
                        if (cent.Centros_Operacion == items.descripcion && items.tipo == "BOLSA POLIBON GRANDE") {
                            unidades4 = items.cantidad;
                            valneto4 = items.valorneto;
                            valtotal4 = items.valorneto;
                        }
                        if (cent.Centros_Operacion == items.descripcion && items.tipo == "BOLSA POLIBON MEDIANA") {
                            unidades5 = items.cantidad;
                            valneto5 = items.valorneto;
                            valtotal5 = items.valorneto;
                        }
                        if (cent.Centros_Operacion == items.descripcion && items.tipo == "BOLSA POLIBON PEQUEÑA") {
                            unidades6 = items.cantidad;
                            valneto6 = items.valorneto;
                            valtotal6 = items.valorneto;
                        }

                        if (items.tipo == "BOLSA POLIBON GRANDE") {
                            unidadestot1 = parseInt(unidadestot1) + parseInt(items.cantidad);
                            valnetotot1 = parseInt(valnetotot1) + parseInt(items.valorneto)
                        }

                    });
                    let dat = {
                        descripcion: cent.Centros_Operacion,
                        unidades4,
                        valneto4,
                        valtotal4,
                        bolsa4,
                        unidades5,
                        valneto5,
                        valtotal5,
                        bolsa5,
                        unidades6,
                        valneto6,
                        valtotal6,
                        bolsa6,
                        totalund: unidades4 + unidades5 + unidades6,
                        totalval: valtotal4 + valtotal5 + valtotal6
                    }
                    newDetTot.push(dat)
                });

                //console.log("DATOS : ", newDetTot)
                setmovimientos(newDetTot);
            } 
        } else
            if (selectedAno.length == 1 && selectedMes.length == 1) {
                if (opcion == 0) {

                    let newDet = [];
                    datosmaterialempaque && datosmaterialempaque.map((items) => {
                        if (items.ano == selectedAno[0].value && items.mes == selectedMes[0].value) {
                            let dat = {
                                ano: items.ano,
                                grupo: items.Grupo,
                                marca: items.Marca,
                                descripcion: items.Descripcion_Item,
                                sublinea: items.Sublinea,
                                Centro: items.Centro,
                                periodo: items.Periodo,
                                cantidad: items.Cantidad,
                                valorneto: items.Vlr_Neto,
                                valorneto: items.Vlr_Total
                            }
                            newDet.push(dat)
                        }
                    });

                    let newDetCentro = [];

                    centrosoperacion && centrosoperacion.map((cent) => {
                        tipoempaque && tipoempaque.map((emp) => {
                            let unidades = 0;
                            let valneto = 0;
                            let valtotal = 0;

                            newDet && newDet.map((items) => {
                                if (cent.Centros_Operacion == items.Centro && items.descripcion == emp.Descripcion_Item) {
                                    unidades = parseInt(unidades) + parseInt(items.cantidad);
                                    valneto = parseInt(valneto) + parseInt(items.valorneto);
                                    valtotal = parseInt(valtotal) + parseInt(items.valorneto);
                                }

                            });
                            let dat = {
                                descripcion: cent.Centros_Operacion,
                                tipo: emp.Descripcion_Item,
                                cantidad: unidades,
                                valorneto: valneto,
                                valortotal: valtotal
                            }
                            newDetCentro.push(dat)
                        });
                    });

                    //console.log("DATOS XXX: ", newDetCentro)
                    //return

                    let newDetTot = [];
                    let unidadestot1 = 0;
                    let valnetotot1 = 0;
                    let unidadestot2 = 0;
                    let valnetotot2 = 0;
                    let unidadestot3 = 0;
                    let valnetotot3 = 0;

                    centrosoperacion && centrosoperacion.map((cent) => {
                        let unidades4 = 0;
                        let valneto4 = 0;
                        let valtotal4 = 0;
                        let bolsa4 = "";
                        let unidades5 = 0;
                        let valneto5 = 0;
                        let valtotal5 = 0;
                        let bolsa5 = "";
                        let unidades6 = 0;
                        let valneto6 = 0;
                        let valtotal6 = 0;
                        let bolsa6 = "";

                        newDetCentro && newDetCentro.map((items) => {
                            if (cent.Centros_Operacion == items.descripcion && items.tipo == "BOLSA POLIBON GRANDE") {
                                bolsa4 = "BOLSA POLIBON GRANDE";
                                unidades4 = items.cantidad;
                                valneto4 = items.valorneto;
                                valtotal4 = items.valorneto;
                            }
                            if (cent.Centros_Operacion == items.descripcion && items.tipo == "BOLSA POLIBON MEDIANA") {
                                bolsa5 = "BOLSA POLIBON MEDIANA";
                                unidades5 = items.cantidad;
                                valneto5 = items.valorneto;
                                valtotal5 = items.valorneto;
                            }
                            if (cent.Centros_Operacion == items.descripcion && items.tipo == "BOLSA POLIBON PEQUEÑA") {
                                bolsa6 = "BOLSA POLIBON PEQUEÑA";
                                unidades6 = items.cantidad;
                                valneto6 = items.valorneto;
                                valtotal6 = items.valorneto;
                            }

                            if (items.tipo == "BOLSA POLIBON GRANDE") {
                                unidadestot1 = parseInt(unidadestot1) + parseInt(items.cantidad);
                                valnetotot1 = parseInt(valnetotot1) + parseInt(items.valorneto)
                            }

                        });
                        let dat = {
                            descripcion: cent.Centros_Operacion,
                            unidades4,
                            valneto4,
                            valtotal4,
                            bolsa4,
                            unidades5,
                            valneto5,
                            valtotal5,
                            bolsa5,
                            unidades6,
                            valneto6,
                            valtotal6,
                            bolsa6,
                            totalund: unidades4 + unidades5 + unidades6,
                            totalval: valtotal4 + valtotal5 + valtotal6
                        }
                        newDetTot.push(dat)
                    });

                    //console.log("DATOS : ", newDetTot)
                    setmovimientos(newDetTot);
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
        { title: "CENTRO", dataIndex: "descripcion", key: "descripcion", width: 200, fixed: true },
        {
            title: "UNIDADES - POLIBON GRANDE", dataIndex: "UNIDADES - POLIBON GRANDE", key: "unidades4", width: 150, align: "right",
            sortDirections: ['descend', 'ascend'],
            //sorter: (a, b) => a.unidades4_ - b.unidades4_,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, zIndex: 0 }}>
                        {myNumber(1, row.unidades4, 2)}
                    </Title>

                );
            }
        },
        {
            title: "VALOR - POLIBON GRANDE", dataIndex: "VALOR - POLIBON GRANDE", key: "valtotal4", width: 150, align: "right",
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.valtotal4 - b.valtotal4,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.valtotal4, 2)}
                    </Title>

                );
            }
        },
        {
            title: "UNIDADES - POLIBON MEDIANA", dataIndex: "UNIDADES - POLIBON MEDIANA", key: "unidades5", width: 150, align: "right",
            sorter: (a, b) => a.unidades5_ - b.unidades5_,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.unidades5, 2)}
                    </Title>

                );
            }
        },
        {
            title: "VALOR - POLIBON MEDIANA", dataIndex: "VALOR - POLIBON MEDIANA", key: "valtotal5", width: 150, align: "right",
            sorter: (a, b) => a.valtotal5 - b.valtotal5,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.valtotal5, 2)}
                    </Title>

                );
            }
        },
        {
            title: "UNIDADES - POLIBON PEQUEÑA", dataIndex: "UNIDADES - POLIBON PEQUEÑA", key: "unidades6", width: 150, align: "right",
            sorter: (a, b) => a.unidades6_ - b.unidades6_,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.unidades6, 2)}
                    </Title>

                );
            }
        },
        {
            title: "VALOR - POLIBON PEQUEÑA", dataIndex: "VALOR - POLIBON PEQUEÑA", key: "valtotal6", width: 150, align: "right",
            sorter: (a, b) => a.valtotal6 - b.valtotal6,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.valtotal6, 2)}
                    </Title>

                );
            }
        },
        {
            title: "UNIDADES - TOTAL", dataIndex: "totalund", key: "totalund", width: 150, align: "right",
            sorter: (a, b) => a.totalund - b.totalund,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.totalund, 2)}
                    </Title>

                );
            }
        },
        {
            title: "VALOR - TOTAL", dataIndex: "totalval", key: "totalval", width: 150, align: "right",
            sorter: (a, b) => a.totalval - b.totalval,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.totalval, 2)}
                    </Title>

                );
            }
        },


    ]


    return (
        <div className="mlanegativo">

            <h2 className="mx-auto mt-1 px-4 text-lg leading-6 font-medium text-gray-900 sm:px-6 lg:px-8">
                <div className="col-start-1 row-start-1 py-3">
                    <div className="ml-10 mx-auto flex max-w-7xl justify-center px-4 sm:px-6 text-gray-900 lg:px-8">
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
                        selectedAno.length == 1 && selectedMes.length == 0 && selectedDia.length == 0 ?
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
                            selectedAno.length > 0 && selectedMes.length > 0 && selectedDia.length == 0 ?
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

                                ) : selectedAno.length > 0 && selectedMes.length == 0 ?
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
                                                                            <td className=" bg-slate-300 whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  text-gray-900 sm:pl-6">
                                                                                {ventas.Nombreagrupa}
                                                                            </td>
                                                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-right text-gray-900 sm:pl-6">
                                                                                {isNaN(parseInt(ventas.dia_1)) ?
                                                                                    null
                                                                                    :
                                                                                    myNumber(1, (ventas.dia_1))
                                                                                }
                                                                            </td>
                                                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-right text-gray-900 sm:pl-6">
                                                                                {isNaN(parseInt(ventas.dia_2)) ?
                                                                                    null
                                                                                    :
                                                                                    myNumber(1, (ventas.dia_2))
                                                                                }
                                                                            </td>
                                                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-right text-gray-900 sm:pl-6">
                                                                                {isNaN(parseInt(ventas.dia_3)) ?
                                                                                    null
                                                                                    :
                                                                                    myNumber(1, (ventas.dia_3))
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
                                    ) :
                                    null
                    }


                </div>
            </h2>

        </div>
    );
}

export default TabMaterialEmpaque;