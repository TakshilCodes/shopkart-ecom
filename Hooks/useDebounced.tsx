"use client"
import { useEffect, useState } from "react";

export default function useDebounced(value:string,delay=500){
    const [debouncedValue,setDebouncedvalue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedvalue(value), delay)
        return () => clearTimeout(handler);
    }, [value,delay]);

    return debouncedValue;
}