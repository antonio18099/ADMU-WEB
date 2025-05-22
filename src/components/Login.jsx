import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, LogIn, ShieldCheck } from "lucide-react";
import { Link ,useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import ChatBot from "./ChatBot";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Por favor, completa todos los campos.");
      }

      if (!email.includes("@")) {
        throw new Error("Por favor, ingresa un correo electrónico válido.");
      }

      await signInWithEmailAndPassword(auth, email, password);
      console.log("Inicio de sesión exitoso", { email });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.code === "auth/user-not-found"
          ? "El usuario no está registrado. Por favor, regístrate."
          : err.code === "auth/wrong-password"
          ? "Contraseña incorrecta. Inténtalo de nuevo."
          : err.code === "auth/too-many-requests"
          ? "Demasiados intentos fallidos. Intenta más tarde o restablece tu contraseña."
          : "Ocurrió un error. Por favor, inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!resetEmail || !resetEmail.includes("@")) {
        throw new Error("Por favor, ingresa un correo electrónico válido.");
      }

      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess(true);
    } catch (err) {
      setError(
        err.code === "auth/user-not-found"
          ? "No existe una cuenta con este correo electrónico."
          : "Ocurrió un error. Por favor, inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Contenedor principal */}
      <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto overflow-hidden shadow-2xl rounded-xl m-4">
        {/* Panel decorativo - solo visible en md y superior */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 text-white flex-col justify-center items-center">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-6">¡Bienvenido de nuevo!</h1>
            <p className="text-lg opacity-90 mb-8">
              Inicia sesión para acceder a tu cuenta y gestionar todas tus actividades.
            </p>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <p className="italic text-white/80">
                &quot;Nuestra plataforma ofrece un acceso seguro y rápido a todas tus herramientas favoritas.&quot;
              </p>
            </div>
          </div>
        </div>
        
        {/* Componente ChatBot */}
        <ChatBot />
        
        {/* Formulario */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center">
          {!resetRequested ? (
            <>
              <div className="text-center mb-10">
                {/* Icono decorativo encima del título */}
                <Link to="/inicio" className="flex items-center space-x-2 inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-4">
                  <img src="/icons/parada-Icon.png" alt="ADMU Logo" className=" h-20 w-20" />
                </Link>
                <h2 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h2>
                <p className="text-gray-600 mt-2">Ingresa tus credenciales para continuar</p>
              </div>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 block w-full rounded-lg border border-gray-300 py-3 px-4 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Contraseña
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 block w-full rounded-lg border border-gray-300 py-3 px-4 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={18} className="text-gray-500 hover:text-gray-700 transition" />
                      ) : (
                        <Eye size={18} className="text-gray-500 hover:text-gray-700 transition" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all hover:-translate-y-0.5 shadow-md disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Iniciando sesión...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <LogIn size={18} className="mr-2" />
                        Iniciar Sesión
                      </span>
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setResetRequested(true);
                      setResetEmail(email);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center border-t border-gray-200 pt-6">
                <p className="text-gray-600">
                  ¿No tienes una cuenta?{" "}
                  <a href="/register" className="font-medium text-blue-600 hover:text-blue-800 transition">
                    Regístrate aquí
                  </a>
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-10">
                {/* Icono decorativo para la página de recuperación de contraseña */}
                <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-4">
                  <ShieldCheck size={36} className="text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Recuperar Contraseña</h2>
                <p className="text-gray-600 mt-2">Te enviaremos un correo con instrucciones</p>
              </div>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                  <p>{error}</p>
                </div>
              )}
              
              {resetSuccess ? (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
                  <p>
                    Se ha enviado un correo con instrucciones para restablecer tu contraseña. 
                    Revisa tu bandeja de entrada.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePasswordReset} className="space-y-6">
                  <div>
                    <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="reset-email"
                        placeholder="tu@email.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="pl-10 block w-full rounded-lg border border-gray-300 py-3 px-4 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all hover:-translate-y-0.5 shadow-md disabled:opacity-70"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                          Enviando...
                        </span>
                      ) : (
                        "Enviar correo de recuperación"
                      )}
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setResetRequested(false);
                    setResetSuccess(false);
                    setError("");
                  }}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Volver al inicio de sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

