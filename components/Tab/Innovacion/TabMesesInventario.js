import { Fragment, useState, useEffect } from "react";
import { myNumber, nameMonth } from "../../../utils/ArrayFunctions";
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, FunnelIcon, } from "@heroicons/react/solid";
import { MultiSelect } from "react-multi-select-component";
import swal from 'sweetalert';
import Loading from "../../../components/Loading";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function TabMesesInventario(props) {
    const { tipo, setTipo, ventasDiariasMes, existencias, parametrosVtas } = props;
    const [isLoading, setIsLoading] = useState(true)
    //console.log("EXISTENCIAS TAB : ",existencias);
    const [entMes, setEntMes] = useState(true);
    const [entAcumuladas, setEntAcumuladas] = useState(false);
    const [movimientos, setmovimientos] = useState(false);
    const [opcion, setOpcion] = useState(0);
    const [textoTipo, setTextoTipo] = useState("CENTROS_DE_OPERACIÓN");

    const [filtroAno, setFiltroAno] = useState(null);
    const [filtroMes, setFiltroMes] = useState(null);
    const [filtroDia, setFiltroDia] = useState(null);
    const [labeldias, setLabeldias] = useState([]);
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
 
    var date = new Date(); //Lee fecha actual
    var day = date.getDate()-1; //Se resta uno por que el banco de dato tiene la informacion actualiza un dia antes
    var mesactual = date.getMonth() + 1; // Se le suma uno por que esta funcion devuelve enero como 0, por eso se suma uno
    var ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var fechaenformato = new Date(ultimoDia); // Lo pasamos al formato que requiere getDate
    var dia = fechaenformato.getDate();

    //console.log("VENTAS DIARIAS MES XXX: ", ventasDiariasMes);
    //console.log("LABEL DIAS: ", labelVentas);
    const tabsdos = [
        { name: 'Meses de inventarios', href: '#', current: entMes },
    ]

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
        if (selectedAno.length == 0 || selectedMes.length == 0) {
            swal({
                title: "Tablero Cosmos",
                text: "Primero debes seleccionar el año y mes!",
                icon: "warning",
            });
            return
        }

        GenerarDatos();
        setConsultar(true)
    }

    const GenerarDatos = () => {

        //if (selectedAno.length > 0) {
        setIsLoading(true);
        setConsultar(false)
        let periodo = "";

        if (selectedMes[0].value < 10)
            periodo = "" + selectedAno[0].value + "0" + selectedMes[0].value;
        else
            periodo = "" + selectedAno[0].value + selectedMes[0].value;

        let vtasreferencia = [];
        let vtasmasexistencia = [];
        let vtasreferenciaperiodo = [];
        let vtasdatosinventarios = [];

        let inventario = existencias.existenciasreferencia;
        let referencias = ventasDiariasMes.referencias;
        let pendientes = existencias.pendientereferencia;
        let lineas = existencias.lineas;
        let vtasperiodo = ventasDiariasMes.ventasreferenciaperiodo;
        let sublineas = ventasDiariasMes.sublineas;
        let precioreferencia = existencias.precioreferencia;

        //console.log("VENTAS : ", vtasperiodo)
        //return
        sublineas &&
            sublineas.map((sub, index) => {
                let vtaundsublinea = 0;
                let vtavalsublinea = 0;
                vtasperiodo &&
                    vtasperiodo.map((ref, index) => {
                        if (ref.Periodo == periodo) {
                            if (sub.Sublinea == ref.Sublinea) {
                                vtaundsublinea = parseInt(vtaundsublinea) + parseInt(ref.Cantidad);
                                vtavalsublinea = parseInt(vtavalsublinea) + parseInt(ref.Vlr_Neto);
                            }
                        }
                    });
                let item = {
                    Sublinea: sub.Sublinea,
                    Cantidad: vtaundsublinea,
                    Valor: vtavalsublinea
                }
                vtasreferenciaperiodo.push(item);
            });

            //console.log("VENTAS : ", vtasreferenciaperiodo)
            //return

        vtasreferenciaperiodo &&
            vtasreferenciaperiodo.map((vta, index) => {
                let undpendiente = 0;
                let valpendiente = 0;
                pendientes &&
                    pendientes.map((ref, index) => {
                        if (vta.Sublinea == ref.sublinea) {
                            undpendiente = parseInt(undpendiente) + parseInt(ref.undpendiente);
                            valpendiente = parseInt(valpendiente) + parseInt(ref.valorpendiente);
                        }
                    });
                let item = {
                    Sublinea: vta.Sublinea,
                    Cantidad: vta.Cantidad,
                    Valor: vta.Valor,
                    Undpendiente: undpendiente,
                    Valpendiente: valpendiente,
                }
                vtasmasexistencia.push(item);

            });

        let longitud = precioreferencia.length;

        vtasmasexistencia &&
            vtasmasexistencia.map((vta, index) => {
                let undexistencia = 0;
                let precio = 0;

                inventario &&
                    inventario.map((ref, index) => {
                        if (vta.Sublinea == ref.SubLinea) {
                            undexistencia = parseInt(undexistencia) + parseInt(ref.Existencia);

                        }
                    });
                
                let fechaanterior = '"'+selectedAno[0].value+'/'+selectedMes[0].value+"/01";
                var ultimoDiaMesCerrado = new Date(fechaanterior);
                var ultimoDia = new Date(ultimoDiaMesCerrado.getFullYear(), ultimoDiaMesCerrado.getMonth() + 1, 0);
                var cerrado = new Date(ultimoDia);
                var ultimodiacerrado = cerrado.getDate();
                //console.log("ULTIMO DIA : ",ultimodiacerrado)
                
                let proyeccionpor = 0;
                let valexist = undexistencia * (vta.Valor / vta.Cantidad);
                let mesesinv = undexistencia / vta.Cantidad;
                let rotacion = (vta.Cantidad / undexistencia) * 100;

                if(selectedMes[0].value == mesactual){
                    proyeccionpor = (vta.Cantidad/day)*dia;
                }else{
                    proyeccionpor = (vta.Cantidad/ultimodiacerrado)*ultimodiacerrado;
                }
                
                let proyeccionvta = undexistencia/proyeccionpor;

                let item = {
                    Sublinea: vta.Sublinea,
                    Cantidad: vta.Cantidad,
                    Valor: vta.Valor,
                    Undpendiente: vta.Undpendiente,
                    Valpendiente: vta.Valpendiente,
                    Undexistencia: undexistencia,
                    ValorExistencia: valexist,
                    MesesInventario: mesesinv,
                    Rotacion: rotacion,
                    ProyeccionVta: proyeccionvta,
                    Proyeccionpor: proyeccionpor
                }
                vtasdatosinventarios.push(item);

            });

        setmovimientos(vtasdatosinventarios);
        //console.log("VENTAS ANÑO : ", vtasdatosinventarios)

        setIsLoading(false);

        //} else
        /*
            if (selectedAno.length > 0) {

                //console.log("VENTAS ANÑO : ", newDetVtasAcum)
                setmovimientos(newDetVtasAcum);
            } else
                if (opcion == 1) {

                }*/
        setConsultar(false);
    }


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
        setConsultar(true);
    }, [opcion]);


    return (
        <div className="mlanegativo">

            <h2 className="mx-auto mt-1 px-4 text-lg leading-6 font-medium text-gray-900 sm:px-6 lg:px-8">
                <div className="col-start-1 row-start-1 py-3">
                    <div className="ml-10 mx-auto flex max-w-7xl justify-center px-4 sm:px-6 lg:px-8">
                        {/* justify-end */}
                        <div className="flex">
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

                        <div className="flex">
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
                                <div className="ml-2 mx-auto flex max-w-4xl h-10 space-x-6 divide-x bg-cosmocolor rounded divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
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
                <div className="-mt-4 hidden sm:block ml-12">
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
                                        'sticky left-60   whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
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
                    <div className="margenizaquierdanegativo px-4 sm:px-6 lg:px-8">
                        <div className="mt-8 flex flex-col">
                            <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-4">
                                    <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-300">
                                            <thead className="bg-slate-300">
                                                <tr>
                                                    <th scope="col" className="sticky left-60 top-0 bg-slate-300 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                        Sublinea
                                                    </th>
                                                    <th scope="col" className="sticky top-0   bg-slate-300 px-6 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Ingreso pendiente
                                                    </th>
                                                    <th scope="col" className="sticky top-0   bg-slate-300 px-6 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Ventas
                                                    </th>
                                                    <th scope="col" className="sticky top-0   bg-slate-300 px-6 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Existencia
                                                    </th>
                                                    <th scope="col" className="sticky top-0   bg-slate-300 px-6 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        M.I.
                                                    </th>
                                                    <th scope="col" className="sticky top-0   bg-slate-300 px-6 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Rotación
                                                    </th>
                                                    <th scope="col" className="sticky top-0   bg-slate-300 px-6 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Proyección Vtas
                                                    </th>
                                                    <th scope="col" className="sticky top-0   bg-slate-300 px-6 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Proyección MI
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white">
                                                {movimientos && movimientos.map((ventas, index) => (
                                                    <tr key={index} className={index % 2 === 0 ? undefined : 'bg-gray-50'}>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-left text-gray-900 sm:pl-6">
                                                            {ventas.Sublinea}
                                                        </td>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-center text-gray-900 sm:pl-6">
                                                            {isNaN(parseInt(ventas.Undpendiente)) ?
                                                                null
                                                                :
                                                                myNumber(1, (ventas.Undpendiente).toFixed(0))
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-center text-gray-900 sm:pl-6">
                                                            {isNaN(parseInt(ventas.Cantidad)) ?
                                                                null
                                                                :
                                                                myNumber(1, (ventas.Cantidad).toFixed(0))
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-center text-gray-900 sm:pl-6">
                                                            {isNaN(parseInt(ventas.Undexistencia)) ?
                                                                null
                                                                :
                                                                myNumber(1, (ventas.Undexistencia).toFixed(0))
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-center text-gray-900 sm:pl-6">
                                                            {isNaN(parseInt(ventas.MesesInventario)) ?
                                                                null
                                                                :
                                                                myNumber(1, (ventas.MesesInventario).toFixed(1))
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-center text-gray-900 sm:pl-6">
                                                            {isNaN(parseInt(ventas.Rotacion)) ?
                                                                null
                                                                :
                                                                myNumber(1, (ventas.Rotacion).toFixed(1))
                                                            }%
                                                        </td>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-center text-gray-900 sm:pl-6">
                                                        {isNaN(parseInt(ventas.Proyeccionpor)) ?
                                                                null
                                                                :
                                                                myNumber(1, (ventas.Proyeccionpor).toFixed(1))
                                                            }
                                                            
                                                        </td>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-center text-gray-900 sm:pl-6">
                                                        {isNaN(parseInt(ventas.ProyeccionVta)) ?
                                                                null
                                                                :
                                                                myNumber(1, (ventas.ProyeccionVta).toFixed(1))
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
                </div>
            </h2>
        </div>
    );
}

export default TabMesesInventario;