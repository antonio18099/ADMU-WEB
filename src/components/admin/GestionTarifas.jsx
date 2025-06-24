// src/components/admin/GestionTarifas.jsx
import { useState, useEffect } from "react";
import { PlusCircle, Edit3, Trash2, Filter } from 'lucide-react'; // Icons

const GestionTarifas = () => {
  const [tarifas, setTarifas] = useState([]);
  const [nombreCompania, setNombreCompania] = useState("");
  const [ruta, setRuta] = useState("");
  const [tarifa, setTarifa] = useState("");
  const [tipo, setTipo] = useState("");
  const [condicion, setCondicion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tarifaEditando, setTarifaEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroCompania, setFiltroCompania] = useState("");
  const [filtroRuta, setFiltroRuta] = useState("");
  const [error, setError] = useState(null);

  // URL base de la API
  const API_URL = "http://localhost:8080/api/tarifas";

  // Obtener todas las tarifas
  const obtenerTarifas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Error al obtener tarifas: ${response.status}`);
      }
      const data = await response.json();
      setTarifas(data);
    } catch (error) {
      console.error("Error al obtener tarifas:", error);
      setError("Error al cargar las tarifas. Por favor, intenta de nuevo más tarde.");
    }
    setLoading(false);
  };

  // Obtener tarifas filtradas por tipo
  const obtenerTarifasPorTipo = async (tipo) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/tipo/${tipo}`);
      if (!response.ok) {
        throw new Error(`Error al obtener tarifas por tipo: ${response.status}`);
      }
      const data = await response.json();
      setTarifas(data);
    } catch (error) {
      console.error("Error al obtener tarifas por tipo:", error);
      setError("Error al filtrar tarifas por tipo. Por favor, intenta de nuevo más tarde.");
    }
    setLoading(false);
  };

  // Obtener tarifas filtradas por compañía
  const obtenerTarifasPorCompania = async (compania) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/compania/${compania}`);
      if (!response.ok) {
        throw new Error(`Error al obtener tarifas por compañía: ${response.status}`);
      }
      const data = await response.json();
      setTarifas(data);
    } catch (error) {
      console.error("Error al obtener tarifas por compañía:", error);
      setError("Error al filtrar tarifas por compañía. Por favor, intenta de nuevo más tarde.");
    }
    setLoading(false);
  };

  // Obtener tarifas filtradas por ruta
  const obtenerTarifasPorRuta = async (ruta) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/ruta/${ruta}`);
      if (!response.ok) {
        throw new Error(`Error al obtener tarifas por ruta: ${response.status}`);
      }
      const data = await response.json();
      setTarifas(data);
    } catch (error) {
      console.error("Error al obtener tarifas por ruta:", error);
      setError("Error al filtrar tarifas por ruta. Por favor, intenta de nuevo más tarde.");
    }
    setLoading(false);
  };

  // Cargar tarifas al iniciar el componente
  useEffect(() => {
    obtenerTarifas();
  }, []);

  // Limpiar formulario
  const limpiarFormulario = () => {
    setNombreCompania("");
    setRuta("");
    setTarifa("");
    setTipo("");
    setCondicion("");
    setDescripcion("");
    setTarifaEditando(null);
    setShowForm(false);
  };

  // Manejar envío del formulario
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!nombreCompania || !ruta || !tarifa || !tipo) {
      alert("Por favor, completa los campos obligatorios: Compañía, Ruta, Tarifa y Tipo.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const tarifaData = {
      nombreCompania,
      ruta,
      tarifa,
      tipo,
      condicion,
      descripcion
    };
    
    try {
      let response;
      
      if (tarifaEditando) {
        // Actualizar tarifa existente
        response = await fetch(`${API_URL}/${tarifaEditando.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tarifaData),
        });
        
        if (!response.ok) {
          throw new Error(`Error al actualizar tarifa: ${response.status}`);
        }
        
        alert("Tarifa actualizada exitosamente");
      } else {
        // Crear nueva tarifa
        response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tarifaData),
        });
        
        if (!response.ok) {
          throw new Error(`Error al crear tarifa: ${response.status}`);
        }
        
        alert("Tarifa creada exitosamente");
      }
      
      limpiarFormulario();
      obtenerTarifas(); // Recargar tarifas
    } catch (error) {
      console.error("Error al guardar tarifa:", error);
      setError("Error al guardar la tarifa. Por favor, intenta de nuevo más tarde.");
    }
    
    setLoading(false);
  };

  // Eliminar tarifa
  const handleEliminarTarifa = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta tarifa?")) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`Error al eliminar tarifa: ${response.status}`);
        }
        
        obtenerTarifas(); // Recargar tarifas
        alert("Tarifa eliminada exitosamente");
      } catch (error) {
        console.error("Error al eliminar tarifa:", error);
        setError("Error al eliminar la tarifa. Por favor, intenta de nuevo más tarde.");
      }
      setLoading(false);
    }
  };

  // Seleccionar tarifa para editar
  const seleccionarTarifaParaEditar = (tarifa) => {
    setTarifaEditando(tarifa);
    setNombreCompania(tarifa.nombreCompania);
    setRuta(tarifa.ruta);
    setTarifa(tarifa.tarifa);
    setTipo(tarifa.tipo);
    setCondicion(tarifa.condicion || "");
    setDescripcion(tarifa.descripcion || "");
    setShowForm(true);
  };

  // Aplicar filtros
  const aplicarFiltros = () => {
    if (filtroTipo) {
      obtenerTarifasPorTipo(filtroTipo);
    } else if (filtroCompania) {
      obtenerTarifasPorCompania(filtroCompania);
    } else if (filtroRuta) {
      obtenerTarifasPorRuta(filtroRuta);
    } else {
      obtenerTarifas();
    }
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltroTipo("");
    setFiltroCompania("");
    setFiltroRuta("");
    obtenerTarifas();
  };

  // Inicializar datos por defecto
  const inicializarTarifas = async () => {
    if (window.confirm("¿Estás seguro de que deseas inicializar las tarifas con datos por defecto? Esto podría sobrescribir datos existentes.")) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/inicializar`, {
          method: 'POST',
        });
        
        if (!response.ok) {
          throw new Error(`Error al inicializar tarifas: ${response.status}`);
        }
        
        obtenerTarifas(); // Recargar tarifas
        alert("Tarifas inicializadas exitosamente");
      } catch (error) {
        console.error("Error al inicializar tarifas:", error);
        setError("Error al inicializar las tarifas. Por favor, intenta de nuevo más tarde.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">Gestión de Tarifas</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => { setShowForm(true); setTarifaEditando(null); setNombreCompania(''); setRuta(''); setTarifa(''); setTipo(''); setCondicion(''); setDescripcion(''); }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center transition-colors duration-150"
          >
            <PlusCircle size={20} className="mr-2" /> Crear Nueva Tarifa
          </button>
          <button 
            onClick={inicializarTarifas}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center transition-colors duration-150"
          >
            Inicializar Datos
          </button>
        </div>
      </div>

      {/* Formulario de filtros */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md">
        <div className="flex items-center mb-2">
          <Filter size={20} className="mr-2 text-gray-600 dark:text-gray-300" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-white">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="filtroTipo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
            <input 
              type="text" 
              id="filtroTipo"
              value={filtroTipo} 
              onChange={(e) => setFiltroTipo(e.target.value)} 
              placeholder="Ej: Estudiante" 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="filtroCompania" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Compañía</label>
            <input 
              type="text" 
              id="filtroCompania"
              value={filtroCompania} 
              onChange={(e) => setFiltroCompania(e.target.value)} 
              placeholder="Ej: Cooburquin" 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="filtroRuta" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ruta</label>
            <input 
              type="text" 
              id="filtroRuta"
              value={filtroRuta} 
              onChange={(e) => setFiltroRuta(e.target.value)} 
              placeholder="Ej: Terminal-Centro" 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="flex items-end space-x-2">
            <button 
              onClick={aplicarFiltros}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-sm transition-colors duration-150"
            >
              Aplicar Filtros
            </button>
            <button 
              onClick={limpiarFiltros}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md shadow-sm transition-colors duration-150"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Formulario de creación/edición */}
      {showForm && (
        <form onSubmit={handleFormSubmit} className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">{tarifaEditando ? "Editar Tarifa" : "Crear Nueva Tarifa"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nombreCompania" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Compañía</label>
              <input 
                type="text" 
                id="nombreCompania"
                value={nombreCompania} 
                onChange={(e) => setNombreCompania(e.target.value)} 
                placeholder="Ej: Cooburquin" 
                required 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="ruta" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ruta</label>
              <input 
                type="text" 
                id="ruta"
                value={ruta} 
                onChange={(e) => setRuta(e.target.value)} 
                placeholder="Ej: Terminal-Centro" 
                required 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="tarifa" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tarifa</label>
              <input 
                type="text" 
                id="tarifa"
                value={tarifa} 
                onChange={(e) => setTarifa(e.target.value)} 
                placeholder="Ej: $2.500" 
                required 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
              <select 
                id="tipo" 
                value={tipo} 
                onChange={(e) => setTipo(e.target.value)} 
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Selecciona un tipo</option>
                <option value="General">General</option>
                <option value="Estudiante">Estudiante</option>
                <option value="Adulto Mayor">Adulto Mayor</option>
                <option value="Especial">Especial</option>
              </select>
            </div>
            <div>
              <label htmlFor="condicion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condición (Opcional)</label>
              <input 
                type="text" 
                id="condicion"
                value={condicion} 
                onChange={(e) => setCondicion(e.target.value)} 
                placeholder="Ej: Válido con carnet estudiantil" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción (Opcional)</label>
              <textarea 
                id="descripcion"
                value={descripcion} 
                onChange={(e) => setDescripcion(e.target.value)} 
                placeholder="Ej: Tarifa aplicable en días hábiles de 6am a 8pm."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={limpiarFormulario} 
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md shadow-sm transition-colors duration-150"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-md shadow-sm flex items-center transition-colors duration-150 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : (tarifaEditando ? 'Actualizar Tarifa' : 'Crear Tarifa')}
            </button>
          </div>
        </form>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {/* Tabla de tarifas */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-white p-4 border-b dark:border-gray-700">Listado de Tarifas</h3>
        {loading && tarifas.length === 0 ? <p className="p-4 text-gray-500 dark:text-gray-400">Cargando tarifas...</p> : 
         !loading && tarifas.length === 0 ? <p className="p-4 text-gray-500 dark:text-gray-400">No hay tarifas registradas.</p> : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Compañía</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ruta</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tarifa</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tipo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Condición</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {tarifas.map((tarifa) => (
                <tr key={tarifa.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{tarifa.nombreCompania}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{tarifa.ruta}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{tarifa.tarifa}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                      ${tarifa.tipo === 'General' ? 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100' : 
                                        tarifa.tipo === 'Estudiante' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 
                                        tarifa.tipo === 'Adulto Mayor' ? 'bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-100' : 
                                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100'}`}>
                      {tarifa.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 dark:text-gray-300 max-w-xs break-words">{tarifa.condicion}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => seleccionarTarifaParaEditar(tarifa)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-150" title="Editar">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => handleEliminarTarifa(tarifa.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-150" title="Eliminar">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default GestionTarifas;
