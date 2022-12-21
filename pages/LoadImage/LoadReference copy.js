import { Fragment, useState, useEffect } from "react";
import { CheckIcon, ClockIcon } from "@heroicons/react/solid";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { close, logo, menu } from "../../assets";
import img from "../../assets/uploadimage1.png";
import { opcionesmenu, opcionesmenudos, tailsvtas, vtascanal } from "../../constants";
import swal from 'sweetalert';
import axios from "axios";
import NavBar from "../../components/NavBar/NavBar";

const products = [
    { id: 1, name: '102061', color: 'NEGRO', size: 'TALLA 35', inStock: 'OCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/comosdefault.jpg' },
    { id: 2, name: '101264', color: 'BLANCO', size: 'TALLA 35', inStock: 'OCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/comosdefault.jpg' },
    { id: 3, name: '101758', color: 'ARENA', size: 'TALLA 35', inStock: 'OCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/comosdefault.jpg' },
    { id: 4, name: '101532', color: 'CAMEL', size: 'TALLA 8', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/comosdefault.jpg' },
    { id: 5, name: '102180', color: 'PASSION M', size: 'TALLA 10', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/comosdefault.jpg' },
    { id: 6, name: '101807', color: 'LILA', size: 'CALCETINES', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/comosdefault.jpg' },
    { id: 7, name: '101808', color: 'NUDE', size: 'CALCETINES', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/comosdefault.jpg' },
    { id: 8, name: '101659', color: 'BLANCO', size: 'TALLA 35', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/comosdefault.jpg' },
    { id: 9, name: '100607', color: 'ROSA', size: 'TALLA 35', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/comosdefault.jpg' },
    { id: 10, name: '100541', color: 'BLANCO', size: 'TALLA 35', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/comosdefault.jpg' },
    { id: 11, name: '101618', color: 'CAMEL', size: 'TALLA 12', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/comosdefault.jpg' },
    { id: 12, name: '102006', color: 'CAMEL', size: 'TALLA 8', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/comosdefault.jpg' },
    { id: 13, name: '101967', color: 'NARANJA', size: 'TALLA 35', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/comosdefault.jpg' },
    { id: 14, name: '102037', color: 'NEGRO', size: 'BOLSO', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/comosdefault.jpg' },
    { id: 15, name: '101900', color: 'BEIGE', size: 'TALLA 35', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/comosdefault.jpg' },
    { id: 16, name: '101947', color: 'NEGRO', size: 'TALLA 35', inStock: 'ROCTUBRE 2022-1', imageSrc: 'https://api.aal-cloud.com/files/comosdefault.jpg' }
]

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function LoadReference(props) {
    const [imgUno, setImgUno] = useState(img);
    const [selectedArchives, setSelectedArchives] = useState([]);
    const [baseArchives, setBaseArchives] = useState([]);
    const [valorReferencia, setValorReferencia] = useState(null);
    const [valorSublinea, setValorSublinea] = useState(null);

    const generabase64 = async () => {
        if (!baseArchives) {
            swal({
                title: "Tablero Cosmos",
                text: "Selecciona una imagen!",
                icon: "warning",
            });
            return
        }

        if (!valorReferencia) {
            swal({
                title: "Tablero Cosmos",
                text: "Ingresa el id de la referencia!",
                icon: "warning",
            });
            return
        }

        if (!valorSublinea) {
            swal({
                title: "Tablero Cosmos",
                text: "Ingresa la Sublinea del producto!",
                icon: "warning",
            });
            return
        }

        const recorreImagen = async () => {
            let longitud = baseArchives.length;
            let arreglofotos = [];
            let contador = 0;
            let extension = "";

            await Array.from(baseArchives).forEach((archivo) => {
                var reader = new FileReader();
                reader.readAsDataURL(archivo);
                reader.onload = function () {
                    var base64 = reader.result;
                    arreglofotos[contador] = base64;
                    //console.log("BASE 64 : ", base64.substring(base64.indexOf('/') + 1, base64.indexOf(';base64')));
                    console.log("BASE 64 : ", arreglofotos[0]);

                    extension =
                        "." +
                        base64.substring(
                            base64.indexOf("/") + 1,
                            base64.indexOf(";base64")
                        );

                    let imagen = valorReferencia + extension;
                    console.log("EXTENSION : ", imagen);

                    const datosReferencia = async () => {

                        let params = {
                            referencia: valorReferencia,
                            imagen: imagen,
                            sublinea: valorSublinea
                        };

                        await axios({
                            method: "post",
                            url: "https://api.aal-cloud.com/api/cosmos/201",
                            params,
                        })
                            .then((res) => {
                                if (res.data) {
                                    grabarDatosReferencia(arreglofotos[0], valorReferencia)
                                } else {
                                    console.log("GRABA DATOS PRODUCTOS")
                                }
                            })
                            .catch(function (error) {
                                console.log("PRODUCTO EXISTE NO  EN SIIGO")
                                //grabarDatosBD(datos)
                            });
                    };
                    datosReferencia();
                };
            });

        };
        recorreImagen();
    }

    const grabarDatosReferencia = (foto, referencia) => {

        const formdata = new FormData();
        formdata.append("imagen", foto);
        formdata.append("nombreimagen", referencia);

        let url = "https://api.aal-cloud.com/api/cosmos";

        const grabar = async () => {
            await fetch(`${url}/200`, {
                method: "POST",
                body: formdata,
                //headers: headers,
            }).then((response) => {
                if (response) {
                    if (response.status === 200) {
                        swal({
                            title: "Tablero Cosmos",
                            text: "Registro de Foto OK!",
                            icon: "warning",
                        });
                        console.log("GRABAR OK")
                    } else {
                        console.log("GRABAR ERROR")
                    }
                } else {
                    console.log("RESPONSE INGRESO FOTOS : ", response);
                }
            });
        }
        grabar();
    }

    const onSelectFile = (event) => {
        const selectedFiles = event.target.files;
        const selectedFilesArray = Array.from(selectedFiles);

        let longitud = baseArchives.length;
        const newDet = [];
        if (!baseArchives) {
            setBaseArchives(selectedFilesArray);
        } else newDet.push.apply(baseArchives, selectedFiles);

        const imagesArray = selectedFilesArray.map((file) => {
            return file.name;
            //return URL.createObjectURL(file);
        });
        products
        setSelectedArchives((previousImages) =>
            previousImages.concat(imagesArray)
        );
    };

    const header_test = [
        { title: "Referencia", dataIndex: "Descripcion", key: "Descripcion", width: 80, fixed: true },
        {
            title: "Imagen", dataIndex: "labelDos", key: "labelDos", width: 100, align: "right",
            //sorter: (a, b) => a.Vlr_VentaAnoUno - b.Vlr_VentaAnoUno,
            render: (text, row, index) => {
                return (
                    <img
                        src={"https://api.aal-cloud.com/files/cosmos/"+row.Imagen}
                        //alt={product.imageAlt}
                        className="h-20 w-20 rounded-md object-cover object-center sm:h-20 sm:w-20"
                    />
                );
            }
        },
        {
            title: "Sublínea", dataIndex: "variacion", key: "variacion", width: 100, align: "right",
            sorter: (a, b) => a.Variacion - b.Variacion,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.Variacion, 2)}%
                    </Title>
                );
            }
        },
        {
            title: "Grupo", dataIndex: "variacion", key: "variacion", width: 100, align: "right",
            sorter: (a, b) => a.Variacion - b.Variacion,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.Variacion, 2)}%
                    </Title>
                );
            }
        }
    ]

    return (
        <div className="bg-white">
            <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 ">
                <NavBar />
            </div>

            <div className="mx-auto max-w-2xl py-16 px-4 sm:py-10 sm:px-6 lg:px-0">
                <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Banco de Imagenes Cosmos</h1>
                <form className="mt-12">
                    <section aria-labelledby="cart-heading">

                        <ul role="list" className="divide-y divide-gray-200 border-t border-b border-gray-200">
                            {products.map((product) => (
                                <li key={product.id} className="flex py-6">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={product.imageSrc}
                                            alt={product.imageAlt}
                                            className="h-20 w-20 rounded-md object-cover object-center sm:h-20 sm:w-20"
                                        />
                                    </div>
                                    <div className="ml-4 flex flex-1 flex-col sm:ml-6">
                                        <div>
                                            <div className="flex justify-between">
                                                <h4 className="text-sm">
                                                    <a href={product.href} className="font-medium text-blue-700 hover:text-gray-800">
                                                        {product.name}
                                                    </a>
                                                </h4>
                                                <p className="ml-4 text-sm font-medium text-gray-900">{product.price}</p>
                                            </div>
                                            <p className="text-sm text-gray-500">{product.color}</p>
                                            <p className="text-sm text-gray-500">{product.size}</p>
                                        </div>
                                        <div className="flex flex-1 items-end justify-between">
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
                            <p className="mt-1 text-base font-medium text-center text-gray-700">Subir imagen</p>
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="idreferencia">
                                Id Referencia
                            </label>
                            <input
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="idreferencia"
                                type="text"
                                onChange={(e) => setValorReferencia(e.target.value)}
                                placeholder="Ingrese id referencia"
                            />
                        </div>
                        <div >
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="sublinea">
                                Sublinea
                            </label>
                            <input
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="sublinea"
                                type="text"
                                onChange={(e) => setValorSublinea(e.target.value)}
                                placeholder="Ingrese sublinea del producto"
                            />
                        </div>
                        <div className="mt-3">
                            <div>
                                <label for="file-input">
                                    Seleccionar imagen
                                    <img
                                        className="tamañoimagenupload"
                                        src={imgUno.src}
                                        alt="Seleccione Archivo"
                                    />

                                </label>
                                <input
                                    id="file-input"
                                    name="images"
                                    type="file"
                                    className="ml-10 w-full rounded-md border border-transparent bg-basecosmos py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                                    onChange={onSelectFile}
                                    //multiple
                                    style={{ display: "none" }}
                                    accept="image/png, image/jpeg, application/pdf"
                                />
                            </div>
                            <div className="mt-4 ml-50 mtmenos50">

                                <div
                                    className="w-full rounded-md text-center border border-transparent bg-basecosmos py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                                    onClick={generabase64}>
                                    Grabar
                                </div>

                            </div>
                        </div>

                    </section>
                </form>
            </div>
        </div>
    );
}

export default LoadReference;