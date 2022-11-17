import { Fragment, useState, useEffect } from "react";
import { myNumber, nameMonth } from "../../../utils/ArrayFunctions";
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, FunnelIcon, } from "@heroicons/react/solid";
import swal from 'sweetalert';
import { MultiSelect } from "react-multi-select-component";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const options = [
    { label: "Grapes 🍇", value: "grapes" },
    { label: "Mango 🥭", value: "mango" },
    { label: "Strawberry 🍓", value: "strawberry", disabled: true },
];

const dato = [];

function TabListasPrecios(props) {
    const { tipo, setTipo, datosCostos, ventasDiariasMes, listaPrecios} = props;
    const [entMargenCentro, setEntMargenCentro] = useState(true);
    const [entMargenSubcategoria, setEntMargenSubcategoria] = useState(false);
    const [entMargenProveedor, setEntMargenProveedor] = useState(false);
    const [opcion, setOpcion] = useState(0);
    const [tituloTipo, setTituloTipo] = useState("CENTROS_DE_OPERACIÓN");
    const [datosVariacion, setDatosVariacion] = useState([]);

    const [vtasAno, setVtasAno] = useState(ventasDiariasMes.anos_vtasdiarias);
    const [vtasMes, setVtasMes] = useState(ventasDiariasMes.meses_vtasdiarias);
    const [vtasDia, setVtasDia] = useState(ventasDiariasMes.dias_vtas);
    const [centrosoperacion, setCentrosoperacion] = useState(ventasDiariasMes.centrosoperacion);
    const [subcategorias, setSubcategorias] = useState(ventasDiariasMes.subcategorias);
    const [proveedores, setProveedores] = useState(ventasDiariasMes.proveedores);

    const [filtroAno, setFiltroAno] = useState([]);
    const [filtroMes, setFiltroMes] = useState([]);
    const [filtroDia, setFiltroDia] = useState([]);
    const [consultar, setConsultar] = useState(false);
    const [consultarAno, setConsultarAno] = useState(false);

    const [selectedAno, setSelectedAno] = useState([]);
    const [selectedMes, setSelectedMes] = useState([]);
    const [selectedDia, setSelectedDia] = useState([]);
    const [labelUno, setLabelUno] = useState([]);
    const [labelDos, setLabelDos] = useState([]);
    const [labelTres, setLabelTres] = useState([]);

    const tabsdos = [
        { name: 'Consolidado', href: '#', current: entMargenCentro },
        { name: 'Precios x línea', href: '#', current: entMargenSubcategoria },
        { name: 'Margen-lista-proveedor', href: '#', current: entMargenProveedor },
    ]

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
    }, []);

    //costosvtacentro
    const selCostoVentas = (seleccion) => {
        setOpcion(seleccion);
        //consolidar();
        if (seleccion == 0) {
            setEntMargenCentro(true);
            setEntMargenSubcategoria(false);
            setEntMargenProveedor(false);
            setTituloTipo("CENTROS_DE_OPERACIÓN")
        }
        else
            if (seleccion == 1) {
                setTituloTipo("SUBCATEGORÍAS");
                setEntMargenSubcategoria(true);
                setEntMargenCentro(false);
                setEntMargenProveedor(false);
            } else
                if (seleccion == 2) {
                    setTituloTipo("PROVEEDORES");
                    setEntMargenSubcategoria(false);
                    setEntMargenCentro(false);
                    setEntMargenProveedor(true);
                }
                else {
                    setTituloTipo("");
                    setEntMargenSubcategoria(false);
                    setEntMargenCentro(false);
                    setEntMargenProveedor(false);
                    setdatosVariacion("");
                }
    }

    const limpiarFiltros = () => {
        /*
        setFiltroAno([]);
        setFiltroMes([]);
        setFiltroDia([]);
        setdatosVariacion([]);
        */
    }

    const generarConsulta = () => {
        if (selectedAno.length < 1) {
            swal({
                title: "Tablero Cosmos",
                text: "Debes seleccionar Años!",
                icon: "warning",
            });
            return
        }

        if (selectedAno.length < 2 && selectedMes.length == 0) {
            swal({
                title: "Tablero Cosmos",
                text: "Debes seleccionar los años a comparar!",
                icon: "warning",
            });
            return
        }

        if (selectedAno.length == 1 && selectedMes.length < 2) {
            swal({
                title: "Tablero Cosmos",
                text: "Debes seleccionar año y meses a comparar!",
                icon: "warning",
            });
            return
        }

        consolidar();
        //setConsultarAno(true)
    }

    const consolidar = () => {
        //let periodo = "" + filtroAno + filtroMes;
        if (selectedAno.length > 0 && selectedMes.length == 0) {
            if (opcion == 0) {

                let ventastotalanouno = 0;
                let ventastotalanodos = 0;
                let ventastotalanotres = 0;
                let ventastotalanocuatro = 0;

                let newDetVtasAcumAnoUno = [];
                let newDetVtasAcumAnoDos = [];
                let newDetVtasAcumAnoTres = [];
                let newDetVtasAcumAnoCuatro = [];

                let longitud = selectedAno.length;

                for (var i = 0; i < longitud; i++) {

                    datosCostos.costosvtacentro &&
                        datosCostos.costosvtacentro.map((vtas, index) => {

                            if (i == 0)
                                if (vtas.ano == selectedAno[i].value) {
                                    ventastotalanouno = ventastotalanouno + vtas.Vlr_Total
                                    setLabelUno("Ventas año" + selectedAno[i].label)
                                }

                            if (i == 1)
                                if (vtas.ano == selectedAno[i].value) {
                                    ventastotalanodos = ventastotalanodos + vtas.Vlr_Total
                                    setLabelDos("Ventas año" + selectedAno[i].label)
                                }

                            if (i == 2) {
                                if (vtas.ano == selectedAno[i].value) {
                                    ventastotalanotres = ventastotalanotres + vtas.Vlr_Total
                                    setLabelTres("Ventas año" + selectedAno[i].label)
                                }
                            }

                            if (i == 3)
                                if (vtas.ano == selectedAno[i].value) {
                                    ventastotalanocuatro = ventastotalanocuatro + vtas.Vlr_Total
                                }
                        });
                }



                for (var i = 0; i < longitud; i++) {
                    if (i == 0) {
                        centrosoperacion &&
                            centrosoperacion.map((centros, index) => {
                                let valorventa = 0;
                                let participacion = 0;
                                datosCostos.costosvtacentro &&
                                    datosCostos.costosvtacentro.map((vtas, index) => {

                                        if (vtas.ano == selectedAno[i].value
                                            && vtas.Descripcion == centros.Centros_Operacion) {
                                            valorventa = valorventa + vtas.Vlr_Total;
                                        }
                                    });
                                let vtauno = {
                                    Descripcion: centros.Centros_Operacion,
                                    ano: selectedAno[i].value,
                                    VentaAcumulada: valorventa,
                                    ParticipacionAcum: valorventa / ventastotalanouno
                                };
                                newDetVtasAcumAnoUno.push(vtauno);
                            });
                    }


                    if (i == 1) {
                        centrosoperacion &&
                            centrosoperacion.map((centros, index) => {
                                let valorventa = 0;
                                let participacion = 0;
                                datosCostos.costosvtacentro &&
                                    datosCostos.costosvtacentro.map((vtas, index) => {
                                        if (vtas.ano == selectedAno[i].value
                                            && vtas.Descripcion == centros.Centros_Operacion) {
                                            valorventa = valorventa + vtas.Vlr_Total;
                                        }
                                    });
                                let vtados = {
                                    Descripcion: centros.Centros_Operacion,
                                    ano: selectedAno[i].value,
                                    VentaAcumulada: valorventa,
                                    ParticipacionAcum: valorventa / ventastotalanouno
                                };
                                newDetVtasAcumAnoDos.push(vtados);
                            });
                    }

                    if (i == 2) {
                        centrosoperacion &&
                            centrosoperacion.map((centros, index) => {
                                let valorventa = 0;
                                let participacion = 0;
                                datosCostos.costosvtacentro &&
                                    datosCostos.costosvtacentro.map((vtas, index) => {
                                        if (vtas.ano == selectedAno[i].value
                                            && vtas.Descripcion == centros.Centros_Operacion) {
                                            valorventa = valorventa + vtas.Vlr_Total;
                                        }
                                    });
                                let vtatres = {
                                    Descripcion: centros.Centros_Operacion,
                                    ano: selectedAno[i].value,
                                    VentaAcumulada: valorventa,
                                    ParticipacionAcum: valorventa / ventastotalanouno
                                };
                                newDetVtasAcumAnoTres.push(vtatres);
                            });
                    }

                    if (i == 3) {
                        centrosoperacion &&
                            centrosoperacion.map((centros, index) => {
                                let valorventa = 0;
                                let participacion = 0;
                                datosCostos.costosvtacentro &&
                                    datosCostos.costosvtacentro.map((vtas, index) => {
                                        if (vtas.ano == selectedAno[i].value
                                            && vtas.Descripcion == centros.Centros_Operacion) {
                                            valorventa = valorventa + vtas.Vlr_Total;
                                        }
                                    });
                                let vtacuatro = {
                                    Descripcion: centros.Centros_Operacion,
                                    ano: selectedAno[i].value,
                                    VentaAcumulada: valorventa,
                                    ParticipacionAcum: valorventa / ventastotalanouno
                                };
                                newDetVtasAcumAnoCuatro.push(vtacuatro);
                            });
                    }
                }

                let newDetVtasCompara = [];

                if (longitud == 2) {
                    newDetVtasAcumAnoUno &&
                        newDetVtasAcumAnoUno.map((acumula, index) => {
                            newDetVtasAcumAnoDos &&
                                newDetVtasAcumAnoDos.map((meses, index) => {
                                    let variacion = 0;
                                    variacion = ((1 - (acumula.VentaAcumulada / meses.VentaAcumulada)) * 100).toFixed(2);

                                    if (isNaN(variacion))
                                        variacion = 0;

                                    if (acumula.Descripcion == meses.Descripcion) {
                                        let vta = {
                                            Descripcion: acumula.Descripcion,
                                            Periodo: acumula.ano + " - " + meses.ano,
                                            Vlr_VentaAnoUno: acumula.VentaAcumulada,
                                            Vlr_VentaAnoDos: meses.VentaAcumulada,
                                            Variacion: variacion
                                        };
                                        newDetVtasCompara.push(vta);
                                    }
                                });
                        });
                }
                setDatosVariacion(newDetVtasCompara);
            } else
                if (opcion == 1) {
                    let ventastotalanouno = 0;
                    let ventastotalanodos = 0;
                    let ventastotalanotres = 0;
                    let ventastotalanocuatro = 0;

                    let newDetVtasAcumAnoUno = [];
                    let newDetVtasAcumAnoDos = [];
                    let newDetVtasAcumAnoTres = [];
                    let newDetVtasAcumAnoCuatro = [];

                    let longitud = selectedAno.length;

                    for (var i = 0; i < longitud; i++) {
                        datosCostos.costosvtasubcategoria &&
                            datosCostos.costosvtasubcategoria.map((vtas, index) => {

                                if (i == 0)
                                    if (vtas.ano == selectedAno[i].value) {
                                        ventastotalanouno = ventastotalanouno + vtas.Vlr_Total
                                        setLabelUno(selectedAno[i].label)
                                    }

                                if (i == 1)
                                    if (vtas.ano == selectedAno[i].value) {
                                        ventastotalanodos = ventastotalanodos + vtas.Vlr_Total
                                        setLabelDos(selectedAno[i].label)
                                    }

                                if (i == 2) {
                                    if (vtas.ano == selectedAno[i].value) {
                                        ventastotalanotres = ventastotalanotres + vtas.Vlr_Total
                                        setLabelTres(selectedAno[i].label)
                                    }
                                }

                                if (i == 3)
                                    if (vtas.ano == selectedAno[i].value) {
                                        ventastotalanocuatro = ventastotalanocuatro + vtas.Vlr_Total
                                    }
                            });
                    }

                    for (var i = 0; i < longitud; i++) {
                        if (i == 0) {
                            subcategorias &&
                                subcategorias.map((centros, index) => {
                                    let valorventa = 0;
                                    let participacion = 0;
                                    datosCostos.costosvtasubcategoria &&
                                        datosCostos.costosvtasubcategoria.map((vtas, index) => {
                                            if (vtas.ano == selectedAno[i].value
                                                && vtas.Descripcion == centros.Subcategorias) {
                                                valorventa = valorventa + vtas.Vlr_Total;
                                            }
                                        });
                                    let vtauno = {
                                        Descripcion: centros.Subcategorias,
                                        ano: selectedAno[i].value,
                                        VentaAcumulada: valorventa,
                                        ParticipacionAcum: valorventa / ventastotalanouno
                                    };
                                    newDetVtasAcumAnoUno.push(vtauno);
                                });
                        }

                        if (i == 1) {
                            subcategorias &&
                                subcategorias.map((centros, index) => {
                                    let valorventa = 0;
                                    let participacion = 0;
                                    datosCostos.costosvtasubcategoria &&
                                        datosCostos.costosvtasubcategoria.map((vtas, index) => {
                                            if (vtas.ano == selectedAno[i].value
                                                && vtas.Descripcion == centros.Subcategorias) {
                                                valorventa = valorventa + vtas.Vlr_Total;
                                            }
                                        });
                                    let vtados = {
                                        Descripcion: centros.Subcategorias,
                                        ano: selectedAno[i].value,
                                        VentaAcumulada: valorventa,
                                        ParticipacionAcum: valorventa / ventastotalanouno
                                    };
                                    newDetVtasAcumAnoDos.push(vtados);
                                });
                        }

                        if (i == 2) {
                            subcategorias &&
                                subcategorias.map((centros, index) => {
                                    let valorventa = 0;
                                    let participacion = 0;
                                    datosCostos.costosvtasubcategoria &&
                                        datosCostos.costosvtasubcategoria.map((vtas, index) => {
                                            if (vtas.ano == selectedAno[i].value
                                                && vtas.Descripcion == centros.Subcategorias) {
                                                valorventa = valorventa + vtas.Vlr_Total;
                                            }
                                        });
                                    let vtatres = {
                                        Descripcion: centros.Subcategorias,
                                        ano: selectedAno[i].value,
                                        VentaAcumulada: valorventa,
                                        ParticipacionAcum: valorventa / ventastotalanouno
                                    };
                                    newDetVtasAcumAnoTres.push(vtatres);
                                });
                        }

                        if (i == 3) {
                            subcategorias &&
                                subcategorias.map((centros, index) => {
                                    let valorventa = 0;
                                    let participacion = 0;
                                    datosCostos.costosvtasubcategoria &&
                                        datosCostos.costosvtasubcategoria.map((vtas, index) => {
                                            if (vtas.ano == selectedAno[i].value
                                                && vtas.Descripcion == centros.Subcategorias) {
                                                valorventa = valorventa + vtas.Vlr_Total;
                                            }
                                        });
                                    let vtacuatro = {
                                        Descripcion: centros.Subcategorias,
                                        ano: selectedAno[i].value,
                                        VentaAcumulada: valorventa,
                                        ParticipacionAcum: valorventa / ventastotalanouno
                                    };
                                    newDetVtasAcumAnoCuatro.push(vtacuatro);
                                });
                        }
                    }

                    let newDetVtasCompara = [];

                    if (longitud == 2) {
                        newDetVtasAcumAnoUno &&
                            newDetVtasAcumAnoUno.map((acumula, index) => {
                                newDetVtasAcumAnoDos &&
                                    newDetVtasAcumAnoDos.map((meses, index) => {
                                        let variacion = 0;
                                        variacion = ((1 - (acumula.VentaAcumulada / meses.VentaAcumulada)) * 100).toFixed(2);

                                        if (isNaN(variacion))
                                            variacion = 0;

                                        if (acumula.Descripcion == meses.Descripcion) {
                                            let vta = {
                                                Descripcion: acumula.Descripcion,
                                                Periodo: acumula.ano + " - " + meses.ano,
                                                Vlr_VentaAnoUno: acumula.VentaAcumulada,
                                                Vlr_VentaAnoDos: meses.VentaAcumulada,
                                                Variacion: variacion
                                            };
                                            newDetVtasCompara.push(vta);
                                        }
                                    });
                            });
                    }
                    setDatosVariacion(newDetVtasCompara);

                } else
                    if (opcion == 2) {
                        let ventastotalanouno = 0;
                        let ventastotalanodos = 0;
                        let ventastotalanotres = 0;
                        let ventastotalanocuatro = 0;

                        let newDetVtasAcumAnoUno = [];
                        let newDetVtasAcumAnoDos = [];
                        let newDetVtasAcumAnoTres = [];
                        let newDetVtasAcumAnoCuatro = [];

                        let longitud = selectedAno.length;

                        for (var i = 0; i < longitud; i++) {
                            datosCostos.costosproveedor &&
                                datosCostos.costosproveedor.map((vtas, index) => {

                                    if (i == 0)
                                        if (vtas.ano == selectedAno[i].value) {
                                            ventastotalanouno = ventastotalanouno + vtas.Vlr_Total
                                            setLabelUno(selectedAno[i].label)
                                        }

                                    if (i == 1)
                                        if (vtas.ano == selectedAno[i].value) {
                                            ventastotalanodos = ventastotalanodos + vtas.Vlr_Total
                                            setLabelDos(selectedAno[i].label)
                                        }

                                    if (i == 2) {
                                        if (vtas.ano == selectedAno[i].value) {
                                            ventastotalanotres = ventastotalanotres + vtas.Vlr_Total
                                            setLabelTres(selectedAno[i].label)
                                        }
                                    }

                                    if (i == 3)
                                        if (vtas.ano == selectedAno[i].value) {
                                            ventastotalanocuatro = ventastotalanocuatro + vtas.Vlr_Total
                                        }
                                });
                        }

                        for (var i = 0; i < longitud; i++) {
                            if (i == 0) {
                                proveedores &&
                                    proveedores.map((centros, index) => {
                                        let valorventa = 0;
                                        let participacion = 0;
                                        datosCostos.costosproveedor &&
                                            datosCostos.costosproveedor.map((vtas, index) => {
                                                if (vtas.ano == selectedAno[i].value
                                                    && vtas.Descripcion == centros.Nombre_Proveedor) {
                                                    valorventa = valorventa + vtas.Vlr_Total;
                                                }
                                            });

                                        if (valorventa > 0) {
                                            let vtauno = {
                                                Descripcion: centros.Nombre_Proveedor,
                                                ano: selectedAno[i].value,
                                                VentaAcumulada: valorventa,
                                                ParticipacionAcum: valorventa / ventastotalanouno
                                            };
                                            newDetVtasAcumAnoUno.push(vtauno);
                                        }
                                    });
                            }

                            if (i == 1) {
                                proveedores &&
                                    proveedores.map((centros, index) => {
                                        let valorventa = 0;
                                        let participacion = 0;
                                        datosCostos.costosproveedor &&
                                            datosCostos.costosproveedor.map((vtas, index) => {
                                                if (vtas.ano == selectedAno[i].value
                                                    && vtas.Descripcion == centros.Nombre_Proveedor) {
                                                    valorventa = valorventa + vtas.Vlr_Total;
                                                }
                                            });
                                        let vtados = {
                                            Descripcion: centros.Nombre_Proveedor,
                                            ano: selectedAno[i].value,
                                            VentaAcumulada: valorventa,
                                            ParticipacionAcum: valorventa / ventastotalanouno
                                        };
                                        newDetVtasAcumAnoDos.push(vtados);
                                    });
                            }

                            if (i == 2) {
                                proveedores &&
                                    proveedores.map((centros, index) => {
                                        let valorventa = 0;
                                        let participacion = 0;
                                        datosCostos.costosproveedor &&
                                            datosCostos.costosproveedor.map((vtas, index) => {
                                                if (vtas.ano == selectedAno[i].value
                                                    && vtas.Descripcion == centros.Nombre_Proveedor) {
                                                    valorventa = valorventa + vtas.Vlr_Total;
                                                }
                                            });
                                        let vtatres = {
                                            Descripcion: centros.Nombre_Proveedor,
                                            ano: selectedAno[i].value,
                                            VentaAcumulada: valorventa,
                                            ParticipacionAcum: valorventa / ventastotalanouno
                                        };
                                        newDetVtasAcumAnoTres.push(vtatres);
                                    });
                            }

                            if (i == 3) {
                                proveedores &&
                                    proveedores.map((centros, index) => {
                                        let valorventa = 0;
                                        let participacion = 0;
                                        datosCostos.costosproveedor &&
                                            datosCostos.costosproveedor.map((vtas, index) => {
                                                if (vtas.ano == selectedAno[i].value
                                                    && vtas.Descripcion == centros.Nombre_Proveedor) {
                                                    valorventa = valorventa + vtas.Vlr_Total;
                                                }
                                            });
                                        let vtacuatro = {
                                            Descripcion: centros.Nombre_Proveedor,
                                            ano: selectedAno[i].value,
                                            VentaAcumulada: valorventa,
                                            ParticipacionAcum: valorventa / ventastotalanouno
                                        };
                                        newDetVtasAcumAnoCuatro.push(vtacuatro);
                                    });
                            }
                        }

                        let newDetVtasCompara = [];

                        if (longitud == 2) {
                            newDetVtasAcumAnoUno &&
                                newDetVtasAcumAnoUno.map((acumula, index) => {
                                    newDetVtasAcumAnoDos &&
                                        newDetVtasAcumAnoDos.map((meses, index) => {
                                            let variacion = 0;
                                            variacion = ((1 - (acumula.VentaAcumulada / meses.VentaAcumulada)) * 100).toFixed(2);

                                            if (isNaN(variacion))
                                                variacion = 0;

                                            if (acumula.Descripcion == meses.Descripcion) {
                                                let vta = {
                                                    Descripcion: acumula.Descripcion,
                                                    Periodo: acumula.ano + " - " + meses.ano,
                                                    Vlr_VentaAnoUno: acumula.VentaAcumulada,
                                                    Vlr_VentaAnoDos: meses.VentaAcumulada,
                                                    Variacion: variacion
                                                };
                                                newDetVtasCompara.push(vta);
                                            }
                                        });
                                });
                        }
                        setDatosVariacion(newDetVtasCompara);
                    } else
                        setDatosVariacion([])
        } else
            if (selectedAno.length == 1 && selectedMes.length < 3) {

                if (opcion == 0) {

                    let ventastotalanouno = 0;
                    let ventastotalanodos = 0;
                    let ventastotalanotres = 0;
                    let ventastotalanocuatro = 0;

                    let newDetVtasAcumAnoUno = [];
                    let newDetVtasAcumAnoDos = [];
                    let newDetVtasAcumAnoTres = [];
                    let newDetVtasAcumAnoCuatro = [];
                    let longitud = selectedMes.length;

                    setLabelDos([]);
                    setLabelTres([]);

                    for (var i = 0; i < longitud; i++) {

                        datosCostos.costosvtacentro &&
                            datosCostos.costosvtacentro.map((vtas, index) => {

                                if (i == 0)
                                    if (vtas.ano == selectedAno[0].value && vtas.mes == selectedMes[i].value) {
                                        ventastotalanouno = ventastotalanouno + vtas.Vlr_Total;
                                        setLabelUno("Periodo-" + selectedMes[i].label + "-" + selectedAno[i].label)
                                    }

                                if (i == 1)
                                    if (vtas.ano == selectedAno[0].value && vtas.mes == selectedMes[i].value) {
                                        ventastotalanodos = ventastotalanodos + vtas.Vlr_Total;
                                        setLabelDos("Periodo-" + selectedMes[i].label + "-" + selectedAno[0].label)
                                    }
                                /*
                                                            if (i == 2) {
                                                                if (vtas.ano == selectedAno[i].value) {
                                                                    //ventastotalanotres = ventastotalanotres + vtas.Vlr_Total;
                                                                    setLabelTres([])
                                                                }
                                                            }
                                
                                                            if (i == 3)
                                                                if (vtas.ano == selectedAno[i].value) {
                                                                    //ventastotalanocuatro = ventastotalanocuatro + vtas.Vlr_Total;
                                                                }
                                                                */
                            });
                    }

                    for (var i = 0; i < longitud; i++) {
                        console.log("VALOR I : ", i)
                        if (i == 0) {
                            centrosoperacion &&
                                centrosoperacion.map((centros, index) => {
                                    let valorventa = 0;
                                    let participacion = 0;
                                    datosCostos.costosvtacentro &&
                                        datosCostos.costosvtacentro.map((vtas, index) => {

                                            if (vtas.ano == selectedAno[0].value
                                                && vtas.Descripcion == centros.Centros_Operacion
                                                && vtas.mes == selectedMes[i].value
                                            ) {
                                                valorventa = valorventa + vtas.Vlr_Total;
                                            }
                                        });
                                    let vtauno = {
                                        Descripcion: centros.Centros_Operacion,
                                        ano: selectedAno[0].value,
                                        VentaAcumulada: valorventa,
                                        ParticipacionAcum: valorventa / ventastotalanouno
                                    };
                                    newDetVtasAcumAnoUno.push(vtauno);
                                });
                        }

                        if (i == 1) {
                            centrosoperacion &&
                                centrosoperacion.map((centros, index) => {
                                    let valorventa = 0;
                                    let participacion = 0;
                                    datosCostos.costosvtacentro &&
                                        datosCostos.costosvtacentro.map((vtas, index) => {

                                            if (vtas.ano == selectedAno[0].value
                                                && vtas.Descripcion == centros.Centros_Operacion
                                                && vtas.mes == selectedMes[i].value
                                            ) {
                                                valorventa = valorventa + vtas.Vlr_Total;
                                            }

                                        });

                                    let vtados = {
                                        Descripcion: centros.Centros_Operacion,
                                        ano: selectedAno[0].value,
                                        VentaAcumulada: valorventa,
                                        ParticipacionAcum: valorventa / ventastotalanouno
                                    };
                                    newDetVtasAcumAnoDos.push(vtados);

                                });
                        }

                        /*
                                            if (i == 2) {
                                                centrosoperacion &&
                                                    centrosoperacion.map((centros, index) => {
                                                        let valorventa = 0;
                                                        let participacion = 0;
                                                        datosCostos.costosvtacentro &&
                                                            datosCostos.costosvtacentro.map((vtas, index) => {
                                                                if (vtas.ano == selectedAno[i].value
                                                                    && vtas.Descripcion == centros.Centros_Operacion) {
                                                                    valorventa = valorventa + vtas.Vlr_Total;
                                                                }
                                                            });
                                                        let vtatres = {
                                                            Descripcion: centros.Centros_Operacion,
                                                            ano: selectedAno[i].value,
                                                            VentaAcumulada: valorventa,
                                                            ParticipacionAcum: valorventa / ventastotalanouno
                                                        };
                                                        newDetVtasAcumAnoTres.push(vtatres);
                                                    });
                                            }
                        */
                        /*
                                             if (i == 3) {
                                                 centrosoperacion &&
                                                     centrosoperacion.map((centros, index) => {
                                                         let valorventa = 0;
                                                         let participacion = 0;
                                                         datosCostos.costosvtacentro &&
                                                             datosCostos.costosvtacentro.map((vtas, index) => {
                                                                 if (vtas.ano == selectedAno[i].value
                                                                     && vtas.Descripcion == centros.Centros_Operacion) {
                                                                     valorventa = valorventa + vtas.Vlr_Total;
                                                                 }
                                                             });
                                                         let vtacuatro = {
                                                             Descripcion: centros.Centros_Operacion,
                                                             ano: selectedAno[i].value,
                                                             VentaAcumulada: valorventa,
                                                             ParticipacionAcum: valorventa / ventastotalanouno
                                                         };
                                                         newDetVtasAcumAnoCuatro.push(vtacuatro);
                                                     });
                                             }
                                             */
                    }


                    let newDetVtasCompara = [];

                    if (longitud == 2) {
                        newDetVtasAcumAnoUno &&
                            newDetVtasAcumAnoUno.map((acumula, index) => {
                                newDetVtasAcumAnoDos &&
                                    newDetVtasAcumAnoDos.map((meses, index) => {
                                        let variacion = 0;
                                        variacion = ((1 - (acumula.VentaAcumulada / meses.VentaAcumulada)) * 100).toFixed(2);

                                        if (isNaN(variacion))
                                            variacion = 0;

                                        if (acumula.Descripcion == meses.Descripcion) {
                                            let vta = {
                                                Descripcion: acumula.Descripcion,
                                                Periodo: acumula.ano + " - " + meses.ano,
                                                Vlr_VentaAnoUno: acumula.VentaAcumulada,
                                                Vlr_VentaAnoDos: meses.VentaAcumulada,
                                                Variacion: variacion
                                            };
                                            newDetVtasCompara.push(vta);
                                        }
                                    });
                            });
                    }
                    setDatosVariacion(newDetVtasCompara);
                } else
                    if (opcion == 1) {

                        let ventastotalanouno = 0;
                        let ventastotalanodos = 0;
                        let ventastotalanotres = 0;
                        let ventastotalanocuatro = 0;

                        let newDetVtasAcumAnoUno = [];
                        let newDetVtasAcumAnoDos = [];
                        let newDetVtasAcumAnoTres = [];
                        let newDetVtasAcumAnoCuatro = [];
                        let longitud = selectedMes.length;

                        setLabelDos([]);
                        setLabelTres([]);

                        for (var i = 0; i < longitud; i++) {

                            datosCostos.costosvtasubcategoria &&
                                datosCostos.costosvtasubcategoria.map((vtas, index) => {

                                    if (i == 0)
                                        if (vtas.ano == selectedAno[0].value && vtas.mes == selectedMes[i].value) {
                                            ventastotalanouno = ventastotalanouno + vtas.Vlr_Total;
                                            setLabelUno("Periodo-" + selectedMes[i].label + "-" + selectedAno[i].label)
                                        }

                                    if (i == 1)
                                        if (vtas.ano == selectedAno[0].value && vtas.mes == selectedMes[i].value) {
                                            ventastotalanodos = ventastotalanodos + vtas.Vlr_Total;
                                            setLabelDos("Periodo-" + selectedMes[i].label + "-" + selectedAno[0].label)
                                        }
                                    /*
                                                                if (i == 2) {
                                                                    if (vtas.ano == selectedAno[i].value) {
                                                                        //ventastotalanotres = ventastotalanotres + vtas.Vlr_Total;
                                                                        setLabelTres([])
                                                                    }
                                                                }
                                    
                                                                if (i == 3)
                                                                    if (vtas.ano == selectedAno[i].value) {
                                                                        //ventastotalanocuatro = ventastotalanocuatro + vtas.Vlr_Total;
                                                                    }
                                                                    */
                                });
                        }

                        console.log("VENTAS : ", datosCostos.costosvtasubcategoria)
                        for (var i = 0; i < longitud; i++) {
                            console.log("VALOR I : ", i)
                            if (i == 0) {
                                subcategorias &&
                                    subcategorias.map((centros, index) => {
                                        let valorventa = 0;
                                        let participacion = 0;
                                        datosCostos.costosvtasubcategoria &&
                                            datosCostos.costosvtasubcategoria.map((vtas, index) => {

                                                if (vtas.ano == selectedAno[0].value
                                                    && vtas.Descripcion == centros.Subcategorias
                                                    && vtas.mes == selectedMes[i].value
                                                ) {
                                                    valorventa = valorventa + vtas.Vlr_Total;
                                                }
                                            });
                                        let vtauno = {
                                            Descripcion: centros.Subcategorias,
                                            ano: selectedAno[0].value,
                                            VentaAcumulada: valorventa,
                                            ParticipacionAcum: valorventa / ventastotalanouno
                                        };
                                        newDetVtasAcumAnoUno.push(vtauno);
                                    });
                            }

                            if (i == 1) {
                                subcategorias &&
                                    subcategorias.map((centros, index) => {
                                        let valorventa = 0;
                                        let participacion = 0;
                                        datosCostos.costosvtasubcategoria &&
                                            datosCostos.costosvtasubcategoria.map((vtas, index) => {

                                                if (vtas.ano == selectedAno[0].value
                                                    && vtas.Descripcion == centros.Subcategorias
                                                    && vtas.mes == selectedMes[i].value
                                                ) {
                                                    valorventa = valorventa + vtas.Vlr_Total;
                                                }

                                            });

                                        let vtados = {
                                            Descripcion: centros.Subcategorias,
                                            ano: selectedAno[0].value,
                                            VentaAcumulada: valorventa,
                                            ParticipacionAcum: valorventa / ventastotalanouno
                                        };
                                        newDetVtasAcumAnoDos.push(vtados);

                                    });
                            }

                            /*
                                                if (i == 2) {
                                                    centrosoperacion &&
                                                        centrosoperacion.map((centros, index) => {
                                                            let valorventa = 0;
                                                            let participacion = 0;
                                                            datosCostos.costosvtacentro &&
                                                                datosCostos.costosvtacentro.map((vtas, index) => {
                                                                    if (vtas.ano == selectedAno[i].value
                                                                        && vtas.Descripcion == centros.Centros_Operacion) {
                                                                        valorventa = valorventa + vtas.Vlr_Total;
                                                                    }
                                                                });
                                                            let vtatres = {
                                                                Descripcion: centros.Centros_Operacion,
                                                                ano: selectedAno[i].value,
                                                                VentaAcumulada: valorventa,
                                                                ParticipacionAcum: valorventa / ventastotalanouno
                                                            };
                                                            newDetVtasAcumAnoTres.push(vtatres);
                                                        });
                                                }
                            */
                            /*
                                                 if (i == 3) {
                                                     centrosoperacion &&
                                                         centrosoperacion.map((centros, index) => {
                                                             let valorventa = 0;
                                                             let participacion = 0;
                                                             datosCostos.costosvtacentro &&
                                                                 datosCostos.costosvtacentro.map((vtas, index) => {
                                                                     if (vtas.ano == selectedAno[i].value
                                                                         && vtas.Descripcion == centros.Centros_Operacion) {
                                                                         valorventa = valorventa + vtas.Vlr_Total;
                                                                     }
                                                                 });
                                                             let vtacuatro = {
                                                                 Descripcion: centros.Centros_Operacion,
                                                                 ano: selectedAno[i].value,
                                                                 VentaAcumulada: valorventa,
                                                                 ParticipacionAcum: valorventa / ventastotalanouno
                                                             };
                                                             newDetVtasAcumAnoCuatro.push(vtacuatro);
                                                         });
                                                 }
                                                 */
                        }


                        let newDetVtasCompara = [];

                        if (longitud == 2) {
                            newDetVtasAcumAnoUno &&
                                newDetVtasAcumAnoUno.map((acumula, index) => {
                                    newDetVtasAcumAnoDos &&
                                        newDetVtasAcumAnoDos.map((meses, index) => {
                                            let variacion = 0;
                                            variacion = ((1 - (acumula.VentaAcumulada / meses.VentaAcumulada)) * 100).toFixed(2);

                                            if (isNaN(variacion))
                                                variacion = 0;

                                            if (acumula.Descripcion == meses.Descripcion) {
                                                let vta = {
                                                    Descripcion: acumula.Descripcion,
                                                    Periodo: acumula.ano + " - " + meses.ano,
                                                    Vlr_VentaAnoUno: acumula.VentaAcumulada,
                                                    Vlr_VentaAnoDos: meses.VentaAcumulada,
                                                    Variacion: variacion
                                                };
                                                newDetVtasCompara.push(vta);
                                            }
                                        });
                                });
                        }
                        setDatosVariacion(newDetVtasCompara);
                    } else {
                        console.log("");
                    }
            }

        setConsultarAno(false);
    }

    useEffect(() => {
        let det;
        let newdat = [];
        setConsultar(true)
    }, [opcion]);

    return (
        <div className="mlanegativo">
            <h2 className="mx-auto mt-1 px-4 text-lg leading-6 font-medium text-gray-900 sm:px-6 lg:px-8">

                <div className="col-start-1 row-start-1 py-4">
                    <div className="mx-auto flex max-w-7xl justify-center px-4 sm:px-6 lg:px-8">
                        {/* justify-end */}

                        <div className="flex">
                            <Menu as="div" className="relative inline-block" >
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
                                <h3 className="mt-2 ml-4 text-sm font-medium text-gray-700 hover:text-gray-900">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <tbody className="bg-white">
                                            {
                                                filtroAno && filtroAno.map((row, comprasIdx) => (
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
                                <h3 className="mt-2 ml-4 text-sm font-medium text-gray-700 hover:text-gray-900">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <tbody className="bg-white">
                                            {
                                                filtroMes && filtroMes.map((row, comprasIdx) => (
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
                <div className="hidden sm:block ml-12">
                    <div className="border-b border-gray-200">
                        <nav className="ml-1 -mb-px flex space-x-8" aria-label="Tabs">
                            {tabsdos.map((tab, index) => (
                                <a
                                    key={tab.name}
                                    onClick={() => selCostoVentas(index)}
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
                        selectedAno.length > 0 ?
                            (
                                <div className="margenizaquierdanegativo px-4 sm:px-6 lg:px-8">
                                    <div className="mt-8 flex flex-col">
                                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                                    <table className="min-w-full divide-y divide-gray-300">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                                    {tituloTipo}
                                                                </th>
                                                                <th scope="col" className="px-2 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                    {labelUno}
                                                                </th>
                                                                <th scope="col" className="px-2 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                    {labelDos}
                                                                </th>
                                                                <th scope="col" className="px-2 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                    Variación %
                                                                </th>
                                                            </tr>
                                                        </thead>

                                                        <tbody className="bg-white">
                                                            {
                                                                datosVariacion && datosVariacion.map((compras, comprasIdx) => (
                                                                    <tr key={compras.nombre} className={comprasIdx % 2 === 0 ? undefined : 'bg-gray-50'}>
                                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                            {compras.Descripcion}
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                                                                            {
                                                                                myNumber(1, compras.Vlr_VentaAnoUno)
                                                                            }
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-2 py-4 text-right text-sm text-gray-500">
                                                                            $ {
                                                                                myNumber(1, compras.Vlr_VentaAnoDos)
                                                                            }
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-2 py-4 text-right text-sm text-gray-500">
                                                                            {
                                                                                myNumber(1, compras.Variacion)
                                                                            }
                                                                        </td>

                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            )
                            :
                            (
                                <div className="margenizaquierdanegativo px-4 sm:px-6 lg:px-8">
                                    <div className="mt-8 flex flex-col">
                                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">

                                                    <table className="min-w-full divide-y divide-gray-300">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                                    {tituloTipo}
                                                                </th>
                                                                <th scope="col" className="px-0 py-3.5 text-right text-sm font-semibold text-gray-900">

                                                                </th>
                                                                <th scope="col" className="px-2 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                    Ventas
                                                                </th>
                                                                <th scope="col" className="px-2 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                                    % Participación
                                                                </th>
                                                            </tr>

                                                        </thead>

                                                        <tbody className="bg-white">
                                                            {
                                                                datosVariacion && datosVariacion.map((compras, comprasIdx) => (

                                                                    <tr key={compras.nombre} className={comprasIdx % 2 === 0 ? undefined : 'bg-gray-50'}>
                                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                            {compras.Descripcion}
                                                                        </td>
                                                                        <td className="whitespace-nowrap py-4 text-right text-sm text-gray-500">
                                                                            $
                                                                        </td>

                                                                        <td className="whitespace-nowrap px-2 py-4 text-right text-sm text-gray-500">
                                                                            {
                                                                                myNumber(1, compras.VentaAcumulada)
                                                                            }
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                                                                            {
                                                                                (myNumber(1, compras.ParticipacionAcum) * 100).toFixed(2) + " % "
                                                                            }
                                                                        </td>

                                                                    </tr>

                                                                ))
                                                            }
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
            </h2 >
        </div >
    );
}
export default TabListasPrecios;