import React, { useState, useMemo, useEffect } from "react";
import ProductGrid from "../components/ProductGrid.jsx";
import SearchBar from "../components/SearchBar";
import { useProductos } from "../hooks/useProducto";
import { deleteProducto } from "../services/productosService";

import useVoiceRecognition from "../hooks/useVoiceRecognition";
import { Mic } from "lucide-react"; // npm install lucide-react

/**
 * Componente de la página de productos.
 * Renderiza el componente ProductGrid que muestra todos los productos disponibles.
 *
 * @returns {JSX.Element} Página de productos con cuadrícula de todos los productos
 */
export default function Productos() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: muebles, loading, error, recargarProductos } = useProductos();

  const voice = useVoiceRecognition((text) => setSearchTerm(text));

  const [localMuebles, setLocalMuebles] = useState([]);

  useEffect(() => {
    if (muebles) setLocalMuebles(muebles);
  }, [muebles]);

  const handleEliminar = async (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este producto?")
    ) {
      try {
        await deleteProducto(id);
        setLocalMuebles((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Usamos useMemo para memorizar la lista filtrada.
  // Solo se recalcula si 'searchTerm' cambia.
  const filteredMuebles = useMemo(() => {
    if (!localMuebles) return [];
    if (!searchTerm) {
      return localMuebles; // Si no hay término, devuelve la lista completa
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return localMuebles.filter((mueble) =>
      mueble.nombre.toLowerCase().includes(lowerCaseSearchTerm),
    );
  }, [searchTerm, localMuebles]);

  // Detectamos si es móvil
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  // Lógica de gestos (swipe)
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEnd < -100 && isMobile && voice.isSupported) {
      voice.startListening();
    }
  };

  if (loading)
    return <div className="text-center p-10">Cargando productos...</div>;
  if (error)
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;

  return (
    <>
      <main className="Productos px-4">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Nuestra Colección
        </h2>

        <div
          className="relative w-full max-w-lg mx-auto mb-6 z-10"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Buscar muebles por nombre..."
            className={!isMobile ? "pr-12" : ""}
          />
          {/* Botón de voz solo si es desktop y soporta reconocimiento */}
          {!isMobile && voice.isSupported && (
            <button
              onClick={voice.startListening}
              className={`absolute right-3 top-1/2 -translate-y-1/2 transition
                ${
                  voice.isListening
                    ? "text-red-500 animate-pulse"
                    : "text-gray-400 hover:text-blue-600"
                }`}
              title="Buscar por voz"
            >
              <Mic size={20} />
            </button>
          )}

          {/* Mensaje visual para móviles */}
          {isMobile && voice.isSupported && (
            <div
              className={`text-center text-xs mt-2 transition-opacity duration-300 ${voice.isListening ? "text-red-500 animate-pulse" : "text-gray-400"}`}
            >
              {voice.isListening
                ? "Escuchando..."
                : "Desliza → para buscar por voz"}
            </div>
          )}
        </div>

        <div className="mt-8 w-full">
          {filteredMuebles.length > 0 ? (
          <ProductGrid muebles={filteredMuebles} onEliminar={handleEliminar} />
          ) : (
            <p className="col-span-full text-center text-gray-500 p-4">
              No se encontraron muebles con el término "{searchTerm}".
            </p>
          )}
        </div>
      </main>
    </>
  );
}
