import { Fragment, useState, useEffect } from "react";
import { myNumber, nameMonth } from "../../utils/ArrayFunctions";
import { Table, Tag, Typography } from 'antd';
import img from "../../assets/uploadimage1.png";
import swal from 'sweetalert';
import axios from "axios";
import NavBar from "../../components/NavBar/NavBar";
const URL_SERVICE = "https://api.aal-cloud.com/api/cosmos";
import Spinner from "../../components/Spinner/Spinner";
import Moment from "moment";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function LoadReference(props) {
    const { Title } = Typography;
    const [imgUno, setImgUno] = useState(img);
    const [longitudArray, setLongitudArray] = useState(0);

    const [selectedArchives, setSelectedArchives] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saveImage, setSaveImage] = useState(false);

    const [baseArchives, setBaseArchives] = useState([]);
    const [valorReferencia, setValorReferencia] = useState(null);
    const [valorSublinea, setValorSublinea] = useState(null);
    const [listaImagenes, setListaImagenes] = useState(null);
    const [imagenUno, setImagenUno] = useState(null);
    const [imagenDos, setImagenDos] = useState(null);
    const [imagenTres, setImagenTres] = useState(null);
    const [imagenCuatro, setImagenCuatro] = useState(null);
    const [imagenCinco, setImagenCinco] = useState(null);
    const [imagenSeis, setImagenSeis] = useState(null);
    const [imagenSiete, setImagenSiete] = useState(null);
    const [imagenOcho, setImagenOcho] = useState(null);
    const [imagenNueve, setImagenNueve] = useState(null);
    const [imagenDiez, setImagenDiez] = useState(null);
    const [imagenOnce, setImagenOnce] = useState(null);
    const [imagenDoce, setImagenDoce] = useState(null);
    const [imagenTrece, setImagenTrece] = useState(null);
    const [imagenCatorce, setImagenCatorce] = useState(null);
    const [imagenQuince, setImagenQuince] = useState(null);
    const [imagenDieciSeis, setImagenDieciSeis] = useState(null);
    const [imagenDieciSiete, setImagenDieciSiete] = useState(null);
    const [imagenDieciOcho, setImagenDieciOcho] = useState(null);
    const [imagenDieciNueve, setImagenDieciNueve] = useState(null);
    const [imagenVeinte, setImagenVeinte] = useState(null);
    const fechaactual = Moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

    useEffect(() => {
        // Lee imaganes
        setLoading(true);
        let imagenes = JSON.parse(localStorage.getItem("bancoimagenes"));
        setProductos(imagenes.listaproductos);

        //setListaImagenes(imagenes.imagenreferencia);
        let newDet = [];
        imagenes.imagenreferencia &&
            imagenes.imagenreferencia.map((items, index) => {
                //if (items.SubLinea == "CALZADO") {
                newDet.push(items);
                //}
            });

        setListaImagenes(newDet);
        let longitud = newDet.length;
        if (longitud > 6500) {
            setLoading(false);
        }
        setLongitudArray(longitud);
        //console.log("IMAGENES : ", newDet);
        //SubLinea: "CALZADO"
    }, []);

    const mostrarImagenes = async () => {
        let longitud = baseArchives.length;
        if (longitud == 1) {
            setImagenUno(URL.createObjectURL(baseArchives[0]));
        } else
            if (longitud == 2) {
                setImagenUno(URL.createObjectURL(baseArchives[0]));
                setImagenDos(URL.createObjectURL(baseArchives[1]));
            } else
                if (longitud == 3) {
                    setImagenUno(URL.createObjectURL(baseArchives[0]));
                    setImagenDos(URL.createObjectURL(baseArchives[1]));
                    setImagenTres(URL.createObjectURL(baseArchives[2]));
                } else
                    if (longitud == 4) {
                        setImagenUno(URL.createObjectURL(baseArchives[0]));
                        setImagenDos(URL.createObjectURL(baseArchives[1]));
                        setImagenTres(URL.createObjectURL(baseArchives[2]));
                        setImagenCuatro(URL.createObjectURL(baseArchives[3]));
                    } else
                        if (longitud == 5) {
                            setImagenUno(URL.createObjectURL(baseArchives[0]));
                            setImagenDos(URL.createObjectURL(baseArchives[1]));
                            setImagenTres(URL.createObjectURL(baseArchives[2]));
                            setImagenCuatro(URL.createObjectURL(baseArchives[3]));
                            setImagenCinco(URL.createObjectURL(baseArchives[4]));
                        } else
                            if (longitud == 6) {
                                setImagenUno(URL.createObjectURL(baseArchives[0]));
                                setImagenDos(URL.createObjectURL(baseArchives[1]));
                                setImagenTres(URL.createObjectURL(baseArchives[2]));
                                setImagenCuatro(URL.createObjectURL(baseArchives[3]));
                                setImagenCinco(URL.createObjectURL(baseArchives[4]));
                                setImagenSeis(URL.createObjectURL(baseArchives[5]));
                            } else
                                if (longitud == 7) {
                                    setImagenUno(URL.createObjectURL(baseArchives[0]));
                                    setImagenDos(URL.createObjectURL(baseArchives[1]));
                                    setImagenTres(URL.createObjectURL(baseArchives[2]));
                                    setImagenCuatro(URL.createObjectURL(baseArchives[3]));
                                    setImagenCinco(URL.createObjectURL(baseArchives[5]));
                                    setImagenSeis(URL.createObjectURL(baseArchives[5]));
                                    setImagenSiete(URL.createObjectURL(baseArchives[6]));
                                } else
                                    if (longitud == 8) {
                                        setImagenUno(URL.createObjectURL(baseArchives[0]));
                                        setImagenDos(URL.createObjectURL(baseArchives[1]));
                                        setImagenTres(URL.createObjectURL(baseArchives[2]));
                                        setImagenCuatro(URL.createObjectURL(baseArchives[3]));
                                        setImagenCinco(URL.createObjectURL(baseArchives[4]));
                                        setImagenSeis(URL.createObjectURL(baseArchives[5]));
                                        setImagenSiete(URL.createObjectURL(baseArchives[6]));
                                        setImagenOcho(URL.createObjectURL(baseArchives[7]));
                                    } else
                                        if (longitud == 9) {
                                            setImagenUno(URL.createObjectURL(baseArchives[0]));
                                            setImagenDos(URL.createObjectURL(baseArchives[1]));
                                            setImagenTres(URL.createObjectURL(baseArchives[2]));
                                            setImagenCuatro(URL.createObjectURL(baseArchives[3]));
                                            setImagenCinco(URL.createObjectURL(baseArchives[4]));
                                            setImagenSeis(URL.createObjectURL(baseArchives[5]));
                                            setImagenSiete(URL.createObjectURL(baseArchives[6]));
                                            setImagenOcho(URL.createObjectURL(baseArchives[7]));
                                            setImagenNueve(URL.createObjectURL(baseArchives[8]));
                                        } else
                                            if (longitud == 10) {
                                                setImagenUno(URL.createObjectURL(baseArchives[0]));
                                                setImagenDos(URL.createObjectURL(baseArchives[1]));
                                                setImagenTres(URL.createObjectURL(baseArchives[2]));
                                                setImagenCuatro(URL.createObjectURL(baseArchives[3]));
                                                setImagenCinco(URL.createObjectURL(baseArchives[4]));
                                                setImagenSeis(URL.createObjectURL(baseArchives[5]));
                                                setImagenSiete(URL.createObjectURL(baseArchives[6]));
                                                setImagenOcho(URL.createObjectURL(baseArchives[7]));
                                                setImagenNueve(URL.createObjectURL(baseArchives[8]));
                                                setImagenDiez(URL.createObjectURL(baseArchives[9]));
                                            } else
                                                if (longitud == 11) {
                                                    setImagenUno(URL.createObjectURL(baseArchives[0]));
                                                    setImagenDos(URL.createObjectURL(baseArchives[1]));
                                                    setImagenTres(URL.createObjectURL(baseArchives[2]));
                                                    setImagenCuatro(URL.createObjectURL(baseArchives[3]));
                                                    setImagenCinco(URL.createObjectURL(baseArchives[4]));
                                                    setImagenSeis(URL.createObjectURL(baseArchives[5]));
                                                    setImagenSiete(URL.createObjectURL(baseArchives[6]));
                                                    setImagenOcho(URL.createObjectURL(baseArchives[7]));
                                                    setImagenNueve(URL.createObjectURL(baseArchives[8]));
                                                    setImagenDiez(URL.createObjectURL(baseArchives[9]));
                                                    setImagenOnce(URL.createObjectURL(baseArchives[10]));
                                                } else
                                                    if (longitud == 12) {
                                                        setImagenUno(URL.createObjectURL(baseArchives[0]));
                                                        setImagenDos(URL.createObjectURL(baseArchives[1]));
                                                        setImagenTres(URL.createObjectURL(baseArchives[2]));
                                                        setImagenCuatro(URL.createObjectURL(baseArchives[3]));
                                                        setImagenCinco(URL.createObjectURL(baseArchives[4]));
                                                        setImagenSeis(URL.createObjectURL(baseArchives[5]));
                                                        setImagenSiete(URL.createObjectURL(baseArchives[6]));
                                                        setImagenOcho(URL.createObjectURL(baseArchives[7]));
                                                        setImagenNueve(URL.createObjectURL(baseArchives[8]));
                                                        setImagenDiez(URL.createObjectURL(baseArchives[9]));
                                                        setImagenOnce(URL.createObjectURL(baseArchives[10]));
                                                        setImagenDoce(URL.createObjectURL(baseArchives[11]));
                                                    } else
                                                        if (longitud == 13) {
                                                            setImagenUno(URL.createObjectURL(baseArchives[0]));
                                                            setImagenDos(URL.createObjectURL(baseArchives[1]));
                                                            setImagenTres(URL.createObjectURL(baseArchives[2]));
                                                            setImagenCuatro(URL.createObjectURL(baseArchives[3]));
                                                            setImagenCinco(URL.createObjectURL(baseArchives[4]));
                                                            setImagenSeis(URL.createObjectURL(baseArchives[5]));
                                                            setImagenSiete(URL.createObjectURL(baseArchives[6]));
                                                            setImagenOcho(URL.createObjectURL(baseArchives[7]));
                                                            setImagenNueve(URL.createObjectURL(baseArchives[8]));
                                                            setImagenDiez(URL.createObjectURL(baseArchives[9]));
                                                            setImagenOnce(URL.createObjectURL(baseArchives[10]));
                                                            setImagenDoce(URL.createObjectURL(baseArchives[11]));
                                                            setImagenTrece(URL.createObjectURL(baseArchives[12]));
                                                        } else
                                                            if (longitud == 14) {
                                                                setImagenUno(URL.createObjectURL(baseArchives[0]));
                                                                setImagenDos(URL.createObjectURL(baseArchives[1]));
                                                                setImagenTres(URL.createObjectURL(baseArchives[2]));
                                                                setImagenCuatro(URL.createObjectURL(baseArchives[3]));
                                                                setImagenCinco(URL.createObjectURL(baseArchives[4]));
                                                                setImagenSeis(URL.createObjectURL(baseArchives[5]));
                                                                setImagenSiete(URL.createObjectURL(baseArchives[6]));
                                                                setImagenOcho(URL.createObjectURL(baseArchives[7]));
                                                                setImagenNueve(URL.createObjectURL(baseArchives[8]));
                                                                setImagenDiez(URL.createObjectURL(baseArchives[9]));
                                                                setImagenOnce(URL.createObjectURL(baseArchives[10]));
                                                                setImagenDoce(URL.createObjectURL(baseArchives[11]));
                                                                setImagenTrece(URL.createObjectURL(baseArchives[12]));
                                                                setImagenCatorce(URL.createObjectURL(baseArchives[13]));
                                                            } else
                                                                if (longitud == 15) {
                                                                    setImagenUno(URL.createObjectURL(baseArchives[0]));
                                                                    setImagenDos(URL.createObjectURL(baseArchives[1]));
                                                                    setImagenTres(URL.createObjectURL(baseArchives[2]));
                                                                    setImagenCuatro(URL.createObjectURL(baseArchives[3]));
                                                                    setImagenCinco(URL.createObjectURL(baseArchives[4]));
                                                                    setImagenSeis(URL.createObjectURL(baseArchives[5]));
                                                                    setImagenSiete(URL.createObjectURL(baseArchives[6]));
                                                                    setImagenOcho(URL.createObjectURL(baseArchives[7]));
                                                                    setImagenNueve(URL.createObjectURL(baseArchives[8]));
                                                                    setImagenDiez(URL.createObjectURL(baseArchives[9]));
                                                                    setImagenOnce(URL.createObjectURL(baseArchives[10]));
                                                                    setImagenDoce(URL.createObjectURL(baseArchives[11]));
                                                                    setImagenTrece(URL.createObjectURL(baseArchives[12]));
                                                                    setImagenCatorce(URL.createObjectURL(baseArchives[13]));
                                                                    setImagenQuince(URL.createObjectURL(baseArchives[14]));
                                                                } else
                                                                    if (longitud == 16) {
                                                                        setImagenUno(URL.createObjectURL(baseArchives[0]));
                                                                        setImagenDos(URL.createObjectURL(baseArchives[1]));
                                                                        setImagenTres(URL.createObjectURL(baseArchives[2]));
                                                                        setImagenCuatro(URL.createObjectURL(baseArchives[3]));
                                                                        setImagenCinco(URL.createObjectURL(baseArchives[4]));
                                                                        setImagenSeis(URL.createObjectURL(baseArchives[5]));
                                                                        setImagenSiete(URL.createObjectURL(baseArchives[6]));
                                                                        setImagenOcho(URL.createObjectURL(baseArchives[7]));
                                                                        setImagenNueve(URL.createObjectURL(baseArchives[8]));
                                                                        setImagenDiez(URL.createObjectURL(baseArchives[9]));
                                                                        setImagenOnce(URL.createObjectURL(baseArchives[10]));
                                                                        setImagenDoce(URL.createObjectURL(baseArchives[11]));
                                                                        setImagenTrece(URL.createObjectURL(baseArchives[12]));
                                                                        setImagenCatorce(URL.createObjectURL(baseArchives[13]));
                                                                        setImagenQuince(URL.createObjectURL(baseArchives[14]));
                                                                        setImagenDieciSeis(URL.createObjectURL(baseArchives[15]));
                                                                    } else
                                                                        if (longitud == 17) {
                                                                            setImagenUno(URL.createObjectURL(baseArchives[0]));
                                                                            setImagenDos(URL.createObjectURL(baseArchives[1]));
                                                                            setImagenTres(URL.createObjectURL(baseArchives[2]));
                                                                            setImagenCuatro(URL.createObjectURL(baseArchives[3]));
                                                                            setImagenCinco(URL.createObjectURL(baseArchives[4]));
                                                                            setImagenSeis(URL.createObjectURL(baseArchives[5]));
                                                                            setImagenSiete(URL.createObjectURL(baseArchives[6]));
                                                                            setImagenOcho(URL.createObjectURL(baseArchives[7]));
                                                                            setImagenNueve(URL.createObjectURL(baseArchives[8]));
                                                                            setImagenDiez(URL.createObjectURL(baseArchives[9]));
                                                                            setImagenOnce(URL.createObjectURL(baseArchives[10]));
                                                                            setImagenDoce(URL.createObjectURL(baseArchives[11]));
                                                                            setImagenTrece(URL.createObjectURL(baseArchives[12]));
                                                                            setImagenCatorce(URL.createObjectURL(baseArchives[13]));
                                                                            setImagenQuince(URL.createObjectURL(baseArchives[14]));
                                                                            setImagenDieciSeis(URL.createObjectURL(baseArchives[15]));
                                                                            setImagenDieciSiete(URL.createObjectURL(baseArchives[16]));
                                                                        } else
                                                                            if (longitud == 18) {
                                                                                setImagenUno(URL.createObjectURL(baseArchives[0]));
                                                                                setImagenDos(URL.createObjectURL(baseArchives[1]));
                                                                                setImagenTres(URL.createObjectURL(baseArchives[2]));
                                                                                setImagenCuatro(URL.createObjectURL(baseArchives[3]));
                                                                                setImagenCinco(URL.createObjectURL(baseArchives[4]));
                                                                                setImagenSeis(URL.createObjectURL(baseArchives[5]));
                                                                                setImagenSiete(URL.createObjectURL(baseArchives[6]));
                                                                                setImagenOcho(URL.createObjectURL(baseArchives[7]));
                                                                                setImagenNueve(URL.createObjectURL(baseArchives[8]));
                                                                                setImagenDiez(URL.createObjectURL(baseArchives[9]));
                                                                                setImagenOnce(URL.createObjectURL(baseArchives[10]));
                                                                                setImagenDoce(URL.createObjectURL(baseArchives[11]));
                                                                                setImagenTrece(URL.createObjectURL(baseArchives[12]));
                                                                                setImagenCatorce(URL.createObjectURL(baseArchives[13]));
                                                                                setImagenQuince(URL.createObjectURL(baseArchives[14]));
                                                                                setImagenDieciSeis(URL.createObjectURL(baseArchives[15]));
                                                                                setImagenDieciSiete(URL.createObjectURL(baseArchives[16]));
                                                                                setImagenDieciOcho(URL.createObjectURL(baseArchives[17]));
                                                                            } else
                                                                                if (longitud == 19) {
                                                                                    setImagenUno(URL.createObjectURL(baseArchives[0]));
                                                                                    setImagenDos(URL.createObjectURL(baseArchives[1]));
                                                                                    setImagenTres(URL.createObjectURL(baseArchives[2]));
                                                                                    setImagenCuatro(URL.createObjectURL(baseArchives[3]));
                                                                                    setImagenCinco(URL.createObjectURL(baseArchives[4]));
                                                                                    setImagenSeis(URL.createObjectURL(baseArchives[5]));
                                                                                    setImagenSiete(URL.createObjectURL(baseArchives[6]));
                                                                                    setImagenOcho(URL.createObjectURL(baseArchives[7]));
                                                                                    setImagenNueve(URL.createObjectURL(baseArchives[8]));
                                                                                    setImagenDiez(URL.createObjectURL(baseArchives[9]));
                                                                                    setImagenOnce(URL.createObjectURL(baseArchives[10]));
                                                                                    setImagenDoce(URL.createObjectURL(baseArchives[11]));
                                                                                    setImagenTrece(URL.createObjectURL(baseArchives[12]));
                                                                                    setImagenCatorce(URL.createObjectURL(baseArchives[13]));
                                                                                    setImagenQuince(URL.createObjectURL(baseArchives[14]));
                                                                                    setImagenDieciSeis(URL.createObjectURL(baseArchives[15]));
                                                                                    setImagenDieciSiete(URL.createObjectURL(baseArchives[16]));
                                                                                    setImagenDieciOcho(URL.createObjectURL(baseArchives[17]));
                                                                                    setImagenDieciNueve(URL.createObjectURL(baseArchives[18]));
                                                                                } else
                                                                                    if (longitud == 20) {
                                                                                        setImagenUno(URL.createObjectURL(baseArchives[0]));
                                                                                        setImagenDos(URL.createObjectURL(baseArchives[1]));
                                                                                        setImagenTres(URL.createObjectURL(baseArchives[2]));
                                                                                        setImagenCuatro(URL.createObjectURL(baseArchives[3]));
                                                                                        setImagenCinco(URL.createObjectURL(baseArchives[4]));
                                                                                        setImagenSeis(URL.createObjectURL(baseArchives[5]));
                                                                                        setImagenSiete(URL.createObjectURL(baseArchives[6]));
                                                                                        setImagenOcho(URL.createObjectURL(baseArchives[7]));
                                                                                        setImagenNueve(URL.createObjectURL(baseArchives[8]));
                                                                                        setImagenDiez(URL.createObjectURL(baseArchives[9]));
                                                                                        setImagenOnce(URL.createObjectURL(baseArchives[10]));
                                                                                        setImagenDoce(URL.createObjectURL(baseArchives[11]));
                                                                                        setImagenTrece(URL.createObjectURL(baseArchives[12]));
                                                                                        setImagenCatorce(URL.createObjectURL(baseArchives[13]));
                                                                                        setImagenQuince(URL.createObjectURL(baseArchives[14]));
                                                                                        setImagenDieciSeis(URL.createObjectURL(baseArchives[15]));
                                                                                        setImagenDieciSiete(URL.createObjectURL(baseArchives[16]));
                                                                                        setImagenDieciOcho(URL.createObjectURL(baseArchives[17]));
                                                                                        setImagenDieciNueve(URL.createObjectURL(baseArchives[18]));
                                                                                        setImagenVeinte(URL.createObjectURL(baseArchives[19]));
                                                                                    }

    }

    const generabase64 = async () => {
        setSaveImage(true);
        if (!baseArchives) {
            swal({
                title: "Tablero Cosmos",
                text: "Selecciona una imagen!",
                icon: "warning",
            });
            return
        }

        //Recorre arreglo de imagenes y extrae el nombre del archivo
        let newDetName = [];
        let newDetPrd = [];
        selectedArchives &&
            selectedArchives.map((items, index) => {
                let row = {
                    referencia: items.split(".").shift(),
                    imagen: items
                }
                newDetName.push(row);
                newDetPrd.push(row);
            });
        //console.log("PRODUCTOS : ", productos)
        /*

        // Crear el array de nombre y variables a granar en tabla referencia imagenes
        
        newDetName &&
            newDetName.map((img, index) => {
                productos &&
                    productos.map((prd, index) => {
                        if (img.referencia == prd.referencia) {
                            let row = {
                                grupo: prd.Grupo,
                                marca: prd.Marca,
                                sublinea: prd.SubLinea,
                                codigo: prd.codigo,
                                referencia: prd.referencia,
                                imagen: img.imagen,
                                referencia_proveedor: prd.referencia_proveedor
                            }
                            newDetPrd.push(row);
                        }
                    });
            });
*/
        if (newDetPrd.length > 0) {
            const recorreImagen = async () => {
                let longitud = baseArchives.length;
                let arreglofotos = [];
                let contador = 0;
                let extension = "";

                await Array.from(baseArchives).forEach((archivo, index) => {
                    var reader = new FileReader();
                    reader.readAsDataURL(archivo);
                    reader.onload = function () {
                        var base64 = reader.result;
                        arreglofotos[index] = base64;
                        //console.log("BASE 64 : ", base64.substring(base64.indexOf('/') + 1, base64.indexOf(';base64')));
                        console.log("BASE 64 : ", arreglofotos[index]);

                        extension =
                            "." +
                            base64.substring(
                                base64.indexOf("/") + 1,
                                base64.indexOf(";base64")
                            );

                        const datosReferencia = async () => {

                            //console.log("NOMBRES : ", newDetPrd[index]);
                            let params = {
                                referencia: newDetPrd[index].referencia,
                                imagen: newDetPrd[index].imagen,
                                sublinea: "",
                                grupo: "",
                                referenciaproveedor: "",
                                fecha: fechaactual
                            };

                            await axios({
                                method: "post",
                                url: "https://api.aal-cloud.com/api/cosmos/201",
                                params,
                            })
                                .then((res) => {
                                    if (res.data) {
                                        grabarDatosReferencia(arreglofotos[index], newDetPrd[index].referencia)
                                        contador = contador + 1;
                                    } else {
                                        console.log("GRABA DATOS PRODUCTOS")
                                    }
                                })
                                .catch(function (error) {
                                    console.log("PRODUCTO EXISTE NO  EN SIIGO")
                                    //grabarDatosBD(datos)
                                });
                            if (contador == longitud) {
                                setSaveImage(false);
                            }
                        };
                        datosReferencia();
                    };
                });

            };
            recorreImagen();
        } else {
            swal({
                title: "Tablero Cosmos",
                text: "Un momento aun esta cargando las imagenes!",
                icon: "warning",
            });
        }
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
        //console.log("ARCHIVOS : ",selectedFiles)
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

        setSelectedArchives((previousImages) =>
            previousImages.concat(imagesArray)
        );
        mostrarImagenes();
    };

    const header_test = [
        {
            title: "Imagen", dataIndex: "Imagen", key: "Imagen", width: 100, fixed: true,
            render: (text, row, index) => {
                return (
                    <img
                        width="250"
                        height="200"
                        src={"https://api.aal-cloud.com/files/cosmos/" + row.Imagen}
                        alt={row.imageAlt}
                        className="ml-3 h-23 w-23 rounded-md object-cover object-center  sm:h-18 sm:w-18"
                    />

                );
            }
        },
        { title: "Referencia", dataIndex: "Referencia", key: "Referencia", width: 80, align: "left" },
        //{ title: "Sublínea", dataIndex: "SubLinea", key: "SubLinea", width: 50, align: "left" },
        //{ title: "Grupo", dataIndex: "Grupo", key: "Grupo", width: 50, align: "left" },
        {
            title: "Fecha", dataIndex: "Fecha", key: "Fecha", width: 80, align: "left",
            sorter: (a, b) => a.Fecha - b.Fecha,
        },
    ]

    return (
        <div className="bg-white">
            <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 ">
                <NavBar />
            </div>

            <div className="ml-80 max-w-7xl py-16 px-6 sm:py-4 sm:px-6 lg:px-0">
                <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Banco de Imagenes Cosmos</h1>

                <div className="min-w-full  margenizaquierdanegativo px-4 sm:px-6 lg:px-8">

                    {
                        loading ?
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
                    }

                    <div className="min-w-full  mt-8 flex flex-col">
                        <div className="min-w-full  -my-2 -mx-4 sm:-mx-6 lg:-mx-8">
                            <div className="min-w-full py-2 align-middle md:px-6 lg:px-8">
                                <div className="min-w-full shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                    <Table columns={header_test} dataSource={listaImagenes} pagination={false}
                                        scroll={{
                                            x: 1000,
                                            y: 500,
                                        }}
                                        bordered />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <form className="mt-12">
                    <section aria-labelledby="summary-heading" className="mt-10">
                        <h2 id="summary-heading" className="sr-only">
                            Order summary
                        </h2>
                        <div>
                            <dl className="space-y-2">
                                <div className="flex items-center">
                                    <dt className="text-base font-medium text-gray-900">Total referencias: </dt>
                                    <dd className="ml-40 text-base font-medium text-gray-900">{longitudArray}</dd>
                                </div>
                            </dl>
                            <p className="mt-1 text-base font-medium text-center text-gray-700">Subir imagen</p>
                        </div>

                        {/*
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
                        */}

                        <div className="mt-3">
                            <div>
                                <label for="file-input" className="text-lg">
                                    Seleccionar imagen
                                    <img
                                        className="tamañoimagenupload"
                                        src={imgUno.src}
                                        alt="Seleccione Archivo"
                                    />

                                </label>
                                <div className="mt-5 ">
                                    {
                                        saveImage ?
                                            <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                                Grabando imagenes ...
                                            </h1>
                                            :
                                            null
                                    }

                                    <p className="text-center text-lg" for="file-input">
                                        Imagenes a cargar - maximo veinte
                                    </p>
                                    <div className="grid grid-cols-10 gap-4">
                                        <img
                                            className="rounded tamañoimagen"
                                            src={imagenUno}
                                        />
                                        <img
                                            className="rounded tamañoimagen"
                                            src={imagenDos}
                                        />
                                        <img
                                            className="rounded tamañoimagen"
                                            src={imagenTres}
                                        />
                                        <img
                                            className="rounded tamañoimagen"
                                            src={imagenCuatro}
                                        />
                                        <img
                                            className="rounded tamañoimagen"
                                            src={imagenCinco}
                                        />
                                        <img
                                            className="rounded tamañoimagen"
                                            src={imagenSeis}
                                        />
                                        <img
                                            className="rounded tamañoimagen"
                                            src={imagenSiete}
                                        />
                                        <img
                                            className="rounded tamañoimagen"
                                            src={imagenOcho}
                                        />
                                        <img
                                            className="rounded tamañoimagen"
                                            src={imagenNueve}
                                        />
                                        <img
                                            className="rounded tamañoimagen"
                                            src={imagenDiez}
                                        />
                                        <img
                                            className="rounded tamañoimagen"
                                            src={imagenOnce}
                                        />
                                        <img
                                            className="rounded tamañoimagen"
                                            src={imagenDoce}
                                        />
                                        <img
                                            className="rounded tamañoimagen"
                                            src={imagenTrece}
                                        />
                                        <img
                                            className="rounded tamañoimagen"
                                            src={imagenCatorce}
                                        />
                                        <img
                                            className="rounded tamañoimagen"
                                            src={imagenQuince}
                                        />
                                        <img
                                            className="rounded tamañoimagen"
                                            src={imagenDieciSeis}
                                        />
                                        <img
                                            className="rounded tamañoimagen"
                                            src={imagenDieciSiete}
                                        />
                                        <img
                                            className="rounded tamañoimagen"
                                            src={imagenDieciOcho}
                                        />
                                        <img
                                            className="rounded tamañoimagen"
                                            src={imagenDieciNueve}
                                        />
                                        <img
                                            className="rounded tamañoimagen"
                                            src={imagenVeinte}
                                        />
                                    </div>
                                </div>
                                <input
                                    id="file-input"
                                    name="images"
                                    type="file"
                                    className="ml-10 w-full rounded-md border border-transparent bg-basecosmos py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                                    onChange={onSelectFile}
                                    multiple
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