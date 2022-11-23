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

function TabProveedores(props) {
    const { tipo, setTipo, ingresosxlinea, ingreosxproveedor, presupuestosxlinea, lineasproductos, proveedorescompras } = props;
    const [entMes, setEntMes] = useState(true);
    const [entAcumuladas, setEntAcumuladas] = useState(false);
    const [movimientos, setmovimientos] = useState(false);
    const [movimientosMes, setmovimientosMes] = useState(false);
    const [opcion, setOpcion] = useState(0);
    const fecha = new Date();
    const mesActual = fecha.getMonth() + 1;

    let ventasDiariasMes = [];
    ventasDiariasMes = useSelector((state) => state.datosfiltros.datosfiltros);

    const [vtasAno, setVtasAno] = useState(ventasDiariasMes.anos_vtasdiarias);
    const [vtasMes, setVtasMes] = useState(ventasDiariasMes.meses_vtasdiarias);
    const [vtasDia, setVtasDia] = useState(ventasDiariasMes.dias_vtas);
    const [centrosoperacion, setCentrosoperacion] = useState(ventasDiariasMes.centrosoperacion);
    const [subcategorias, setSubcategorias] = useState(ventasDiariasMes.subcategorias);
    const [proveedores, setProveedores] = useState(ventasDiariasMes.proveedores);

    const [selectedAno, setSelectedAno] = useState(null);
    const [selectedMes, setSelectedMes] = useState(null);
    const [selectedDia, setSelectedDia] = useState(null);
    const [labelUno, setLabelUno] = useState([]);
    const [labelDos, setLabelDos] = useState([]);
    const [labelTres, setLabelTres] = useState([]);

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
    }, []);

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
                ingreosxproveedor && ingreosxproveedor.map((items) => {
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
                    ingreosxproveedor && ingreosxproveedor.map((items) => {
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
        if (!selectedAno) {
            swal({
                title: "Tablero Cosmos",
                text: "Primero debes seleccionar el año!",
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
        if (selectedAno && selectedMes) {

            let newDetCompras = [];
            let newDetComprasMes = [];

            proveedorescompras &&
                proveedorescompras.map((lineas, index) => {
                    let undcompras = 0;
                    let valcompras = 0;
                    let undcomprasmes = 0;
                    let valcomprasmes = 0;

                    ingreosxproveedor &&
                        ingreosxproveedor.map((ingresos, index) => {
                            if (ingresos.NombreProveedor == lineas.Proveedor && ingresos.ano == selectedAno.value
                                && ingresos.mes <= selectedMes.value) {
                                undcompras = undcompras + ingresos.UND;
                                valcompras = valcompras + ingresos.MND;
                            }
                            if (ingresos.NombreProveedor == lineas.Proveedor && ingresos.ano == selectedAno.value
                                && ingresos.mes == selectedMes.value) {
                                undcomprasmes = undcomprasmes + ingresos.UND;
                                valcomprasmes = valcomprasmes + ingresos.MND;
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
                            if (ingresos.Descripcion == pst.Sublinea && selectedAno.value == pst.ano
                                && pst.mes == selectedMes.value) {
                                undpstmes = undpstmes + pst.UND_PST;
                                valpstmes = valpstmes + pst.VAL_PST;
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
                            if (ingresos.Descripcion == pst.Sublinea && selectedAno.value == pst.ano
                                && pst.mes <= selectedMes.value) {
                                undpst = undpst + pst.UND_PST;
                                valpst = valpst + pst.VAL_PST;
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
        }
        else 
        if (selectedAno && !selectedMes) {

            let newDetCompras = [];
            let newDetComprasMes = [];

            proveedorescompras &&
                proveedorescompras.map((lineas, index) => {
                    let undcompras = 0;
                    let valcompras = 0;
                    let undcomprasmes = 0;
                    let valcomprasmes = 0;

                    ingreosxproveedor &&
                        ingreosxproveedor.map((ingresos, index) => {
                            if (ingresos.NombreProveedor == lineas.Proveedor && ingresos.ano == selectedAno.value) {
                                undcompras = undcompras + ingresos.UND;
                                valcompras = valcompras + ingresos.MND;
                            }
                            if (ingresos.NombreProveedor == lineas.Proveedor && ingresos.ano == selectedAno.value) {
                                undcomprasmes = undcomprasmes + ingresos.UND;
                                valcomprasmes = valcomprasmes + ingresos.MND;
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
                            if (ingresos.Descripcion == pst.Sublinea && selectedAno.value == pst.ano) {
                                undpstmes = undpstmes + pst.UND_PST;
                                valpstmes = valpstmes + pst.VAL_PST;
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
                            if (ingresos.Descripcion == pst.Sublinea && selectedAno.value == pst.ano) {
                                undpst = undpst + pst.UND_PST;
                                valpst = valpst + pst.VAL_PST;
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

                            <div className="mt-1 flex">
                                <Menu as="div" className="ml-10 relative inline-block" >
                                    <Select
                                        options={vtasAno}
                                        value={selectedAno}
                                        onChange={setSelectedAno}
                                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                        placeholder="Selec. año"
                                    />
                                </Menu>
                            </div>
                            <div className="mt-1 flex">
                                <Menu as="div" className="relative inline-block" >
                                    <Select
                                        options={vtasMes}
                                        value={selectedMes}
                                        onChange={setSelectedMes}
                                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                        placeholder="Selec. mes"
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


                    <div className="margenizaquierdanegativo px-4 sm:px-6 lg:px-8">
                        {opcion == 0 ?
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
                            opcion == 1 ?
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
                                null
                        }
                    </div>
                </div>
            </h2>
        </div>
    );
}

export default TabProveedores;