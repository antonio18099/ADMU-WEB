import { useState, useRef, useEffect } from "react";
import { Camera, Edit, Loader2 } from "lucide-react";
import ThemeToggleButton from "./ThemeToggleButton";
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
                        const preferences = fetchedData.preferences || { notifications: true };
                        // Ensure routeType is removed if it exists from older data structures
                        if ('routeType' in preferences) {
                            delete preferences.routeType;
                        }
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
                            preferences: { notifications: true },
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
                        preferences: { notifications: true },
                    };
                    setProfile(defaultOnError);
                    setTempProfile(defaultOnError);
                    setCurrentDisplayImage(defaultOnError.profileImage);
                }
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
        if (isEditing && tempProfile) {
            setCurrentDisplayImage(tempProfile.profileImage || "/icons/default-avatar.png");
        } else if (!isEditing && profile) {
            setCurrentDisplayImage(profile.profileImage || "/icons/default-avatar.png");
        }
    }, [profile, tempProfile, isEditing]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const keys = name.split('.');
        
        setTempProfile(prev => {
            const newProfile = JSON.parse(JSON.stringify(prev)); // Deep copy for safety
            let current = newProfile;
            
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = current[keys[i]] || {};
                current = current[keys[i]];
            }
            
            current[keys[keys.length - 1]] = type === 'checkbox' ? checked : value;
            return newProfile;
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const user = auth.currentUser;
        if (user) {
            const storage = getStorage();
            const storageRef = ref(storage, `profile_images/${user.uid}/${file.name}`);
            try {
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);
                setTempProfile(prev => ({ ...prev, profileImage: downloadURL }));
                setCurrentDisplayImage(downloadURL);
            } catch (error) {
                console.error("Error al subir la imagen:", error);
                alert("Error al subir la imagen. Por favor, inténtalo de nuevo.");
            }
        }
        setIsUploading(false);
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!tempProfile) return;

        setIsSaving(true);
        const user = auth.currentUser;
        if (user) {
            const docRef = doc(db, "users", user.uid);
            try {
                // Explicitly exclude routeType from the data being saved
                // eslint-disable-next-line no-unused-vars
                const { routeType, ...preferencesToSave } = tempProfile.preferences || {};

                const dataToSave = {
                    name: tempProfile.name,
                    email: tempProfile.email,
                    profileImage: tempProfile.profileImage,
                    preferences: preferencesToSave,
                };
                await updateDoc(docRef, dataToSave);
                setProfile(tempProfile);
                setIsEditing(false);
                alert("Perfil actualizado con éxito.");
            } catch (error) {
                console.error("Error al guardar los cambios:", error);
                alert("Error al guardar los cambios. Por favor, inténtalo de nuevo.");
            }
        }
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-6 min-h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto my-8">
                <p className="text-gray-700 dark:text-gray-300">Por favor, inicia sesión para ver tu perfil.</p>
            </div>
        );
    }

    return (
        <div className="relative z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-auto my-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Perfil de Usuario</h2>
                <div className="flex items-center space-x-4">
                    <ThemeToggleButton />
                    {!isEditing && (
                        <button 
                            onClick={() => {
                                setTempProfile({ ...profile });
                                setIsEditing(true);
                            }}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                            aria-label="Editar perfil"
                        >
                            <Edit className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </button>
                    )}
                </div>
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="relative w-28 h-28 mx-auto">
                        <img 
                            src={currentDisplayImage}
                            alt="Perfil"
                            className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
                            onError={(e) => { e.target.onerror = null; e.target.src='/icons/default-avatar.png'; }}
                        />
                        <button 
                            type="button" 
                            onClick={triggerFileInput}
                            disabled={isUploading}
                            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-150"
                            aria-label="Cambiar foto de perfil"
                        >
                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageUpload} 
                            className="hidden"
                            accept="image/png, image/jpeg"
                        />
                    </div>

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
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico:</label>
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
                <div className="space-y-6 text-sm text-center">
                    <div className="relative w-28 h-28 mx-auto">
                        <img 
                            src={currentDisplayImage}
                            alt="Perfil"
                            className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
                            onError={(e) => { e.target.onerror = null; e.target.src='/icons/default-avatar.png'; }}
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Información Personal</h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Nombre</p>
                                <p className="font-medium text-gray-900 dark:text-white">{profile?.name || "No especificado"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Correo</p>
                                <p className="font-medium text-gray-900 dark:text-white break-words">{profile?.email || "No especificado"}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Configuración</h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Notificaciones</p>
                                <p className={`font-medium ${profile?.preferences?.notifications ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                                    {profile?.preferences?.notifications ? "Activadas" : "Desactivadas"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
