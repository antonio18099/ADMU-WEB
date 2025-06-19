import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Star, MapPin, Route } from "lucide-react";

import "../styles/Dashboard.css";
import DashboardMap from "./DashboardMap";
import routesData from "../data/routesData";
import ChatBot from "./ChatBot";

const Dashboard = () => {
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const fetchUserName = async (user) => {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserName(docSnap.data().name);
                } else {
                    setUserName(user.displayName || "Usuario");
                }
            }
        };

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchUserName(user);
            } else {
                setUserName("");
            }
        });

        return () => unsubscribe();
    }, []);


    return (
        <div className="dashboard-container pt-16 bg-gray-100 dark:bg-zinc-900 min-h-screen p-4 sm:p-6 lg:p-8">
            {/* Header Section */}
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    ¡Hola, {userName || 'explorador'}!
                </h1>
                <p className="text-md text-gray-600 dark:text-zinc-400 mt-1">
                    ¿Qué ruta tomarás hoy?
                </p>
            </header>

            {/* Quick Actions Only - Centered */}
            <div className="flex justify-center mb-8">
                <div className="flex gap-4">
                    <button className="flex flex-col items-center justify-center p-3 bg-white dark:bg-zinc-800 rounded-lg shadow-sm hover:bg-green-50 dark:hover:bg-zinc-700/50 transition-colors">
                        <Star className="h-6 w-6 text-green-600 dark:text-green-400 mb-1" />
                        <span className="text-xs font-medium text-gray-700 dark:text-zinc-300">Favoritas</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-3 bg-white dark:bg-zinc-800 rounded-lg shadow-sm hover:bg-green-50 dark:hover:bg-zinc-700/50 transition-colors">
                        <MapPin className="h-6 w-6 text-green-600 dark:text-green-400 mb-1" />
                        <span className="text-xs font-medium text-gray-700 dark:text-zinc-300">Cercanos</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-3 bg-white dark:bg-zinc-800 rounded-lg shadow-sm hover:bg-green-50 dark:hover:bg-zinc-700/50 transition-colors">
                        <Route className="h-6 w-6 text-green-600 dark:text-green-400 mb-1" />
                        <span className="text-xs font-medium text-gray-700 dark:text-zinc-300">Planificar</span>
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-8">
                {/* Map Section */}
                <section>
                    <div className="h-[400px] md:h-[500px] w-full shadow-lg rounded-lg overflow-hidden bg-white dark:bg-zinc-800">
                        <DashboardMap />
                    </div>
                </section>

                {/* Routes List Section */}
                <section>
                    <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Rutas Populares</h2>
                        <ul className="space-y-3">
                            {routesData.map((route) => (
                                <li key={route.id} className="p-3 border-b border-gray-200 dark:border-zinc-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-zinc-700/50 rounded-md">
                                    <div className="font-semibold text-green-700 dark:text-green-400">{route.name}</div>
                                    <div className="text-sm text-gray-600 dark:text-zinc-400">
                                        <span>{route.from}</span> <span className="mx-1">→</span> <span>{route.to}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        <span>{route.duration}</span>
                                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${route.status.includes("Retraso") ? "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200" : "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"}`}>
                                            {route.status}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>
            
            <ChatBot />
        </div>
    );
};

export default Dashboard;

