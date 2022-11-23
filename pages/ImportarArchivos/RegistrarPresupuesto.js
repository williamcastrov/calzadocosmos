import { Fragment, useState, useEffect } from "react";
import * as XLSX from "xlsx";
import swal from 'sweetalert';
import axios from "axios";
import NavBar from "../../components/NavBar/NavBar";
import { Table, Typography, Button, Input, Spin } from 'antd';
import { myNumber, nameMonth } from "../../utils/ArrayFunctions";


function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function RegistrarPresupuesto(props) {
    const { Title } = Typography;
    const [contratacionesMtto, setContrataciones] = useState([]);
    const [ok, setOk] = useState(true);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: 'Tipo',
            dataIndex: 'tipo',
        },
        {
            title: 'Año',
            dataIndex: 'ano'
        },
        {
            title: 'Mes',
            dataIndex: 'mes'
        },
        {
            title: 'Periodo',
            dataIndex: 'periodo'
        },
        {
            title: 'IdBodega',
            dataIndex: 'idbodega'
        },
        {
            title: 'NombreBodega',
            dataIndex: 'nombrebodega',
            width: 200,
            align: "left",

        },
        {
            title: 'NombreConcepto',
            dataIndex: 'nombreconcepto',
            width: 200,
            align: "left",

        },
        {
            title: 'Ppto_Und',
            dataIndex: 'pptosund',
            align: "right",
        },
        {
            title: 'Costo_promedio',
            dataIndex: 'costopromedppto',
            align: "right",
        },
        {
            title: 'Ppto_Valor',
            dataIndex: 'pptovalor',
            align: "right",
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 14, }}>
                        {myNumber(1, row.pptovalor, 2)}
                    </Title>

                );
            }
        },
    ];

    const readExcel = (file) => {
        //console.log("FILE : ", file)
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);
            console.log("FILE : ", file)
            fileReader.onload = (e) => {
                const bufferArray = e.target.result;

                const wb = XLSX.read(bufferArray, { type: "buffer" });

                const wsname = wb.SheetNames[0];

                const ws = wb.Sheets[wsname];

                const data = XLSX.utils.sheet_to_json(ws);

                resolve(data);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });

        promise.then((d) => {
            setContrataciones(d);
        });
    };

    const subirContrataciones = () => {

        const addContrataciones = async () => {
            //console.log("CONTRATACIONES IMPORTADAS : ", contratacionesMtto);

            var longitud = contratacionesMtto.length;
            console.log("LONGITUD : ", contratacionesMtto);
            setLoading(true);

            for (var i = 0; i < longitud; i++) {

                if (i == (longitud - 1)) {
                    setLoading(false);
                }

                const datospppto = async () => {

                    let params = {
                        tipo: contratacionesMtto[i].tipo,
                        ano: contratacionesMtto[i].anoo,
                        mes: contratacionesMtto[i].mes,
                        periodo: contratacionesMtto[i].periodo,
                        nombremes: contratacionesMtto[i].nombremes,
                        idbodega: contratacionesMtto[i].idbodega,
                        nombrebodega: contratacionesMtto[i].nombrebodega,
                        nombreconcepto: contratacionesMtto[i].nombreconcepto,
                        pptosund: contratacionesMtto[i].pptosund,
                        costopromedppto: contratacionesMtto[i].costopromedppto,
                        pptocomprasvalor: contratacionesMtto[i].pptocomprasvalor
                    };

                    await axios({
                        method: "post",
                        url: "https://api.aal-cloud.com/api/cosmos/17",
                        params,
                        headers: {
                            "Content-type": "*",
                        },
                    })
                        .then((res) => {
                            if (res) {
                                console.log("RES DATA : ", res)
                            } else {
                                console.log("GRABA DATOS PPTO")
                            }
                        })
                        .catch(function (error) {
                            console.log("ERROR GRABANDO PPTO")
                            //grabarDatosBD(datos)
                        });
                };
                datospppto();

            }

            if (ok) {
                setLoading(false);
                swal("Subir Contrataciones", "Archivo de Contrataciones cargado de forma correcta!", "success", { button: "Aceptar" });
                //console.log(res.message)
                //abrirCerrarModalCancelar();
            }
            else {
                swal("Subir Contrataciones", "Error Subiendo Archivo de contrataciones!", "error", { button: "Aceptar" });
                console.log(res.message);
                //abrirCerrarModalCancelar();
            }
            setLoading(false);

        }
        addContrataciones();
    }

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <div className="bg-white">
            <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 ">
                <NavBar />
            </div>

            <div className="mx-80 max-w-2xl py-16 px-4 sm:py-10 sm:px-6 lg:px-0">
                <h1 className="ml-80 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-3xl">Subir presupuesto</h1>

                <div className="ml-80">
                    <Input type="file" onChange={(e) => {
                        const file = e.target.files[0];
                        readExcel(file);
                    }} />
                    <button type="button" className="ml-20 mt-5 inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-cosmocolor hover:bg-violet focus:outline-none "
                        onClick={() => subirContrataciones()} >
                        Subir Archivo
                    </button>

                    {
                        loading ? <Spin size="large" /> : null
                    }
                </div>

            </div>
            <div className="ml-80 w-9/12 border-solid rounded border-2 border-gray-200">
                <Table columns={columns} dataSource={contratacionesMtto} onChange={onChange} />
            </div>
        </div>
    );
}

export default RegistrarPresupuesto;