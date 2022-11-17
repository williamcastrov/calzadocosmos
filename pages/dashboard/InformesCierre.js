import { Fragment, useState, useEffect } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { close, logo, menu } from "../../assets";
import { opcionesmenu, opcionesmenudos, tailsvtas, vtascanal } from "../../constants";
import { PaperClipIcon } from '@heroicons/react/outline';

import {
    BellIcon,
    MenuAlt1Icon,
    XIcon,
} from "@heroicons/react/outline";
import {
    CheckCircleIcon,
    ChevronDownIcon,
    OfficeBuildingIcon,
    SearchIcon,
} from "@heroicons/react/solid";

import {
    mdiBasketPlusOutline,
    mdiMargin,
    mdiDecimalIncrease,
    mdiTrendingUp,
    mdiCashCheck
} from '@mdi/js';

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function InformesCierre(props) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
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

            <div className="ml-60 overflow-hidden bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Informes de cierre</h3>

                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-0">
                        <h1>Nombre/Codigo informe.</h1>
                        <h1>Descripción.</h1>
                    </div>

                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-2 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Indicador 19</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Informes e indicadores de compras</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-2 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">indicador 7</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Informes e indicadores de ventas</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-2 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Indicador 00</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Pendiente por asignar</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-2 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Indicador 00</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Pendiente por asignar</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-2 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Indicador 00</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Pendiente por asignar</dd>
                        </div>
                        {/*
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Attachments</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                <ul role="list" className="divide-y divide-gray-200 rounded-md border border-gray-200">
                                    <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                                        <div className="flex w-0 flex-1 items-center">
                                            <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                            <span className="ml-2 w-0 flex-1 truncate">resume_back_end_developer.pdf</span>
                                        </div>
                                        <div className="ml-4 flex-shrink-0">
                                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                Download
                                            </a>
                                        </div>
                                    </li>
                                    <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                                        <div className="flex w-0 flex-1 items-center">
                                            <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                            <span className="ml-2 w-0 flex-1 truncate">coverletter_back_end_developer.pdf</span>
                                        </div>
                                        <div className="ml-4 flex-shrink-0">
                                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                Download
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </dd>
                        </div>
                        */}
                    </dl>
                </div>
            </div>
        </div>


    );
}

export default InformesCierre;