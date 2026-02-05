import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { useDetalleProductos } from "../hooks/useDetalleProductos";
import { UserContext } from "../context/UserContext.jsx";
import { deleteProducto } from "../services/productosService";

/**
 * Componente que muestra la página de detalle de un producto individual.
 * Obtiene el ID del producto desde los parámetros de la URL y muestra
 * toda la información detallada del producto incluyendo imagen, precio,
 * puntuación y descripción.
 *
 * @returns {JSX.Element} Página de detalle del producto con botón de volver,
 *                        información del producto e imagen.
 */
export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userLogged } = useContext(UserContext);

  // Simplificado: Solo usamos el hook con el ID
  const { producto, loading, error } = useDetalleProductos(id);

  const handleEliminar = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await deleteProducto(id);
        navigate("/Productos");
      } catch (err) {
        alert("Error al eliminar el producto: " + err.message);
      }
    }
  };

  if (loading) return <div className="text-center p-10">Cargando...</div>;
  if (error)
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  if (!producto)
    return <div className="text-center p-10">Producto no encontrado.</div>;

  const precioFormateado = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(producto.precio);

  return (
    <main className="detalle-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="btn-back"
          style={{ margin: 0 }}
        >
          ← Volver
        </button>

        {userLogged && (
          <button onClick={handleEliminar} className="btn-delete-detail">
            Eliminar Producto
          </button>
        )}
      </div>

      <div className="detalle-content">
        <section className="detalle-info">
          <h1 className="detalle-title">{producto.nombre}</h1>
          <div className="detalle-price-row">
            <p className="detalle-price">{precioFormateado}</p>
            <p className="detalle-score">{producto.puntuacion} / 5.0</p>
          </div>
          <p className="detalle-description">{producto.descripcion}</p>
        </section>
        <figure className="detalle-image-wrap">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="detalle-image"
          />
        </figure>
      </div>
    </main>
  );
}
