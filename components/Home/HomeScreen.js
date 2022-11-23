import { Fragment, useState, useEffect } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { close, logo, menu } from "../../assets";
import NavBar from "../NavBar/NavBar";
import { opcionesmenu, opcionesmenudos, tails, vtascanal } from "../../constants";
import app from "../../server/firebase";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged, reload, signOut } from "firebase/auth";
import { useRouter } from "next/router";
const auth = getAuth(app);

import axios from "axios";
const URL_SERVICE = "https://api.aal-cloud.com/api/cosmos";
//import { setTipoUsuario } from "../../components/store/slices/tipousuario";

//Componentes detalle movimientos
import TabDetalle from "../Tab/Compras/TabDetalle";
import TabProveedores from "../Tab/Compras/TabProveedores";
import TabCostos from "../Tab/Compras/TabCostos";
import TabPresupuesto from "../Tab/Compras/TabPresupuesto";

//Anibal
import TileIcon from "../TileIcon";
import CST from '../../utils/CustomSettings'
//Fin Anibal

import {
    BellIcon,
    ClockIcon,
    CogIcon,
    CreditCardIcon,
    DocumentReportIcon,
    HomeIcon,
    MenuAlt1Icon,
    QuestionMarkCircleIcon,
    ScaleIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    XIcon,
} from "@heroicons/react/outline";
import {
    CashIcon,
    CheckCircleIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    OfficeBuildingIcon,
    SearchIcon,
} from "@heroicons/react/solid";

import {
    mdiHumanDolly,
    mdiBasketPlusOutline,
    mdiCurrencyUsdOff,
    mdiWarehouse,
    mdiBankOutline
} from '@mdi/js';

