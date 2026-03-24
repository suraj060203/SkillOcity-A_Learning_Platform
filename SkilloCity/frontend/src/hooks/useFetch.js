import { useState, useEffect, useCallback } from 'react';

export function useFetch(fetchFn, deps = [], immediate = true) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState(null);

    const execute = useCallback(async (...args) => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchFn(...args);
            setData(result);
            return result;
        } catch (err) {
            setError(err.message || 'Something went wrong');
            return null;
        } finally {
            setLoading(false);
        }
    }, deps);

    useEffect(() => {
        if (immediate) execute();
    }, [immediate, execute]);

    return { data, loading, error, execute, setData };
}

export default useFetch;
