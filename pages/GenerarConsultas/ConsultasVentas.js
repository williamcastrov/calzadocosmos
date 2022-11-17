import { Fragment, useState, useEffect } from "react";
import { CheckIcon, ClockIcon } from "@heroicons/react/solid";
import { MultiSelect } from "react-multi-select-component";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { close, logo, menu } from "../../assets";
import img from "../../assets/uploadimage1.png";
import { opcionesmenu, opcionesmenudos, tailsvtas, vtascanal } from "../../constants";
import swal from 'sweetalert';
import NavBar from "../../components/NavBar/NavBar";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function ConsultasVentas(props) {
    const [vtasAno, setVtasAno] = useState([]);
    const [meses, setMeses] = useState([]);
    const [centros, setCentros] = useState([]);
    const [filtrosVentas, setFiltrosVentas] = useState([]);

    useEffect(() => {
        let filtrosventas = null;
        filtrosventas = JSON.parse(localStorage.getItem("filtrosventas"));
        console.log("FILTROS VENTAS : ", filtrosventas)
        if(filtrosVentas){
            setCentros(filtrosventas.centrosdeoperacion)
            setVtasAno(filtrosventas.anos)
            setMeses(filtrosventas.meses)
        }
    }, []);

    return (
        <div className="bg-white">
            <h1 className="mt-5 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Generar informes de ventas
            </h1>
            <NavBar />
            <div className="ml-80 mt-4 hidden sm:block">
                <nav className="ml-1 -mb-px flex space-x-0" aria-label="Tabs">
                    <div className="mt-1 flex"
                    //onClick={datosFiltros} 
                    >
                        <Menu as="div" className="relative inline-block" >
                            <MultiSelect
                                options={vtasAno}
                                //value={selectedAno}
                                //onChange={setSelectedAno}
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
                                options={meses}
                                //value={selectedTrimestre}
                                //onChange={setSelectedTrimestre}
                                disableSearch="false"
                                labelledBy="Filtrar por trimestre"
                                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                overrideStrings={{
                                    selectSomeItems: "Filtrar meses",
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
                                options={centros}
                                //value={selectedSemestre}
                                //onChange={setSelectedSemestre}
                                disableSearch="false"
                                labelledBy="Filtrar por año"
                                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                overrideStrings={{
                                    selectSomeItems: "Centros de operación",
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
                                options={vtasAno}
                                //value={selectedMes}
                                //onChange={setSelectedMes}
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

                            <MultiSelect
                                options={vtasAno}
                                //value={selectedDia}
                                //onChange={setSelectedDia}
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
                </nav>
                <nav className="mt-3 -mb-px flex space-x-0" aria-label="Tabs">
                    <div className="ml-60 mt-1 flex  text-center">
                        <Menu as="div" className="ml-1 relative inline-block" >
                            <div className="flex">

                                <div className="mx-auto flex max-w-4xl h-10 space-x-6 divide-x bg-violet rounded divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
                                    <button
                                    //onClick={() => generarConsulta()}
                                    >
                                        Consultar
                                    </button>
                                </div>
                                <div className="ml-3 mx-auto flex max-w-4xl h-10 space-x-6 divide-x bg-cosmocolor rounded divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
                                    <div >
                                        <button
                                            type="button"
                                            //onClick={() => limpiarFiltros()}
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
    );
}

export default ConsultasVentas;