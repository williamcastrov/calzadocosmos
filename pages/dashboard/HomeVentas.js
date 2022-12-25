import { Fragment, useState, useEffect } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { close, logo, menu } from "../../assets";
import { opcionesmenu, opcionesmenudos, tailsvtas, vtascanal } from "../../constants";
import NavBar from "../../components/NavBar/NavBar";
import app from "../../server/firebase";
import { useSelector } from "react-redux";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { BellIcon, MenuAlt1Icon, XIcon, } from "@heroicons/react/outline";
import { CheckCircleIcon, ChevronDownIcon, OfficeBuildingIcon, SearchIcon } from "@heroicons/react/solid";
import { mdiBasketPlusOutline, mdiMargin, mdiDecimalIncrease, mdiTrendingUp, mdiCashCheck } from '@mdi/js';
import { myNumber, nameMonth } from "../../utils/ArrayFunctions";

const auth = getAuth(app);

//Componentes detalle movimientos
import TabVtasDiarias from "../../components/Tab/Ventas/TabVtasDiarias";
import TabMargenes from "../../components/Tab/Ventas/TabMargenes";
import TabParticipacion from "../../components/Tab/Ventas/TabParticipacion";
import TabVariacion from "../../components/Tab/Ventas/TabVariacion";
import TabListasPrecios from "../../components/Tab/Ventas/TabListasPrecios";
import ConsultarPresupuesto from "../ImportarArchivos/ConsultarPresupuesto";
import TabMaterialEmpaque from "../../components/Tab/Ventas/TabMaterialEmpaque";

