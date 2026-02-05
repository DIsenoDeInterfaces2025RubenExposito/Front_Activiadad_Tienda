import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL + "/productos";

const mapProductoFromAPI = (producto) => ({
    id: producto._id,
    nombre: producto.name,
    descripcion: producto.description,
    precio: producto.price,
    puntuacion: producto.puntuacion,
    imagen: producto.photo,
});


export const createProducto = async (producto) => {
    try {
        const apiData = {
            name: producto.nombre,
            description: producto.descripcion,
            price: parseFloat(producto.precio),
            puntuacion: parseFloat(producto.puntuacion),
            photo: producto.imagen,
        };
        const res = await axios.post(API_URL, apiData);
        return mapProductoFromAPI(res.data.data ?? res.data);
    } catch (error) {
        console.error("Error al crear el producto:", error);
        // Lanzamos un error con mensaje genérico o del servidor
        throw new Error(error.response?.data?.message || "No se pudo crear el producto.");
    }
};


/*
export const createProducto = async (producto) => {
    try {
        const apiData = {
            name: producto.nombre,
            description: producto.descripcion,
            price: parseFloat(producto.precio),
            puntuacion: parseFloat(producto.puntuacion),
            photo: producto.imagen,
        };

        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(apiData),
        });

        if (!res.ok) {
            throw new Error("Error dn el servidor")
        }

        const data = await res.json();
        return mapProductoFromAPI(data.data ?? data)
    } catch (error) {
        throw new Error(error.message || "Error")
    }
}*/


export const getProductos = async () => {
    try {
        const res = await axios.get(API_URL);
        // La API devuelve { message: '...', data: [...] }
        const data = res.data.data ?? res.data;
        return Array.isArray(data) ? data.map(mapProductoFromAPI) : [];
    } catch (error) {
        console.error("Error al obtener productos:", error);
        throw new Error(error.response?.data?.message || "No se pudo cargar la lista de productos.");
    }
};

/*
export const getProductosFetch = async () => {
    try {
        const res = await fetch(API_URL)
        if (!res.ok) {
            throw new Error("Error en el servidor");
        }
        const data = await res.json();
        const productos = data.data ?? data;
        return productos.map(mapProductoFromAPI)
    } catch {
        throw new Error(error.respose?.data?.message || "Error")
    }
}*/


export const getProductoById = async (id) => {
    try {
        const res = await axios.get(`${API_URL}/${id}`);
        const data = res.data.data ?? res.data;

        if (data) {
            return mapProductoFromAPI(data);
        }

        return null;
    } catch (error) {
        console.error(`Error al obtener el producto con id ${id}:`, error);
        throw new Error(error.response?.data?.messag || "No se pudo obtener el producto.");
    }
};


/*
export const getProductoById = async(id) => {
    try {
        const res = await fetch(`${API_URL}/${id}`)
        if(!res.ok) throw new Error("Error en el servidor")
        const data = await res.json();
        const producto = data.data ?? data;
        return mapProductoFromAPI(data)
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al obener el producto")
    }
}*/


export const deleteProducto = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Error al eliminar el producto con id ${id}:`, error);
        throw new Error(error.response?.data?.message || "No se pudo eliminar el producto.");
    }
};

/*
export const deleteProducto = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
            throw new Error("Error en el servidor");
    }

    return await response.json();
  } catch (error) {
    console.error('Error en eliminarProductos:', error);
    throw error;
  }
};
  */

