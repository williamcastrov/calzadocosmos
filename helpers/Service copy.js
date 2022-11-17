//import { showNotification } from "../utilities/ShowNotifications";
const URL_SERVICE = "https://api.aal-cloud.com/api/cosmos";

class SRV {
    authUser(record) {
        let uploadData = new FormData();
        uploadData.append("record", JSON.stringify(record));
        return fetch(`${URL_SERVICE}/1`, {
            method: "POST",
            body: uploadData,
            headers: {
                "Content-type": "application/json",
            },
        })
            .then((res) => {
            console.log("RETORNA API : ",res)
            res.json()
            
            })
            .catch((error) =>
                alert("Error Inesperado")
            )
            .then((response) => response);
    }

    getDatos() {
        return fetch(`${URL_SERVICE}/2`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
        })
            .then((res) => res.json())
            .catch((error) =>
                alert("Error Inesperado")
            )
            .then((response) => response);
    }
}

export default new SRV();