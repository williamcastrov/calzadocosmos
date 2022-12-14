import { Fragment, useState, useEffect } from "react";
import { myNumber, nameMonth } from "../../../utils/ArrayFunctions";
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, FunnelIcon, } from "@heroicons/react/solid";
import { Table, Tag, Typography } from 'antd';
import swal from 'sweetalert';

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function TabParticipacion(props) {
    const { Title } = Typography;
    const { tipo, setTipo, datosCostos, ventasDiariasMes, } = props;
    const [entMargenCentro, setEntMargenCentro] = useState(true);
    const [entMargenSubcategoria, setEntMargenSubcategoria] = useState(false);
    const [entMargenProveedor, setEntMargenProveedor] = useState(false);
    const [opcion, setOpcion] = useState(0);
    const [tituloTipo, setTituloTipo] = useState("CENTROS_DE_OPERACIÓN");
    const [detalleCostos, setDetalleCostos] = useState([]);

    const [vtasAno, setVtasAno] = useState(ventasDiariasMes.anos_vtasdiarias);
    const [vtasMes, setVtasMes] = useState(ventasDiariasMes.meses_vtasdiarias);
    const [vtasDia, setVtasDia] = useState(ventasDiariasMes.dias_vtas);
    const [centrosoperacion, setCentrosoperacion] = useState(ventasDiariasMes.centrosoperacion);
    const [subcategorias, setSubcategorias] = useState(ventasDiariasMes.subcategorias);
    const [proveedores, setProveedores] = useState(ventasDiariasMes.proveedores);

    const [filtroAno, setFiltroAno] = useState(null);
    const [filtroMes, setFiltroMes] = useState(null);
    const [filtroDia, setFiltroDia] = useState(null);
    const [consultar, setConsultar] = useState(false);

    const tabsdos = [
        { name: 'Participación x Centro', href: '#', current: entMargenCentro },
        { name: 'Participación x Sublínea', href: '#', current: entMargenSubcategoria },
        { name: 'Participación x Proveedor', href: '#', current: entMargenProveedor },
    ]
    //costosvtacentro

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

    const reiniciar = () => {
        setDetalleCostos([]);
    }

    const selCostoVentas = (seleccion) => {
        setOpcion(seleccion)
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
                    setDetalleCostos("");
                }
    }

    const limpiarFiltros = () => {
        setFiltroAno(null);
        setFiltroMes(null);
        setFiltroDia(null);
        setDetalleCostos([]);
    }

    const generarConsulta = () => {
        if (!filtroAno) {
            swal({
                title: "Tablero Cosmos",
                text: "Primero debes seleccionar el año!",
                icon: "warning",
            });
            return
        }
        setConsultar(true)
    }

    useEffect(() => {
        let periodo = "" + filtroAno + filtroMes;

        if (filtroAno && filtroMes) {

            if (opcion == 0) {
                let ventastotal = 0;
                let ventastotalmes = 0;

                datosCostos.costosvtacentro &&
                    datosCostos.costosvtacentro.map((vtas, index) => {
                        if (vtas.ano == filtroAno && vtas.mes <= filtroMes) {
                            ventastotal = ventastotal + vtas.Vlr_Total
                        }
                    });

                datosCostos.costosvtacentro &&
                    datosCostos.costosvtacentro.map((vtas, index) => {
                        if (vtas.ano == filtroAno && vtas.mes == filtroMes) {
                            ventastotalmes = ventastotalmes + vtas.Vlr_Total
                        }
                    });

                let newDetVtas = [];

                datosCostos.costosvtacentro &&
                    datosCostos.costosvtacentro.map((vtas, index) => {

                        if (vtas.Periodo == periodo) {
                            let vta = {
                                Descripcion: vtas.Descripcion,
                                Periodo: vtas.Periodo,
                                Vlr_Venta: vtas.Vlr_Total,
                                participacion: (vtas.Vlr_Total / ventastotalmes) * 100
                            };
                            newDetVtas.push(vta);
                        }
                    });

                let newDetVtasAcum = [];

                centrosoperacion &&
                    centrosoperacion.map((centros, index) => {
                        let valorventa = 0;
                        let participacion = 0;
                        datosCostos.costosvtacentro &&
                            datosCostos.costosvtacentro.map((vtas, index) => {
                                if (vtas.ano == filtroAno && vtas.mes <= filtroMes
                                    && vtas.Descripcion == centros.Centros_Operacion) {
                                    valorventa = valorventa + vtas.Vlr_Total;
                                }
                            });
                        let vta = {
                            Descripcion: centros.Centros_Operacion,
                            Periodo: periodo,
                            VentaAcumulada: valorventa,
                            ParticipacionAcum: (valorventa / ventastotal) * 100
                        };
                        newDetVtasAcum.push(vta);
                    });

                let newDetVtasTot = [];
                newDetVtasAcum &&
                    newDetVtasAcum.map((acumula, index) => {
                        newDetVtas &&
                            newDetVtas.map((meses, index) => {
                                if (acumula.Descripcion == meses.Descripcion) {
                                    let vta = {
                                        Descripcion: acumula.Descripcion,
                                        Periodo: periodo,
                                        Vlr_Venta: meses.Vlr_Venta,
                                        participacion: meses.participacion,
                                        VentaAcumulada: acumula.VentaAcumulada,
                                        ParticipacionAcum: acumula.ParticipacionAcum
                                    };
                                    newDetVtasTot.push(vta);
                                }
                            });
                    });

                let partmes = 0;
                let ventames = 0;
                let part = 0;
                let venta = 0;

                newDetVtasTot &&
                    newDetVtasTot.map((mes, index) => {
                        partmes = partmes + mes.participacion;
                        ventames = ventames + mes.Vlr_Venta;
                        part = part + mes.ParticipacionAcum;
                        venta = venta + mes.VentaAcumulada;
                    });

                let mvto = {
                    Descripcion: "TOTAL",
                    Periodo: periodo,
                    Vlr_Venta: ventames,
                    participacion: partmes,
                    VentaAcumulada: venta,
                    ParticipacionAcum: part
                };
                newDetVtasTot.push(mvto);
                //console.log("VENTAS TOTAL : ", newDetVtasTot)

                setDetalleCostos(newDetVtasTot);
            } else
                if (opcion == 1) {
                    let ventastotal = 0;
                    let ventastotalmes = 0;

                    datosCostos.costosvtasubcategoria &&
                        datosCostos.costosvtasubcategoria.map((vtas, index) => {
                            if (vtas.ano == filtroAno && vtas.mes <= filtroMes) {
                                ventastotal = ventastotal + vtas.Vlr_Total
                            }
                        });

                    datosCostos.costosvtasubcategoria &&
                        datosCostos.costosvtasubcategoria.map((vtas, index) => {
                            if (vtas.ano == filtroAno && vtas.mes == filtroMes) {
                                ventastotalmes = ventastotalmes + vtas.Vlr_Total
                            }
                        });

                    let newDetVtas = [];

                    datosCostos.costosvtasubcategoria &&
                        datosCostos.costosvtasubcategoria.map((vtas, index) => {

                            if (vtas.Periodo == periodo) {
                                let vta = {
                                    Descripcion: vtas.Descripcion,
                                    Periodo: vtas.Periodo,
                                    Vlr_Venta: vtas.Vlr_Total,
                                    participacion: (vtas.Vlr_Total / ventastotalmes) * 100
                                };
                                newDetVtas.push(vta);
                            }
                        });

                    let newDetVtasAcum = [];

                    subcategorias &&
                        subcategorias.map((centros, index) => {
                            let valorventa = 0;
                            let participacion = 0;
                            datosCostos.costosvtasubcategoria &&
                                datosCostos.costosvtasubcategoria.map((vtas, index) => {
                                    if (vtas.ano == filtroAno && vtas.mes <= filtroMes
                                        && vtas.Descripcion == centros.Subcategorias) {
                                        valorventa = valorventa + vtas.Vlr_Total;
                                    }
                                });
                            let vta = {
                                Descripcion: centros.Subcategorias,
                                Periodo: periodo,
                                VentaAcumulada: valorventa,
                                ParticipacionAcum: (valorventa / ventastotal) * 100
                            };
                            newDetVtasAcum.push(vta);
                        });

                    let newDetVtasTot = [];
                    newDetVtasAcum &&
                        newDetVtasAcum.map((acumula, index) => {
                            newDetVtas &&
                                newDetVtas.map((meses, index) => {
                                    if (acumula.Descripcion == meses.Descripcion) {
                                        let vta = {
                                            Descripcion: acumula.Descripcion,
                                            Periodo: periodo,
                                            Vlr_Venta: meses.Vlr_Venta,
                                            participacion: meses.participacion,
                                            VentaAcumulada: acumula.VentaAcumulada,
                                            ParticipacionAcum: acumula.ParticipacionAcum
                                        };
                                        newDetVtasTot.push(vta);
                                    }
                                });
                        });

                    let partmes = 0;
                    let ventames = 0;
                    let part = 0;
                    let venta = 0;

                    newDetVtasTot &&
                        newDetVtasTot.map((mes, index) => {
                            partmes = partmes + mes.participacion;
                            ventames = ventames + mes.Vlr_Venta;
                            part = part + mes.ParticipacionAcum;
                            venta = venta + mes.VentaAcumulada;
                        });

                    let mvto = {
                        Descripcion: "TOTAL",
                        Periodo: periodo,
                        Vlr_Venta: ventames,
                        participacion: partmes,
                        VentaAcumulada: venta,
                        ParticipacionAcum: part
                    };
                    newDetVtasTot.push(mvto);
                    //console.log("VENTAS TOTAL : ", newDetVtasTot)
                    setDetalleCostos(newDetVtasTot);

                } else
                    if (opcion == 2) {

                        let ventastotal = 0;
                        let ventastotalmes = 0;

                        datosCostos.costosproveedor &&
                            datosCostos.costosproveedor.map((vtas, index) => {
                                if (vtas.ano == filtroAno && vtas.mes <= filtroMes) {
                                    ventastotal = ventastotal + vtas.Vlr_Total
                                }
                            });

                        datosCostos.costosproveedor &&
                            datosCostos.costosproveedor.map((vtas, index) => {
                                if (vtas.ano == filtroAno && vtas.mes == filtroMes) {
                                    ventastotalmes = ventastotalmes + vtas.Vlr_Total
                                }
                            });

                        let newDetVtas = [];

                        datosCostos.costosproveedor &&
                            datosCostos.costosproveedor.map((vtas, index) => {

                                if (vtas.Periodo == periodo) {
                                    let vta = {
                                        Descripcion: vtas.Descripcion,
                                        Periodo: vtas.Periodo,
                                        Vlr_Venta: vtas.Vlr_Total,
                                        participacion: (vtas.Vlr_Total / ventastotalmes) * 100
                                    };
                                    newDetVtas.push(vta);
                                }
                            });

                        let newDetVtasAcum = [];

                        proveedores &&
                            proveedores.map((prov, index) => {
                                let valorventa = 0;
                                let participacion = 0;
                                datosCostos.costosproveedor &&
                                    datosCostos.costosproveedor.map((vtas, index) => {
                                        if (vtas.ano == filtroAno && vtas.mes <= filtroMes
                                            && vtas.Descripcion == prov.Nombre_Proveedor) {
                                            valorventa = valorventa + vtas.Vlr_Total;
                                        }
                                    });
                                let vta = {
                                    Descripcion: prov.Nombre_Proveedor,
                                    Periodo: periodo,
                                    VentaAcumulada: valorventa,
                                    ParticipacionAcum: (valorventa / ventastotal) * 100
                                };
                                newDetVtasAcum.push(vta);
                            });


                        let newDetVtasTot = [];
                        newDetVtasAcum &&
                            newDetVtasAcum.map((acumula, index) => {
                                newDetVtas &&
                                    newDetVtas.map((meses, index) => {
                                        if (acumula.Descripcion == meses.Descripcion) {
                                            let vta = {
                                                Descripcion: acumula.Descripcion,
                                                Periodo: periodo,
                                                Vlr_Venta: meses.Vlr_Venta,
                                                participacion: meses.participacion,
                                                VentaAcumulada: acumula.VentaAcumulada,
                                                ParticipacionAcum: acumula.ParticipacionAcum
                                            };
                                            newDetVtasTot.push(vta);
                                        }
                                    });
                            });

                        let partmes = 0;
                        let ventames = 0;
                        let part = 0;
                        let venta = 0;

                        newDetVtasTot &&
                            newDetVtasTot.map((mes, index) => {
                                partmes = partmes + mes.participacion;
                                ventames = ventames + mes.Vlr_Venta;
                                part = part + mes.ParticipacionAcum;
                                venta = venta + mes.VentaAcumulada;
                            });

                        let mvto = {
                            Descripcion: "TOTAL",
                            Periodo: periodo,
                            Vlr_Venta: ventames,
                            participacion: partmes,
                            VentaAcumulada: venta,
                            ParticipacionAcum: part
                        };
                        newDetVtasTot.push(mvto);

                        setDetalleCostos(newDetVtasTot);

                    }
        } else {
            if (filtroAno) {

                if (opcion == 0) {
                    let ventastotal = 0;

                    datosCostos.costosvtacentro &&
                        datosCostos.costosvtacentro.map((vtas, index) => {
                            if (vtas.ano == filtroAno) {
                                ventastotal = ventastotal + vtas.Vlr_Total
                            }
                        });

                    let newDetVtasAcum = [];

                    centrosoperacion &&
                        centrosoperacion.map((centros, index) => {
                            let valorventa = 0;
                            let participacion = 0;
                            datosCostos.costosvtacentro &&
                                datosCostos.costosvtacentro.map((vtas, index) => {
                                    if (vtas.ano == filtroAno && vtas.Descripcion == centros.Centros_Operacion) {
                                        valorventa = valorventa + vtas.Vlr_Total;
                                    }
                                });
                            let vta = {
                                Descripcion: centros.Centros_Operacion,
                                Periodo: periodo,
                                VentaAcumulada: valorventa,
                                ParticipacionAcum: (valorventa / ventastotal)
                            };
                            newDetVtasAcum.push(vta);
                        });

                    let part = 0;
                    let venta = 0;

                    newDetVtasAcum &&
                        newDetVtasAcum.map((mes, index) => {
                            part = part + mes.ParticipacionAcum;
                            venta = venta + mes.VentaAcumulada;
                        });

                    let mvto = {
                        Descripcion: "TOTAL",
                        Periodo: periodo,
                        VentaAcumulada: venta,
                        ParticipacionAcum: part
                    };
                    newDetVtasAcum.push(mvto);
                    //console.log("VENTAS TOTAL : ", newDetVtasAcum)
                    setDetalleCostos(newDetVtasAcum);
                } else
                    if (opcion == 1) {
                        let ventastotal = 0;

                        datosCostos.costosvtasubcategoria &&
                            datosCostos.costosvtasubcategoria.map((vtas, index) => {
                                if (vtas.ano == filtroAno) {
                                    ventastotal = ventastotal + vtas.Vlr_Total
                                }
                            });

                        let newDetVtasAcum = [];

                        subcategorias &&
                            subcategorias.map((centros, index) => {
                                let valorventa = 0;
                                let participacion = 0;
                                datosCostos.costosvtasubcategoria &&
                                    datosCostos.costosvtasubcategoria.map((vtas, index) => {
                                        if (vtas.ano == filtroAno && vtas.Descripcion == centros.Subcategorias) {
                                            valorventa = valorventa + vtas.Vlr_Total;
                                        }
                                    });
                                let vta = {
                                    Descripcion: centros.Subcategorias,
                                    Periodo: periodo,
                                    VentaAcumulada: valorventa,
                                    ParticipacionAcum: (valorventa / ventastotal)
                                };
                                newDetVtasAcum.push(vta);
                            });


                        let part = 0;
                        let venta = 0;

                        newDetVtasAcum &&
                            newDetVtasAcum.map((mes, index) => {
                                part = part + mes.ParticipacionAcum;
                                venta = venta + mes.VentaAcumulada;
                            });

                        let mvto = {
                            Descripcion: "TOTAL",
                            Periodo: periodo,
                            VentaAcumulada: venta,
                            ParticipacionAcum: part
                        };
                        newDetVtasAcum.push(mvto);

                        //console.log("VENTAS TOTAL : ", newDetVtasTot)
                        setDetalleCostos(newDetVtasAcum);

                    } else
                        if (opcion == 2) {
                            let ventastotal = 0;

                            datosCostos.costosproveedor &&
                                datosCostos.costosproveedor.map((vtas, index) => {
                                    if (vtas.ano == filtroAno) {
                                        ventastotal = ventastotal + vtas.Vlr_Total
                                    }
                                });

                            let newDetVtasAcum = [];

                            proveedores &&
                                proveedores.map((prov, index) => {
                                    let valorventa = 0;
                                    let participacion = 0;
                                    datosCostos.costosproveedor &&
                                        datosCostos.costosproveedor.map((vtas, index) => {
                                            if (vtas.ano == filtroAno && vtas.Descripcion == prov.Nombre_Proveedor) {
                                                valorventa = valorventa + vtas.Vlr_Total;
                                            }
                                        });
                                    let vta = {
                                        Descripcion: prov.Nombre_Proveedor,
                                        Periodo: periodo,
                                        VentaAcumulada: valorventa,
                                        ParticipacionAcum: (valorventa / ventastotal)
                                    };
                                    newDetVtasAcum.push(vta);
                                });


                            let part = 0;
                            let venta = 0;

                            newDetVtasAcum &&
                                newDetVtasAcum.map((mes, index) => {
                                    part = part + mes.ParticipacionAcum;
                                    venta = venta + mes.VentaAcumulada;
                                });

                            let mvto = {
                                Descripcion: "TOTAL",
                                Periodo: periodo,
                                VentaAcumulada: venta,
                                ParticipacionAcum: part
                            };
                            newDetVtasAcum.push(mvto);

                            //console.log("VENTAS TOTAL : ", newDetVtasTot)
                            setDetalleCostos(newDetVtasAcum);

                        }
            }
        }
        setConsultar(false);
    }, [consultar]);

    useEffect(() => {
        let det;
        let newdat = [];
        setConsultar(true)
    }, [opcion]);

    const header_test = [
        { title: tituloTipo, dataIndex: "Descripcion", key: "Descripcion", width: 80, fixed: true },
        {
            title: "VENTAS", dataIndex: "VentaAcumulada", key: "VentaAcumulada", width: 150, align: "right",
            sorter: (a, b) => a.VentaAcumulada - b.VentaAcumulada,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.VentaAcumulada, 2)}
                    </Title>
                );
            }
        },
        {
            title: "% PARTICIPACIÓN", dataIndex: "ParticipacionAcum", key: "ParticipacionAcum", width: 150, align: "right",
            sorter: (a, b) => a.ParticipacionAcum - b.ParticipacionAcum,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {(myNumber(1, row.ParticipacionAcum, 2) * 100).toFixed(2)}%
                    </Title>
                );
            }
        }
    ]

    const header_testmes = [
        { title: tituloTipo, dataIndex: "Descripcion", key: "Descripcion", width: 200, fixed: true },
        {
            title: "VENTAS MES", dataIndex: "Vlr_Venta", key: "Vlr_Venta", width: 150, align: "right",
            sorter: (a, b) => a.Vlr_Venta - b.Vlr_Venta,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.Vlr_Venta, 2)}
                    </Title>
                );
            }
        },
        {
            title: "% PARTICIPACIÓN MES", dataIndex: "ParticipacionAcum", key: "ParticipacionAcum", width: 150, align: "right",
            sorter: (a, b) => a.ParticipacionAcum - b.ParticipacionAcum,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.participacion, 2)}%
                    </Title>
                );
            }
        },
        {
            title: "VENTAS ACUM.", dataIndex: "VentaAcumulada", key: "VentaAcumulada", width: 150, align: "right",
            sorter: (a, b) => a.VentaAcumulada - b.VentaAcumulada,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.VentaAcumulada, 2)}
                    </Title>
                );
            }
        },
        {
            title: "% PARTICIPACIÓN ACUM.", dataIndex: "ParticipacionAcum", key: "ParticipacionAcum", width: 150, align: "right",
            sorter: (a, b) => a.ParticipacionAcum - b.ParticipacionAcum,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.ParticipacionAcum, 2)}%
                    </Title>
                );
            }
        }
    ]

    return (
        <div className="mlanegativo">
            <h2 className="mx-auto mt-1 px-4 text-lg leading-6 font-medium text-gray-900 sm:px-6 lg:px-8">

                <div className="col-start-1 row-start-1 py-4">
                    <div className="mx-auto flex max-w-7xl justify-center px-4 sm:px-6 lg:px-8">
                        {/* justify-end */}
                        <Menu as="div" className="mt-3 relative inline-block" >
                            <div className="flex"
                                onClick={reiniciar}
                            >
                                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                    Filtrar por año
                                    <ChevronDownIcon
                                        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                        aria-hidden="true"
                                    />
                                </Menu.Button>
                            </div>
                            <h3 className="mt-2 ml-4 text-sm font-medium text-gray-700 hover:text-gray-900">
                                {filtroAno}
                            </h3>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        {vtasAno.map((option) => (
                                            <Menu.Item key={option.Ventas_ano}>
                                                {({ active }) => (
                                                    <a
                                                        href={option.href}
                                                        onClick={() => setFiltroAno(option.Ventas_ano)}
                                                        className={classNames(
                                                            option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                                            active ? 'bg-gray-100' : '',
                                                            'block px-4 py-2 text-sm'
                                                        )}
                                                    >
                                                        {option.Ventas_ano}
                                                    </a>
                                                )}
                                            </Menu.Item>
                                        ))}
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>

                        <Menu as="div" className="ml-10 relative inline-block" >
                            <div className="flex"
                                onClick={reiniciar}
                            >
                                <Menu.Button className="mt-3 group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                    Filtrar por mes
                                    <ChevronDownIcon
                                        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                        aria-hidden="true"
                                    />
                                </Menu.Button>
                            </div>
                            <h1 className="mt-2 ml-4 text-sm font-medium text-gray-700 hover:text-gray-900">
                                {nameMonth(filtroMes)}
                            </h1>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        {vtasMes.map((option) => (
                                            <Menu.Item key={option.Ventas_mes}>
                                                {({ active }) => (
                                                    <a
                                                        href={option.href}
                                                        onClick={() => setFiltroMes(option.Ventas_mes)}
                                                        className={classNames(
                                                            option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                                            active ? 'bg-gray-100' : '',
                                                            'block px-4 py-2 text-sm'
                                                        )}
                                                    >
                                                        {nameMonth(option.Ventas_mes)}
                                                    </a>
                                                )}
                                            </Menu.Item>
                                        ))}
                                    </div>
                                </Menu.Items>
                            </Transition>

                        </Menu>
                        <Menu as="div" className="ml-10 relative inline-block" >
                            <div className="flex">
                                <div className="ml-5 mx-auto flex max-w-4xl h-10 space-x-6 divide-x bg-redhdr rounded divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
                                    <button
                                        onClick={() => generarConsulta()}
                                    >
                                        Consultar
                                    </button>
                                </div>
                                <div className="ml-5 mx-auto flex max-w-4xl h-10 space-x-6 divide-x bg-orange rounded divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
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
                        filtroAno && filtroMes ?
                            (
                                <div className="ml-10 px-4 sm:px-6 lg:px-8">
                                    <div className="mt-8 flex flex-col">
                                        <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-16">
                                            <div className=" min-w-full py-0 align-middle md:px-6 lg:px-1">
                                                <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                                    <Table columns={header_testmes} dataSource={detalleCostos} pagination={false}
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
                            (
                                <div className="ml-10 px-4 sm:px-6 lg:px-8">
                                    <div className="mt-8 flex flex-col">
                                        <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-16">
                                            <div className=" min-w-full py-0 align-middle md:px-6 lg:px-1">
                                                <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                                    <Table columns={header_test} dataSource={detalleCostos} pagination={false}
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
                    }
                </div>
            </h2 >
        </div >
    );
}
export default TabParticipacion;