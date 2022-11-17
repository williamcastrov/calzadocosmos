import { notification } from "antd";

export function showNotification(
    placement = "topRight",
    type,
    message,
    description,
    time
) {
    if (type === 1) {
        notification.info({
            message: `${message}`,
            description: `${description}`,
            placement,
            duration: time ? time : 4.5,
        });
    } else if (type === 2) {
        notification.error({
            message: `${message}`,
            description: `${description}`,
            placement,
            duration: time ? time : 4.5,
        });
    } else if (type === 3) {
        notification.warning({
            message: `${message}`,
            description: `${description}`,
            placement,
            duration: time ? time : 4.5,
        });
    } else {
        notification.success({
            message: `${message}`,
            description: `${description}`,
            placement,
            duration: time ? time : 4.5,
        });
    }
}
