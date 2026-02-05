import { useState } from "react";
import { createProducto } from "../services/productosService";

export const useCreateProducto = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addProducto = async (productoData) => {
    try {
      setLoading(true);
      setError(null);
      await createProducto(productoData);
      return true;
    } catch (err) {
      setError(err.message || "Error al guardar el producto");
      return false;
    } finally {
      setLoading(false);
    }
  };

  
  return { addProducto, loading, error };
};
