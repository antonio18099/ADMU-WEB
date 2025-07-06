// src/components/Notifications.jsx
import "../styles/Notifications.css";

const Notifications = () => {
    const notifications = [
        { id: 1, message: "Tu ruta está en camino.", date: "2025-10-01" },
        { id: 2, message: "Retraso en la ruta 2.", date: "2025-10-02" },
    ];

    return (
        <div className="notifications-container">
            <h2>Notificaciones</h2>
            <ul>
                {notifications.map((notification) => (
                    <li key={notification.id}>
                        <strong>{notification.date}</strong>: {notification.message}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;