import { myNumber, nameMonth } from "../../utils/ArrayFunctions";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function HomeScreen(props) {
    const { movimientoscompras } = props;

    const dispatch = useDispatch();
    const router = useRouter();
    const [anoACT, setAnoACT] = useState(0);
    const [anoANT, setAnoANT] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [tituloIngresoLinea, setTituloIngresolInea] = useState("Ingresos/Presupuesto - Mes Cte");
    const [tituloCostos, setTituloCostos] = useState("Costos - " + anoACT + "/" + anoANT);
    const [tipo, setTipo] = useState(1);
    const [detalleCostos, setDetalleCostos] = useState([]);
    const [detalleCompras, setDetalleCompras] = useState([]);
    const [listaPresupuestos, setListaPresupuestos] = useState(null)

    const [tabIngresoslinea, setTabIngresoslinea] = useState(true);
    const [tabCostosingreso, setTabCostosingreso] = useState(false);
    const [tabIngresoProveedor, setTabIngresoProveedor] = useState(false);
    const [tabPresupuestos, setTabPresupuestos] = useState(false);

    const [tabPendienteslinea, setTabPendienteslinea] = useState(false);
    const [tabPendientesProveedor, setTabPendientesProveedor] = useState(false);
    const [tabMargen, setTabMargen] = useState(false);

    //Variables valores x mes y presupupesto ingreso compras
    const [totalMesCorrUnd, setTotalMesCorrUnd] = useState(0);
    const [totalMesCorrMnd, setTotalMesCorrMnd] = useState(0);
    const [totalMesPstUnd, setTotalMesPstUnd] = useState(0);
    const [totalMesPstMnd, setTotalMesPstMnd] = useState(0);

    const [costoPromAct, setCostoPromAct] = useState(0);
    const [costoPromAnt, setCostoPromAnt] = useState(0);
    const [costoPromActMes, setCostoPromActMes] = useState(0);
    const [costoPromAntMes, setCostoPromAntMes] = useState(0);
/*
    const totalventas = useSelector((state) => state.datosdashboard.datosdashboard.ventas_periodo);
    const totalcompras = useSelector((state) => state.datosdashboard.datosdashboard.compras_periodo);
    const detallecompras = useSelector((state) => state.datosdashboard.datosdashboard.compras_periodo_detalle);
    const totalinventarios = useSelector((state) => state.datosdashboard.datosdashboard.inventarios_periodo);
    const detalleinventarios = useSelector((state) => state.datosdashboard.datosdashboard.inventarios_periodo_detalle);
*/
    let filtrosVentas = null;
    filtrosVentas = useSelector((state) => state.datosfiltros.datosfiltros);

    const tabs = [
        { name: 'Ingresos x linea', href: '#', current: tabIngresoslinea },
        { name: 'Variación', href: '#', current: tabCostosingreso },
        { name: 'Ingresos Proveedor', href: '#', current: tabIngresoProveedor },
        { name: 'Presupuestos', href: '#', current: tabPresupuestos },
    ]

    const salirApp = () => {
        signOut(auth);
        router.push("/");
    }

    useEffect(() => {

    }, []);


    useEffect(() => {

        if (movimientoscompras) {
            setAnoACT(movimientoscompras.ano_actual);
            setAnoANT(movimientoscompras.ano_anterior);
            setTituloCostos("Costos - " + movimientoscompras.ano_actual + "/" + movimientoscompras.ano_anterior);

            let costouniact = (movimientoscompras.ingresocomprasacumuladaact[0].UND_ACUMACT);
            let costomndact = (movimientoscompras.ingresocomprasacumuladaact[0].MNDACUMACT);
            let costouniant = (movimientoscompras.ingresocomprasacumuladaant[0].UNDACUMANT);
            let costomndant = (movimientoscompras.ingresocomprasacumuladaant[0].MNDACUMANT);

            let costouniactmes = (movimientoscompras.ingresocomprasact[0].UND_ACT);
            let costomndactmes = (movimientoscompras.ingresocomprasact[0].MND_ACT);
            let costouniantmes = (movimientoscompras.ingresocomprasant[0].UND_ANT);
            let costomndantmes = (movimientoscompras.ingresocomprasant[0].MND_ANT);

            setCostoPromAct(costomndact / costouniact);
            setCostoPromAnt(costomndant / costouniant);
            setCostoPromActMes(costomndactmes / costouniactmes);
            setCostoPromAntMes(costomndantmes / costouniantmes);
        }

    }, [movimientoscompras]);

    useEffect(() => {

        if (movimientoscompras) {
            if (tipo === 1) {
                setTotalMesCorrUnd(movimientoscompras.ingresocomprasact[0].UND_ACT);
                setTotalMesCorrMnd(movimientoscompras.ingresocomprasact[0].MND_ACT);
                setTotalMesPstUnd(0);
                setTotalMesPstMnd(0);
                setTituloIngresolInea("Ingresos/Presupuesto - Mes Cte");
            } else
                if (tipo === 2) {
                    setTotalMesCorrUnd(movimientoscompras.ingresocomprasact[0].UND_ACT);
                    setTotalMesCorrMnd(movimientoscompras.ingresocomprasact[0].MND_ACT);
                    setTotalMesPstUnd(0);
                    setTotalMesPstMnd(0);
                    setTituloIngresolInea("Ingresos/Presupuesto - Acum.");
                } else
                    setTituloIngresolInea("Sin asignar");
        }

    }, [tipo]);

    useEffect(() => {
        axios({
            method: "post",
            url: `${URL_SERVICE}/41`,
            headers: {
                "Content-type": "application/json",
            },
        })
            .then((res) => {
                console.log("RETORNA API COMPRAS: ", res.data)
                //res.json()
                if (res.status == 200) {
                    setDetalleCompras(res.data);
                    console.log("RETORNA API COMPRAS: ", "OK")
                } else {
                    console.log("RETORNA API COMPRAS: ", "ERROR")
                }
            })
            .catch((error) =>
                alert("Error Inesperado")
            )

        axios({
            method: "post",
            url: `${URL_SERVICE}/10`,
            headers: {
                "Content-type": "application/json",
            },
        })
            .then((res) => {
                console.log("RETORNA API COMPRAS: ", res.data)
                //res.json()
                if (res.status == 200) {
                    setDetalleCostos(res.data);
                    console.log("RETORNA API COMPRAS: ", "OK")
                } else {
                    console.log("RETORNA API COMPRAS: ", "ERROR")
                }
            })
            .catch((error) =>
                alert("Error Inesperado")
            )

            // Datos Presupuestos
      axios({
        method: "post",
        url: `${URL_SERVICE}/18`,
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => {
          if (res.status == 200) {
            //console.log("RETORNA VENTAS RESUMEN: ", res.data)
            if (res) {
              setListaPresupuestos(res.data);
              //localStorage.setItem('detalledatosvtas', JSON.stringify(datos));
              //setIsLoading(false);
            } else {
              console.log("RETORNA DATOS PRESUPUESTOS: ", "ERROR")
            }

          } else {
            console.log("RETORNA DATOS PRESUPUESTOS: ", "ERROR")
          }
        })
        .catch((error) =>
          alert("Error Inesperado 4")
        )

    }, []);

    const verDetalle = (seleccion) => {
        if (seleccion == 0) {
            setTabIngresoslinea(true);
            setTabCostosingreso(false);
            setTabIngresoProveedor(false);
            setTabPendienteslinea(false);
            setTabPendientesProveedor(false);
            setTabMargen(false);
        } else
            if (seleccion == 1) {
                setTabIngresoslinea(false);
                setTabCostosingreso(true);
                setTabIngresoProveedor(false);
                setTabPendienteslinea(false);
                setTabPendientesProveedor(false);
                setTabMargen(false);
            }
            else
                if (seleccion == 2) {
                    setTabIngresoslinea(false);
                    setTabCostosingreso(false);
                    setTabIngresoProveedor(true);
                    setTabPendienteslinea(false);
                    setTabPendientesProveedor(false);
                    setTabMargen(false);
                }
                else
                    if (seleccion == 3) {
                        setTabIngresoslinea(false);
                        setTabCostosingreso(false);
                        setTabIngresoProveedor(false);
                        setTabPendienteslinea(false);
                        setTabPresupuestos(true);
                        setTabPendientesProveedor(false);
                       
                    }
                    else {
                        setTabIngresoslinea(true);
                        setTabCostosingreso(false);
                        setTabIngresoProveedor(false);
                        setTabPendienteslinea(false);
                        setTabPendientesProveedor(false);
                        setTabMargen(false);
                    }
    }

    const asignaTipoUsuario = (tipo) => {
        console.log("TIPO : ", tipo)
        localStorage.setItem(
            "tipousuario",
            JSON.stringify(tipo)
        );
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
                                                    //Maryori - Nombre del usuario     
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
                                                            //Maryori - Nombre del usuario     
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
                                                        Coordinadora compras
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
                                    {

                                        tails.map((card) => (
                                            card.name === 'Compras' ? (
                                                movimientoscompras.ingresoxlinea ?
                                                    (
                                                        <TileIcon
                                                            clrH={CST.cosmosHdr}
                                                            clrB={CST.cosmosBdy}
                                                            clrF={CST.cosmosFoo}
                                                            title={tituloIngresoLinea}
                                                            texto={nameMonth(movimientoscompras.mes_actual) + ' - ' + movimientoscompras.ano_actual}
                                                            subtexto={'Real: ' + myNumber(1, (totalMesCorrUnd / 1000)) + "K Und - " + myNumber(1, (totalMesCorrMnd / 1000000)) + 'MM'}
                                                            icono={mdiHumanDolly}
                                                            pie={'Ppto: ' + myNumber(1, (totalMesPstUnd / 1000)) + "K Und - " + myNumber(1, (totalMesPstMnd / 1000000)) + 'MM'}
                                                            funcion={null}
                                                            opcion={0}
                                                        />
                                                    )
                                                    :
                                                    null
                                            ) : card.name === 'Costos' ? (
                                                <TileIcon
                                                    clrH={CST.redHdr}
                                                    clrB={CST.redBdy}
                                                    clrF={CST.redFoo}
                                                    title={tituloCostos}
                                                    texto={nameMonth(movimientoscompras.mes_actual)
                                                        + ': $ ' + (costoPromActMes).toFixed(0) + "  $ " + (costoPromAntMes).toFixed(0)}
                                                    subtexto={"Acum: $ " + (costoPromAct).toFixed(0) + "  $ " + (costoPromAnt).toFixed(0)}
                                                    icono={mdiCurrencyUsdOff}
                                                    //pie={nameMonth(totalcompras.mes_anterior) + ' - ' + totalventas.ano_anterior + ' ' + myNumber(1, (totalventas.UND_ANT / 1000)) + "K Und - " + myNumber(1, (totalventas.MND_ANT / 1000000)) + 'MM'}
                                                    funcion={null}
                                                    opcion={0}
                                                />
                                            ) : null
                                        ))
                                    }
                                </div>
                            </div>

                            <div>
                                <h2 className="mx-auto mt-8 px-4 text-lg leading-6 font-medium text-gray-900 sm:px-6 lg:px-8">
                                    <div className="sm:hidden">
                                        <label htmlFor="tabs" className="sr-only">
                                            Select a tab
                                        </label>
                                        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                                        <select
                                            id="tabs"
                                            name="tabs"
                                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            defaultValue={tabs.find((tab) => tab.current).name}
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
                                                        onClick={() => verDetalle(index)}
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
                                            tabIngresoslinea ?
                                                (
                                                    <TabDetalle tipo={tipo} setTipo={setTipo}
                                                        ingresosxlinea={movimientoscompras.ingresoxlinea}
                                                        ingreosxproveedor={movimientoscompras.ingresoxproveedor}
                                                        presupuestosxlinea={movimientoscompras.presupuestosxlinea}
                                                        lineasproductos={movimientoscompras.lineasproductos}
                                                        proveedorescompras={movimientoscompras.proveedorescompras}
                                                        filtrosVentas={filtrosVentas}
                                                    />
                                                ) : tabCostosingreso ?
                                                    (
                                                        <TabCostos tipo={tipo} setTipo={setTipo}
                                                            detalleCostos={detalleCostos}
                                                            detalleCompras={detalleCompras} />
                                                    ) :
                                                    tabIngresoProveedor ?
                                                        (
                                                            <TabProveedores tipo={tipo} setTipo={setTipo}
                                                                ingresosxlinea={movimientoscompras.ingresoxlinea}
                                                                ingreosxproveedor={movimientoscompras.ingresoxproveedor}
                                                                presupuestosxlinea={movimientoscompras.presupuestosxlinea}
                                                                lineasproductos={movimientoscompras.lineasproductos}
                                                                proveedorescompras={movimientoscompras.proveedorescompras}
                                                            />
                                                        ) :
                                                        tabPresupuestos ?
                                                        (
                                                            <TabPresupuesto tipo={tipo} setTipo={setTipo}
                                                                listaPresupuestos={listaPresupuestos}                                                            
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
