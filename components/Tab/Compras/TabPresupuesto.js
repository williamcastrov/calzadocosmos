import { Fragment, useState, useEffect } from "react";
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';
import { myNumber, nameMonth } from "../../../utils/ArrayFunctions";
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MultiSelect } from "react-multi-select-component";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import swal from 'sweetalert';
import axios from "axios";
import NavBar from "../../../components/NavBar/NavBar";
import PickerButton from "antd/lib/date-picker/PickerButton";

const originData = [];

for (let i = 0; i < 10; i++) {
    originData.push({
        key: i.toString(),
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
    });
}

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function TabPresupuesto(props) {
    const { tipo, setTipo, listaPresupuestos } = props;
    const { Title } = Typography;
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [filtroAno, setFiltroAno] = useState(null);
    const [filtroMes, setFiltroMes] = useState(null);

    let vtasDiariasMes = [];
    vtasDiariasMes = useSelector((state) => state.datosfiltros.datosfiltros);

    const [selectedAno, setSelectedAno] = useState([]);
    const [selectedMes, setSelectedMes] = useState([]);

    const [vtasAno, setVtasAno] = useState(vtasDiariasMes.anos_vtasdiarias);
    const [vtasMes, setVtasMes] = useState(vtasDiariasMes.meses_vtasdiarias);

    useEffect(() => {
        let newDetAnos = [];

        vtasDiariasMes.anos_vtasdiarias &&
            vtasDiariasMes.anos_vtasdiarias.map((anos, index) => {
                let vta = {
                    Ventas_ano: anos.Ventas_ano,
                    value: anos.Ventas_ano,
                    label: anos.Ventas_ano
                };
                newDetAnos.push(vta);
            });
        setVtasAno(newDetAnos);

        let newDetMes = [];
        vtasDiariasMes.meses_vtasdiarias &&
            vtasDiariasMes.meses_vtasdiarias.map((meses, index) => {
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

    }, [vtasDiariasMes]);

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            pptocomprasvalor: '',
            pptosund: '',
            ...record,
        });
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                setData(newData);
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                console.log("NEW DATA : ", newData[index])
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const generarConsulta = () => {
        if (selectedAno.length < 1 || selectedMes.length < 0) {
            swal({
                title: "Tablero Cosmos",
                text: "Primero debes seleccionar el año y mes!",
                icon: "warning",
            });
            return
        }

        let newDet = [];

        let periodo = 0;
        
        if (selectedMes[0].value > 9)
            periodo = "" + selectedAno[0].value + selectedMes[0].value;
        else
            periodo = "" + selectedAno[0].value + "0" + selectedMes[0].value;

        //console.log("PPTO  : ", listaPresupuestos)
        //return
        listaPresupuestos.presupuestocompras &&
            listaPresupuestos.presupuestocompras.map((ppto, index) => {

                if (ppto.periodo == periodo) {
                    let vta = {
                        ano: ppto.ano,
                        costopromedppto: ppto.costopromedppto,
                        key:  ppto.id,
                        idbodega: ppto.idbodega,
                        mes: ppto.mes,
                        nombrebodega: ppto.nombrebodega,
                        nombreconcepto: ppto.nombreconcepto,
                        nombremes:  ppto.nombremes,
                        periodo:  ppto.periodo,
                        pptocomprasvalor:  ppto.pptocomprasvalor,
                        pptosund:  ppto.pptosund,
                        tipo:  ppto.tipo,
                        updated_at:  ppto.updated_at,
                        created_at:  ppto.created_at,
                        
                    };
                    newDet.push(vta);
                }
            });
        setData(newDet)
    }

    const columns = [
        {
            title: 'Año',
            dataIndex: 'ano',
            width: '10%',
            editable: true,
        },
        {
            title: 'Mes',
            dataIndex: 'mes',
            width: '10%',
            editable: true,
        },
        {
            title: 'Periodo',
            dataIndex: 'periodo',
            width: '15%',
            editable: true,
        },
        {
            title: 'Nombre Mes',
            dataIndex: 'nombremes',
            width: '15%',
            editable: true,
        },
        {
            title: 'IdBodega',
            dataIndex: 'idbodega',
            width: '10%',
            editable: true,
        },
        {
            title: 'Concepto',
            dataIndex: 'nombreconcepto',
            width: '30%',
            editable: true,
        },
        {
            title: 'Ppto_Und',
            dataIndex: 'pptosund',
            width: '20%',
            editable: true,
            align: 'right',
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.pptosund, 2)}
                    </Title>

                );
            }
        },
        {
            title: 'Costo_Prom',
            dataIndex: 'costopromedppto',
            width: '20%',
            editable: true,
            align: 'right',
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.costopromedppto, 2)}
                    </Title>

                );
            }
        },
        {
            title: 'Ppto_Valor',
            dataIndex: 'pptocomprasvalor',
            width: '20%',
            editable: true,
            align: 'right',
            render: (text, row, index) => {
                return (
                    <Title level={4} style={{ fontSize: 15, }}>
                        {myNumber(1, row.pptocomprasvalor, 2)}
                    </Title>

                );
            }
        },
        {
            title: 'Editar',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Grabar
                        </Typography.Link>
                        <Popconfirm title="Confirma?" onConfirm={cancel}>
                            <a>Cancelar</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Modificar
                    </Typography.Link>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <div className="bg-white">
            <div className="ml-1 max-w-6xl py-16 px-4 sm:py-10 sm:px-6 lg:px-0">
                <div className="ml-10 mx-auto flex max-w-7xl justify-center px-4 sm:px-6 lg:px-8">
                    {/* justify-end */}
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
                                    selectSomeItems: "Filtrar por año...",
                                    allItemsAreSelected:
                                        "Todos los años",
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

                    <Menu as="div" className="ml-1 relative inline-block" >
                        <div className="flex">

                            <div className="ml-1 mx-auto flex max-w-4xl h-10 space-x-6 divide-x bg-basecosmos rounded divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
                                <button
                                    onClick={() => generarConsulta()}
                                >
                                    Consultar
                                </button>
                            </div>

                        </div>
                    </Menu>
                </div>
                <Form form={form} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        bordered
                        dataSource={data}
                        columns={mergedColumns}
                        rowClassName="editable-row"
                        pagination={{
                            onChange: cancel,
                        }}
                    />
                </Form>
            </div>
        </div>
    );
}

export default TabPresupuesto;