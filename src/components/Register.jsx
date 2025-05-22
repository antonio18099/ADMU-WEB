import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, UserCheck } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";


const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Función para validar la contraseña
  const validatePassword = (password) => {
    // Expresión regular para validar:
    // - Al menos una letra mayúscula
    // - Al menos un carácter especial
    // - Longitud mínima de 8 caracteres
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validaciones básicas
    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Por favor, ingresa un correo electrónico válido.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "La contraseña debe tener al menos una letra mayúscula y un carácter especial."
      );
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      // Crear usuario en Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Actualizar el perfil del usuario con su nombre
      await updateProfile(userCredential.user, {
        displayName: name,
      });

////// Guardar información adicional del usuario en Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: name,
        email: email,
        createdAt: new Date()
        });

      console.log("Usuario registrado exitosamente", userCredential.user);

      // Redirigir al dashboard después del registro exitoso
      navigate("/dashboard");
    } catch (err) {
      // Manejar errores específicos de Firebase
      if (err.code === "auth/email-already-in-use") {
        setError("Este correo electrónico ya está registrado.");
      } else if (err.code === "auth/invalid-email") {
        setError("El formato del correo electrónico no es válido.");
      } else if (err.code === "auth/weak-password") {
        setError("La contraseña es demasiado débil.");
      } else {
        setError(err.message);
      }
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
            <h1 className="text-4xl font-bold mb-6">Únete a nosotros</h1>
            <p className="text-lg opacity-90 mb-8">
              Crea una cuenta para acceder a todas nuestras funcionalidades y comenzar tu experiencia.
            </p>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <p className="italic text-white/80">
                "Registrarse te da acceso a funciones exclusivas y te mantiene conectado con nuestra comunidad."
              </p>
            </div>
          </div>
        </div>
        
        {/* Formulario */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            
            {/* Icono decorativo encima del título */}
            <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-4">
                  <UserCheck size={36} className="text-blue-600" />
                </div>

            <h2 className="text-3xl font-bold text-gray-800">Crear Cuenta</h2>
            <p className="text-gray-600 mt-2">Ingresa tus datos para registrarte</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  placeholder="Tu nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 block w-full rounded-lg border border-gray-300 py-3 px-4 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

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
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full rounded-lg border border-gray-300 py-3 px-4 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Mínimo 8 caracteres"
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
              <p className="text-xs text-gray-500 mt-1">
                Debe contener al menos 8 caracteres, una mayúscula y un carácter especial
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirma tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 block w-full rounded-lg border border-gray-300 py-3 px-4 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} className="text-gray-500 hover:text-gray-700 transition" />
                  ) : (
                    <Eye size={18} className="text-gray-500 hover:text-gray-700 transition" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
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
                    Registrando...
                  </span>
                ) : (
                  "Crear Cuenta"
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-gray-200 pt-6">
            <p className="text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800 transition">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

// //codigo con la nueva bse de datos de firebase