//Anibal
import TileIcon from "../../components/TileIcon";
import CST from '../../utils/CustomSettings';
//Fin Anibal

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function HomeVentas(props) {
    const { datos, datosCostos, detalleVtas, ventasDiariasMes, ventasDiariasMesSubcategoria,
        listaPrecios, listaPresupuestos, listaMaterialEmpaque } = props;
    const router = useRouter();
    //console.log("VENTAS DIARIAS MES: ", ventasDiariasMes.sublineas);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [tipo, setTipo] = useState(1);
    const [tabFiltros, setTabFiltros] = useState(false);

    const [tabVtasLinea, setTabVtasLinea] = useState(true);
    const [tabCostosVtas, setTabCostosVtas] = useState(false);
    const [tabParticipacionVtas, setTabParticipacionVtas] = useState(false);
    const [tabVariacionVtas, setTabVariacionVtas] = useState(false);
    const [tabListasPrecios, setTabListasPrecios] = useState(false);
    const [tabPptoVentas, setTabPttoVentas] = useState(false);
    const [tabMaterialEmpaque, setTabMaterialEmpaque] = useState(false);

    const [tabMargen, setTabMargen] = useState(false);

    const [mesact, setMesact] = useState(1);
    const [anoact, setAnoact] = useState(1);
    const [undvtasmesact, setUndvtasmesact] = useState(1);
    const [pesosvtasmesact, setPesosvtasmesact] = useState(1);
    const [undvtasmesant, setUndvtasmesant] = useState(1);
    const [pesosvtasmesant, setPesosvtasmesant] = useState(1);
    const [costovtasmesact, setCostovtasmesact] = useState(1);
    const [valorvtamesaact, setValorvtamesaact] = useState(1);
    const [costovtasacum, setCostovtasacum] = useState(1);
    const [valorvtasacum, setValorvtasacum] = useState(1);

    let totalingresoxlinea = [];
    totalingresoxlinea = useSelector((state) => state.datosdashboard.datosdashboard);
    //datosCostos = useSelector((state) => state.costosventas.datoscostosventas);

    const tabs = [
        { name: 'Ventas mes dia', href: '#', current: tabVtasLinea },
        { name: 'Margen', href: '#', current: tabCostosVtas },
        { name: 'Participación', href: '#', current: tabParticipacionVtas },
        { name: 'Variación', href: '#', current: tabVariacionVtas },
        { name: 'Listas de precio', href: '#', current: tabListasPrecios },
        { name: 'Presupuestos de vtas', href: '#', current: tabPptoVentas },
        { name: 'Material empaque', href: '#', current: tabMaterialEmpaque },
    ]

    const salirApp = () => {
        signOut(auth);
        router.push("/");
    }

    useEffect(() => {
        setMesact(datos.mes_actual);
        setAnoact(datos.ano_actual);
        setUndvtasmesact(datos.ventas_res.UND_ACT);
        setPesosvtasmesact(datos.ventas_res.MND_ACT);
        setUndvtasmesant(datos.ventas_res.UND_ANT);
        setPesosvtasmesant(datos.ventas_res.MND_ANT);
        setCostovtasmesact(datosCostos.costosvtames[0].CSV_ACT);
        setValorvtamesaact(datosCostos.costosvtames[0].VSIMP_ACT);
        setCostovtasacum(datosCostos.costosvtaacum[0].CSV_TOT);
        setValorvtasacum(datosCostos.costosvtaacum[0].VSIMP_TOT);
        /*
        const [mesact, setMesact] = useState(datos.mes_actual);
    const [anoact, setAnoact] = useState(datos.ano_actual);
    const [undvtasmesact, setUndvtasmesact] = useState(datos.ventas_res.UND_ACT);
    const [pesosvtasmesact, setPesosvtasmesact] = useState(datos.ventas_res.MND_ACT);
    const [undvtasmesant, setUndvtasmesant] = useState(datos.ventas_res.UND_ANT);
    const [pesosvtasmesant, setPesosvtasmesant] = useState(datos.ventas_res.MND_ANT);
    const [costovtasmesact, setCostovtasmesact] = useState(datosCostos.costosvtames[0].CSV_ACT);
    const [valorvtamesaact, setValorvtamesaact] = useState(datosCostos.costosvtames[0].VSIMP_ACT);
    const [costovtasacum, setCostovtasacum] = useState(datosCostos.costosvtaacum[0].CSV_TOT);
    const [valorvtasacum, setValorvtasacum] = useState(datosCostos.costosvtaacum[0].VSIMP_TOT);
    */
    }, []);

    const seleccionarTab = (seleccion) => {
        console.log("SELECCION : ", seleccion)
        if (seleccion == 0) {
            setTabVtasLinea(true);
            setTabCostosVtas(false);
            setTabParticipacionVtas(false);
            setTabVariacionVtas(false);
            setTabListasPrecios(false);
            setTabFiltros(false);
            setTabPttoVentas(false);
            setTabMaterialEmpaque(false);
            setTabMargen(false);
        } else
            if (seleccion == 1) {
                setTabVtasLinea(false);
                setTabCostosVtas(true);
                setTabParticipacionVtas(false);
                setTabVariacionVtas(false);
                setTabListasPrecios(false);
                setTabFiltros(false);
                setTabPttoVentas(false);
                setTabMaterialEmpaque(false);
                setTabMargen(false);
            }
            else
                if (seleccion == 2) {
                    setTabVtasLinea(false);
                    setTabCostosVtas(false);
                    setTabParticipacionVtas(true);
                    setTabVariacionVtas(false);
                    setTabListasPrecios(false);
                    setTabFiltros(false);
                    setTabPttoVentas(false);
                    setTabMaterialEmpaque(false);
                    setTabMargen(false);
                }
                else
                    if (seleccion == 3) {
                        setTabVtasLinea(false);
                        setTabCostosVtas(false);
                        setTabParticipacionVtas(false);
                        setTabVariacionVtas(true);
                        setTabListasPrecios(false);
                        setTabFiltros(false);
                        setTabPttoVentas(false);
                        setTabMaterialEmpaque(false);
                        setTabMargen(false);
                    } else
                        if (seleccion == 4) {
                            setTabVtasLinea(false);
                            setTabCostosVtas(false);
                            setTabParticipacionVtas(false);
                            setTabVariacionVtas(false);
                            setTabListasPrecios(true);
                            setTabFiltros(false);
                            setTabPttoVentas(false);
                            setTabMaterialEmpaque(false);
                            setTabMargen(false);
                        }
                        else
                            if (seleccion == 5) {
                                setTabVtasLinea(false);
                                setTabCostosVtas(false);
                                setTabParticipacionVtas(false);
                                setTabVariacionVtas(false);
                                setTabListasPrecios(false);
                                setTabFiltros(false);
                                setTabPttoVentas(true);
                                setTabMaterialEmpaque(false);
                                setTabMargen(false);
                            }else
                            if (seleccion == 6) {
                                setTabVtasLinea(false);
                                setTabCostosVtas(false);
                                setTabParticipacionVtas(false);
                                setTabVariacionVtas(false);
                                setTabListasPrecios(false);
                                setTabFiltros(false);
                                setTabPttoVentas(false);
                                setTabMaterialEmpaque(true);
                                setTabMargen(false);
                            }
                            else {
                                setTabVtasLinea(false);
                                setTabCostosVtas(false);
                                setTabParticipacionVtas(false);
                                setTabVariacionVtas(false);
                                setTabListasPrecios(false);
                                setTabFiltros(false);
                                setTabMargen(false);
                            }
    }

    return (
        <>
            <div className='flex flex-col h-screen'>
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-40 lg:hidden"
                        onClose={setSidebarOpen}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                        </Transition.Child>

                        <div className="fixed inset-0 flex z-40">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-sidebar">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                                            <button
                                                type="button"
                                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                                onClick={() => setSidebarOpen(false)}
                                            >
                                                <span className="sr-only">Close sidebar</span>
                                                <XIcon
                                                    className="h-6 w-6 text-white"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    <div className="flex-shrink-0 flex items-center px-4">
                                        <img
                                            className="h-12 w-auto"
                                            src={logo.src}
                                            alt="Easywire logo"
                                        />
                                    </div>
                                    <nav
                                        className="mt-5 flex-shrink-0 h-full divide-y divide-cyan-800 overflow-y-auto"
                                        aria-label="Sidebar"
                                    >
                                        <div className="px-2 space-y-1">
                                            {opcionesmenu.map((item) => (
                                                <a
                                                    key={item.name}
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? "text-black text-white"
                                                            : "text-black hover:text-white hover:bg-slate-200",
                                                        "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                                                    )}
                                                    aria-current={item.current ? "page" : undefined}
                                                >
                                                    <item.icon
                                                        className="mr-4 flex-shrink-0 h-6 w-6 text-cyan-200"
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </a>
                                            ))}
                                        </div>
                                        <div className="mt-6 pt-6">
                                            <div className="px-2 space-y-1">
                                                {opcionesmenudos && opcionesmenudos.map((item) => (
                                                    <a
                                                        key={item.name}
                                                        href={item.href}
                                                        className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-black hover:text-white hover:bg-cyan-600"
                                                    >
                                                        <item.icon
                                                            className="mr-4 h-6 w-6 text-cyan-200"
                                                            aria-hidden="true"
                                                        />
                                                        {item.name}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </nav>
                                </Dialog.Panel>
                            </Transition.Child>
                            <div className="flex-shrink-0 w-14" aria-hidden="true">
                                {/* Dummy element to force sidebar to shrink to fit close icon */}
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
                <NavBar />
                <div className="lg:pl-64 flex flex-col flex-1">
                    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:border-none">
                        <button
                            type="button"
                            className="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
                        </button>
                        {/* Search bar */}
                        <div className="flex-1 px-4 flex justify-between sm:px-6 lg:mx-auto lg:px-8">
                            <div className="flex-1 flex">
                                <form className="w-full flex md:ml-0" action="#" method="GET">
                                    <label htmlFor="search-field" className="sr-only">
                                        Search
                                    </label>
                                    <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                                        <div
                                            className="absolute inset-y-0 left-0 flex items-center pointer-events-none"
                                            aria-hidden="true"
                                        >
                                            <SearchIcon className="h-5 w-5" aria-hidden="true" />
                                        </div>
                                        <input
                                            id="search-field"
                                            name="search-field"
                                            className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm"
                                            placeholder="Consultar movimientos"
                                            type="search"
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="ml-4 flex items-center md:ml-6">
                                <button
                                    type="button"
                                    className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-basecosmos"
                                >
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon className="h-6 w-6 text-basecosmos" aria-hidden="true" />
                                </button>

                                {/* Profile dropdown */}
                                <Menu as="div" className="ml-3 relative">
                                    <div>
                                        <Menu.Button className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 lg:p-2 lg:rounded-md lg:hover:bg-gray-50">
                                            <img
                                                className="h-8 w-8 rounded-full"
                                                src={logo.src} //AQUI VA EL AVATAR DEL USUARIO
                                                alt=""
                                            />
                                            <span className="hidden ml-3 text-gray-700 text-sm font-medium lg:block">
                                                <span className="sr-only">Open user menu for </span>
                                                {
                                                    // Daniel Nombre del usuario
                                                }
                                            </span>
                                            <ChevronDownIcon
                                                className="hidden flex-shrink-0 ml-1 h-5 w-5 text-gray-400 lg:block"
                                                aria-hidden="true"
                                            />
                                        </Menu.Button>
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
                                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <a
                                                        href="#"
                                                        className={classNames(
                                                            active ? "bg-gray-100" : "",
                                                            "block px-4 py-2 text-sm text-gray-700"
                                                        )}
                                                    >
                                                        Your Profile
                                                    </a>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <a
                                                        href="#"
                                                        className={classNames(
                                                            active ? "bg-gray-100" : "",
                                                            "block px-4 py-2 text-sm text-gray-700"
                                                        )}
                                                    >
                                                        Settings
                                                    </a>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <a
                                                        onClick={() => salirApp()}
                                                        className={classNames(
                                                            active ? "bg-gray-100" : "",
                                                            "block px-4 py-2 text-sm text-gray-700"
                                                        )}
                                                    >
                                                        Salir
                                                    </a>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>
                    <main className="flex-1 pb-8">
                        {/* Page header */}
                        <div className="bg-white shadow shadow-lg shadow-basecosmos">
                            <div className="px-4 sm:px-6 lg:mx-auto lg:px-8">
                                <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
                                    <div className="flex-1 min-w-0">
                                        {/* Profile */}
                                        <div className="flex items-center">
                                            <img
                                                className="hidden h-16 w-16 rounded-full sm:block"
                                                src={logo.src} //AQUI VA EL  AVATAR Y CARGO DEL FUNCIONARIO
                                                alt=""
                                            />
                                            <div>
                                                <div className="flex items-center">
                                                    <img
                                                        className="h-16 w-16 rounded-full sm:hidden"
                                                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.6&w=256&h=256&q=80"
                                                        alt=""
                                                    />
                                                    <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                                                        {
                                                            // Daniel Nombre del usuario
                                                        }
                                                    </h1>
                                                </div>
                                                <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                                                    <dt className="sr-only">Company</dt>
                                                    <dd className="flex items-center text-sm text-gray-500 font-medium capitalize sm:mr-6">
                                                        <OfficeBuildingIcon
                                                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                            aria-hidden="true"
                                                        />
                                                        Coordinador ecommerce
                                                    </dd>
                                                    <dt className="sr-only">Account status</dt>
                                                    <dd className="mt-1 flex items-center text-sm text-gray-500 font-medium sm:mr-6 sm:mt-0 capitalize">
                                                        <CheckCircleIcon
                                                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400"
                                                            aria-hidden="true"
                                                        />

                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-basecosmos focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                                        >
                                            Resultados Ecommerce
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-black bg-slate-200 hover:bg-basecosmos focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                                        >
                                            Control interno
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <div className="mx-auto px-4 sm:px-6 lg:px-0">
                                <div className="mt-2 grid grid-cols-2 gap-0 sm:grid-cols-2 lg:grid-cols-4 ">
                                    {tailsvtas.map((card) => (
                                        card.name === 'Ventas' ? (
                                            <TileIcon
                                                clrH={CST.blueHdr}
                                                clrB={CST.blueBdy}
                                                clrF={CST.blueFoo}
                                                title={"Ventas"}
                                                texto={nameMonth(mesact) + ' - ' + anoact}
                                                subtexto={
                                                    'Cte: ' + myNumber(1, (undvtasmesact / 1000)) + " Und - " + myNumber(1, (pesosvtasmesact / 1000000)) + ' MM'}
                                                icono={mdiCashCheck}

                                                pie={'Ant: ' + myNumber(1, (undvtasmesant / 1000)) + "K Und - " + myNumber(1, (pesosvtasmesant / 1000000)) + 'MM'}
                                                funcion={null}
                                                opcion={0}
                                            />
                                        ) : card.name === 'Margen' ? (
                                            <TileIcon
                                                clrH={CST.orangeHdr}
                                                clrB={CST.orangeBdy}
                                                clrF={CST.orangeFoo}
                                                title={"Margen"}
                                                texto={nameMonth(mesact) + ' - ' + anoact}
                                                subtexto={'Mes Cte: ' + myNumber(1, (1 - (costovtasmesact / valorvtamesaact)) * 100) + " % "}
                                                icono={mdiMargin}
                                                pie={'Acum Año: ' + myNumber(1, (1 - (costovtasacum / valorvtasacum)) * 100) + " % "}
                                                funcion={null}
                                                opcion={0}
                                            />
                                        ) : null

                                    ))}
                                </div>
                            </div>

                            <div>
                                <h2 className="mx-auto mt-2 px-4 text-lg leading-6 font-medium text-gray-900 sm:px-6 lg:px-8">
                                    <div>{/* className="sm:hidden" */}
                                        <label htmlFor="tabs"
                                            className="mx-auto mt-4 px-4 text-lg leading-6 font-medium text-gray-900 sm:px-6 lg:px-3"
                                        >
                                            Indicador 19
                                        </label>
                                        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                                        <select
                                            id="tabs"
                                            name="tabs"
                                            className="block mt-2 w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        //defaultValue={tabs.find((tab) => tab.current).name}
                                        >
                                            {tabs.map((tab) => (
                                                <option key={tab.name}>{tab.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="hidden sm:block">
                                        <div className="border-b border-gray-200">
                                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                                {tabs.map((tab, index) => (
                                                    <a
                                                        key={tab.name}
                                                        onClick={() => seleccionarTab(index)}
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
                                        {
                                            tabVtasLinea ?
                                                (
                                                    <TabVtasDiarias tipo={tipo} setTipo={setTipo}
                                                        ventasDiariasMes={ventasDiariasMes}
                                                        ventasDiariasMesSubcategoria={ventasDiariasMesSubcategoria}
                                                    />
                                                ) : tabCostosVtas ?
                                                    (
                                                        <TabMargenes tipo={tipo} setTipo={setTipo} datosCostos={datosCostos}
                                                            ventasDiariasMes={ventasDiariasMes} listaPresupuestos={listaPresupuestos}
                                                        />
                                                    ) : tabParticipacionVtas ?
                                                        (
                                                            <TabParticipacion tipo={tipo} setTipo={setTipo} datosCostos={datosCostos}
                                                                ventasDiariasMes={ventasDiariasMes}
                                                            />
                                                        ) : tabVariacionVtas ?
                                                            (
                                                                <TabVariacion tipo={tipo} setTipo={setTipo} datosCostos={datosCostos}
                                                                    ventasDiariasMes={ventasDiariasMes}
                                                                />
                                                            ) :
                                                            tabListasPrecios ?
                                                                (
                                                                    <TabListasPrecios tipo={tipo} setTipo={setTipo} datosCostos={datosCostos}
                                                                        ventasDiariasMes={ventasDiariasMes} listaPrecios={listaPrecios}
                                                                        sublineas={ventasDiariasMes.sublineas}
                                                                    />
                                                                ) :
                                                                tabPptoVentas ?
                                                                    (
                                                                        <ConsultarPresupuesto tipo={tipo} ventasDiariasMes={ventasDiariasMes}
                                                                            setTipo={setTipo} listaPresupuestos={listaPresupuestos}
                                                                        />
                                                                    ) :
                                                                    tabMaterialEmpaque ?
                                                                    (
                                                                        <TabMaterialEmpaque tipo={tipo} ventasDiariasMes={ventasDiariasMes}
                                                                            setTipo={setTipo} listaMaterialEmpaque={listaMaterialEmpaque}
                                                                        />
                                                                    ) :
                                                                    null
                                        }
                                    </div>
                                </h2>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
