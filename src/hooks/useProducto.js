import { useState, useEffect } from 'react';
import { getProductos } from '../services/productosService';

export const useProductos = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);



    const obtenerProductos = async () => {
        try {
            setLoading(true);
            const response = await getProductos();
            setData(response);
            setError(null);
        } catch (error) {
            setError(error.message || "Error al obtener los productos");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        obtenerProductos();
    }, []);


    return { error, loading, data, recargarProductos: obtenerProductos };
};
