import { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";

/**
 * Componente que representa una tarjeta de producto individual.
 * Muestra la imagen, nombre y precio formateado del producto.
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.id - ID del producto
 * @param {string} props.nombre - Nombre del producto
 * @param {number} props.precio - Precio del producto en euros
 * @param {string} props.imagen - URL de la imagen del producto
 * @param {string} [props.descripcion] - Descripción opcional del producto (no se muestra actualmente)
 * @param {Function} [props.onEliminar] - Función para eliminar el producto
 * @returns {JSX.Element} Tarjeta de producto con imagen, nombre y precio formateado
 */
export default function ProductCard({
  id,
  nombre,
  precio,
  imagen,
  descripcion,
  onEliminar,
}) {
  const { userLogged } = useContext(UserContext);
  // Formatear el precio a euros
  const precioFormateado = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(precio || 0);

  const handleEliminarClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEliminar) {
      onEliminar(id);
    }
  };

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          src={imagen || ""}
          alt={nombre || "Producto"}
          className="product-image"
        />
        {userLogged && (
          <button
            className="delete-product-btn"
            onClick={handleEliminarClick}
            title="Eliminar producto"
          >
            ×
          </button>
        )}
      </div>
      <h3 className="product-name">{nombre || "Cargando..."}</h3>
      <p className="product-price">{precioFormateado}</p>

      {/* Descripción comentada para que no se muestre en el catalogo de productos*/}
      {/*<p className="product-description">{descripcion}</p>*/}
    </article>
  );
}
