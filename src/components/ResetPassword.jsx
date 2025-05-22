// src/components/ResetPassword.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from '../firebase';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [validCode, setValidCode] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Extraer el código de la URL
    const queryParams = new URLSearchParams(location.search);
    const oobCode = queryParams.get('oobCode');

    useEffect(() => {
        const verifyCode = async () => {
            if (!oobCode) {
                setError('Enlace de restablecimiento inválido');
                return;
            }

            try {
                setLoading(true);
                await verifyPasswordResetCode(auth, oobCode);
                setValidCode(true);
            } catch (error) {
                setError('El enlace de restablecimiento no es válido o ha expirado');
            } finally {
                setLoading(false);
            }
        };

        verifyCode();
    }, [oobCode]);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            setLoading(true);
            await confirmPasswordReset(auth, oobCode, newPassword);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            setError('Error al restablecer la contraseña: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Restablecer Contraseña</h2>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                {success ? (
                    <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                        Contraseña restablecida con éxito. Serás redirigido al inicio de sesión.
                    </div>
                ) : validCode ? (
                    <form onSubmit={handleResetPassword}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="new-password">Nueva contraseña</label>
                            <input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2" htmlFor="confirm-password">Confirmar contraseña</label>
                            <input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
                            disabled={loading}
                        >
                            Cambiar Contraseña
                        </button>
                    </form>
                ) : (
                    <div className="text-center">
                        <p className="mb-4">El enlace no es válido o ha expirado.</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            Volver al inicio de sesión
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;