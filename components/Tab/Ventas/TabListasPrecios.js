import { Fragment, useState, useEffect } from "react";
import { myNumber, nameMonth } from "../../../utils/ArrayFunctions";
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, FunnelIcon, } from "@heroicons/react/solid";
import swal from 'sweetalert';
import { MultiSelect } from "react-multi-select-component";
import { Table, Tag, Typography } from 'antd';
import ReactHTMLTableToExcel from "react-html-table-to-excel";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function TabListasPrecios(props) {
    const { Title } = Typography;
    const { tipo, setTipo, datosCostos, ventasDiariasMes, listaPrecios, sublineas } = props;
    const [entMargenCentro, setEntMargenCentro] = useState(true);
    const [entMargenSubcategoria, setEntMargenSubcategoria] = useState(false);
    const [entMargenProveedor, setEntMargenProveedor] = useState(false);
    const [opcion, setOpcion] = useState(0);
    const [tituloTipo, setTituloTipo] = useState("LISTA DE PRECIO");
    const [tituloTipoDos, setTituloTipoDos] = useState("SUBLINEA");
    const [datosVariacion, setDatosVariacion] = useState([]);

    const [vtasAno, setVtasAno] = useState(ventasDiariasMes.anos_vtasdiarias);
    const [vtasMes, setVtasMes] = useState(ventasDiariasMes.meses_vtasdiarias);
    const [vtasDia, setVtasDia] = useState(ventasDiariasMes.dias_vtas);
    const [centrosoperacion, setCentrosoperacion] = useState(ventasDiariasMes.centrosoperacion);
    const [subcategorias, setSubcategorias] = useState(ventasDiariasMes.subcategorias);

    const [labelcostos, setLabelcostos] = useState([]);
    const [movimientos, setmovimientos] = useState(false);

    const [filtroAno, setFiltroAno] = useState([]);
    const [filtroMes, setFiltroMes] = useState([]);
    const [filtroDia, setFiltroDia] = useState([]);
    const [consultar, setConsultar] = useState(false);
    const [consultarAno, setConsultarAno] = useState(false);

    const [selectedAno, setSelectedAno] = useState([]);
    const [selectedMes, setSelectedMes] = useState([]);
    const [selectedDia, setSelectedDia] = useState([]);
    const [labelUno, setLabelUno] = useState("");
    const [labelDos, setLabelDos] = useState("");
    const [labelTres, setLabelTres] = useState("");

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
            setTituloTipo("LISTA DE PRECIO")
        }
        else
            if (seleccion == 1) {
                setTituloTipo("LISTA DE PRECIO");
                setEntMargenSubcategoria(true);
                setEntMargenCentro(false);
                setEntMargenProveedor(false);
            } else
                if (seleccion == 2) {
                    setTituloTipo("PLISTA DE PRECIO");
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
        setFiltroAno([]);
        setFiltroMes([]);
        setFiltroDia([]);
        setmovimientos([]);
    }

    useEffect(() => {
        setmovimientos([]);
        if (opcion == 1) {
            setTituloTipoDos("SUBLINEA")
        }
        else
            if (opcion == 2) {
                setTituloTipoDos("PROVEEDOR")
            } else
                if (opcion > 2) {
                    setTituloTipoDos("")
                }

    }, [opcion]);

    const generarConsulta = () => {
        if (selectedAno.length == 0) {
            swal({
                title: "Tablero Cosmos",
                text: "Debes seleccionar Años!",
                icon: "warning",
            });
            return
        }
        consolidar();
        //setConsultarAno(true)
    }

    const consolidar = () => {
        //let periodo = "" + filtroAno + filtroMes;
        if (selectedAno.length == 1 && selectedMes.length == 0) {
            if (opcion == 0) {

                let longitud = selectedAno.length;
                let newDet = [];

                if (longitud == 1) {
                    let vta = {
                        nombre: { tituloTipo },
                        nombre1: "Valor neto" + selectedAno[0].value,
                        nombre2: "Costo" + selectedAno[0].value,
                        variacion: "Margen"
                    };
                    setLabelUno(vta.nombre1);
                    setLabelDos(vta.nombre2);
                    setLabelTres(vta.variacion);
                    newDet.push(vta);
                } else
                    if (longitud == 2) {
                        let vta;
                        vta = {
                            nombre: { tituloTipo },
                            nombre1: "Valor neto" + selectedAno[0].value,
                            nombre2: "Costo" + selectedAno[1].value,
                            variacion: "Margen"
                        };
                        setLabelUno(vta.nombre1);
                        setLabelDos(vta.nombre2);
                        setLabelTres(vta.variacion);
                        newDet.push(vta);
                    } else {
                        swal({
                            title: "Tablero Cosmos",
                            text: "Seleccionar maximo dos años!",
                            icon: "warning",
                        });
                        return
                    }

                setLabelcostos(newDet);

                let newPreConsolida = [];

                listaPrecios.listasprecio && listaPrecios.listasprecio.map((prov) => {

                    let valorneto = 0;
                    let valornetodos = 0;
                    let costo = 0;
                    let costodos = 0;

                    listaPrecios.listaprecioconsolidada && listaPrecios.listaprecioconsolidada.map((items) => {
                        if (items.ano == selectedAno[0].value && prov.IdListaPrecio == items.Id_Lista_Precio) {
                            valorneto = valorneto + items.Vlr_Neto;
                            costo = costo + items.Vlr_Costo;
                        }

                        if (longitud == 2) {
                            if (items.ano == selectedAno[1].value && prov.IdListaPrecio == items.Id_Lista_Precio) {
                                valornetodos = valornetodos + items.Vlr_Neto;
                                costodos = costodos + items.Vlr_Costo;
                            }
                        }
                    })

                    let margen = 0;
                    margen = ((valorneto - costo) / valorneto);

                    if (isNaN(margen)) {
                        margen = 0;
                    }

                    let det = {
                        nombre: prov.NombreListaPrecio,
                        valorneto: valorneto,
                        costo: costo,
                        margen: margen
                    };
                    newPreConsolida.push(det)
                })

                let costo = 0;
                let margen = 0;
                let valorneto = 0;

                newPreConsolida &&
                    newPreConsolida.map((tot, index) => {
                        costo = parseInt(costo) + parseInt(tot.costo);
                        margen = parseInt(margen) + parseInt(tot.margen);
                        valorneto = parseInt(valorneto) + parseInt(tot.valorneto);
                    });

                let acum = {
                    nombre: "TOTAL",
                    valorneto: valorneto,
                    costo: costo,
                    margen: ((valorneto - costo) / valorneto)
                }

                newPreConsolida.push(acum);

                setmovimientos(newPreConsolida);
            } else
                if (opcion == 1) {

                    let longitud = selectedAno.length;
                    let newDet = [];

                    if (longitud == 1) {
                        let vta = {
                            nombre: { tituloTipo },
                            nombre1: "Valor neto" + selectedAno[0].value,
                            nombre2: "Costo" + selectedAno[0].value,
                            variacion: "Margen"
                        };
                        newDet.push(vta);
                    } else
                        if (longitud == 2) {
                            let vta;
                            vta = {
                                nombre: { tituloTipo },
                                nombre1: "Valor neto" + selectedAno[0].value,
                                nombre2: "Costo" + selectedAno[1].value,
                                variacion: "Margen"
                            };
                            newDet.push(vta);
                        } else {
                            swal({
                                title: "Tablero Cosmos",
                                text: "Seleccionar maximo dos años!",
                                icon: "warning",
                            });
                            return
                        }

                    setLabelcostos(newDet);

                    let newPreConsolida = [];

                    let contador = 0;

                    listaPrecios.listasprecio && listaPrecios.listasprecio.map((prov) => {
                        contador = 0;
                        sublineas && sublineas.map((sub) => {
                            let valorneto = 0;
                            let valornetodos = 0;
                            let costo = 0;
                            let costodos = 0;
                            contador = contador + 1;

                            listaPrecios.listapreciosublinea && listaPrecios.listapreciosublinea.map((items) => {
                                if (items.ano == selectedAno[0].value && prov.IdListaPrecio == items.Id_Lista_Precio &&
                                    sub.Sublinea == items.Subcategoria) {
                                    valorneto = valorneto + items.Vlr_Neto;
                                    costo = costo + items.Vlr_Costo;
                                }

                                if (longitud == 2) {
                                    if (items.ano == selectedAno[1].value && prov.IdListaPrecio == items.Id_Lista_Precio &&
                                        sub.Sublinea == items.Subcategoria) {
                                        valornetodos = valornetodos + items.Vlr_Neto;
                                        costodos = costodos + items.Vlr_Costo;
                                    }
                                }
                            })

                            let margen = 0;
                            let nombrelista = "";

                            margen = ((valorneto - costo) / valorneto) * 100;

                            if (isNaN(margen)) {
                                margen = 0;
                            }

                            if (contador == 1)
                                nombrelista = prov.NombreListaPrecio;
                            else
                                nombrelista = "";

                            let det = {
                                nombre: nombrelista,
                                sublinea: sub.Sublinea,
                                valorneto: valorneto,
                                costo: costo,
                                margen: margen
                            };
                            newPreConsolida.push(det)
                        })
                    })

                    let costo = 0;
                    let margen = 0;
                    let valorneto = 0;

                    newPreConsolida &&
                        newPreConsolida.map((tot, index) => {
                            costo = parseInt(costo) + parseInt(tot.costo);
                            margen = parseInt(margen) + parseInt(tot.margen);
                            valorneto = parseInt(valorneto) + parseInt(tot.valorneto);
                        });

                    let acum = {
                        nombre: "TOTAL",
                        valorneto: valorneto,
                        costo: costo,
                        margen: ((valorneto - costo) / valorneto)
                    }

                    newPreConsolida.push(acum);

                    setmovimientos(newPreConsolida);

                } else
                    if (opcion == 2) {

                        let longitud = selectedAno.length;
                        let newDet = [];

                        if (longitud == 1) {
                            let vta = {
                                nombre: { tituloTipo },
                                nombre1: "Valor neto" + selectedAno[0].value,
                                nombre2: "Costo" + selectedAno[0].value,
                                variacion: "Margen"
                            };
                            newDet.push(vta);
                        } else
                            if (longitud == 2) {
                                let vta;
                                vta = {
                                    nombre: { tituloTipo },
                                    nombre1: "Valor neto" + selectedAno[0].value,
                                    nombre2: "Costo" + selectedAno[1].value,
                                    variacion: "Margen"
                                };
                                newDet.push(vta);
                            } else {
                                swal({
                                    title: "Tablero Cosmos",
                                    text: "Seleccionar maximo dos años!",
                                    icon: "warning",
                                });
                                return
                            }

                        setLabelcostos(newDet);

                        let newPreConsolida = [];

                        let contador = 0;
                        //console.log("PROVEEDORES  : ", listaPrecios.proveedores)
                        //return

                        listaPrecios.listasprecio && listaPrecios.listasprecio.map((prov) => {
                            contador = 0;
                            listaPrecios.proveedores && listaPrecios.proveedores.map((sub) => {
                                let valorneto = 0;
                                let valornetodos = 0;
                                let costo = 0;
                                let costodos = 0;
                                contador = contador + 1;

                                listaPrecios.listaprecioproveedor && listaPrecios.listaprecioproveedor.map((items) => {
                                    if (items.ano == selectedAno[0].value && prov.IdListaPrecio == items.Id_Lista_Precio &&
                                        sub.Nit_Proveedor == items.Nit_Proveedor) {
                                        valorneto = valorneto + items.Vlr_Neto;
                                        costo = costo + items.Vlr_Costo;
                                    }

                                    if (longitud == 2) {
                                        if (items.ano == selectedAno[1].value && prov.IdListaPrecio == items.Id_Lista_Precio &&
                                            sub.Nit_Proveedor == items.Nit_Proveedor) {
                                            valornetodos = valornetodos + items.Vlr_Neto;
                                            costodos = costodos + items.Vlr_Costo;
                                        }
                                    }
                                })

                                let margen = 0;
                                let nombrelista = "";

                                if (valorneto > 0) {
                                    margen = ((valorneto - costo) / valorneto) * 100;

                                    if (isNaN(margen)) {
                                        margen = 0;
                                    }

                                    if (contador == 1)
                                        nombrelista = prov.NombreListaPrecio;
                                    else
                                        nombrelista = "";

                                    let det = {
                                        nombre: nombrelista,
                                        sublinea: sub.NombreProveedor,
                                        valorneto: valorneto,
                                        costo: costo,
                                        margen: margen
                                    };
                                    newPreConsolida.push(det)
                                }
                            })
                        })

                        let costo = 0;
                        let margen = 0;
                        let valorneto = 0;

                        newPreConsolida &&
                            newPreConsolida.map((tot, index) => {
                                costo = parseInt(costo) + parseInt(tot.costo);
                                margen = parseInt(margen) + parseInt(tot.margen);
                                valorneto = parseInt(valorneto) + parseInt(tot.valorneto);
                            });

                        let acum = {
                            nombre: "TOTAL",
                            valorneto: valorneto,
                            costo: costo,
                            margen: ((valorneto - costo) / valorneto)
                        }

                        newPreConsolida.push(acum);

                        setmovimientos(newPreConsolida);

                    }
        } else
            if (selectedAno.length == 1 && selectedMes.length == 1) {

                let longitud = selectedAno.length;
                let newDet = [];

                let nommesuno = "";
                let nommesdos = "";

                if (selectedMes[0].value < 10) {
                    let mes = "0" + selectedMes[0].value;
                    nommesuno = nameMonth(mes);
                } else {
                    let mes = "" + selectedMes[0].value;
                    nommesuno = nameMonth(mes);
                }

                if (selectedMes[0].value < 10) {
                    let mes = "0" + selectedMes[0].value;
                    nommesdos = nameMonth(mes);
                } else {
                    let mes = "" + selectedMes[0].value;
                    nommesdos = nameMonth(mes);
                }

                if (longitud == 1) {
                    let vta = {
                        nombre: { tituloTipo },
                        nombre1: "Valor neto" + nommesuno + selectedAno[0].value,
                        nombre2: "Costo" + nommesuno + selectedAno[0].value,
                        variacion: "Margen"
                    };
                    newDet.push(vta);
                } else
                    if (longitud == 2) {
                        let vta;
                        vta = {
                            nombre: { tituloTipo },
                            nombre1: "Valor neto" + nommesuno + selectedAno[0].value,
                            nombre2: "Costo" + nommesuno + selectedAno[1].value,
                            variacion: "Margen"
                        };
                        newDet.push(vta);
                    } else {
                        swal({
                            title: "Tablero Cosmos",
                            text: "Seleccionar maximo dos años!",
                            icon: "warning",
                        });
                        return
                    }

                setLabelcostos(newDet);

                if (opcion == 0) {

                    let newPreConsolida = [];

                    listaPrecios.listasprecio && listaPrecios.listasprecio.map((prov) => {

                        let valorneto = 0;
                        let valornetodos = 0;
                        let costo = 0;
                        let costodos = 0;

                        listaPrecios.listaprecioconsolidada && listaPrecios.listaprecioconsolidada.map((items) => {
                            if (items.ano == selectedAno[0].value && prov.IdListaPrecio == items.Id_Lista_Precio &&
                                items.mes == selectedMes[0].value
                            ) {
                                valorneto = valorneto + items.Vlr_Neto;
                                costo = costo + items.Vlr_Costo;
                            }

                            if (longitud == 2) {
                                if (items.ano == selectedAno[1].value && prov.IdListaPrecio == items.Id_Lista_Precio &&
                                    items.mes == selectedMes[1].value) {
                                    valornetodos = valornetodos + items.Vlr_Neto;
                                    costodos = costodos + items.Vlr_Costo;
                                }
                            }
                        })

                        let margen = 0;
                        margen = ((valorneto - costo) / valorneto) * 100;

                        if (isNaN(margen)) {
                            margen = 0;
                        }

                        let det = {
                            nombre: prov.NombreListaPrecio,
                            valorneto: (valorneto).toFixed(0),
                            costo: (costo).toFixed(0),
                            margen: (margen).toFixed(2)
                        };
                        newPreConsolida.push(det)
                    })

                    let costo = 0;
                    let margen = 0;
                    let valorneto = 0;

                    newPreConsolida &&
                        newPreConsolida.map((tot, index) => {
                            costo = parseInt(costo) + parseInt(tot.costo);
                            margen = parseInt(margen) + parseInt(tot.margen);
                            valorneto = parseInt(valorneto) + parseInt(tot.valorneto);
                        });

                    let acum = {
                        nombre: "TOTAL",
                        valorneto: valorneto,
                        costo: costo,
                        margen: ((valorneto - costo) / valorneto)
                    }

                    newPreConsolida.push(acum);

                    setmovimientos(newPreConsolida);
                } else
                    if (opcion == 1) {

                        let newPreConsolida = [];

                        let contador = 0;

                        listaPrecios.listasprecio && listaPrecios.listasprecio.map((prov) => {
                            contador = 0;
                            sublineas && sublineas.map((sub) => {
                                let valorneto = 0;
                                let valornetodos = 0;
                                let costo = 0;
                                let costodos = 0;
                                contador = contador + 1;

                                listaPrecios.listapreciosublinea && listaPrecios.listapreciosublinea.map((items) => {
                                    if (items.ano == selectedAno[0].value && prov.IdListaPrecio == items.Id_Lista_Precio &&
                                        sub.Sublinea == items.Subcategoria && items.mes == selectedMes[0].value) {
                                        valorneto = valorneto + items.Vlr_Neto;
                                        costo = costo + items.Vlr_Costo;
                                    }

                                    if (longitud == 2) {
                                        if (items.ano == selectedAno[1].value && prov.IdListaPrecio == items.Id_Lista_Precio &&
                                            sub.Sublinea == items.Subcategoria && items.mes == selectedMes[0].value) {
                                            valornetodos = valornetodos + items.Vlr_Neto;
                                            costodos = costodos + items.Vlr_Costo;
                                        }
                                    }
                                })

                                let margen = 0;
                                let nombrelista = "";

                                margen = ((valorneto - costo) / valorneto) * 100;

                                if (isNaN(margen)) {
                                    margen = 0;
                                }

                                if (contador == 1)
                                    nombrelista = prov.NombreListaPrecio;
                                else
                                    nombrelista = "";

                                let det = {
                                    nombre: nombrelista,
                                    sublinea: sub.Sublinea,
                                    valorneto: valorneto,
                                    costo: costo,
                                    margen: margen
                                };
                                newPreConsolida.push(det)
                            })
                        })

                        let costo = 0;
                        let margen = 0;
                        let valorneto = 0;

                        newPreConsolida &&
                            newPreConsolida.map((tot, index) => {
                                costo = parseInt(costo) + parseInt(tot.costo);
                                margen = parseInt(margen) + parseInt(tot.margen);
                                valorneto = parseInt(valorneto) + parseInt(tot.valorneto);
                            });

                        let acum = {
                            nombre: "TOTAL",
                            valorneto: valorneto,
                            costo: costo,
                            margen: ((valorneto - costo) / valorneto)
                        }

                        newPreConsolida.push(acum);

                        setmovimientos(newPreConsolida);

                    } else
                        if (opcion == 2) {

                            let newPreConsolida = [];

                            let contador = 0;
                            //console.log("PROVEEDORES  : ", listaPrecios.proveedores)
                            //return

                            listaPrecios.listasprecio && listaPrecios.listasprecio.map((prov) => {
                                contador = 0;
                                listaPrecios.proveedores && listaPrecios.proveedores.map((sub) => {
                                    let valorneto = 0;
                                    let valornetodos = 0;
                                    let costo = 0;
                                    let costodos = 0;
                                    contador = contador + 1;

                                    listaPrecios.listaprecioproveedor && listaPrecios.listaprecioproveedor.map((items) => {
                                        if (items.ano == selectedAno[0].value && prov.IdListaPrecio == items.Id_Lista_Precio &&
                                            sub.Nit_Proveedor == items.Nit_Proveedor && items.mes == selectedMes[0].value) {
                                            valorneto = valorneto + items.Vlr_Neto;
                                            costo = costo + items.Vlr_Costo;
                                        }

                                        if (longitud == 2) {
                                            if (items.ano == selectedAno[1].value && prov.IdListaPrecio == items.Id_Lista_Precio &&
                                                sub.Nit_Proveedor == items.Nit_Proveedor && items.mes == selectedMes[0].value) {
                                                valornetodos = valornetodos + items.Vlr_Neto;
                                                costodos = costodos + items.Vlr_Costo;
                                            }
                                        }
                                    })

                                    let margen = 0;
                                    let nombrelista = "";

                                    if (valorneto > 0) {
                                        margen = ((valorneto - costo) / valorneto) * 100;

                                        if (isNaN(margen)) {
                                            margen = 0;
                                        }

                                        if (contador == 1)
                                            nombrelista = prov.NombreListaPrecio;
                                        else
                                            nombrelista = "";

                                        let det = {
                                            nombre: nombrelista,
                                            sublinea: sub.NombreProveedor,
                                            valorneto: valorneto,
                                            costo: costo,
                                            margen: margen
                                        };
                                        newPreConsolida.push(det)
                                    }
                                })
                            })

                            let costo = 0;
                            let margen = 0;
                            let valorneto = 0;

                            newPreConsolida &&
                                newPreConsolida.map((tot, index) => {
                                    costo = parseInt(costo) + parseInt(tot.costo);
                                    margen = parseInt(margen) + parseInt(tot.margen);
                                    valorneto = parseInt(valorneto) + parseInt(tot.valorneto);
                                });

                            let acum = {
                                nombre: "TOTAL",
                                valorneto: valorneto,
                                costo: costo,
                                margen: ((valorneto - costo) / valorneto)
                            }

                            newPreConsolida.push(acum);

                            setmovimientos(newPreConsolida);

                        }

            }

        setConsultarAno(false);
    }

    const header_test = [
        { title: tituloTipo, dataIndex: "nombre", key: "nombre", width: 80, fixed: true },
        {
            title: labelUno, dataIndex: "labeluno", key: "labeluno", width: 100, align: "right",
            sorter: (a, b) => a.valorneto - b.valorneto,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {isNaN(row.valorneto) ?
                            0
                            :
                            myNumber(1, row.valorneto)
                        }
                    </Title>
                );
            }
        },
        {
            title: labelDos, dataIndex: "labelDos", key: "labelDos", width: 100, align: "right",
            sorter: (a, b) => a.costo - b.costo,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {isNaN(row.costo) ?
                            0
                            :
                            myNumber(1, row.costo)
                        }
                    </Title>
                );
            }
        },
        {
            title: labelTres, dataIndex: "labelTres", key: "labelTres", width: 100, align: "right",
            sorter: (a, b) => a.margen - b.margen,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, (row.margen) * 100, 2)}%
                    </Title>
                );
            }
        }
    ]

    const header_testotr = [
        { title: tituloTipo, dataIndex: "nombre", key: "nombre", width: 80, fixed: true },
        { title: tituloTipoDos, dataIndex: "sublinea", key: "sublinea", width: 80, fixed: true },
        {
            title: labelUno, dataIndex: "labeluno", key: "labeluno", width: 100, align: "right",
            sorter: (a, b) => a.valorneto - b.valorneto,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {isNaN(row.valorneto) ?
                            0
                            :
                            myNumber(1, row.valorneto)
                        }
                    </Title>
                );
            }
        },
        {
            title: labelDos, dataIndex: "labelDos", key: "labelDos", width: 100, align: "right",
            sorter: (a, b) => a.costo - b.costo,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {isNaN(row.costo) ?
                            0
                            :
                            myNumber(1, row.costo)
                        }
                    </Title>
                );
            }
        },
        {
            title: labelTres, dataIndex: "labelTres", key: "labelTres", width: 100, align: "right",
            sorter: (a, b) => a.margen - b.margen,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, (row.margen) * 100, 2)}%
                    </Title>
                );
            }
        }
    ]


    return (
        <div className="mlanegativo">
            <h2 className="mx-auto mt-1 px-4 text-lg leading-6 font-medium text-gray-900 sm:px-6 lg:px-8">

                <div className="ml-80 col-start-1 row-start-1 py-4">
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
                                    className="absolute right-40 z-8 text-sm font-medium text-gray-900 dark:text-gray-300"
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
                                    className="absolute right-1 z-10  text-sm font-medium text-gray-900 dark:text-gray-300"
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

                                <div className="ml-4 mx-auto flex max-w-4xl h-10 space-x-6 divide-x bg-violet rounded divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
                                    <button
                                        onClick={() => generarConsulta()}
                                    >
                                        Consultar
                                    </button>
                                </div>
                                <div className="ml-5 mx-auto flex max-w-4xl h-10 space-x-6 divide-x bg-green rounded divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
                                    <button>
                                        <ReactHTMLTableToExcel
                                            table="precioslinea"
                                            filename="Preciosxlinea"
                                            sheet="Sheet"
                                            buttonText="Exportar a Excel"
                                        />
                                    </button>
                                </div>
                                <div className="ml-5 mx-auto flex max-w-4xl h-10 space-x-6 divide-x bg-cosmocolor rounded divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
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
                        opcion == 0 ?
                            (
                                <div className="margenizaquierdanegativo px-4 sm:px-6 lg:px-8">
                                    <div className="mt-4 flex flex-col">
                                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                                    <Table columns={header_test} dataSource={movimientos} pagination={false}
                                                        scroll={{
                                                            x: 1200,
                                                            y: 500,
                                                        }}
                                                        bordered />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                            :
                            opcion > 0 ?
                                (
                                    <div className="margenizaquierdanegativo px-4 sm:px-6 lg:px-8">
                                        <div className="mt-4 flex flex-col">
                                            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                                        <Table columns={header_testotr} dataSource={movimientos} pagination={false}
                                                            scroll={{
                                                                x: 1200,
                                                                y: 500,
                                                            }}
                                                            bordered />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                                :
                                null
                    }
                </div>
            </h2 >
        </div >
    );
}
export default TabListasPrecios;