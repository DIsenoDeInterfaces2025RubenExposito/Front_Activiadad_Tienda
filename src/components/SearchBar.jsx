/**
 * Componente de barra de búsqueda.
 * Permite al usuario filtrar productos por nombre mediante un campo de entrada controlado.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.searchTerm - El término de búsqueda actual.
 * @param {Function} props.onSearchChange - Función para manejar el cambio en el término de búsqueda.
 * @param {string} [props.placeholder="Buscar..."] - Texto de sugerencia opcional para el input.
 * @returns {JSX.Element} Barra de búsqueda con etiqueta accesible.
 */
export default function SearchBar({
  searchTerm,
  onSearchChange,
  placeholder = "Buscar...",
  className = "",
}) {
  return (
    <div className={`mb-8 w-full max-w-lg mx-auto relative ${className}`}>
      <label htmlFor="search-input" className="sr-only">
        {placeholder}
      </label>
      <input
        id="search-input"
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        // Llama a la función proporcionada por el padre en cada cambio
        onChange={(e) => onSearchChange(e.target.value)}
        className={`w-full p-3 border-2 border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out ${className}`}
        aria-label={placeholder}
      />
    </div>
  );
}
