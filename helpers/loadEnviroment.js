//import { showNotification } from "../utilities/ShowNotifications";
import SRV from './Service';

export const loadEnviroment = async () => {
    try {
        let datos = await SRV.authUser();
        if (datos) {
            return datos;
        } else {
            alert("NO SE ENCONTRARON DATOS... INTENTE MAS TARDE");
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}