import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFound.css'; // Asegúrate de tener este archivo CSS

const NotFound = () => {
    return (
    <div className="not-found">
        <img src="/images/404.png" alt="Página No Encontrada" className="not-found-image" />
        <h1>404 - Página No Encontrada</h1>
        <p>Lo sentimos, la página que estás buscando no existe.</p>
        <Link to="/" className="home-button">Volver al Inicio</Link>
    </div>
    );
};

export default NotFound;