import { Fragment, useState, useEffect } from "react";
import { myNumber, nameMonth } from "../../../utils/ArrayFunctions";
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MultiSelect } from "react-multi-select-component";
import swal from 'sweetalert';
import { Table, Tag, Typography, Button } from 'antd';
import Loading from "../../../components/Loading";
import { BeakerIcon, ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/solid";
import Spinner from "../../Spinner/Spinner";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function TabInformeVtas(props) {
    const { Title } = Typography;
    const { tipo, setTipo, ventasDiariasMes, existencias, grupos, sublineas, marcas, vtasReferencias } = props;
    const [isLoading, setIsLoading] = useState(false)
    //console.log("EXISTENCIAS TAB : ",existencias);
    const [entMes, setEntMes] = useState(true);
    const [entAcumuladas, setEntAcumuladas] = useState(false);
    const [movimientos, setmovimientos] = useState(false);
    const [opcion, setOpcion] = useState(0);
    const [textoTipo, setTextoTipo] = useState("CENTROS_DE_OPERACIÓN");

    const [filtroAno, setFiltroAno] = useState(null);
    const [filtroMes, setFiltroMes] = useState(null);
    const [filtroDia, setFiltroDia] = useState(null);
    const [labeldias, setLabeldias] = useState([]);
    const [consultar, setConsultar] = useState(false);

    const [generar, setGenerar] = useState(false);

    const [selectedGrupo, setSelectedGrupo] = useState([]);
    const [selectedSublinea, setSelectedSublinea] = useState([]);
    const [selectedMarca, setSelectedMarca] = useState([]);

    const [selectedAno, setSelectedAno] = useState([]);
    const [selectedMes, setSelectedMes] = useState([]);
    const [selectedDia, setSelectedDia] = useState([]);

    const [vtasAno, setVtasAno] = useState([]);
    const [vtasMes, setVtasMes] = useState([]);
    const [vtasDia, setVtasDia] = useState([]);
    const [vtasGrupo, setVtasGrupo] = useState([]);
    const [vtasSublinea, setVtasSublinea] = useState([]);
    const [vtasMarca, setVtasMarca] = useState([]);

    const [ordenaTotalStock, setOrdenaTotalStock] = useState(true);
    const [ordenaRotacion, setOrdenaRotacion] = useState(true);
    const [ordenaTemporada, setOrdenaTemporada] = useState(true);
    const [ordenaVenta, setOrdenaVenta] = useState(true);
    const [ordenaGrupo, setOrdenaGrupo] = useState(true);
    const [ordenaColor, setOrdenaColor] = useState(true);

    const [tipoConsulta, setTipoConsulta] = useState([]);

    let registros = [
        { label: "100 Primeros", value: 1 },
        { label: "Todos los registros", value: 2 }
    ];

    //console.log("LABEL DIAS: ", labelVentas);
    const tabsdos = [
        { name: 'Referencia', href: '#', current: entMes }
    ]

    useEffect(() => {
        let newDetAnos = [];
        //setVtasSemestre(ventasDiariasMes.semestre_vtasdiarias);
        //setVtasTrimestre(ventasDiariasMes.trimestre_vtasdiarias);
        setVtasGrupo(grupos);
        setVtasSublinea(sublineas);
        setVtasMarca(marcas);

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
    }, [ventasDiariasMes]);

    const selVentas = (seleccion) => {
        setOpcion(seleccion)

        if (seleccion == 0)
            setTextoTipo("CENTROS_DE_OPERACIÓN")
        else
            if (seleccion == 1)
                setTextoTipo("SUBCATEGORÍAS")
            else
                setTextoTipo("")
    }

    const limpiarFiltros = () => {
        setFiltroAno(null);
        setFiltroMes(null);
        setFiltroDia(null);
        setmovimientos([]);
    }

    const generarConsulta = () => {

        if (selectedAno.length == 0 || selectedMes.length == 0) {
            swal({
                title: "Tablero Cosmos",
                text: "Primero debes seleccionar el año y mes!",
                icon: "warning",
            });
            return
        }
        setGenerar(true);
        GenerarDatos();
        setConsultar(true)
    }

    useEffect(() => {
        if (generar) {
            setIsLoading(true);
        }
    }, [generar]);

    const GenerarDatos = () => {

        //if (selectedAno.length > 0) {

        let periodo = "";

        if (selectedMes[0].value < 10)
            periodo = "" + selectedAno[0].value + "0" + selectedMes[0].value;
        else
            periodo = "" + selectedAno[0].value + selectedMes[0].value;

        if (selectedAno.length > 1 && selectedMes.length > 1) {
            swal({
                title: "Tablero Cosmos",
                text: "Selecciona solo un rango año - mes!",
                icon: "warning",
            });
            setIsLoading(false);
            return
        }

        let vtasreferencia = [];
        let vtasmasexistencia = [];
        let vtasmasexistenciaSublineaGrupo = [];
        let vtasmasexistenciaSublineaMarca = [];
        let vtasmasexistenciaMarcaGrupo = [];
        let vtasmasexistenciaSublineaGrupoMarca = [];
        let vtasreferenciaperiodo = [];
        let existenciareferenciacolor = [];
        let contador = 0;

        let inventario = existencias.existenciasreferencia;
        let referenciacolor = existencias.referenciacolor;
        let referencias = ventasDiariasMes.referencias;
        let vtasperiodo = ventasDiariasMes.ventasreferenciaperiodo;
        let referenciacolorvta = vtasReferencias.referenciasvta;

        let datomes = [];

        vtasperiodo &&
            vtasperiodo.map((vta, index) => {
                if (vta.Periodo == periodo) {
                    datomes.push(vta);
                }
            });

        let referenciacolorvtames = [];

        referenciacolorvta &&
            referenciacolorvta.map((ref, index) => {
                if (ref.Periodo == periodo) {
                    referenciacolorvtames.push(ref);
                }
            });

        if (tipoConsulta.length == 0) {
            swal({
                title: "Tablero Cosmos",
                text: "Selecciona tipo de consulta!",
                icon: "warning",
            });
            return
        }

        let cantidad = 0;
        if (tipoConsulta[0].value == 1)
            cantidad = 500;
        else
            cantidad = 10000;

        if (selectedAno.length > 0 && selectedMes.length > 0 && selectedGrupo.length == 0 &&
            selectedSublinea.length == 0 && selectedMarca.length == 0) {

            referenciacolorvtames &&
                referenciacolorvtames.map((ref, index) => {
                    if (ref.Periodo == periodo) {
                        let ventaund = 0;
                        let ventapesos = 0;
                        let color = "";
                        let grupo = "";
                        let marca = "";
                        let referencia = "";
                        let sublinea = "";
                        let talla = "";

                        contador = contador + 1;

                        if (contador < cantidad) {

                            datomes &&
                                datomes.map((vta, index) => {
                                    if (vta.Periodo == periodo && vta.Referencia_Item == ref.Referencia &&
                                        vta.Color == ref.Color) {

                                        ventaund = parseInt(ventaund) + parseInt(vta.Cantidad);
                                        ventapesos = parseInt(ventapesos) + parseInt(vta.Vlr_Neto);
                                        talla = talla + "," + vta.Talla;
                                        color = vta.Color;
                                        grupo = vta.Grupo;
                                        marca = vta.Marca;
                                        referencia = vta.Referencia_Item;
                                        sublinea = vta.Sublinea;
                                    }
                                });

                            if (ventaund > 0) {
                                let item = {
                                    Cantidad: ventaund,
                                    Color: color,
                                    Grupo: grupo,
                                    Marca: marca,
                                    Periodo: periodo,
                                    Referencia_Item: referencia,
                                    Sublinea: sublinea,
                                    Talla: talla,
                                    Vlr_Neto: ventapesos
                                }
                                vtasreferenciaperiodo.push(item);

                            }
                        }
                    }

                });

            referenciacolor &&
                referenciacolor.map((ref, index) => {
                    let cantidad = 0;
                    let Grupo = 0;
                    let Imagen = 0;
                    let Marca = 0;
                    let Referencia = 0;
                    let Color = 0;
                    let SubLinea = 0;
                    let Talla = "";

                    inventario &&
                        inventario.map((vta, index) => {
                            if (ref.Color == vta.Color && ref.Referencia == vta.Referencia) {

                                cantidad = parseInt(cantidad) + parseInt(vta.Existencia);
                                Grupo = vta.Grupo;
                                Imagen = vta.Imagen;
                                Marca = vta.Marca;
                                Referencia = vta.Referencia;
                                Color = vta.Color;
                                SubLinea = vta.SubLinea;
                                if (!vta.Talla)
                                    Talla = Talla + "";
                                else
                                    Talla = Talla + vta.Talla + " = " + vta.Existencia + " Und ";
                            }
                        });


                    if (cantidad > 0) {
                        //if(Referencia == 101791){
                        let item = {
                            Existencia: cantidad,
                            Grupo: Grupo,
                            Imagen: Imagen,
                            Marca: Marca,
                            Referencia: Referencia,
                            Color: Color,
                            SubLinea: SubLinea,
                            Talla: Talla,
                        }
                        existenciareferenciacolor.push(item);
                        //}
                    }

                });

            let longitudexistencias = existenciareferenciacolor.length;

            vtasreferenciaperiodo &&
                vtasreferenciaperiodo.map((vta, index) => {
                    for (var i = 0; i < longitudexistencias; i++) {

                        if (existenciareferenciacolor[i].Referencia == vta.Referencia_Item &&
                            existenciareferenciacolor[i].Color == vta.Color
                        ) {
                            let item = {
                                Referencia: vta.Referencia_Item,
                                Cantidad: vta.Cantidad,
                                Existencia: existenciareferenciacolor[i].Existencia,
                                Imagen: existenciareferenciacolor[i].Imagen,
                                Color: existenciareferenciacolor[i].Color,
                                Talla: existenciareferenciacolor[i].Talla
                            }
                            vtasmasexistencia.push(item);
                            break
                        }

                    }

                });

            let refe;
            let colo;
            vtasmasexistencia &&
                vtasmasexistencia.map((vta, index) => {

                    let color = '';
                    let talla = '';
                    let temporada = '';
                    let referenciaproveedor = '';
                    let grupo = '';

                    referencias &&
                        referencias.map((ref, index) => {

                            if (vta.Referencia == ref.referencia && vta.Color == ref.Color) {
                                color = vta.Color;
                                talla = vta.Talla;
                                temporada = ref.Temporada;
                                grupo = ref.Grupo;
                                referenciaproveedor = ref.referencia_proveedor;
                            }
                        });
                    //if (refe != vta.Referencia && colo != vta.Color) {
                    let rotacion = (parseInt(vta.Cantidad) / (parseInt(vta.Existencia) + parseInt(vta.Cantidad))) * 100
                    let imagencosmos = "https://api.aal-cloud.com/files/comosdefault.jpg";

                    if (vta.Imagen) {
                        imagencosmos = "https://api.aal-cloud.com/files/cosmos/" + vta.Imagen;
                    } else
                        imagencosmos = "https://api.aal-cloud.com/files/comosdefault.jpg";

                    let item = {
                        Referencia: vta.Referencia,
                        ReferenciaProv: referenciaproveedor,
                        Color: vta.Color,
                        Grupo: grupo,
                        Venta: vta.Cantidad,
                        Temporada: temporada,
                        Talla: vta.Talla,
                        Totalstock: vta.Existencia,
                        Rotacion: rotacion,
                        imageSrc: imagencosmos
                    }
                    vtasreferencia.push(item);
                });

            if (vtasReferencias.length > 0)
                setIsLoading(false);

            setmovimientos(vtasreferencia);
        } else
            if (selectedAno.length > 0 && selectedMes.length > 0 && selectedGrupo.length > 0 &&
                selectedSublinea.length == 0 && selectedMarca.length == 0) {

                referenciacolorvtames &&
                    referenciacolorvtames.map((ref, index) => {
                        if (ref.Periodo == periodo) {
                            let ventaund = 0;
                            let ventapesos = 0;
                            let color = "";
                            let grupo = "";
                            let marca = "";
                            let referencia = "";
                            let sublinea = "";
                            let talla = "";

                            contador = contador + 1;
                            if (contador < 500) {

                                datomes &&
                                    datomes.map((vta, index) => {
                                        if (vta.Periodo == periodo && vta.Referencia_Item == ref.Referencia &&
                                            vta.Color == ref.Color) {

                                            ventaund = parseInt(ventaund) + parseInt(vta.Cantidad);
                                            ventapesos = parseInt(ventapesos) + parseInt(vta.Vlr_Neto);
                                            talla = talla + "," + vta.Talla;
                                            color = vta.Color;
                                            grupo = vta.Grupo;
                                            marca = vta.Marca;
                                            referencia = vta.Referencia_Item;
                                            sublinea = vta.Sublinea;
                                        }
                                    });

                                if (ventaund > 0) {
                                    let item = {
                                        Cantidad: ventaund,
                                        Color: color,
                                        Grupo: grupo,
                                        Marca: marca,
                                        Periodo: periodo,
                                        Referencia_Item: referencia,
                                        Sublinea: sublinea,
                                        Talla: talla,
                                        Vlr_Neto: ventapesos
                                    }
                                    vtasreferenciaperiodo.push(item);

                                }
                            }
                        }

                    });

                referenciacolor &&
                    referenciacolor.map((ref, index) => {
                        let cantidad = 0;
                        let Grupo = 0;
                        let Imagen = 0;
                        let Marca = 0;
                        let Referencia = 0;
                        let Color = 0;
                        let SubLinea = 0;
                        let Talla = "";

                        inventario &&
                            inventario.map((vta, index) => {
                                if (ref.Color == vta.Color && ref.Referencia == vta.Referencia) {

                                    cantidad = parseInt(cantidad) + parseInt(vta.Existencia);
                                    Grupo = vta.Grupo;
                                    Imagen = vta.Imagen;
                                    Marca = vta.Marca;
                                    Referencia = vta.Referencia;
                                    Color = vta.Color;
                                    SubLinea = vta.SubLinea;
                                    if (!vta.Talla)
                                        Talla = Talla + "";
                                    else
                                        Talla = Talla + vta.Talla + " = " + vta.Existencia + " Und  ";
                                }
                            });

                        if (cantidad > 0) {
                            let item = {
                                Existencia: cantidad,
                                Grupo: Grupo,
                                Imagen: Imagen,
                                Marca: Marca,
                                Referencia: Referencia,
                                Color: Color,
                                SubLinea: SubLinea,
                                Talla: Talla,
                            }
                            existenciareferenciacolor.push(item);
                        }
                    });


                let longitudexistencias = existenciareferenciacolor.length;

                selectedGrupo &&
                    selectedGrupo.map((grp, index) => {
                        vtasreferenciaperiodo &&
                            vtasreferenciaperiodo.map((vta, index) => {
                                if (grp.Familias === vta.Grupo) {

                                    for (var i = 0; i < longitudexistencias; i++) {
                                        if (existenciareferenciacolor[i].Referencia == vta.Referencia_Item &&
                                            existenciareferenciacolor[i].Color == vta.Color
                                        ) {
                                            let item = {
                                                Referencia: vta.Referencia_Item,
                                                Cantidad: vta.Cantidad,
                                                Existencia: existenciareferenciacolor[i].Existencia,
                                                Imagen: existenciareferenciacolor[i].Imagen,
                                                Color: existenciareferenciacolor[i].Color,
                                                Talla: existenciareferenciacolor[i].Talla
                                            }
                                            vtasmasexistencia.push(item);
                                            break
                                        }
                                    }
                                }
                            });
                    });

                if (vtasmasexistencia.length == 0) {
                    swal({
                        title: "Tablero Cosmos",
                        text: "No hay productos por ese criterio de selección!",
                        icon: "warning",
                    });
                    setIsLoading(false);
                    return
                }

                let refe;

                vtasmasexistencia &&
                    vtasmasexistencia.map((vta, index) => {

                        let color = '';
                        let talla = '';
                        let temporada = '';
                        let referenciaproveedor = '';
                        let grupo = '';

                        referencias &&
                            referencias.map((ref, index) => {

                                if (vta.Referencia == ref.referencia
                                ) {
                                    color = ref.Color;
                                    talla = ref.Talla;
                                    temporada = ref.Temporada;
                                    grupo = ref.Grupo;
                                    referenciaproveedor = ref.referencia_proveedor;
                                }
                            });

                        if (refe != vta.Referencia) {
                            let rotacion = (parseInt(vta.Cantidad) / (parseInt(vta.Existencia) + parseInt(vta.Cantidad))) * 100
                            let imagencosmos = "https://api.aal-cloud.com/files/comosdefault.jpg";

                            if (vta.Imagen) {
                                imagencosmos = "https://api.aal-cloud.com/files/cosmos/" + vta.Imagen;
                            } else
                                imagencosmos = "https://api.aal-cloud.com/files/comosdefault.jpg";

                            let item = {
                                Referencia: vta.Referencia,
                                ReferenciaProv: referenciaproveedor,
                                Color: vta.Color,
                                Grupo: grupo,
                                Venta: vta.Cantidad,
                                Temporada: temporada,
                                Talla: vta.Talla,
                                Totalstock: vta.Existencia,
                                Rotacion: rotacion,
                                imageSrc: imagencosmos
                            }

                            vtasreferencia.push(item);
                        }
                        refe = vta.Referencia;

                    });

                if (vtasReferencias.length > 0)
                    setIsLoading(false);
                setmovimientos(vtasreferencia);

            } else
                if (selectedAno.length > 0 && selectedMes.length > 0 && selectedGrupo.length == 0 &&
                    selectedSublinea.length > 0 && selectedMarca.length == 0) {

                    referenciacolorvtames &&
                        referenciacolorvtames.map((ref, index) => {
                            if (ref.Periodo == periodo) {
                                let ventaund = 0;
                                let ventapesos = 0;
                                let color = "";
                                let grupo = "";
                                let marca = "";
                                let referencia = "";
                                let sublinea = "";
                                let talla = "";

                                contador = contador + 1;
                                if (contador < 500) {

                                    datomes &&
                                        datomes.map((vta, index) => {
                                            if (vta.Periodo == periodo && vta.Referencia_Item == ref.Referencia &&
                                                vta.Color == ref.Color) {

                                                ventaund = parseInt(ventaund) + parseInt(vta.Cantidad);
                                                ventapesos = parseInt(ventapesos) + parseInt(vta.Vlr_Neto);
                                                talla = talla + "," + vta.Talla;
                                                color = vta.Color;
                                                grupo = vta.Grupo;
                                                marca = vta.Marca;
                                                referencia = vta.Referencia_Item;
                                                sublinea = vta.Sublinea;
                                            }
                                        });

                                    if (ventaund > 0) {
                                        let item = {
                                            Cantidad: ventaund,
                                            Color: color,
                                            Grupo: grupo,
                                            Marca: marca,
                                            Periodo: periodo,
                                            Referencia_Item: referencia,
                                            Sublinea: sublinea,
                                            Talla: talla,
                                            Vlr_Neto: ventapesos
                                        }
                                        vtasreferenciaperiodo.push(item);

                                    }
                                }
                            }

                        });

                    referenciacolor &&
                        referenciacolor.map((ref, index) => {
                            let cantidad = 0;
                            let Grupo = 0;
                            let Imagen = 0;
                            let Marca = 0;
                            let Referencia = 0;
                            let Color = 0;
                            let SubLinea = 0;
                            let Talla = "";

                            inventario &&
                                inventario.map((vta, index) => {
                                    if (ref.Color == vta.Color && ref.Referencia == vta.Referencia) {

                                        cantidad = parseInt(cantidad) + parseInt(vta.Existencia);
                                        Grupo = vta.Grupo;
                                        Imagen = vta.Imagen;
                                        Marca = vta.Marca;
                                        Referencia = vta.Referencia;
                                        Color = vta.Color;
                                        SubLinea = vta.SubLinea;
                                        if (!vta.Talla)
                                            Talla = Talla + "";
                                        else
                                            Talla = Talla + vta.Talla + " = " + vta.Existencia + " Und  ";
                                    }
                                });

                            if (cantidad > 0) {
                                let item = {
                                    Existencia: cantidad,
                                    Grupo: Grupo,
                                    Imagen: Imagen,
                                    Marca: Marca,
                                    Referencia: Referencia,
                                    Color: Color,
                                    SubLinea: SubLinea,
                                    Talla: Talla,
                                }
                                existenciareferenciacolor.push(item);
                            }
                        });


                    let longitudexistencias = existenciareferenciacolor.length;

                    selectedSublinea &&
                        selectedSublinea.map((grp, index) => {
                            vtasreferenciaperiodo &&
                                vtasreferenciaperiodo.map((vta, index) => {
                                    if (grp.value === vta.Sublinea) {

                                        for (var i = 0; i < longitudexistencias; i++) {
                                            if (existenciareferenciacolor[i].Referencia == vta.Referencia_Item &&
                                                existenciareferenciacolor[i].Color == vta.Color
                                            ) {
                                                let item = {
                                                    Referencia: vta.Referencia_Item,
                                                    Cantidad: vta.Cantidad,
                                                    Existencia: existenciareferenciacolor[i].Existencia,
                                                    Imagen: existenciareferenciacolor[i].Imagen,
                                                    Color: existenciareferenciacolor[i].Color,
                                                    Talla: existenciareferenciacolor[i].Talla
                                                }
                                                vtasmasexistencia.push(item);
                                                break
                                            }
                                        }
                                    }
                                });
                        });

                    if (vtasmasexistencia.length == 0) {
                        swal({
                            title: "Tablero Cosmos",
                            text: "No hay productos por ese criterio de selección!",
                            icon: "warning",
                        });
                        //setIsLoading(false);
                        return
                    }

                    let refe;
                    vtasmasexistencia &&
                        vtasmasexistencia.map((vta, index) => {

                            let color = '';
                            let talla = '';
                            let temporada = '';
                            let referenciaproveedor = '';
                            let grupo = '';

                            referencias &&
                                referencias.map((ref, index) => {

                                    if (vta.Referencia == ref.referencia
                                    ) {
                                        color = ref.Color;
                                        talla = ref.Talla;
                                        temporada = ref.Temporada;
                                        grupo = ref.Grupo;
                                        referenciaproveedor = ref.referencia_proveedor;
                                    }
                                });

                            if (refe != vta.Referencia) {
                                let rotacion = (parseInt(vta.Cantidad) / (parseInt(vta.Existencia) + parseInt(vta.Cantidad))) * 100
                                let imagencosmos = "https://api.aal-cloud.com/files/comosdefault.jpg";

                                if (vta.Imagen) {
                                    imagencosmos = "https://api.aal-cloud.com/files/cosmos/" + vta.Imagen;
                                } else
                                    imagencosmos = "https://api.aal-cloud.com/files/comosdefault.jpg";

                                let item = {
                                    Referencia: vta.Referencia,
                                    ReferenciaProv: referenciaproveedor,
                                    Color: vta.Color,
                                    Grupo: grupo,
                                    Venta: vta.Cantidad,
                                    Temporada: temporada,
                                    Talla: vta.Talla,
                                    Totalstock: vta.Existencia,
                                    Rotacion: rotacion,
                                    imageSrc: imagencosmos
                                }
                                vtasreferencia.push(item);
                            }
                            refe = vta.Referencia;

                        });

                    if (vtasReferencias.length > 0)
                        setIsLoading(false);

                    setmovimientos(vtasreferencia);
                } else
                    if (selectedAno.length > 0 && selectedMes.length > 0 && selectedGrupo.length == 0 &&
                        selectedSublinea.length == 0 && selectedMarca.length > 0) {

                        referenciacolorvtames &&
                            referenciacolorvtames.map((ref, index) => {
                                if (ref.Periodo == periodo) {
                                    let ventaund = 0;
                                    let ventapesos = 0;
                                    let color = "";
                                    let grupo = "";
                                    let marca = "";
                                    let referencia = "";
                                    let sublinea = "";
                                    let talla = "";

                                    contador = contador + 1;
                                    if (contador < 500) {

                                        datomes &&
                                            datomes.map((vta, index) => {
                                                if (vta.Periodo == periodo && vta.Referencia_Item == ref.Referencia &&
                                                    vta.Color == ref.Color) {

                                                    ventaund = parseInt(ventaund) + parseInt(vta.Cantidad);
                                                    ventapesos = parseInt(ventapesos) + parseInt(vta.Vlr_Neto);
                                                    talla = talla + "," + vta.Talla;
                                                    color = vta.Color;
                                                    grupo = vta.Grupo;
                                                    marca = vta.Marca;
                                                    referencia = vta.Referencia_Item;
                                                    sublinea = vta.Sublinea;
                                                }
                                            });

                                        if (ventaund > 0) {
                                            let item = {
                                                Cantidad: ventaund,
                                                Color: color,
                                                Grupo: grupo,
                                                Marca: marca,
                                                Periodo: periodo,
                                                Referencia_Item: referencia,
                                                Sublinea: sublinea,
                                                Talla: talla,
                                                Vlr_Neto: ventapesos
                                            }
                                            vtasreferenciaperiodo.push(item);

                                        }
                                    }
                                }

                            });

                        referenciacolor &&
                            referenciacolor.map((ref, index) => {
                                let cantidad = 0;
                                let Grupo = 0;
                                let Imagen = 0;
                                let Marca = 0;
                                let Referencia = 0;
                                let Color = 0;
                                let SubLinea = 0;
                                let Talla = "";

                                inventario &&
                                    inventario.map((vta, index) => {
                                        if (ref.Color == vta.Color && ref.Referencia == vta.Referencia) {

                                            cantidad = parseInt(cantidad) + parseInt(vta.Existencia);
                                            Grupo = vta.Grupo;
                                            Imagen = vta.Imagen;
                                            Marca = vta.Marca;
                                            Referencia = vta.Referencia;
                                            Color = vta.Color;
                                            SubLinea = vta.SubLinea;
                                            if (!vta.Talla)
                                                Talla = Talla + "";
                                            else
                                                Talla = Talla + vta.Talla + " = " + vta.Existencia + " Und ";
                                        }
                                    });

                                if (cantidad > 0) {
                                    //if(Referencia == 101264){
                                    let item = {
                                        Existencia: cantidad,
                                        Grupo: Grupo,
                                        Imagen: Imagen,
                                        Marca: Marca,
                                        Referencia: Referencia,
                                        Color: Color,
                                        SubLinea: SubLinea,
                                        Talla: Talla,
                                    }
                                    existenciareferenciacolor.push(item);
                                    //}
                                }
                            });

                        let longitudexistencias = existenciareferenciacolor.length;

                        selectedMarca &&
                            selectedMarca.map((grp, index) => {
                                vtasreferenciaperiodo &&
                                    vtasreferenciaperiodo.map((vta, index) => {
                                        if (grp.value === vta.Marca) {

                                            for (var i = 0; i < longitudexistencias; i++) {
                                                if (existenciareferenciacolor[i].Referencia == vta.Referencia_Item &&
                                                    existenciareferenciacolor[i].Color == vta.Color
                                                ) {
                                                    let item = {
                                                        Referencia: vta.Referencia_Item,
                                                        Cantidad: vta.Cantidad,
                                                        Existencia: existenciareferenciacolor[i].Existencia,
                                                        Imagen: existenciareferenciacolor[i].Imagen,
                                                        Color: existenciareferenciacolor[i].Color,
                                                        Talla: existenciareferenciacolor[i].Talla
                                                    }
                                                    vtasmasexistencia.push(item);
                                                    break
                                                }
                                            }
                                        }
                                    });
                            });

                        if (vtasmasexistencia.length == 0) {
                            swal({
                                title: "Tablero Cosmos",
                                text: "No hay productos por ese criterio de selección!",
                                icon: "warning",
                            });
                            setIsLoading(false);
                            return
                        }

                        let refe;
                        vtasmasexistencia &&
                            vtasmasexistencia.map((vta, index) => {

                                let color = '';
                                let talla = '';
                                let temporada = '';
                                let referenciaproveedor = '';
                                let grupo = '';
                                let imagen = '';

                                referencias &&
                                    referencias.map((ref, index) => {

                                        if (vta.Referencia == ref.referencia
                                        ) {
                                            color = ref.Color;
                                            talla = ref.Talla;
                                            temporada = ref.Temporada;
                                            grupo = ref.Grupo;
                                            referenciaproveedor = ref.referencia_proveedor;
                                        }
                                    });

                                if (refe != vta.Referencia) {
                                    let rotacion = (parseInt(vta.Cantidad) / (parseInt(vta.Existencia) + parseInt(vta.Cantidad))) * 100
                                    let imagencosmos = "https://api.aal-cloud.com/files/comosdefault.jpg";

                                    if (vta.Imagen) {
                                        imagencosmos = "https://api.aal-cloud.com/files/cosmos/" + vta.Imagen;
                                    } else
                                        imagencosmos = "https://api.aal-cloud.com/files/comosdefault.jpg";

                                    let item = {
                                        Referencia: vta.Referencia,
                                        ReferenciaProv: referenciaproveedor,
                                        Color: vta.Color,
                                        Grupo: grupo,
                                        Venta: vta.Cantidad,
                                        Temporada: temporada,
                                        Talla: vta.Talla,
                                        Totalstock: vta.Existencia,
                                        Rotacion: rotacion,
                                        imageSrc: imagencosmos
                                    }
                                    vtasreferencia.push(item);

                                }
                                refe = vta.Referencia;

                            });

                        if (vtasReferencias.length > 0)
                            setIsLoading(false);

                        setmovimientos(vtasreferencia);

                    } else
                        if (selectedAno.length > 0 && selectedMes.length > 0 && selectedGrupo.length > 0 &&
                            selectedSublinea.length > 0 && selectedMarca.length == 0) {

                            referenciacolorvtames &&
                                referenciacolorvtames.map((ref, index) => {
                                    if (ref.Periodo == periodo) {
                                        let ventaund = 0;
                                        let ventapesos = 0;
                                        let color = "";
                                        let grupo = "";
                                        let marca = "";
                                        let referencia = "";
                                        let sublinea = "";
                                        let talla = "";

                                        contador = contador + 1;
                                        if (contador < 500) {

                                            datomes &&
                                                datomes.map((vta, index) => {
                                                    if (vta.Periodo == periodo && vta.Referencia_Item == ref.Referencia &&
                                                        vta.Color == ref.Color) {

                                                        ventaund = parseInt(ventaund) + parseInt(vta.Cantidad);
                                                        ventapesos = parseInt(ventapesos) + parseInt(vta.Vlr_Neto);
                                                        talla = talla + "," + vta.Talla;
                                                        color = vta.Color;
                                                        grupo = vta.Grupo;
                                                        marca = vta.Marca;
                                                        referencia = vta.Referencia_Item;
                                                        sublinea = vta.Sublinea;
                                                    }
                                                });

                                            if (ventaund > 0) {
                                                let item = {
                                                    Cantidad: ventaund,
                                                    Color: color,
                                                    Grupo: grupo,
                                                    Marca: marca,
                                                    Periodo: periodo,
                                                    Referencia_Item: referencia,
                                                    Sublinea: sublinea,
                                                    Talla: talla,
                                                    Vlr_Neto: ventapesos
                                                }
                                                vtasreferenciaperiodo.push(item);

                                            }
                                        }
                                    }

                                });

                            referenciacolor &&
                                referenciacolor.map((ref, index) => {
                                    let cantidad = 0;
                                    let Grupo = 0;
                                    let Imagen = 0;
                                    let Marca = 0;
                                    let Referencia = 0;
                                    let Color = 0;
                                    let SubLinea = 0;
                                    let Talla = "";

                                    inventario &&
                                        inventario.map((vta, index) => {
                                            if (ref.Color == vta.Color && ref.Referencia == vta.Referencia) {

                                                cantidad = parseInt(cantidad) + parseInt(vta.Existencia);
                                                Grupo = vta.Grupo;
                                                Imagen = vta.Imagen;
                                                Marca = vta.Marca;
                                                Referencia = vta.Referencia;
                                                Color = vta.Color;
                                                SubLinea = vta.SubLinea;
                                                if (!vta.Talla)
                                                    Talla = Talla + "";
                                                else
                                                    Talla = Talla + vta.Talla + " = " + vta.Existencia + " Und  ";
                                            }
                                        });

                                    if (cantidad > 0) {
                                        let item = {
                                            Existencia: cantidad,
                                            Grupo: Grupo,
                                            Imagen: Imagen,
                                            Marca: Marca,
                                            Referencia: Referencia,
                                            Color: Color,
                                            SubLinea: SubLinea,
                                            Talla: Talla,
                                        }
                                        existenciareferenciacolor.push(item);
                                    }
                                });


                            let longitudexistencias = existenciareferenciacolor.length;

                            selectedSublinea &&
                                selectedSublinea.map((grp, index) => {
                                    vtasreferenciaperiodo &&
                                        vtasreferenciaperiodo.map((vta, index) => {
                                            if (grp.value === vta.Sublinea) {

                                                for (var i = 0; i < longitudexistencias; i++) {
                                                    if (existenciareferenciacolor[i].Referencia == vta.Referencia_Item &&
                                                        existenciareferenciacolor[i].Color == vta.Color
                                                    ) {
                                                        let item = {
                                                            Referencia: vta.Referencia_Item,
                                                            Cantidad: vta.Cantidad,
                                                            Existencia: existenciareferenciacolor[i].Existencia,
                                                            Imagen: existenciareferenciacolor[i].Imagen,
                                                            Color: existenciareferenciacolor[i].Color,
                                                            Talla: existenciareferenciacolor[i].Talla,
                                                            Grupo: vta.Grupo,
                                                            Sublinea: vta.Sublinea

                                                        }
                                                        vtasmasexistencia.push(item);
                                                        break
                                                    }
                                                }
                                            }
                                        });
                                });

                            selectedGrupo &&
                                selectedGrupo.map((grp, index) => {
                                    vtasmasexistencia &&
                                        vtasmasexistencia.map((vta, index) => {
                                            if (grp.Familias === vta.Grupo) {

                                                for (var i = 0; i < longitudexistencias; i++) {
                                                    if (existenciareferenciacolor[i].Referencia == vta.Referencia &&
                                                        existenciareferenciacolor[i].Color == vta.Color
                                                    ) {
                                                        let item = {
                                                            Referencia: vta.Referencia,
                                                            Cantidad: vta.Cantidad,
                                                            Existencia: existenciareferenciacolor[i].Existencia,
                                                            Imagen: existenciareferenciacolor[i].Imagen,
                                                            Color: existenciareferenciacolor[i].Color,
                                                            Talla: existenciareferenciacolor[i].Talla,
                                                            Grupo: vta.Grupo,
                                                            Sublinea: vta.Sublinea
                                                        }
                                                        vtasmasexistenciaSublineaGrupo.push(item);
                                                        break
                                                    }
                                                }
                                            }
                                        });
                                });

                            if (vtasmasexistenciaSublineaGrupo.length == 0) {
                                swal({
                                    title: "Tablero Cosmos",
                                    text: "No hay productos por ese criterio de selección!",
                                    icon: "warning",
                                });
                                setIsLoading(false);
                                return
                            }

                            let refe;

                            vtasmasexistenciaSublineaGrupo &&
                                vtasmasexistenciaSublineaGrupo.map((vta, index) => {

                                    let color = '';
                                    let talla = '';
                                    let temporada = '';
                                    let referenciaproveedor = '';
                                    let grupo = '';

                                    referencias &&
                                        referencias.map((ref, index) => {

                                            if (vta.Referencia == ref.referencia
                                            ) {
                                                color = ref.Color;
                                                talla = ref.Talla;
                                                temporada = ref.Temporada;
                                                grupo = ref.Grupo;
                                                referenciaproveedor = ref.referencia_proveedor;
                                            }
                                        });

                                    if (refe != vta.Referencia) {
                                        let rotacion = (parseInt(vta.Cantidad) / (parseInt(vta.Existencia) + parseInt(vta.Cantidad))) * 100
                                        let imagencosmos = "https://api.aal-cloud.com/files/comosdefault.jpg";

                                        if (vta.Imagen) {
                                            imagencosmos = "https://api.aal-cloud.com/files/cosmos/" + vta.Imagen;
                                        } else
                                            imagencosmos = "https://api.aal-cloud.com/files/comosdefault.jpg";

                                        let item = {
                                            Referencia: vta.Referencia,
                                            ReferenciaProv: referenciaproveedor,
                                            Color: vta.Color,
                                            Grupo: grupo,
                                            Venta: vta.Cantidad,
                                            Temporada: temporada,
                                            Talla: vta.Talla,
                                            Totalstock: vta.Existencia,
                                            Rotacion: rotacion,
                                            imageSrc: imagencosmos
                                        }

                                        vtasreferencia.push(item);
                                    }
                                    refe = vta.Referencia;

                                });

                            if (vtasReferencias.length > 0)
                                setIsLoading(false);
                            setmovimientos(vtasreferencia);
                        } else
                            if (selectedAno.length > 0 && selectedMes.length > 0 && selectedGrupo.length == 0 &&
                                selectedSublinea.length > 0 && selectedMarca.length > 0) {

                                referenciacolorvtames &&
                                    referenciacolorvtames.map((ref, index) => {
                                        if (ref.Periodo == periodo) {
                                            let ventaund = 0;
                                            let ventapesos = 0;
                                            let color = "";
                                            let grupo = "";
                                            let marca = "";
                                            let referencia = "";
                                            let sublinea = "";
                                            let talla = "";

                                            contador = contador + 1;
                                            if (contador < 500) {

                                                datomes &&
                                                    datomes.map((vta, index) => {
                                                        if (vta.Periodo == periodo && vta.Referencia_Item == ref.Referencia &&
                                                            vta.Color == ref.Color) {

                                                            ventaund = parseInt(ventaund) + parseInt(vta.Cantidad);
                                                            ventapesos = parseInt(ventapesos) + parseInt(vta.Vlr_Neto);
                                                            talla = talla + "," + vta.Talla;
                                                            color = vta.Color;
                                                            grupo = vta.Grupo;
                                                            marca = vta.Marca;
                                                            referencia = vta.Referencia_Item;
                                                            sublinea = vta.Sublinea;
                                                        }
                                                    });

                                                if (ventaund > 0) {
                                                    let item = {
                                                        Cantidad: ventaund,
                                                        Color: color,
                                                        Grupo: grupo,
                                                        Marca: marca,
                                                        Periodo: periodo,
                                                        Referencia_Item: referencia,
                                                        Sublinea: sublinea,
                                                        Talla: talla,
                                                        Vlr_Neto: ventapesos
                                                    }
                                                    vtasreferenciaperiodo.push(item);

                                                }
                                            }
                                        }

                                    });

                                referenciacolor &&
                                    referenciacolor.map((ref, index) => {
                                        let cantidad = 0;
                                        let Grupo = 0;
                                        let Imagen = 0;
                                        let Marca = 0;
                                        let Referencia = 0;
                                        let Color = 0;
                                        let SubLinea = 0;
                                        let Talla = "";

                                        inventario &&
                                            inventario.map((vta, index) => {
                                                if (ref.Color == vta.Color && ref.Referencia == vta.Referencia) {

                                                    cantidad = parseInt(cantidad) + parseInt(vta.Existencia);
                                                    Grupo = vta.Grupo;
                                                    Imagen = vta.Imagen;
                                                    Marca = vta.Marca;
                                                    Referencia = vta.Referencia;
                                                    Color = vta.Color;
                                                    SubLinea = vta.SubLinea;
                                                    if (!vta.Talla)
                                                        Talla = Talla + "";
                                                    else
                                                        Talla = Talla + vta.Talla + " = " + vta.Existencia + " Und  ";
                                                }
                                            });

                                        if (cantidad > 0) {
                                            let item = {
                                                Existencia: cantidad,
                                                Grupo: Grupo,
                                                Imagen: Imagen,
                                                Marca: Marca,
                                                Referencia: Referencia,
                                                Color: Color,
                                                SubLinea: SubLinea,
                                                Talla: Talla,
                                            }
                                            existenciareferenciacolor.push(item);
                                        }
                                    });


                                let longitudexistencias = existenciareferenciacolor.length;

                                //console.log("INVENTARIO : ", existenciareferenciacolor)
                                //return

                                selectedSublinea &&
                                    selectedSublinea.map((grp, index) => {
                                        vtasreferenciaperiodo &&
                                            vtasreferenciaperiodo.map((vta, index) => {
                                                if (grp.value === vta.Sublinea) {

                                                    for (var i = 0; i < longitudexistencias; i++) {
                                                        if (existenciareferenciacolor[i].Referencia == vta.Referencia_Item &&
                                                            existenciareferenciacolor[i].Color == vta.Color
                                                        ) {
                                                            let item = {
                                                                Referencia: vta.Referencia_Item,
                                                                Cantidad: vta.Cantidad,
                                                                Existencia: existenciareferenciacolor[i].Existencia,
                                                                Imagen: existenciareferenciacolor[i].Imagen,
                                                                Color: existenciareferenciacolor[i].Color,
                                                                Talla: existenciareferenciacolor[i].Talla,
                                                                Marca: existenciareferenciacolor[i].Marca,
                                                                Grupo: vta.Grupo,
                                                                Sublinea: vta.Sublinea

                                                            }
                                                            vtasmasexistencia.push(item);
                                                            break
                                                        }
                                                    }
                                                }
                                            });
                                    });

                                //console.log("INVENTARIO : ", vtasmasexistencia)
                                //return

                                selectedMarca &&
                                    selectedMarca.map((grp, index) => {
                                        vtasmasexistencia &&
                                            vtasmasexistencia.map((vta, index) => {
                                                if (grp.value === vta.Marca) {

                                                    for (var i = 0; i < longitudexistencias; i++) {
                                                        if (existenciareferenciacolor[i].Referencia == vta.Referencia &&
                                                            existenciareferenciacolor[i].Color == vta.Color
                                                        ) {
                                                            let item = {
                                                                Referencia: vta.Referencia,
                                                                Cantidad: vta.Cantidad,
                                                                Existencia: existenciareferenciacolor[i].Existencia,
                                                                Imagen: existenciareferenciacolor[i].Imagen,
                                                                Color: existenciareferenciacolor[i].Color,
                                                                Talla: existenciareferenciacolor[i].Talla,
                                                                Grupo: vta.Grupo,
                                                                Sublinea: vta.Sublinea,
                                                                Marca: vta.Marca,
                                                            }
                                                            vtasmasexistenciaSublineaMarca.push(item);
                                                            break
                                                        }
                                                    }
                                                }
                                            });
                                    });

                                //console.log("INVENTARIO : ", vtasmasexistenciaSublineaMarca)
                                //return

                                if (vtasmasexistenciaSublineaMarca.length == 0) {
                                    swal({
                                        title: "Tablero Cosmos",
                                        text: "No hay productos por ese criterio de selección!",
                                        icon: "warning",
                                    });
                                    setIsLoading(false);
                                    return
                                }

                                let refe;

                                vtasmasexistenciaSublineaMarca &&
                                    vtasmasexistenciaSublineaMarca.map((vta, index) => {

                                        let color = '';
                                        let talla = '';
                                        let temporada = '';
                                        let referenciaproveedor = '';
                                        let grupo = '';

                                        referencias &&
                                            referencias.map((ref, index) => {

                                                if (vta.Referencia == ref.referencia
                                                ) {
                                                    color = ref.Color;
                                                    talla = ref.Talla;
                                                    temporada = ref.Temporada;
                                                    grupo = ref.Grupo;
                                                    referenciaproveedor = ref.referencia_proveedor;
                                                }
                                            });

                                        if (refe != vta.Referencia) {
                                            let rotacion = (parseInt(vta.Cantidad) / (parseInt(vta.Existencia) + parseInt(vta.Cantidad))) * 100
                                            let imagencosmos = "https://api.aal-cloud.com/files/comosdefault.jpg";

                                            if (vta.Imagen) {
                                                imagencosmos = "https://api.aal-cloud.com/files/cosmos/" + vta.Imagen;
                                            } else
                                                imagencosmos = "https://api.aal-cloud.com/files/comosdefault.jpg";

                                            let item = {
                                                Referencia: vta.Referencia,
                                                ReferenciaProv: referenciaproveedor,
                                                Color: vta.Color,
                                                Grupo: grupo,
                                                Venta: vta.Cantidad,
                                                Temporada: temporada,
                                                Talla: vta.Talla,
                                                Totalstock: vta.Existencia,
                                                Rotacion: rotacion,
                                                imageSrc: imagencosmos
                                            }

                                            vtasreferencia.push(item);
                                        }
                                        refe = vta.Referencia;

                                    });

                                setmovimientos(vtasreferencia);
                            } else
                                if (selectedAno.length > 0 && selectedMes.length > 0 && selectedGrupo.length > 0 &&
                                    selectedSublinea.length == 0 && selectedMarca.length > 0) {

                                    referenciacolorvtames &&
                                        referenciacolorvtames.map((ref, index) => {
                                            if (ref.Periodo == periodo) {
                                                let ventaund = 0;
                                                let ventapesos = 0;
                                                let color = "";
                                                let grupo = "";
                                                let marca = "";
                                                let referencia = "";
                                                let sublinea = "";
                                                let talla = "";

                                                contador = contador + 1;
                                                if (contador < 500) {

                                                    datomes &&
                                                        datomes.map((vta, index) => {
                                                            if (vta.Periodo == periodo && vta.Referencia_Item == ref.Referencia &&
                                                                vta.Color == ref.Color) {

                                                                ventaund = parseInt(ventaund) + parseInt(vta.Cantidad);
                                                                ventapesos = parseInt(ventapesos) + parseInt(vta.Vlr_Neto);
                                                                talla = talla + "," + vta.Talla;
                                                                color = vta.Color;
                                                                grupo = vta.Grupo;
                                                                marca = vta.Marca;
                                                                referencia = vta.Referencia_Item;
                                                                sublinea = vta.Sublinea;
                                                            }
                                                        });

                                                    if (ventaund > 0) {
                                                        let item = {
                                                            Cantidad: ventaund,
                                                            Color: color,
                                                            Grupo: grupo,
                                                            Marca: marca,
                                                            Periodo: periodo,
                                                            Referencia_Item: referencia,
                                                            Sublinea: sublinea,
                                                            Talla: talla,
                                                            Vlr_Neto: ventapesos
                                                        }
                                                        vtasreferenciaperiodo.push(item);

                                                    }
                                                }
                                            }

                                        });

                                    referenciacolor &&
                                        referenciacolor.map((ref, index) => {
                                            let cantidad = 0;
                                            let Grupo = 0;
                                            let Imagen = 0;
                                            let Marca = 0;
                                            let Referencia = 0;
                                            let Color = 0;
                                            let SubLinea = 0;
                                            let Talla = "";

                                            inventario &&
                                                inventario.map((vta, index) => {
                                                    if (ref.Color == vta.Color && ref.Referencia == vta.Referencia) {

                                                        cantidad = parseInt(cantidad) + parseInt(vta.Existencia);
                                                        Grupo = vta.Grupo;
                                                        Imagen = vta.Imagen;
                                                        Marca = vta.Marca;
                                                        Referencia = vta.Referencia;
                                                        Color = vta.Color;
                                                        SubLinea = vta.SubLinea;
                                                        if (!vta.Talla)
                                                            Talla = Talla + "";
                                                        else
                                                            Talla = Talla + vta.Talla + " = " + vta.Existencia + " Und  ";
                                                    }
                                                });

                                            if (cantidad > 0) {
                                                let item = {
                                                    Existencia: cantidad,
                                                    Grupo: Grupo,
                                                    Imagen: Imagen,
                                                    Marca: Marca,
                                                    Referencia: Referencia,
                                                    Color: Color,
                                                    SubLinea: SubLinea,
                                                    Talla: Talla,
                                                }
                                                existenciareferenciacolor.push(item);
                                            }
                                        });


                                    let longitudexistencias = existenciareferenciacolor.length;

                                    selectedMarca &&
                                        selectedMarca.map((grp, index) => {
                                            vtasreferenciaperiodo &&
                                                vtasreferenciaperiodo.map((vta, index) => {
                                                    if (grp.value === vta.Marca) {

                                                        for (var i = 0; i < longitudexistencias; i++) {
                                                            if (existenciareferenciacolor[i].Referencia == vta.Referencia_Item &&
                                                                existenciareferenciacolor[i].Color == vta.Color
                                                            ) {
                                                                let item = {
                                                                    Referencia: vta.Referencia_Item,
                                                                    Cantidad: vta.Cantidad,
                                                                    Existencia: existenciareferenciacolor[i].Existencia,
                                                                    Imagen: existenciareferenciacolor[i].Imagen,
                                                                    Color: existenciareferenciacolor[i].Color,
                                                                    Talla: existenciareferenciacolor[i].Talla,
                                                                    Grupo: vta.Grupo,
                                                                    Sublinea: vta.Sublinea,
                                                                    Marca: vta.Marca,
                                                                }
                                                                vtasmasexistenciaMarcaGrupo.push(item);
                                                                break
                                                            }
                                                        }
                                                    }
                                                });
                                        });

                                    //console.log("INVENTARIO : ", selectedGrupo)
                                    //return

                                    selectedGrupo &&
                                        selectedGrupo.map((grp, index) => {
                                            vtasmasexistenciaMarcaGrupo &&
                                                vtasmasexistenciaMarcaGrupo.map((vta, index) => {
                                                    if (grp.Familias === vta.Grupo) {

                                                        for (var i = 0; i < longitudexistencias; i++) {
                                                            if (existenciareferenciacolor[i].Referencia == vta.Referencia &&
                                                                existenciareferenciacolor[i].Color == vta.Color
                                                            ) {
                                                                let item = {
                                                                    Referencia: vta.Referencia,
                                                                    Cantidad: vta.Cantidad,
                                                                    Existencia: existenciareferenciacolor[i].Existencia,
                                                                    Imagen: existenciareferenciacolor[i].Imagen,
                                                                    Color: existenciareferenciacolor[i].Color,
                                                                    Talla: existenciareferenciacolor[i].Talla,
                                                                    Grupo: vta.Grupo,
                                                                    Sublinea: vta.Sublinea
                                                                }
                                                                vtasmasexistenciaSublineaGrupoMarca.push(item);
                                                                break
                                                            }
                                                        }
                                                    }
                                                });
                                        });

                                    //console.log("INVENTARIO : ", vtasmasexistenciaSublineaGrupoMarca)
                                    //return

                                    if (vtasmasexistenciaSublineaGrupoMarca.length == 0) {
                                        swal({
                                            title: "Tablero Cosmos",
                                            text: "No hay productos por ese criterio de selección!",
                                            icon: "warning",
                                        });
                                        setIsLoading(false);
                                        return
                                    }

                                    let refe;

                                    vtasmasexistenciaSublineaGrupoMarca &&
                                        vtasmasexistenciaSublineaGrupoMarca.map((vta, index) => {

                                            let color = '';
                                            let talla = '';
                                            let temporada = '';
                                            let referenciaproveedor = '';
                                            let grupo = '';

                                            referencias &&
                                                referencias.map((ref, index) => {

                                                    if (vta.Referencia == ref.referencia
                                                    ) {
                                                        color = ref.Color;
                                                        talla = ref.Talla;
                                                        temporada = ref.Temporada;
                                                        grupo = ref.Grupo;
                                                        referenciaproveedor = ref.referencia_proveedor;
                                                    }
                                                });

                                            if (refe != vta.Referencia) {
                                                let rotacion = (parseInt(vta.Cantidad) / (parseInt(vta.Existencia) + parseInt(vta.Cantidad))) * 100
                                                let imagencosmos = "https://api.aal-cloud.com/files/comosdefault.jpg";

                                                if (vta.Imagen) {
                                                    imagencosmos = "https://api.aal-cloud.com/files/cosmos/" + vta.Imagen;
                                                } else
                                                    imagencosmos = "https://api.aal-cloud.com/files/comosdefault.jpg";

                                                let item = {
                                                    Referencia: vta.Referencia,
                                                    ReferenciaProv: referenciaproveedor,
                                                    Color: vta.Color,
                                                    Grupo: grupo,
                                                    Venta: vta.Cantidad,
                                                    Temporada: temporada,
                                                    Talla: vta.Talla,
                                                    Totalstock: vta.Existencia,
                                                    Rotacion: rotacion,
                                                    imageSrc: imagencosmos
                                                }

                                                vtasreferencia.push(item);
                                            }
                                            refe = vta.Referencia;

                                        });

                                    if (vtasReferencias.length > 0)
                                        setIsLoading(false);
                                    setmovimientos(vtasreferencia);
                                } else
                                    if (selectedAno.length > 0 && selectedMes.length > 0 && selectedGrupo.length > 0 &&
                                        selectedSublinea.length > 0 && selectedMarca.length > 0) {

                                        referenciacolorvtames &&
                                            referenciacolorvtames.map((ref, index) => {
                                                if (ref.Periodo == periodo) {
                                                    let ventaund = 0;
                                                    let ventapesos = 0;
                                                    let color = "";
                                                    let grupo = "";
                                                    let marca = "";
                                                    let referencia = "";
                                                    let sublinea = "";
                                                    let talla = "";

                                                    contador = contador + 1;
                                                    if (contador < 500) {

                                                        datomes &&
                                                            datomes.map((vta, index) => {
                                                                if (vta.Periodo == periodo && vta.Referencia_Item == ref.Referencia &&
                                                                    vta.Color == ref.Color) {

                                                                    ventaund = parseInt(ventaund) + parseInt(vta.Cantidad);
                                                                    ventapesos = parseInt(ventapesos) + parseInt(vta.Vlr_Neto);
                                                                    talla = talla + "," + vta.Talla;
                                                                    color = vta.Color;
                                                                    grupo = vta.Grupo;
                                                                    marca = vta.Marca;
                                                                    referencia = vta.Referencia_Item;
                                                                    sublinea = vta.Sublinea;
                                                                }
                                                            });

                                                        if (ventaund > 0) {
                                                            let item = {
                                                                Cantidad: ventaund,
                                                                Color: color,
                                                                Grupo: grupo,
                                                                Marca: marca,
                                                                Periodo: periodo,
                                                                Referencia_Item: referencia,
                                                                Sublinea: sublinea,
                                                                Talla: talla,
                                                                Vlr_Neto: ventapesos
                                                            }
                                                            vtasreferenciaperiodo.push(item);

                                                        }
                                                    }
                                                }

                                            });

                                        referenciacolor &&
                                            referenciacolor.map((ref, index) => {
                                                let cantidad = 0;
                                                let Grupo = 0;
                                                let Imagen = 0;
                                                let Marca = 0;
                                                let Referencia = 0;
                                                let Color = 0;
                                                let SubLinea = 0;
                                                let Talla = "";

                                                inventario &&
                                                    inventario.map((vta, index) => {
                                                        if (ref.Color == vta.Color && ref.Referencia == vta.Referencia) {

                                                            cantidad = parseInt(cantidad) + parseInt(vta.Existencia);
                                                            Grupo = vta.Grupo;
                                                            Imagen = vta.Imagen;
                                                            Marca = vta.Marca;
                                                            Referencia = vta.Referencia;
                                                            Color = vta.Color;
                                                            SubLinea = vta.SubLinea;
                                                            if (!vta.Talla)
                                                                Talla = Talla + "";
                                                            else
                                                                Talla = Talla + vta.Talla + " = " + vta.Existencia + " Und  ";
                                                        }
                                                    });

                                                if (cantidad > 0) {
                                                    let item = {
                                                        Existencia: cantidad,
                                                        Grupo: Grupo,
                                                        Imagen: Imagen,
                                                        Marca: Marca,
                                                        Referencia: Referencia,
                                                        Color: Color,
                                                        SubLinea: SubLinea,
                                                        Talla: Talla,
                                                    }
                                                    existenciareferenciacolor.push(item);
                                                }
                                            });


                                        let longitudexistencias = existenciareferenciacolor.length;

                                        //console.log("INVENTARIO : ", existenciareferenciacolor)
                                        //return

                                        selectedSublinea &&
                                            selectedSublinea.map((grp, index) => {
                                                vtasreferenciaperiodo &&
                                                    vtasreferenciaperiodo.map((vta, index) => {
                                                        if (grp.value === vta.Sublinea) {

                                                            for (var i = 0; i < longitudexistencias; i++) {
                                                                if (existenciareferenciacolor[i].Referencia == vta.Referencia_Item &&
                                                                    existenciareferenciacolor[i].Color == vta.Color
                                                                ) {
                                                                    let item = {
                                                                        Referencia: vta.Referencia_Item,
                                                                        Cantidad: vta.Cantidad,
                                                                        Existencia: existenciareferenciacolor[i].Existencia,
                                                                        Imagen: existenciareferenciacolor[i].Imagen,
                                                                        Color: existenciareferenciacolor[i].Color,
                                                                        Talla: existenciareferenciacolor[i].Talla,
                                                                        Marca: existenciareferenciacolor[i].Marca,
                                                                        Grupo: vta.Grupo,
                                                                        Sublinea: vta.Sublinea

                                                                    }
                                                                    vtasmasexistencia.push(item);
                                                                    break
                                                                }
                                                            }
                                                        }
                                                    });
                                            });

                                        //console.log("INVENTARIO : ", vtasmasexistencia)
                                        //return

                                        selectedMarca &&
                                            selectedMarca.map((grp, index) => {
                                                vtasmasexistencia &&
                                                    vtasmasexistencia.map((vta, index) => {
                                                        if (grp.value === vta.Marca) {

                                                            for (var i = 0; i < longitudexistencias; i++) {
                                                                if (existenciareferenciacolor[i].Referencia == vta.Referencia &&
                                                                    existenciareferenciacolor[i].Color == vta.Color
                                                                ) {
                                                                    let item = {
                                                                        Referencia: vta.Referencia,
                                                                        Cantidad: vta.Cantidad,
                                                                        Existencia: existenciareferenciacolor[i].Existencia,
                                                                        Imagen: existenciareferenciacolor[i].Imagen,
                                                                        Color: existenciareferenciacolor[i].Color,
                                                                        Talla: existenciareferenciacolor[i].Talla,
                                                                        Grupo: vta.Grupo,
                                                                        Sublinea: vta.Sublinea,
                                                                        Marca: vta.Marca,
                                                                    }
                                                                    vtasmasexistenciaSublineaMarca.push(item);
                                                                    break
                                                                }
                                                            }
                                                        }
                                                    });
                                            });

                                        selectedGrupo &&
                                            selectedGrupo.map((grp, index) => {
                                                vtasmasexistenciaSublineaMarca &&
                                                    vtasmasexistenciaSublineaMarca.map((vta, index) => {
                                                        if (grp.Familias === vta.Grupo) {

                                                            for (var i = 0; i < longitudexistencias; i++) {
                                                                if (existenciareferenciacolor[i].Referencia == vta.Referencia &&
                                                                    existenciareferenciacolor[i].Color == vta.Color
                                                                ) {
                                                                    let item = {
                                                                        Referencia: vta.Referencia,
                                                                        Cantidad: vta.Cantidad,
                                                                        Existencia: existenciareferenciacolor[i].Existencia,
                                                                        Imagen: existenciareferenciacolor[i].Imagen,
                                                                        Color: existenciareferenciacolor[i].Color,
                                                                        Talla: existenciareferenciacolor[i].Talla,
                                                                        Grupo: vta.Grupo,
                                                                        Sublinea: vta.Sublinea
                                                                    }
                                                                    vtasmasexistenciaSublineaGrupoMarca.push(item);
                                                                    break
                                                                }
                                                            }
                                                        }
                                                    });
                                            });

                                        //console.log("INVENTARIO : ", vtasmasexistenciaSublineaGrupoMarca)
                                        //return

                                        if (vtasmasexistenciaSublineaGrupoMarca.length == 0) {
                                            swal({
                                                title: "Tablero Cosmos",
                                                text: "No hay productos por ese criterio de selección!",
                                                icon: "warning",
                                            });
                                            setIsLoading(false);
                                            return
                                        }

                                        let refe;

                                        vtasmasexistenciaSublineaGrupoMarca &&
                                            vtasmasexistenciaSublineaGrupoMarca.map((vta, index) => {

                                                let color = '';
                                                let talla = '';
                                                let temporada = '';
                                                let referenciaproveedor = '';
                                                let grupo = '';

                                                referencias &&
                                                    referencias.map((ref, index) => {

                                                        if (vta.Referencia == ref.referencia
                                                        ) {
                                                            color = ref.Color;
                                                            talla = ref.Talla;
                                                            temporada = ref.Temporada;
                                                            grupo = ref.Grupo;
                                                            referenciaproveedor = ref.referencia_proveedor;
                                                        }
                                                    });

                                                if (refe != vta.Referencia) {
                                                    let rotacion = (parseInt(vta.Cantidad) / (parseInt(vta.Existencia) + parseInt(vta.Cantidad))) * 100
                                                    let imagencosmos = "https://api.aal-cloud.com/files/comosdefault.jpg";

                                                    if (vta.Imagen) {
                                                        imagencosmos = "https://api.aal-cloud.com/files/cosmos/" + vta.Imagen;
                                                    } else
                                                        imagencosmos = "https://api.aal-cloud.com/files/comosdefault.jpg";

                                                    let item = {
                                                        Referencia: vta.Referencia,
                                                        ReferenciaProv: referenciaproveedor,
                                                        Color: vta.Color,
                                                        Grupo: grupo,
                                                        Venta: vta.Cantidad,
                                                        Temporada: temporada,
                                                        Talla: vta.Talla,
                                                        Totalstock: vta.Existencia,
                                                        Rotacion: rotacion,
                                                        imageSrc: imagencosmos
                                                    }

                                                    vtasreferencia.push(item);
                                                }
                                                refe = vta.Referencia;

                                            });

                                        if (vtasReferencias.length > 0)
                                            setIsLoading(false);
                                        setmovimientos(vtasreferencia);
                                    }

    }

    useEffect(() => {
        let det;
        let newdat = [];
        if (opcion == 0) {
            setTipo(1)
            setEntMes(true)
            setEntAcumuladas(false)
        } else
            if (opcion == 1) {
                setTipo(2)
                setEntMes(false)
                setEntAcumuladas(true)

            } else {
                setEntMes(true)
                setEntAcumuladas(false)
            }
        setConsultar(true);
    }, [opcion]);

    const sortTotalStock = (item) => {
        setOrdenaTotalStock(!ordenaTotalStock)
        if (ordenaTotalStock) {
            movimientos.sort(function (a, b) {
                return (b.Totalstock - a.Totalstock)
            })
        } else {
            movimientos.sort(function (a, b) {
                return (a.Totalstock - b.Totalstock)
            })
        }
    }

    const sortRotacion = (item) => {
        setOrdenaRotacion(!ordenaRotacion)
        if (ordenaRotacion) {
            movimientos.sort(function (a, b) {
                return (b.Rotacion - a.Rotacion)
            })
        } else {
            movimientos.sort(function (a, b) {
                return (a.Rotacion - b.Rotacion)
            })
        }
    }

    const sortTemporada = (item) => {
        setOrdenaTemporada(!ordenaTemporada)
        if (ordenaTemporada) {
            movimientos.sort(function (a, b) {
                return (b.Temporada - a.Temporada)
            })
        } else {
            movimientos.sort(function (a, b) {
                return (a.Temporada - b.Temporada)
            })
        }
    }

    const sortVenta = (item) => {
        setOrdenaVenta(!ordenaVenta)
        if (ordenaVenta) {
            movimientos.sort(function (a, b) {
                return (b.Venta - a.Venta)
            })
        } else {
            movimientos.sort(function (a, b) {
                return (a.Venta - b.Venta)
            })
        }
    }

    const sortGrupo = (item) => {
        setOrdenaGrupo(!ordenaGrupo)
        if (ordenaGrupo) {
            movimientos.sort(function (a, b) {
                return (b.Grupo - a.Grupo)
            })
        } else {
            movimientos.sort(function (a, b) {
                return (a.Grupo - b.Grupo)
            })
        }
    }

    const sortColor = (item) => {
        setOrdenaColor(!ordenaColor)
        if (ordenaColor) {
            movimientos.sort(function (a, b) {
                return (b.Color - a.Color)
            })
        } else {
            movimientos.sort(function (a, b) {
                return (a.Color - b.Color)
            })
        }
    }

    const header_test = [
        {
            title: "Foto", dataIndex: "imageSrc", key: "imageSrc", width: 220, align: "left", fixed: true,
            render: (text, row, index) => {
                return (
                    <img
                        src={row.imageSrc + '?v=15454'}
                        alt={row.imageAlt}
                        className="ml-3 h-23 w-23 rounded-md object-cover object-center  sm:h-18 sm:w-18"
                    />

                );
            }
        },
        { title: "Referencia", dataIndex: "Referencia", key: "Referencia", width: 180 },
        { title: "Ref. Proveedor", dataIndex: "ReferenciaProv", key: "ReferenciaProv", width: 180 },
        { title: "Color", dataIndex: "Color", key: "Color", width: 150 },
        { title: "Talla - Cantidad", dataIndex: "Talla", key: "Talla", width: 180 },
        { title: "Grupo", dataIndex: "Grupo", key: "Grupo", width: 200 },
        {
            title: "Venta", dataIndex: "Venta", key: "Venta", width: 130, align: "right",
            sorter: (a, b) => a.Venta - b.Venta,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.Venta, 2)}
                    </Title>


                );
            }
        },
        { title: "Temporada", dataIndex: "Temporada", key: "Temporada", width: 200 },
        {
            title: "Totalstock", dataIndex: "Totalstock", key: "Totalstock", width: 150, align: "right",
            sorter: (a, b) => a.Totalstock - b.Totalstock,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.Totalstock, 2)}
                    </Title>

                );
            }
        },
        {
            title: "Rotacion", dataIndex: "Rotacion", key: "Rotacion", width: 150, align: "right",
            sorter: (a, b) => a.Rotacion - b.Rotacion,
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.Rotacion, 1)}
                    </Title>

                );
            }
        }
    ]

    return (
        <div className="mlanegativo">
            <h2 className="mx-auto mt-1 px-4 text-lg leading-6 font-medium text-gray-900 sm:px-6 lg:px-8">
                <div className="col-start-1 row-start-1 py-3">
                    <div className="ml-30 mx-auto flex max-w-7xl justify-center px-4 sm:px-6 lg:px-8">
                        {/* justify-end */}
                        <div className="flex">
                            <Menu as="div" className="relative inline-block">
                                <MultiSelect
                                    options={registros}
                                    value={tipoConsulta}
                                    onChange={setTipoConsulta}
                                    disableSearch="false"
                                    labelledBy="Registros"
                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    overrideStrings={{
                                        search: "Buscar",
                                        selectSomeItems: "Tipo consulta.",
                                        allItemsAreSelected:
                                            "Todos los años",
                                        selectAll: "Todos"
                                    }}
                                />
                            </Menu>
                        </div>

                        <div className="flex">
                            <Menu as="div" className="relative inline-block">
                                <MultiSelect
                                    options={vtasAno}
                                    value={selectedAno}
                                    onChange={setSelectedAno}
                                    disableSearch="false"
                                    labelledBy="Filtrar por año"
                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    overrideStrings={{
                                        search: "Buscar",
                                        selectSomeItems: "Filtrar por año...",
                                        allItemsAreSelected:
                                            "Todos los años",

                                        selectAll:
                                            "Todos"
                                    }}
                                />
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
                            </Menu>
                        </div>
                        {/*
                        <div className="flex">
                            <Menu as="div" className="relative inline-block" >
                                <MultiSelect
                                    options={vtasDia}
                                    value={selectedDia}
                                    disabled={true}
                                    onChange={setSelectedDia}
                                    labelledBy="Filtrar por marca"
                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    overrideStrings={{
                                        selectSomeItems: "Filtrar por día...",
                                        allItemsAreSelected:
                                            "Todas las marcas",
                                        search: "Buscar",
                                        selectAll:
                                            "Todos"
                                    }}
                                />
                            </Menu>
                        </div>
                                */ }
                        <div className="flex">
                            <Menu as="div" className="relative inline-block" >
                                <MultiSelect
                                    options={vtasGrupo}
                                    value={selectedGrupo}
                                    onChange={setSelectedGrupo}
                                    enableSearch="true"
                                    labelledBy="Filtrar por grupo"
                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    overrideStrings={{
                                        selectSomeItems: "Filtrar por Grupo...",
                                        allItemsAreSelected:
                                            "Todos los grupos",
                                        search: "Buscar",
                                        selectAll:
                                            "Todos"
                                    }}
                                />
                            </Menu>
                        </div>

                        <div className="flex">
                            <Menu as="div" className="relative inline-block" >
                                <MultiSelect
                                    options={vtasSublinea}
                                    value={selectedSublinea}
                                    onChange={setSelectedSublinea}
                                    enableSearch="true"
                                    labelledBy="Filtrar por sublínea"
                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    overrideStrings={{
                                        selectSomeItems: "Filtrar por Sublínea...",
                                        allItemsAreSelected:
                                            "Todas las Sublineas",
                                        search: "Buscar",
                                        selectAll:
                                            "Todos"
                                    }}
                                />
                            </Menu>
                        </div>
                        <div className="flex">
                            <Menu as="div" className="relative inline-block" >
                                <MultiSelect
                                    options={vtasMarca}
                                    value={selectedMarca}
                                    onChange={setSelectedMarca}
                                    enableSearch="true"
                                    labelledBy="Filtrar por marca"
                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    overrideStrings={{
                                        selectSomeItems: "Filtrar por marca...",
                                        allItemsAreSelected:
                                            "Todas las marcas",
                                        search: "Buscar",
                                        selectAll:
                                            "Todos"
                                    }}
                                />
                            </Menu>
                        </div>

                        <div className="flex">
                            <Menu as="div" className="relative inline-block" >
                                <h3 className="ml-4 text-sm font-medium text-gray-700 hover:text-gray-900">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <tbody className="bg-white">
                                            {
                                                filtroDia && filtroDia.map((row, comprasIdx) => (
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
                    </div>
                    <div className="mt-5 ml-10 mx-auto flex max-w-7xl justify-center px-4 sm:px-6 lg:px-8">
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
                <div className="-mt-2 hidden sm:block ml-12">

                    <div className="border-b border-gray-200">
                        <nav className="ml-1 -mb-px flex space-x-8" aria-label="Tabs">
                            {tabsdos.map((tab, index) => (
                                <a
                                    key={tab.name}
                                    onClick={() => selVentas(index)}
                                    className={classNames(
                                        tab.current
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                        'sticky left-60   whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                                    )}
                                    aria-current={tab.current ? 'page' : undefined}
                                >
                                    <div>
                                        {tab.name}
                                    </div>
                                </a>
                            ))}
                        </nav>
                    </div>
                    <div className="ml-6 px-4 sm:px-6 lg:px-0">
                        <div>
                            {
                                /*
                                isLoading ?
                                    (
                                        <div >
                                            <Spinner className="w-9 h-9" />
                                            <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                                Cargando datos ...
                                            </h1>
                                        </div>
                                    )
                                    :
                                    null
                                    */
                            }

                        </div>
                        <div className="mt-8 flex flex-col">
                            <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
                                <div className=" min-w-full py-0 align-middle md:px-6 lg:px-1">
                                    <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                        <Table
                                            columns={header_test}
                                            dataSource={movimientos}
                                            pagination={false}
                                            scroll={{
                                                x: 1300,
                                                y: 600,
                                            }}
                                            bordered />
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

export default TabInformeVtas;