import { Fragment, useState, useEffect } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { close, logo, menu } from "../../assets";
import { opcionesmenu, opcionesmenudos, tails, vtascanal } from "../../constants";
import app from "../../server/firebase";
import { useSelector } from "react-redux";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
const auth = getAuth(app);

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
} from '@mdi/js';

import { myNumber, nameMonth } from "../../utils/ArrayFunctions";

const transactions = [
    {
        id: 1,
        name: "Payment to Molly Sanders",
        href: "#",
        amount: "$20,000",
        currency: "USD",
        status: "success",
        date: "July 11, 2020",
        datetime: "2020-07-11",
    },
    {
        id: 1,
        name: "Payment to Molly Sanders",
        href: "#",
        amount: "$20,000",
        currency: "USD",
        status: "success",
        date: "July 11, 2020",
        datetime: "2020-07-11",
    },
    // More transactions...
];
const statusStyles = {
    success: "bg-green-100 text-green-800",
    processing: "bg-yellow-100 text-yellow-800",
    failed: "bg-gray-100 text-gray-800",
};

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function HomeScreen() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [agrupado, setAgrupado] = useState([]);
    const [detalle, setDetalle] = useState([]);
    const [tabCompras, setTabCompras] = useState(true);
    const [tabVentas, setTabVentas] = useState(false);
    const [tabInventarios, setTabInventarios] = useState(false);
    const [tabGastos, setTabGastos] = useState(false);

    const totalventas = useSelector((state) => state.datosdashboard.datosdashboard.ventas_periodo);
    const totalcompras = useSelector((state) => state.datosdashboard.datosdashboard.compras_periodo);
    const detallecompras = useSelector((state) => state.datosdashboard.datosdashboard.compras_periodo_detalle);
    const totalinventarios = useSelector((state) => state.datosdashboard.datosdashboard.inventarios_periodo);
    const detalleinventarios = useSelector((state) => state.datosdashboard.datosdashboard.inventarios_periodo_detalle);

    const tabs = [
        { name: 'Compras', href: '#', current: tabCompras },
        { name: 'Ventas', href: '#', current: tabVentas },
        { name: 'Inventarios', href: '#', current: tabInventarios },
        { name: 'Gastos', href: '#', current: tabGastos },
    ]

    const people = [
        { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
        // More people...
    ]

    const salirApp = () => {
        signOut(auth);
    }

    const verDetalle = (seleccion) => {
        //console.log("SELECCION : ", seleccion)
        if (seleccion == "Compras" || seleccion == 0) {
            setTabCompras(true);
            setTabVentas(false);
            setTabInventarios(false);
            setTabGastos(false);
            setDetalle([]);
        } else
            if (seleccion == "Ventas" || seleccion == 1) {
                setTabCompras(false);
                setTabVentas(true);
                setTabInventarios(false);
                setTabGastos(false);
                setDetalle([]);
            }
            else
                if (seleccion == "Inventarios" || seleccion == 2) {
                    setTabCompras(false);
                    setTabVentas(false);
                    setTabInventarios(true);
                    setTabGastos(false);
                    setDetalle(detalleinventarios);
                }
                else
                    if (seleccion == "Gastos" || seleccion == 3) {
                        setTabCompras(false);
                        setTabVentas(false);
                        setTabInventarios(false);
                        setTabGastos(true);
                        setDetalle([]);
                    }
                    else {
                        setTabCompras(true);
                        setTabVentas(false);
                        setTabInventarios(false);
                        setTabGastos(false);
                        setDetalle([]);
                    }
    }

    return (
        <>
            {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
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

                {/* Static sidebar for desktop */}
                <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 ">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex flex-col flex-grow bg-sidebar pt-5 pb-4 overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4">
                            <img className="h-12 w-auto" src={logo.src} alt="Easywire logo" />
                            <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                                COSMOS
                            </h1>
                        </div>
                        <nav
                            className="mt-5 flex-1 flex flex-col divide-y divide-cyan-800 overflow-y-auto"
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
                                            "group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md"
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
                                            className="group flex items-center px-2 py-2 text-sm leading-6 font-medium 
                                rounded-md text-black hover:text-white hover:bg-slate-200"
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
                    </div>
                </div>

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
                                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                alt=""
                                            />
                                            <span className="hidden ml-3 text-gray-700 text-sm font-medium lg:block">
                                                <span className="sr-only">Open user menu for </span>
                                                Liliana Montoya
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
                                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.6&w=256&h=256&q=80"
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
                                                        Liliana Montoya
                                                    </h1>
                                                </div>
                                                <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                                                    <dt className="sr-only">Company</dt>
                                                    <dd className="flex items-center text-sm text-gray-500 font-medium capitalize sm:mr-6">
                                                        <OfficeBuildingIcon
                                                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                            aria-hidden="true"
                                                        />
                                                        Directora administrativa
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
                            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 ">
                                    {/* Card */}
                                    {tails.map((card) => (
                                        <div
                                            key={card.name}
                                            className="bg-white overflow-hidden rounded-lg  shadow shadow-lg shadow-basecosmos"
                                        >
                                            <div className="p-1">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0">
                                                        <card.icon
                                                            className="h-6 w-6 text-gray-400"
                                                            aria-hidden="true"
                                                        />
                                                    </div>
                                                    <div className="ml-5 w-0 flex-1">
                                                        {
                                                            card.name == "Ventas" ?
                                                                (
                                                                    <dl>
                                                                        <dt className="text-lg font-medium text-gray-500 truncate">
                                                                            {card.name}
                                                                        </dt>
                                                                        <dd>
                                                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                                                {nameMonth(totalventas.mes_actual) + ' - ' + totalventas.ano_actual} {totalventas && myNumber(1, (totalventas.UND_ACT / 1000))}{"K Und"}{" - "}
                                                                                {totalventas && myNumber(1, (totalventas.MND_ACT / 1000000))}{" MM"}
                                                                            </dt>
                                                                        </dd>
                                                                        <br />
                                                                        <dd>
                                                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                                                {nameMonth(totalventas.mes_anterior) + ' - ' + totalventas.ano_anterior} {totalventas && myNumber(1, (totalventas.UND_ANT / 1000000))}{"K Und"}{" - "}
                                                                                {totalventas && myNumber(1, (totalventas.MND_ANT / 1000000))}{" MM"}
                                                                            </dt>
                                                                        </dd>
                                                                    </dl>

                                                                )
                                                                : card.name == "Compras" ?
                                                                    (

                                                                        <TileIcon
                                                                            clrH={CST.cosmosHdr}
                                                                            clrB={CST.cosmosBdy}
                                                                            clrF={CST.comosFoo}
                                                                            title={"Compras"}
                                                                            texto={nameMonth(totalcompras.mes_actual) + ' - ' + totalcompras.ano_actual + ' ' + myNumber(1, (totalcompras.UND_ACT / 1000)) + "K Und - " + myNumber(1, (totalcompras.MND_ACT / 1000000)) + 'MM'}
                                                                            icono={mdiHumanDolly}
                                                                            pie={nameMonth(totalcompras.mes_anterior) + ' - ' + totalcompras.ano_anterior + ' ' + myNumber(1, (totalcompras.UND_ANT / 1000)) + "K Und - " + myNumber(1, (totalcompras.MND_ANT / 1000000)) + 'MM'}
                                                                            funcion={null}
                                                                            opcion={0}
                                                                        />

                                                                    )
                                                                    : card.name == "Inventarios" ?
                                                                        (
                                                                            <dl>
                                                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                                                    {card.name} {" - "} {card.periodouno}{"/"}{card.periododos}
                                                                                </dt>
                                                                                <dd>
                                                                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                                                                        {totalinventarios && totalinventarios.UND_ACT}{" Und"}{" - "}
                                                                                        {totalinventarios && totalinventarios.MND_ACT}{" Millones"}
                                                                                    </dt>
                                                                                </dd>
                                                                                <br />
                                                                                <dd>
                                                                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                                                                        {totalinventarios && totalinventarios.UND_ANT}{" Und"}{" - "}
                                                                                        {totalinventarios && totalinventarios.MND_ANT}{" Millones"}
                                                                                    </dt>
                                                                                </dd>
                                                                            </dl>

                                                                        )
                                                                        : card.name == "Gastos" ?
                                                                            (
                                                                                <dl>
                                                                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                                                                        {card.name} {" - "} {card.periodouno}{"/"}{card.periododos}
                                                                                    </dt>
                                                                                    <dd>

                                                                                    </dd>
                                                                                    <br />
                                                                                    <dd>

                                                                                    </dd>
                                                                                </dl>

                                                                            )
                                                                            :
                                                                            null
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 px-5 py-3">
                                                <div className="text-sm">
                                                    <a
                                                        onClick={() => verDetalle(card.name)}
                                                        className="font-medium text-cyan-700 hover:text-cyan-900"
                                                    >
                                                        ver detalle
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
                                            tabCompras ?
                                                (
                                                    <TabDetalleCompras tabs={tabs} detalle={detalle} />
                                                ) : tabVentas ?
                                                    (
                                                        <TabDetalleVentas tabs={tabs} detalle={detalle} />
                                                    ) :
                                                    (
                                                        <div className="px-4 sm:px-6 lg:px-8">
                                                            <div className="mt-8 flex flex-col">
                                                                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                                                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                                                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                                                            <table className="min-w-full divide-y divide-gray-300">
                                                                                <thead className="bg-gray-50">
                                                                                    <tr>
                                                                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                                                            Canal
                                                                                        </th>
                                                                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                                            Unidades Mes Actual
                                                                                        </th>
                                                                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                                            Valor Mes Actual
                                                                                        </th>
                                                                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                                            Unidades Mes Anterior
                                                                                        </th>
                                                                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                                            Valor Mes Anterior
                                                                                        </th>
                                                                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                                                            <span className="sr-only">Edit</span>
                                                                                        </th>
                                                                                    </tr>
                                                                                </thead>{ }
                                                                                <tbody className="bg-white">
                                                                                    {detalle && detalle.map((person, personIdx) => (
                                                                                        <tr key={person.email} className={personIdx % 2 === 0 ? undefined : 'bg-gray-50'}>
                                                                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                                                {person.Descripcion}
                                                                                            </td>
                                                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.UND_ACT}</td>
                                                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.MND_ACT}</td>
                                                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.UND_ANT}</td>
                                                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.MND_ANT}</td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
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


function TabDetalleCompras(props) {
    const { detalle, tabs } = props;
    const [entInventarios, setEntInventarios] = useState(true);
    const [salInventarios, setSalInventarios] = useState(false);
    const [TransDirectas, setTransDirectas] = useState(false);
    const [movimientos, setmovimientos] = useState(false);

    const entradasinventarios = useSelector((state) => state.datosdashboard.datosdashboard.compras_periodo_detalle);
    //console.log("ENTRADAS : ", entradasinventarios);

    const tabsdos = [
        { name: 'Entradas x Proveedor', href: '#', current: entInventarios },
        { name: 'Salidas Inventario', href: '#', current: salInventarios },
        { name: 'Transferencias Directas', href: '#', current: TransDirectas },
    ]

    const selTabCompras = (seleccion) => {
        console.log("SELECCION : ", seleccion)
        if (seleccion == 0) {
            setEntInventarios(true)
            setSalInventarios(false)
            setTransDirectas(false)
            setmovimientos(entradasinventarios);
        } else
            if (seleccion == 1) {
                setEntInventarios(false)
                setSalInventarios(true)
                setTransDirectas(false)
                setmovimientos([])
            } else
                if (seleccion == 2) {
                    setEntInventarios(false)
                    setSalInventarios(false)
                    setTransDirectas(true)
                    setmovimientos([])
                } else {
                    setEntInventarios(true)
                    setSalInventarios(false)
                    setTransDirectas(false)
                    setmovimientos([])
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
                <div className="hidden sm:block ml-10">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {tabsdos.map((tab, index) => (
                                <a
                                    key={tab.name}
                                    onClick={() => selTabCompras(index)}
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
                    <div className="margenizaquierdanegativo px-4 sm:px-6 lg:px-8">
                        <div className="mt-8 flex flex-col">
                            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-300">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                        Canal
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Unidades Mes Actual
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Valor Mes Actual
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Unidades Mes Anterior
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Valor Mes Anterior
                                                    </th>
                                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                        <span className="sr-only">Edit</span>
                                                    </th>
                                                </tr>
                                            </thead>{ }
                                            <tbody className="bg-white">
                                                {movimientos && movimientos.map((person, personIdx) => (
                                                    <tr key={person.email} className={personIdx % 2 === 0 ? undefined : 'bg-gray-50'}>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                            {person.Descripcion}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.UND_ACT}</td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.MND_ACT}</td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.UND_ANT}</td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.MND_ANT}</td>
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


function TabDetalleVentas(props) {
    const { detalle, tabs } = props;
    const [vtasFamilia, setVtasFamilia] = useState(false);
    const [vtasCanal, setVtasCanal] = useState(true);
    const [vtasCategoria, setVtasCategoria] = useState(false);
    const [vtasMarca, setVtasMarca] = useState(false);
    const [movimientos, setmovimientos] = useState(false);

    const tabsdos = [
        { name: 'Ventas x Canal', href: '#', current: vtasCanal },
        { name: 'Ventas x Familia', href: '#', current: vtasFamilia },
        { name: 'Ventas x SubCategoría', href: '#', current: vtasCategoria },
        { name: 'Ventas x Marca', href: '#', current: vtasMarca },
    ]

    const ventascanal = useSelector((state) => state.datosdashboard.datosdashboard.ventas_periodo_detalle);
    const ventasfamilia = useSelector((state) => state.datosdashboard.datosdashboard.familia_productos_periodo);
    const ventassubcategorias = useSelector((state) => state.datosdashboard.datosdashboard.subcategorias_productos_periodo);
    const ventasmarcas = useSelector((state) => state.datosdashboard.datosdashboard.marcas_productos_periodo);


    const selTabVentas = (seleccion) => {
        //console.log("SELECCION : ", seleccion)
        if (seleccion == 0) {
            setVtasCanal(true)
            setVtasFamilia(false)
            setVtasCategoria(false)
            setVtasMarca(false)
            setmovimientos(ventascanal);
        } else
            if (seleccion == 1) {
                setVtasCanal(false)
                setVtasFamilia(true)
                setVtasCategoria(false)
                setVtasMarca(false)
                setmovimientos(ventasfamilia);
            } else
                if (seleccion == 2) {
                    setVtasCanal(false)
                    setVtasFamilia(false)
                    setVtasCategoria(true)
                    setVtasMarca(false)
                    setmovimientos(ventassubcategorias);
                } else
                    if (seleccion == 3) {
                        setVtasCanal(false)
                        setVtasFamilia(false)
                        setVtasCategoria(false)
                        setVtasMarca(true)
                        setmovimientos(ventasmarcas);
                    } else {
                        setVtasCanal(false)
                        setVtasFamilia(true)
                        setVtasCategoria(false)
                        setVtasMarca(false)
                        setmovimientos([]);
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
                <div className="hidden sm:block ml-10">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {tabsdos.map((tab, index) => (
                                <a
                                    key={tab.name}
                                    onClick={() => selTabVentas(index)}
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
                    <div className="margenizaquierdanegativo px-4 sm:px-6 lg:px-8">
                        <div className="mt-8 flex flex-col">
                            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-300">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                        Canal
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Unidades Mes Actual
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Valor Mes Actual
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Unidades Mes Anterior
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Valor Mes Anterior
                                                    </th>
                                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                        <span className="sr-only">Edit</span>
                                                    </th>
                                                </tr>
                                            </thead>{ }
                                            <tbody className="bg-white">
                                                {movimientos && movimientos.map((person, personIdx) => (
                                                    <tr key={person.email} className={personIdx % 2 === 0 ? undefined : 'bg-gray-50'}>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                            {person.Descripcion}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.UND_ACT}</td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.MND_ACT}</td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.UND_ANT}</td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.MND_ANT}</td>
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