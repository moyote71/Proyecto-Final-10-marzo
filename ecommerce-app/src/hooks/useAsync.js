import { useState, useCallback } from "react";

export function useAsync(asyncFunction) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(
        async (...args) => {
            setLoading(true);
            setError(null);
            try {
                const response = await asyncFunction(...args);
                setData(response);
                return response;
            } catch (err) {
                const errorMessage = err.message || "Ha ocurrido un error inesperado al cargar la información";
                setError(errorMessage);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [asyncFunction]
    );

    return { execute, loading, error, setError, data, setData };
}
