import React, { useState, useMemo } from "react";
import ProductGrid from "../components/ProductGrid.jsx";
import SearchBar from "../components/SearchBar";
import { useProductos } from "../hooks/useProducto";
import { deleteProducto } from "../services/productosService";
import useVoiceRecognition from "../hooks/useVoiceRecognition";

// Icono de micrófono (SVG)
const Mic = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
);

export default function Productos() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: muebles, loading, error, recargarProductos } = useProductos();

  // NUI: Configuración de reconocimiento de voz
  const voice = useVoiceRecognition((text) => setSearchTerm(text));
  const isMobile = window.innerWidth < 768;

  // NUI: Lógica de gestos (swipe right)
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    // Si el deslizamiento es hacia la derecha (swipe right)
    if (touchStart - touchEnd < -100 && isMobile && voice.isSupported) {
      voice.startListening();
    }
  };

  const handleEliminar = async (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este producto?")
    ) {
      try {
        await deleteProducto(id);
        recargarProductos();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const filteredMuebles = useMemo(() => {
    if (!muebles) return [];
    if (!searchTerm) return muebles;
    const lower = searchTerm.toLowerCase();
    return muebles.filter((m) => m.nombre.toLowerCase().includes(lower));
  }, [searchTerm, muebles]);

  if (loading)
    return <div className="text-center p-10">Cargando productos...</div>;
  if (error)
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;

  return (
    <main className="Productos px-4">
      {/* NUI: Contenedor con soporte para gestos */}
      <div
        className="relative max-w-lg mx-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Buscar muebles por nombre..."
          className={!isMobile ? "pr-12" : ""} // espacio para el micrófono
        />

        {/* Botón de voz solo si es desktop y soporta reconocimiento */}
        {!isMobile && voice.isSupported && (
          <button
            onClick={voice.startListening}
            className={`absolute right-3 top-[22px] -translate-y-1/2 transition
              ${voice.isListening ? "text-red-500 animate-pulse" : "text-gray-400 hover:text-blue-600"}`}
            title="Buscar por voz"
          >
            <Mic size={20} />
          </button>
        )}

        {/* NUI: Mensaje visual para móviles */}
        {isMobile && voice.isSupported && (
          <div
            className={`text-center text-xs mb-8 transition-opacity ${voice.isListening ? "text-red-500 animate-pulse font-bold" : "text-gray-400"}`}
          >
            {voice.isListening
              ? "Escuchando..."
              : "Desliza → para buscar por voz"}
          </div>
        )}

        {voice.error && (
          <div className="text-center text-xs text-red-500 mb-8 font-bold">
            {voice.error}
          </div>
        )}
      </div>

      {filteredMuebles.length > 0 ? (
        <ProductGrid muebles={filteredMuebles} onEliminar={handleEliminar} />
      ) : (
        <p className="col-span-full text-center text-gray-500 p-4">
          No se encontraron muebles con el término "{searchTerm}".
        </p>
      )}
    </main>
  );
}
