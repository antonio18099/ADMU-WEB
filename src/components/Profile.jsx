
// //nueva configuracion

import React, { useState, useRef, useEffect } from "react";
import { Camera, Edit, Loader2 } from "lucide-react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [tempProfile, setTempProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef(null);
    const [currentDisplayImage, setCurrentDisplayImage] = useState("/icons/default-avatar.png");
    const [newImageSuccessfullyUploaded, setNewImageSuccessfullyUploaded] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, "users", user.uid);
                try {
                    const docSnap = await getDoc(docRef);
                    let userDataToSet;
                    if (docSnap.exists()) {
                        const fetchedData = docSnap.data();
                        const preferences = fetchedData.preferences || { routeType: "Económica", notifications: true };
                        userDataToSet = {
                            ...fetchedData,
                            profileImage: fetchedData.profileImage || "/icons/default-avatar.png",
                            preferences: preferences
                        };
                    } else {
                        userDataToSet = {
                            name: user.displayName || "",
                            email: user.email || "",
                            profileImage: "/icons/default-avatar.png",
                            preferences: { routeType: "Económica", notifications: true },
                        };
                        console.log("No se encontraron datos del usuario en Firestore, usando datos por defecto.");
                    }
                    setProfile(userDataToSet);
                    setTempProfile(userDataToSet);
                    setCurrentDisplayImage(userDataToSet.profileImage || "/icons/default-avatar.png");
                } catch (error) {
                    console.error("Error al obtener datos del usuario:", error);
                    const defaultOnError = {
                        name: user.displayName || "Usuario Ejemplo",
                        email: user.email || "usuario@example.com",
                        profileImage: "/icons/default-avatar.png",
                        preferences: { routeType: "Económica", notifications: true },
                    };
                    setProfile(defaultOnError);
                    setTempProfile(defaultOnError);
                    setCurrentDisplayImage(defaultOnError.profileImage);
                }
            } else {
                 console.log("Usuario no autenticado al cargar perfil.");
            }
            setIsLoading(false);
        };

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchUserData();
            } else {
                setIsLoading(false);
                setProfile(null);
                setTempProfile(null);
                setCurrentDisplayImage("/icons/default-avatar.png");
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!isEditing && profile) {
            setCurrentDisplayImage(profile.profileImage || "/icons/default-avatar.png");
        } else if (isEditing && tempProfile) {
            setCurrentDisplayImage(tempProfile.profileImage || "/icons/default-avatar.png");
        }
    }, [profile, tempProfile, isEditing]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTempProfile((prev) => {
            if (!prev) return null;
            if (type === "checkbox") {
                return {
                    ...prev,
                    preferences: { ...prev.preferences, notifications: checked },
                };
            } else if (name.includes(".")) {
                const [parent, child] = name.split(".");
                return {
                    ...prev,
                    [parent]: {
                        ...(prev[parent] || {}),
                        [child]: value,
                    },
                };
            } else {
                return { ...prev, [name]: value };
            }
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            alert("Solo puedes subir archivos de imagen (jpg, png, etc).");
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            alert("Usuario no autenticado.");
            return;
        }
        setIsUploading(true);
        setNewImageSuccessfullyUploaded(false);
        const fileName = `${user.uid}_${Date.now()}_${file.name}`;
        const storage = getStorage();
        const storageRef = ref(storage, `profileImages/${user.uid}/${fileName}`);

        try {
            console.log("Paso 0: Iniciando subida de imagen...");
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            console.log("Paso 1: Imagen subida y URL obtenida:", downloadURL);
            setTempProfile((prev) => ({ ...prev, profileImage: downloadURL }));
            console.log("Paso 2: tempProfile actualizado con nueva imagen.");
            setNewImageSuccessfullyUploaded(true);
        } catch (error) {
            console.error("Error al subir imagen o obtener URL:", error);
            alert("Error al subir la imagen. Inténtalo nuevamente.");
        } finally {
            setIsUploading(false);
            console.log("Paso 3: setIsUploading(false) ejecutado.");
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSaving || isUploading || !tempProfile) return;
        setIsSaving(true);
        console.log("Paso 3.5: Iniciando handleSubmit");

        const user = auth.currentUser;
        if (user) {
            const userRef = doc(db, "users", user.uid);
            try {
                const dataToUpdate = {
                    name: tempProfile.name,
                    email: tempProfile.email,
                    preferences: tempProfile.preferences,
                };
                console.log("Paso 4: Preparando datos para Firestore:", dataToUpdate);

                if (newImageSuccessfullyUploaded && tempProfile.profileImage && (!profile || tempProfile.profileImage !== profile.profileImage)) {
                    dataToUpdate.profileImage = tempProfile.profileImage;
                    console.log("Paso 5: Se incluirá nueva profileImage en Firestore:", tempProfile.profileImage);
                } else {
                    console.log("Paso 5b: No se actualizará profileImage en Firestore. newImageSuccessfullyUploaded:", newImageSuccessfullyUploaded, "tempProfile.profileImage:", tempProfile.profileImage);
                }

                await updateDoc(userRef, dataToUpdate);
                console.log("Paso 6: Datos actualizados en Firestore.");
                setProfile(prevProfile => ({...prevProfile, ...dataToUpdate}));
                setIsEditing(false);
                setNewImageSuccessfullyUploaded(false);
                alert("Perfil actualizado correctamente");
            } catch (error) {
                console.error("Error al actualizar el perfil en Firestore:", error);
                alert("Hubo un error al actualizar el perfil.");
            } finally {
                setIsSaving(false);
                console.log("Paso 7: setIsSaving(false) ejecutado.");
            }
        }
    };

    if (isLoading || !profile) {
        return (
            <div className="flex justify-center items-center p-5 min-h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-700">Cargando perfil...</span>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-auto my-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Mi Perfil</h2>
                {!isEditing && (
                    <button 
                        onClick={() => {
                            setTempProfile({ ...profile });
                            setIsEditing(true);
                            setNewImageSuccessfullyUploaded(false);
                        }}
                        className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-150"
                    >
                        <Edit size={16} className="mr-1" />
                        <span>Editar</span>
                    </button>
                )}
            </div>

            <div className="flex flex-col items-center mb-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600 shadow-md">
                        <img 
                            src={currentDisplayImage} 
                            alt="Foto de perfil" 
                            className="w-full h-full object-cover"
                            onError={() => {
                                setCurrentDisplayImage("/icons/default-avatar.png");
                                if (newImageSuccessfullyUploaded) {
                                    setNewImageSuccessfullyUploaded(false);
                                }
                            }}
                        />
                    </div>
                    
                    {isEditing && (
                        <button 
                            onClick={triggerFileInput}
                            disabled={isUploading}
                            className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 shadow-md transition-colors duration-150 disabled:opacity-50"
                            title="Cambiar foto"
                        >
                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera size={16} />}
                        </button>
                    )}
                    
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                    />
                </div>
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={tempProfile?.name || ''}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo electrónico:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={tempProfile?.email || ''}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                         <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Cambiar esto no actualiza tu email de inicio de sesión.</p>
                    </div>
                    
                    <div>
                        <label htmlFor="routeType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de ruta preferida:</label>
                        <select
                            id="routeType"
                            name="preferences.routeType"
                            value={tempProfile?.preferences?.routeType || "Económica"}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="Rápida">Rápida</option>
                            <option value="Económica">Económica</option>
                            <option value="Sostenible">Sostenible</option>
                        </select>
                    </div>
                    
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="notifications"
                            name="preferences.notifications"
                            checked={tempProfile?.preferences?.notifications || false}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:focus:ring-offset-gray-800"
                        />
                        <label htmlFor="notifications" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                            Recibir notificaciones
                        </label>
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                        <button 
                            type="submit"
                            disabled={isSaving || isUploading}
                            className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-150 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                            {isSaving ? "Guardando..." : "Guardar Cambios"}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setIsEditing(false)}
                            disabled={isSaving || isUploading} 
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-150"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-3 text-sm">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <p className="text-gray-500 dark:text-gray-400">Nombre:</p>
                        <p className="font-medium text-gray-900 dark:text-white">{profile?.name || "No especificado"}</p>
                    </div>
                    
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <p className="text-gray-500 dark:text-gray-400">Correo:</p>
                        <p className="font-medium text-gray-900 dark:text-white">{profile?.email || "No especificado"}</p>
                    </div>
                    
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <p className="text-gray-500 dark:text-gray-400">Tipo de ruta preferida:</p>
                        <p className="font-medium text-gray-900 dark:text-white">{profile?.preferences?.routeType || "No especificado"}</p>
                    </div>
                    
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <p className="text-gray-500 dark:text-gray-400">Notificaciones:</p>
                        <p className={`font-medium ${profile?.preferences?.notifications ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                            {profile?.preferences?.notifications ? "Activadas" : "Desactivadas"}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;


