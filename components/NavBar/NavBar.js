import { Fragment, useState, useEffect, React } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { close, logo, menu } from "../../assets";
import { opcionesmenu, opcionesmenudos, tails, vtascanal } from "../../constants";
import app from "../../server/firebase";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged, reload, signOut } from "firebase/auth";
import { useRouter } from "next/router";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function NavBar(props) {
    const asignaTipoUsuario = () => {

    }
    
    return (
        <div>
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
                            {opcionesmenu.map((item, index) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => asignaTipoUsuario(index)}
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
        </div>
    );
}

export default NavBar;