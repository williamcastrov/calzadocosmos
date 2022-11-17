import { Fragment, useState, useEffect } from "react";
import { CheckIcon, ClockIcon } from "@heroicons/react/solid";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { close, logo, menu } from "../../assets";
import { opcionesmenu, opcionesmenudos, tailsvtas, vtascanal } from "../../constants";

const products = [
    { id: 1, name: '102061', color: 'NEGRO', size: 'TALLA 35', inStock: 'OCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/cosmos/100541.jpg' },
    { id: 2, name: '101264', color: 'BLANCO', size: 'TALLA 35', inStock: 'OCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/cosmos/101264.jpg' },
    { id: 3, name: '101758', color: 'ARENA', size: 'TALLA 35', inStock: 'OCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/cosmos/101758.jpg' },
    { id: 4, name: '101532', color: 'CAMEL', size: 'TALLA 8', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/cosmos/100541.jpg' },
    { id: 5, name: '102180', color: 'PASSION M', size: 'TALLA 10', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/cosmos/101532.jpg' },
    { id: 6, name: '101807', color: 'LILA', size: 'CALCETINES', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/cosmos/102180.jpg' },
    { id: 7, name: '101808', color: 'NUDE', size: 'CALCETINES', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/cosmos/101807.jpg' },
    { id: 8, name: '101659', color: 'BLANCO', size: 'TALLA 35', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/cosmos/101808.jpg' },
    { id: 9, name: '100607', color: 'ROSA', size: 'TALLA 35', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/cosmos/101659.jpg' },
    { id: 10, name: '100541', color: 'BLANCO', size: 'TALLA 35', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/cosmos/100607.jpg' },
    { id: 11, name: '101618', color: 'CAMEL', size: 'TALLA 12', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/cosmos/100541.jpg' },
    { id: 12, name: '102006', color: 'CAMEL', size: 'TALLA 8', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/cosmos/101618.jpg' },
    { id: 13, name: '101967', color: 'NARANJA', size: 'TALLA 35', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/cosmos/102006.jpg' },
    { id: 14, name: '102037', color: 'NEGRO', size: 'BOLSO', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/cosmos/101967.jpg' },
    { id: 15, name: '101900', color: 'BEIGE', size: 'TALLA 35', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/cosmos/102037.jpg' },
    { id: 16, name: '101947', color: 'NEGRO', size: 'TALLA 35', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/cosmos/101900.jpg' }
]

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function LoadReference(props) {
    return (
        <div className="bg-white">
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

            <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:px-0">
                <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Banco de Imagenes Cosmos</h1>
                <form className="mt-12">
                    <section aria-labelledby="cart-heading">
                        <h2 id="cart-heading" className="sr-only">
                            Items in your shopping cart
                        </h2>
                        <ul role="list" className="divide-y divide-gray-200 border-t border-b border-gray-200">
                            {products.map((product) => (
                                <li key={product.id} className="flex py-6">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={product.imageSrc}
                                            alt={product.imageAlt}
                                            className="h-30 w-40 rounded-md object-cover object-center sm:h-50 sm:w-50"
                                        />
                                    </div>
                                    <div className="ml-4 flex flex-1 flex-col sm:ml-6">
                                        <div>
                                            <div className="flex justify-between">
                                                <h4 className="text-sm">
                                                    <a href={product.href} className="font-medium text-gray-700 hover:text-gray-800">
                                                        {product.name}
                                                    </a>
                                                </h4>
                                                <p className="ml-4 text-sm font-medium text-gray-900">{product.price}</p>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                                            <p className="mt-1 text-sm text-gray-500">{product.size}</p>
                                        </div>
                                        <div className="mt-4 flex flex-1 items-end justify-between">
                                            <p className="flex items-center space-x-2 text-sm text-gray-700">
                                                {product.inStock ? (
                                                    <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" aria-hidden="true" />
                                                ) : (
                                                    <ClockIcon className="h-5 w-5 flex-shrink-0 text-gray-300" aria-hidden="true" />
                                                )}
                                                <span>{product.inStock ? 'En inventario' : `Will ship in ${product.leadTime}`}</span>
                                            </p>
                                            <div className="ml-4">
                                                <button type="button" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                                    <span>Eliminar</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                    {/* Order summary */}
                    <section aria-labelledby="summary-heading" className="mt-10">
                        <h2 id="summary-heading" className="sr-only">
                            Order summary
                        </h2>
                        <div>
                            <dl className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <dt className="text-base font-medium text-gray-900">Total referencias</dt>
                                    <dd className="ml-4 text-base font-medium text-gray-900">15</dd>
                                </div>
                            </dl>
                            <p className="mt-1 text-sm text-gray-500">Catalogo de productos.</p>
                        </div>
                        <div className="mt-10">
                            <button
                                type="submit"
                                className="w-full rounded-md border border-transparent bg-basecosmos py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                            >
                                Subir referencia
                            </button>
                        </div>

                    </section>
                </form>
            </div>
        </div>
    );
}

export default LoadReference;