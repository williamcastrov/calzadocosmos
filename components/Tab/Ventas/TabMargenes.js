import { Fragment, useState, useEffect } from "react";
import { myNumber, nameMonth } from "../../../utils/ArrayFunctions";
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, FunnelIcon, } from "@heroicons/react/solid";
import { Table, Tag, Typography } from 'antd';
import swal from 'sweetalert';

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function TabMargenes(props) {
    const { Title } = Typography;
    const { tipo, setTipo, datosCostos, ventasDiariasMes, listaPresupuestos } = props;
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
        { name: 'Margen x Centro', href: '#', current: entMargenCentro },
        { name: 'Margen x Subcategoría', href: '#', current: entMargenSubcategoria },
        { name: 'Margen x Proveedor', href: '#', current: entMargenProveedor },
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
                let newDetVtas = [];
                let newDetPpto = [];

                listaPresupuestos.pptovtacentro &&
                    listaPresupuestos.pptovtacentro.map((ppto, index) => {

                        if (ppto.periodo == periodo) {
                            let vta = {
                                costopromedppto: ppto.costopromedio,
                                nombrebodega: ppto.nombrebodega,
                                periodo: ppto.periodo,
                                pptovalor: ppto.pptovalor,
                                pptound: ppto.pptound,
                            };
                            newDetPpto.push(vta);
                        }
                    });


                datosCostos.costosvtacentro &&
                    datosCostos.costosvtacentro.map((vtas, index) => {

                        if (vtas.Periodo == periodo) {
                            let vta = {
                                Descripcion: vtas.Descripcion,
                                Periodo: vtas.Periodo,
                                Vlr_Costo: vtas.Vlr_Costo,
                                Vlr_Neto: vtas.Vlr_Neto
                            };
                            newDetVtas.push(vta);
                        }
                    });

                let newDetVtasAcum = [];

                centrosoperacion &&
                    centrosoperacion.map((centros, index) => {
                        let costo = 0;
                        let venta = 0;
                        let valppto = 0;
                        datosCostos.costosvtacentro &&
                            datosCostos.costosvtacentro.map((vtas, index) => {
                                if (vtas.ano == filtroAno && vtas.mes <= filtroMes
                                    && vtas.Descripcion == centros.Centros_Operacion) {
                                    costo = costo + vtas.Vlr_Costo;
                                    venta = venta + vtas.Vlr_Neto;
                                }
                            });

                        newDetPpto &&
                            newDetPpto.map((ppto, index) => {
                                if (ppto.nombrebodega == centros.Centros_Operacion) {
                                    valppto = valppto + ppto.pptovalor;
                                }
                            });


                        let vta = {
                            Descripcion: centros.Centros_Operacion,
                            Periodo: periodo,
                            Vlr_CostoAcum: costo,
                            Vlr_NetoAcum: venta,
                            Vlr_Ppto: valppto
                        };
                        newDetVtasAcum.push(vta);
                    });

                let newDetVtasTot = [];
                newDetVtas &&
                    newDetVtas.map((vtasmes, index) => {
                        let costo = 0;
                        let venta = 0;
                        let ppto = 0;

                        newDetVtasAcum &&
                            newDetVtasAcum.map((vtasacum, index) => {
                                if (vtasmes.Descripcion == vtasacum.Descripcion) {
                                    costo = vtasacum.Vlr_CostoAcum;
                                    venta = vtasacum.Vlr_NetoAcum;
                                    ppto = vtasacum.Vlr_Ppto;
                                }
                            });
                        let vta = {
                            Descripcion: vtasmes.Descripcion,
                            Periodo: vtasmes.Periodo,
                            Vlr_Costo: vtasmes.Vlr_Costo,
                            Vlr_Neto: vtasmes.Vlr_Neto,
                            Vlr_CostoAcum: costo,
                            Vlr_NetoAcum: venta,
                            Vlr_Ppto: ppto,
                        };
                        newDetVtasTot.push(vta);
                    });

                let totalcostomes = 0;
                let totalventames = 0;
                let totalcosto = 0;
                let totalventa = 0;
                let totalppto = 0;

                let Descripcion = "";

                newDetVtasTot &&
                    newDetVtasTot.map((tot, index) => {
                        totalcostomes = totalcostomes + tot.Vlr_Costo;
                        totalventames = totalventames + tot.Vlr_Neto;
                        totalcosto = totalcosto + tot.Vlr_CostoAcum;
                        totalventa = totalventa + tot.Vlr_NetoAcum;
                        totalppto = totalppto + tot.Vlr_Ppto;
                        Descripcion = tot.Descripcion;

                    });

                let acum = {
                    Descripcion: "TOTAL",
                    Periodo: periodo,
                    Vlr_Costo: totalcostomes,
                    Vlr_Neto: totalventames,
                    Vlr_CostoAcum: totalcosto,
                    Vlr_NetoAcum: totalventa,
                    Vlr_Ppto: totalppto
                }

                newDetVtasTot.push(acum);

                //console.log("VALORES : ", acum)
                //return
                setDetalleCostos(newDetVtasTot);


            } else
                if (opcion == 1) {
                    let newDetVtas = [];
                    let newDetPpto = [];

                    listaPresupuestos.pptovtasublinea &&
                        listaPresupuestos.pptovtasublinea.map((ppto, index) => {

                            if (ppto.periodo == periodo) {
                                let vta = {
                                    costopromedppto: ppto.costopromedio,
                                    nombrebodega: ppto.nombreconcepto,
                                    periodo: ppto.periodo,
                                    pptovalor: ppto.pptovalor,
                                    pptound: ppto.pptound,
                                };
                                newDetPpto.push(vta);
                            }
                        });

                    datosCostos.costosvtasubcategoria &&
                        datosCostos.costosvtasubcategoria.map((vtas, index) => {

                            if (vtas.Periodo == periodo) {
                                let vta = {
                                    Descripcion: vtas.Descripcion,
                                    Periodo: vtas.Periodo,
                                    Vlr_Costo: vtas.Vlr_Costo,
                                    Vlr_Neto: vtas.Vlr_Neto
                                };
                                newDetVtas.push(vta);
                            }
                        });

                    let newDetVtasAcum = [];

                    subcategorias &&
                        subcategorias.map((centros, index) => {
                            let costo = 0;
                            let venta = 0;
                            let valppto = 0;
                            datosCostos.costosvtasubcategoria &&
                                datosCostos.costosvtasubcategoria.map((vtas, index) => {
                                    if (vtas.ano == filtroAno && vtas.mes <= filtroMes
                                        && vtas.Descripcion == centros.Subcategorias) {
                                        costo = costo + vtas.Vlr_Costo;
                                        venta = venta + vtas.Vlr_Neto;
                                    }
                                });

                            newDetPpto &&
                                newDetPpto.map((ppto, index) => {
                                    if (ppto.nombrebodega == centros.Subcategorias) {
                                        valppto = valppto + ppto.pptovalor;
                                    }
                                });


                            let vta = {
                                Descripcion: centros.Subcategorias,
                                Periodo: periodo,
                                Vlr_CostoAcum: costo,
                                Vlr_NetoAcum: venta,
                                Vlr_Ppto: valppto,
                            };
                            newDetVtasAcum.push(vta);
                        });

                    let newDetVtasTot = [];

                    newDetVtas &&
                        newDetVtas.map((vtasmes, index) => {
                            let costo = 0;
                            let venta = 0;
                            let ppto = 0;

                            newDetVtasAcum &&
                                newDetVtasAcum.map((vtasacum, index) => {
                                    if (vtasmes.Descripcion == vtasacum.Descripcion) {
                                        costo = vtasacum.Vlr_CostoAcum;
                                        venta = vtasacum.Vlr_NetoAcum;
                                        ppto = vtasacum.Vlr_Ppto;
                                    }
                                });
                            let vta = {
                                Descripcion: vtasmes.Descripcion,
                                Periodo: vtasmes.Periodo,
                                Vlr_Costo: vtasmes.Vlr_Costo,
                                Vlr_Neto: vtasmes.Vlr_Neto,
                                Vlr_CostoAcum: costo,
                                Vlr_NetoAcum: venta,
                                Vlr_Ppto: ppto,
                            };
                            newDetVtasTot.push(vta);
                        });

                    let totalcostomes = 0;
                    let totalventames = 0;
                    let totalcosto = 0;
                    let totalventa = 0;
                    let totalppto = 0;

                    let Descripcion = "";

                    newDetVtasTot &&
                        newDetVtasTot.map((tot, index) => {
                            totalcostomes = totalcostomes + tot.Vlr_Costo;
                            totalventames = totalventames + tot.Vlr_Neto;
                            totalcosto = totalcosto + tot.Vlr_CostoAcum;
                            totalventa = totalventa + tot.Vlr_NetoAcum;
                            totalppto = totalppto + tot.Vlr_Ppto;
                            Descripcion = tot.Descripcion;

                        });

                    let acum = {
                        Descripcion: "TOTAL",
                        Periodo: periodo,
                        Vlr_Costo: totalcostomes,
                        Vlr_Neto: totalventames,
                        Vlr_CostoAcum: totalcosto,
                        Vlr_NetoAcum: totalventa,
                        Vlr_Ppto: totalppto
                    }

                    newDetVtasTot.push(acum);
                    //console.log("PPTO  : ",newDetVtasTot)
                    setDetalleCostos(newDetVtasTot);
                } else
                    if (opcion == 2) {

                        let newDetVtas = [];
                        let newDetPpto = [];

                        listaPresupuestos.pptovtasublinea &&
                            listaPresupuestos.pptovtasublinea.map((ppto, index) => {

                                if (ppto.periodo == periodo) {
                                    let vta = {
                                        costopromedppto: ppto.costopromedio,
                                        nombrebodega: ppto.nombreconcepto,
                                        periodo: ppto.periodo,
                                        pptovalor: ppto.pptovalor,
                                        pptound: ppto.pptound,
                                    };
                                    newDetPpto.push(vta);
                                }
                            });

                        datosCostos.costosproveedor &&
                            datosCostos.costosproveedor.map((vtas, index) => {

                                if (vtas.Periodo == periodo) {
                                    let vta = {
                                        Descripcion: vtas.Descripcion,
                                        Periodo: vtas.Periodo,
                                        Vlr_Costo: vtas.Vlr_Costo,
                                        Vlr_Neto: vtas.Vlr_Neto
                                    };
                                    newDetVtas.push(vta);
                                }
                            });

                        let newDetVtasAcum = [];

                        proveedores &&
                            proveedores.map((prov, index) => {
                                let costo = 0;
                                let venta = 0;
                                let valppto = 0;
                                datosCostos.costosproveedor &&
                                    datosCostos.costosproveedor.map((vtas, index) => {
                                        if (vtas.ano == filtroAno && vtas.mes <= filtroMes
                                            && vtas.Descripcion == prov.Nombre_Proveedor) {
                                            costo = costo + vtas.Vlr_Costo;
                                            venta = venta + vtas.Vlr_Neto;
                                        }
                                    });

                                newDetPpto &&
                                    newDetPpto.map((ppto, index) => {
                                        if (ppto.nombrebodega == prov.Nombre_Proveedor) {
                                            valppto = valppto + ppto.pptovalor;
                                        }
                                    });


                                let vta = {
                                    Descripcion: prov.Nombre_Proveedor,
                                    Periodo: periodo,
                                    Vlr_CostoAcum: costo,
                                    Vlr_NetoAcum: venta,
                                    Vlr_Ppto: valppto,
                                };
                                newDetVtasAcum.push(vta);
                            });

                        let newDetVtasTot = [];

                        newDetVtas &&
                            newDetVtas.map((vtasmes, index) => {
                                let costo = 0;
                                let venta = 0;
                                let ppto = 0;

                                newDetVtasAcum &&
                                    newDetVtasAcum.map((vtasacum, index) => {
                                        if (vtasmes.Descripcion == vtasacum.Descripcion) {
                                            costo = vtasacum.Vlr_CostoAcum;
                                            venta = vtasacum.Vlr_NetoAcum;
                                            ppto = vtasacum.Vlr_Ppto;
                                        }
                                    });
                                let vta = {
                                    Descripcion: vtasmes.Descripcion,
                                    Periodo: vtasmes.Periodo,
                                    Vlr_Costo: vtasmes.Vlr_Costo,
                                    Vlr_Neto: vtasmes.Vlr_Neto,
                                    Vlr_CostoAcum: costo,
                                    Vlr_NetoAcum: venta,
                                    Vlr_Ppto: ppto,
                                };
                                newDetVtasTot.push(vta);
                            });

                        let totalcostomes = 0;
                        let totalventames = 0;
                        let totalcosto = 0;
                        let totalventa = 0;
                        let totalppto = 0;

                        let Descripcion = "";

                        newDetVtasTot &&
                            newDetVtasTot.map((tot, index) => {
                                totalcostomes = totalcostomes + tot.Vlr_Costo;
                                totalventames = totalventames + tot.Vlr_Neto;
                                totalcosto = totalcosto + tot.Vlr_CostoAcum;
                                totalventa = totalventa + tot.Vlr_NetoAcum;
                                totalppto = totalppto + tot.Vlr_Ppto;
                                Descripcion = tot.Descripcion;

                            });

                        let acum = {
                            Descripcion: "TOTAL",
                            Periodo: periodo,
                            Vlr_Costo: totalcostomes,
                            Vlr_Neto: totalventames,
                            Vlr_CostoAcum: totalcosto,
                            Vlr_NetoAcum: totalventa,
                            Vlr_Ppto: totalppto
                        }

                        newDetVtasTot.push(acum);
                        //console.log("PPTO  : ",newDetVtasTot)
                        setDetalleCostos(newDetVtasTot);
                    }


        } else {
            if (filtroAno) {

                if (opcion == 0) {
                    let newDet = [];
                    setTituloTipo("CENTROS_DE_OPERACIÓN")

                    let newDetVtasAcum = [];

                    centrosoperacion &&
                        centrosoperacion.map((centros, index) => {
                            let costo = 0;
                            let venta = 0;

                            datosCostos.costosvtacentro &&
                                datosCostos.costosvtacentro.map((vtas, index) => {
                                    if (vtas.ano == filtroAno && vtas.Descripcion == centros.Centros_Operacion) {
                                        costo = costo + vtas.Vlr_Costo;
                                        venta = venta + vtas.Vlr_Neto;
                                    }
                                });
                            let vta = {
                                Descripcion: centros.Centros_Operacion,
                                Periodo: periodo,
                                Vlr_Costo: 0,
                                Vlr_Neto: 0,
                                Vlr_CostoAcum: costo,
                                Vlr_NetoAcum: venta
                            };
                            newDetVtasAcum.push(vta);
                        });


                    let totalcostomes = 0;
                    let totalventames = 0;
                    let totalcosto = 0;
                    let totalventa = 0;

                    let Descripcion = "";

                    newDetVtasAcum &&
                        newDetVtasAcum.map((tot, index) => {
                            totalcostomes = totalcostomes + tot.Vlr_Costo;
                            totalventames = totalventames + tot.Vlr_Neto;
                            totalcosto = totalcosto + tot.Vlr_CostoAcum;
                            totalventa = totalventa + tot.Vlr_NetoAcum;
                            Descripcion = tot.Descripcion;

                        });

                    let acum = {
                        Descripcion: "TOTAL",
                        Periodo: periodo,
                        Vlr_Costo: totalcostomes,
                        Vlr_Neto: totalventames,
                        Vlr_CostoAcum: totalcosto,
                        Vlr_NetoAcum: totalventa
                    }

                    newDetVtasAcum.push(acum);

                    //console.log("VENTAS ANÑO : ", newDetVtasAcum)
                    setDetalleCostos(newDetVtasAcum);
                }
                else
                    if (opcion == 1) {
                        let newDet = [];
                        setTituloTipo("SUBCATEGORÍAS")

                        let newDetVtasAcum = [];

                        subcategorias &&
                            subcategorias.map((centros, index) => {
                                let costo = 0;
                                let venta = 0;

                                datosCostos.costosvtasubcategoria &&
                                    datosCostos.costosvtasubcategoria.map((vtas, index) => {
                                        if (vtas.ano == filtroAno && vtas.Descripcion == centros.Subcategorias) {
                                            costo = costo + vtas.Vlr_Costo;
                                            venta = venta + vtas.Vlr_Neto;
                                        }
                                    });
                                let vta = {
                                    Descripcion: centros.Subcategorias,
                                    Periodo: periodo,
                                    Vlr_Costo: 0,
                                    Vlr_Neto: 0,
                                    Vlr_CostoAcum: costo,
                                    Vlr_NetoAcum: venta
                                };
                                newDetVtasAcum.push(vta);
                            });

                        let totalcostomes = 0;
                        let totalventames = 0;
                        let totalcosto = 0;
                        let totalventa = 0;

                        let Descripcion = "";

                        newDetVtasAcum &&
                            newDetVtasAcum.map((tot, index) => {
                                totalcostomes = totalcostomes + tot.Vlr_Costo;
                                totalventames = totalventames + tot.Vlr_Neto;
                                totalcosto = totalcosto + tot.Vlr_CostoAcum;
                                totalventa = totalventa + tot.Vlr_NetoAcum;
                                Descripcion = tot.Descripcion;

                            });

                        let acum = {
                            Descripcion: "TOTAL",
                            Periodo: periodo,
                            Vlr_Costo: totalcostomes,
                            Vlr_Neto: totalventames,
                            Vlr_CostoAcum: totalcosto,
                            Vlr_NetoAcum: totalventa
                        }

                        newDetVtasAcum.push(acum);


                        //console.log("VENTAS ANÑO : ", newDetVtasAcum)
                        setDetalleCostos(newDetVtasAcum);
                    } else
                        if (opcion == 2) {
                            let newDet = [];
                            setTituloTipo("PROVEEDORES")

                            let newDetVtasAcum = [];

                            proveedores &&
                                proveedores.map((prov, index) => {
                                    let costo = 0;
                                    let venta = 0;

                                    datosCostos.costosproveedor &&
                                        datosCostos.costosproveedor.map((vtas, index) => {
                                            if (vtas.ano == filtroAno && vtas.Descripcion == prov.Nombre_Proveedor) {
                                                costo = costo + vtas.Vlr_Costo;
                                                venta = venta + vtas.Vlr_Neto;
                                            }
                                        });
                                    let vta = {
                                        Descripcion: prov.Nombre_Proveedor,
                                        Periodo: periodo,
                                        Vlr_Costo: 0,
                                        Vlr_Neto: 0,
                                        Vlr_CostoAcum: costo,
                                        Vlr_NetoAcum: venta
                                    };
                                    newDetVtasAcum.push(vta);
                                });

                            let totalcostomes = 0;
                            let totalventames = 0;
                            let totalcosto = 0;
                            let totalventa = 0;

                            let Descripcion = "";

                            newDetVtasAcum &&
                                newDetVtasAcum.map((tot, index) => {
                                    totalcostomes = totalcostomes + tot.Vlr_Costo;
                                    totalventames = totalventames + tot.Vlr_Neto;
                                    totalcosto = totalcosto + tot.Vlr_CostoAcum;
                                    totalventa = totalventa + tot.Vlr_NetoAcum;
                                    Descripcion = tot.Descripcion;

                                });

                            let acum = {
                                Descripcion: "TOTAL",
                                Periodo: periodo,
                                Vlr_Costo: totalcostomes,
                                Vlr_Neto: totalventames,
                                Vlr_CostoAcum: totalcosto,
                                Vlr_NetoAcum: totalventa
                            }

                            newDetVtasAcum.push(acum);


                            //console.log("VENTAS ANÑO : ", newDetVtasAcum)
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
        { title: tituloTipo, dataIndex: "Descripcion", key: "Descripcion", width: 100, fixed: true },
        {
            title: "COSTO PROM ACUM.", dataIndex: "Vlr_CostoAcum", key: "Vlr_CostoAcum", width: 150, align: "right",
            sorter: (a, b) => a.Vlr_CostoAcum - b.Vlr_CostoAcum,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.Vlr_CostoAcum, 2)}
                    </Title>
                );
            }
        },
        {
            title: "VTAS TOT ACUM.", dataIndex: "Vlr_NetoAcum", key: "Vlr_NetoAcum", width: 150, align: "right",
            sorter: (a, b) => a.Vlr_NetoAcum - b.Vlr_NetoAcum,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.Vlr_NetoAcum, 2)}
                    </Title>
                );
            }
        },
        {
            title: "MARGEN ACUM.", dataIndex: "margenacum", key: "margenacum", width: 150, align: "right",
            //sorter: (a, b) => a.(row.Vlr_CostoAcum / row.Vlr_NetoAcum) - b.(row.Vlr_CostoAcum / row.Vlr_NetoAcum),
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {isNaN(parseInt((1 - (row.Vlr_CostoAcum / row.Vlr_NetoAcum)) * 100)) ?
                            0+" %"
                            :
                            myNumber(1, (1 - (row.Vlr_CostoAcum / row.Vlr_NetoAcum)) * 100) + " % "
                        }
                    </Title>
                );
            }

        },
    ]

    const header_testmes = [
        { title: tituloTipo, dataIndex: "Descripcion", key: "Descripcion", width: 120, fixed: true },
        {
            title: "COSTO PROM MES.", dataIndex: "Vlr_Costo", key: "Vlr_Costo", width: 80, align: "right",
            sorter: (a, b) => a.Vlr_Costo - b.Vlr_Costo,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.Vlr_Costo, 2)}
                    </Title>
                );
            }
        },
        {
            title: "VTAS TOT MES.", dataIndex: "Vlr_Neto", key: "Vlr_Neto", width: 80, align: "right",
            sorter: (a, b) => a.Vlr_Neto - b.Vlr_Neto,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.Vlr_Neto, 2)}
                    </Title>
                );
            }
        },
        {
            title: "PPTO TOT MES.", dataIndex: "Vlr_Ppto", key: "Vlr_Ppto", width: 80, align: "right",
            sorter: (a, b) => a.Vlr_Ppto - b.Vlr_Ppto,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.Vlr_Ppto, 2)}
                    </Title>
                );
            }
        },
        {
            title: "FALTANTE PPTO.", dataIndex: "faltante", key: "faltante", width: 80, align: "right",
            //sorter: (a, b) => a.Vlr_NetoAcum - b.Vlr_NetoAcum,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.Vlr_Ppto - row.Vlr_Neto)}
                    </Title>
                );
            }
        },
        {
            title: "MARGEN MES.", dataIndex: "margenmes", key: "margenmes", width: 60, align: "right",
            //sorter: (a, b) => a.(row.Vlr_CostoAcum / row.Vlr_NetoAcum) - b.(row.Vlr_CostoAcum / row.Vlr_NetoAcum),
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {
                            row.Vlr_Costo == 0 ?
                                0 + " % "
                                :
                                myNumber(1, ((1 - (row.Vlr_Costo / row.Vlr_Neto)) * 100), 2) + " % "
                        }
                    </Title>
                );
            }

        },
        {
            title: "COSTO PROM ACUM.", dataIndex: "costomes", key: "costomes", width: 80, align: "right",
            sorter: (a, b) => a.Vlr_NetoAcum - b.Vlr_NetoAcum,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.Vlr_CostoAcum)}
                    </Title>
                );
            }
        },
        {
            title: "VTA TOT ACUM.", dataIndex: "vtaacumulada", key: "vtaacumulada", width: 75, align: "right",
            sorter: (a, b) => a.Vlr_NetoAcum - b.Vlr_NetoAcum,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.Vlr_NetoAcum)}
                    </Title>
                );
            }
        },
        {
            title: "MARGEN ACUM.", dataIndex: "margenmes", key: "margenmes", width: 60, align: "right",
            //sorter: (a, b) => a.(row.Vlr_CostoAcum / row.Vlr_NetoAcum) - b.(row.Vlr_CostoAcum / row.Vlr_NetoAcum),
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {
                            row.CSV_TOT == 0 ?
                                0 + " % "
                                :
                                myNumber(1, ((1 - (row.Vlr_CostoAcum / row.Vlr_NetoAcum)) * 100), 2) + " % "
                        }
                    </Title>
                );
            }
        },
    ]

    return (
        <div className="mlanegativo">
            <h2 className="mx-auto mt-1 px-4 text-lg leading-6 font-medium text-gray-900 sm:px-6 lg:px-8">

                <div className="col-start-1 row-start-1 py-4">
                    <div className="mx-auto flex max-w-7xl justify-center px-4 sm:px-6 lg:px-8">
                        {/* justify-end */}
                        <Menu as="div" className="mt-3 relative inline-block" >
                            <div className="flex">
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
                            <div className="flex">
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
                                <div className="ml-5 mx-auto flex max-w-4xl h-10 space-x-6 divide-x bg-basecosmos rounded divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
                                    <button
                                        onClick={() => generarConsulta()}
                                    >
                                        Consultar
                                    </button>
                                </div>
                                <div className="ml-5 mx-auto flex max-w-4xl h-10 space-x-6 divide-x bg-blue rounded divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
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

export default TabMargenes;